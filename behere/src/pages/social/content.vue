<template>
    <div id='content'>
        <div class="publish">
            <Publish @addArticle='addArticle'/>
        </div>
        <div class="content-container" >
            <div class="articles">
                <div class="loadmore elevation-2" v-if='loadmore&&page===0&&data.length' :style="{marginBottom:'10px'}">
                    <v-progress-circular
                        indeterminate
                        :color="theme"
                    ></v-progress-circular>
                </div>
                <Article v-for="item in data" :key='item.sn' :item='item' :apiHost='apiHost' :myInfo='myInfo' :serverHost='serverHost'
                @snackbar='openSnackbar'/>
                <div class="loadmore elevation-2" v-if='loadmore'>
                    <v-progress-circular
                        indeterminate
                        :color="theme"
                    ></v-progress-circular>
                </div>
                <div v-if='!isMore&&!loadmore' :style="{textAlign:'center',zIndex:-1,marginTop:'20px',color:'#e0e0e0'}">没有更多了</div>
                <div v-intersect="onIntersect" :style="{width:'1px',height:'1px'}"></div>
            </div>
        </div>
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
import Publish from './publish'
import Article from './article'
export default {
    components:{Publish,Article},
    data(){
        return{
            triangle_left:'30px',//小三角左侧的距离
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
        this.getData();
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        myInfo(){
            return this.$store.state.myInfo
        },
        isMore(){
            return (this.page+1)*this.size<this.total
        }
    },
    methods:{
        handleBtnClick(e){
            let left=e.currentTarget.offsetLeft;//按钮左侧距离
            let width=e.currentTarget.clientWidth;//按钮宽度
            this.triangle_left=left+width/2-10+'px'
        },
        getData(){
            this.loadmore=true
            this.axios({
                method:'get',
                url:this.apiHost+`/moment/getMomentList?page=${this.page}&size=${this.size}`
            }).then(res=>{
                let data=JSON.parse(res.data.data);
                this.total=data.totalElement;
                if(this.page===0) this.data=data.data;//第一页直接赋值
                else{//若不是第一页 则push
                    for(let i of data.data){
                        this.data.push(i)
                    }
                }
                
            }).finally(()=>{
                this.loadmore=false
            })
        },
        openSnackbar(params){
            this.snackbar={text:params.text,color:params.color,open:true}
        },
        addArticle(data){
            this.data.unshift(data)
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
        }
    },
    watch:{
        page(newVal){
            if(newVal!==0)
                this.getData();
        },
        '$route'(route){
            if(route.name!=='home'){
                sessionStorage['home_scroll']=document.documentElement.scrollTop
            }else{
                document.documentElement.scrollTop=sessionStorage['home_scroll']?sessionStorage['home_scroll']:0
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #content{
        width:100%;
        min-height:calc(100vh - 95px);
        height: auto;
        border-radius: 10px;
        //padding:20px;
        position: relative;
        overflow: auto;
        .publish{
            padding-bottom: 0;
            position: relative;
            z-index: 1;   
        }
        .content-container{
            width:100%;
            height: auto;
            // background-color: #fff;
            border-radius: 5px;
            position: relative;
            padding-top: 10px;
            .triangle{
                position: absolute;
                border:10px solid transparent;
                border-bottom-color: #fff;
                top:-20px;
                left:30px;
                transition: all .5s ease-out;
            }

            .articles{
                width:100%;
                height:auto;
                position: relative;
                overflow: hidden;
                padding-top:20px;
                z-index:1;
                // padding: 20px;
                .loadmore{
                    position: relative;
                    background-color: #fff;
                    text-align: center;
                    border-radius: 5px;
                    padding:15px;
                    margin-top: 20px;
                }
            }
        }
        .refresh{
            position: fixed;
            bottom: 90px;
            right:20px;
            z-index: 99;
        }
    }
</style>