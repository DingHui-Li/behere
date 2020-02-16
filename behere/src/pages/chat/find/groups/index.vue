<template>
    <div class="find-groups">
        <div class="top">随便聊聊</div>
        <v-row :style="{padding:'20px'}">
            <v-progress-linear indeterminate :color='theme' v-show="loading"></v-progress-linear>
            <v-col xs='12' sm='6' lg='4' v-for="topic in topics" :key="topic.sn">
                <Item :item='topic' :theme='theme' :serverHost='serverHost' :apiHost='apiHost'  @snackbar='openSnackbar'/>
            </v-col>
        </v-row>
        <div :style="{textAlign:'center'}">
            <v-btn depressed :style="{backgroundColor:'rgba(0,0,0,0)'}" @click='getTopics'>
                <v-icon>mdi-reload</v-icon> 换一批
            </v-btn>
        </div>
        <div class="create">
            没有想聊的话题？不如试试 
            <v-btn depressed class="btn" :style="{backgroundColor:theme}" @click="create.open=true">创建</v-btn>
            <span>今日创建（0/5）</span>
            <span class="my-created" @click="openMyCreated=true">我的创建</span>
        </div>
        <v-dialog :width="500" v-model="create.open">
            <Create :theme='theme' @close='create.open=false' @snackbar='openSnackbar'/>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon @click="snackbar.open=false" :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
        <v-dialog :width="500" v-model="openMyCreated">
            <MyCreated @close='openMyCreated=false'/>
        </v-dialog>
    </div>
</template>

<script>
import Item from './item'
import Create from './create'
import MyCreated from './myCreated'
export default {
    components:{Item,Create,MyCreated},
    computed:{
        theme(){
            return this.$store.state.theme
        },
        apiHost(){
            return this.$store.state.apiHost
        },
        serverHost(){
            return this.$store.state.serverHost
        }
    },
    data(){
        return{
            create:{
                open:false
            },
            snackbar:{
                open:false,
                color:'error',
                text:'操作失败'
            },
            topics:[],
            loading:false,
            openMyCreated:false
        }
    },
    created(){
        this.getTopics()
    },
    methods:{
        openSnackbar(params){
            this.snackbar={open:true,text:params.text,color:params.color}
        },
        getTopics(){
            this.loading=true
            this.axios({
                method:'get',
                url:this.apiHost+'/find/getRandomTopic'
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    console.log(data)
                    this.topics=data
                }
            }).finally(()=>{
                this.loading=false
            })
        },
    }
}
</script>

<style lang='scss' scoped>
    .find-groups{
        .top{
            font-weight: bold;
            font-size: 1.3rem;
            padding:20px;
            padding-bottom: 0;
            span{
                border-left:5px solid #656565;
                padding-left: 6px;
            }
        }
        .create{
            padding:20px;
            font-weight: bold;
            color:#656565;
            .btn{
                color:#fff;
                margin: 0 5px;
            }
            span{
                font-size: 0.9rem;
                color:#959595
            }
            .my-created{
                border-bottom: 2px solid #959595;
                cursor: pointer;
                margin-left: 10px;
            }
        }
    }
</style>