<template>
    <div class="look">
        <div class="loadmore elevation-2" v-if='loadmore&&page===0&&data.length' :style="{marginBottom:'10px'}">
            <v-progress-circular
                indeterminate
                :color="theme"
            ></v-progress-circular>
        </div>
        <Article v-for="item in data" :key='item.sn' :item='item' :apiHost='apiHost' :myInfo='myInfo' :serverHost='serverHost'
            @snackbar='openSnackbar' :look='true'/>
        <div class="loadmore elevation-2" v-if='loadmore'>
            <v-progress-circular
                indeterminate
                :color="theme"
            ></v-progress-circular>
        </div>
        <div v-if='!isMore&&!loadmore' :style="{textAlign:'center',zIndex:-1,margin:'10px 0',color:'#e0e0e0'}">没有更多了</div>
        <div v-intersect="onIntersect" :style="{width:'1px',height:'1px'}"></div>
        <v-btn fab class='refresh' :loading='loadmore' @click="refresh"><v-icon>mdi-refresh</v-icon></v-btn>
        <v-snackbar v-model="snackbar.open" :color="snackbar.color" top>
            {{ snackbar.text }}
            <v-btn fab depressed @click="snackbar.open = false" :style="{backgroundColor:'transparent',color:'#fff'}">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import Article from './article'
export default {
    components:{Article},
    computed:{
        apiHost(){
            return this.$store.state.apiHost
        },
        serverHost(){
            return this.$store.state.serverHost
        },
        myInfo(){
            return this.$store.state.myInfo
        },
        isMore(){
            return (this.page+1)*this.size<this.total
        },
        theme(){
            return this.$store.state.theme
        }
    },
    data(){
        return{
            data:[],
            snackbar:{
                open:false,
                text:'发布成功',
                color:'success'
            },
            loadmore:false,
            page:0,//页数
            total:11,//总数  默认大于size，避免第一次加载时显示
            size:10,//每页大小
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        getData(){
            this.loadmore=true
            this.axios({
                method:'get',
                url:this.apiHost+`/moment/getPublicMoment?page=${this.page}&size=${this.size}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    this.total=data.totalElement;
                    if(this.page===0) this.data=data.data;//第一页直接赋值
                    else{//若不是第一页 则push
                        for(let i of data.data){
                            this.data.push(i)
                        }
                    }
                }
            }).finally(()=>{
                this.loadmore=false
            })
        },
        openSnackbar(params){
            this.snackbar={text:params.text,color:params.color,open:true}
        },
        onIntersect(entries){
            if(entries[0].isIntersecting){
                if(!this.loadmore&&this.isMore){//当正在加载时 不请求，避免重复加载
                    this.page++;
                }
            }
        },
        refresh(){
            document.documentElement.scrollTop=0
            sessionStorage['home_scroll']=0
            this.page=0;
            this.getData();
        },
    },
    watch:{
        page(newVal){
            if(newVal!==0)
                this.getData();
        },
    }
}
</script>

<style lang='scss' scoped>
    .look{
        width: 100%;
        min-height: 100vh;
        position: relative;
        z-index: 3;
        .loadmore{
            position: relative;
            background-color: #fff;
            text-align: center;
            border-radius: 5px;
            padding:15px;
            margin-top: 20px;
        }
        .refresh{
            position: fixed;
            bottom: 90px;
            right:20px;
            z-index: 99;
        }
    }
</style>