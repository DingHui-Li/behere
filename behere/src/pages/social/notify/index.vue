<template>
    <div id='notify'>
        <div class="topbar elevation-1">
            <v-tabs :color="theme" :style="{borderRadius:'5px'}">
                <v-tab @click="showType='all'">全部</v-tab>
                <v-tab :style="{height:'40px'}" @click="showType='comment&reply'">评论</v-tab>
                <v-tab @click="showType='like'">点赞</v-tab>
                <v-tab @click="showType='mention'">@我的</v-tab>
            </v-tabs>
        </div>
        <div class="contents elevation-1">
            <transition-group enter-active-class="animated slideInRight" 
                name='notify-item' tag='div' mode="out-in"
                leave-active-class="animated slideOutRight"  >
                <Item :theme='theme' v-for="(notify) in data" :key='notify.sn' 
                    :data='notify' :articles='articles' :apiHost='apiHost' :serverHost='serverHost'
                    @open='v=>dialog={open:true,value:v}' v-show="showType.includes(notify.type)||showType==='all'"/>
            </transition-group>
        </div>
        <div :style="{textAlign:'center',marginTop:'10px'}" v-show="nextPage.loading">
            <v-progress-circular indeterminate :color="theme"></v-progress-circular>
        </div>
        <div class="no-more" v-show="!nextPage.loading&&!isMore">没有更多了</div>
        <div :style="{zIndex:3,position:'relative',width:'100%',height:'10px',backgroundColor:'rgba(0,0,0,0)'}"
            v-intersect="loadMore"></div>
        <v-dialog width="500" v-model="dialog.open">
            <div class="dialog">
                <div class="top">
                    <span class="tip">查看对话</span>
                    <v-btn class='btn' icon @click="dialog.open=false"><v-icon>mdi-close</v-icon></v-btn>
                </div>
                <Article :item='dialog.value' :apiHost='apiHost' :serverHost='serverHost' :myInfo='myInfo' v-if='dialog.value'/>
            </div>
        </v-dialog>
    </div>
</template>

<script>
import Item from './item'
import Article from '../article'
export default {
    components:{Item,Article},
    computed:{
        theme(){
            return this.$store.state.theme
        },
        apiHost(){
            return this.$store.state.apiHost
        },
        serverHost(){
            return this.$store.state.serverHost
        },
        myInfo(){
            return this.$store.state.myInfo
        },
        isMore(){//是否还有更多
            return (this.nextPage.page+1)*this.nextPage.size<this.nextPage.total
        },
    },
    data(){
        return{
            data:[],
            articles:[],
            articleIds:[],
            dialog:{
                open:false,
                value:null
            },
            showType:'all',//显示的通知类型
            nextPage:{//下一页
                page:0,
                total:10+1,
                size:10,
                loading:false
            },
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            this.nextPage.loading=true
            this.axios({
                method:'get',
                url:this.apiHost+`/moment/getMomentMessage?page=${this.nextPage.page}&size=${this.nextPage.size}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$store.commit('setSocialNum',0)
                    let data=JSON.parse(res.data.data)
                    this.nextPage.total=data.totalElement;
                    data.data.map(item=>{
                        this.data.push(item)
                        if(!this.articleIds.includes(item.momentSn)){
                            this.articleIds.push(item.momentSn)
                            this.getArticle(item.momentSn)
                        }
                    })
                }
            }).finally(()=>{
                this.nextPage.loading=false
            })
        },
        getArticle(id){//若是新动态的通知则获取改动态的数据
            this.axios({
                method:'post',
                url:this.apiHost+`/moment/getMomentByMomentSn?momentSn=${id}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    data.attachment=JSON.parse(data.attachment)
                    this.articles.push(data);
                }
            })
        },
        loadMore(entries){
            if(entries[0].isIntersecting){
                if(this.isMore&&!this.nextPage.loading){
                    this.nextPage.page++;
                }
            }
        },
    },
    watch:{
        'dialog.open'(newVal){
            if(!newVal){//关闭时 清空数据 避免不更新
                this.dialog.value=null;
            }
        },
        'nextPage.page'(newVal){
            if(newVal!==0)
                this.getData();
        },
        '$route'(route){
            if(route.name==='notify'){
                this.data=[]
                this.nextPage.page=0;
                this.getData()
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #notify{
        min-height: 100vh;
        position: relative;
        z-index: 3;
        .contents{
            width: 100%;
            border-radius: 5px;
            margin-top: 20px;
            background-color: #fff;
            padding:20px;
            padding-bottom: 10px;
            overflow: hidden;
            height: auto;
            max-height: auto;
            transition: all .5s;
            position: relative;
        }
        .no-more{
            text-align: center;
            position: relative;
            z-index: 2;
            margin-top: 10px;
            color:#fff;
        }
    }
    .dialog{
        background-color: #fff;
        .top{
            overflow: hidden;
            background-color: #e0e0e0;
            line-height: 40px;
            .tip{
                font-weight: bold;
                margin-left: 20px;
            }
            .btn{
                float:right;
                background-color: rgba(0,0,0,.1)
            }
        }
    }
</style>