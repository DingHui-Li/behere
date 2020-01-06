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
            <v-col :sm='12' :lg='6' v-for="(apply,index) in oldData" :key='apply.sn'>
                <NewFriendItem :apply='apply' :index='index' />
            </v-col>
        </div>
    </div>
</template>

<script>
import NewFriendItem from './newFriendItem'
export default {
    components:{NewFriendItem},
    computed:{
        friendApply(){
            return this.$store.state.friendApply;
        }
    },
    data(){
        return{
            latelyData:[],
            oldData:[],
        }
    },
    mounted(){
        this.splitData()
    },
    methods:{
        splitData(){
            for(let i in this.friendApply){
                let date=new Date(this.friendApply[i].sendTime);
                this.friendApply[i].sendTime=date;
                if(date.isLately()){
                    this.latelyData.push(this.friendApply[i])
                }else{
                    this.oldData.push(this.friendApply[i]);
                }
            }
        },
    },
    watch:{
        friendApply(){
            this.splitData()
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