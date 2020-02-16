<template>
    <div id='new-friend'>
        <div class="top">新的朋友</div>
        <div class="content">
            <div class="tip">最近</div>
            <v-row>
                <v-col :sm='12' :lg='6' v-for="(apply,index) in latelyData" :key='apply.sn'>
                    <NewFriendItem :apply='apply' :index='index' />
                </v-col>
            </v-row>
            <div class="tip">一周前</div>
            <v-row>
                <v-col :sm='12' :lg='6' v-for="(apply,index) in oldData" :key='apply.sn'>
                    <NewFriendItem :apply='apply' :index='index' />
                </v-col>
            </v-row>
        </div>
    </div>
</template>

<script>
import NewFriendItem from './newFriendItem'
export default {
    components:{NewFriendItem},
    computed:{
        apiHost(){
            return this.$store.state.apiHost;
        }
    },
    data(){
        return{
            latelyData:[],
            oldData:[],
        }
    },
    mounted(){
        this.getData()
    },
    methods:{
        getData(){
            this.latelyData=[]
            this.oldData=[]
            this.axios({
                method:'get',
                url:this.apiHost+'/message/getContactReqMessage?page=0&size=20'
            }).then(res=>{
                if(res.data.code==='10000'){
                    console.log('获取申请列表成功')
                    let data=JSON.parse(res.data.data);
                    this.splitData(data.data)
                    this.$store.commit('setFriendApplyNum',0)
                }else{
                    //this.snackbar={open:true,text:'获取好友申请列表失败，code:'+res.data.code,color:'error',timeout:10000}
                }
            })
        },
        splitData(data){
            for(let i in data){
                let date=new Date(data[i].sendTime);
                data[i].sendTime=date;
                if(date.isLately()){
                    this.latelyData.push(data[i])
                }else{
                    this.oldData.push(data[i]);
                }
            }
        },
    },
    watch:{
        '$route'(route){
            if(route.name==='newFriend'){
                this.getData();
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #new-friend{
        width:100%;
        height:100%;
        animation-duration: .5s;
        display: flex;
        flex-direction: column;
        .top{
            padding:10px 20px;
            font-size: 1.3rem;
            font-weight: bold;
        }
        .content{
            padding:10px 20px;
            flex: 1;
            overflow: auto;
        }
        .tip{
            font-size: 1rem;
            color:#959595;
            margin:15px 0;
        }
    }
</style>