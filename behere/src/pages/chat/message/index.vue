<template>
    <div id='message-container'>
        <div class="side" ref='side'>
            <Search />
            <div class="chatlist">
                <ChatItem v-for='(item,index) in chatList' :key='item.sn' :data='item' :index='index' :id='openChat'/>
            </div>
            <!-- <v-expansion-panels accordion :value='0'>
                <v-expansion-panel>
                    <v-expansion-panel-header>最近</v-expansion-panel-header>
                    <v-expansion-panel-content class="chats" ref='expand'>
                            <ChatItem v-for='(item,index) in chatList_lately' :key='item.sn' :data='item' :index='index' :id='openChat'/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header>过去一周</v-expansion-panel-header>
                    <v-expansion-panel-content  class="chats">
                            <ChatItem v-for='(item,index) in chatList_lastWeek' :key='item.sn' :data='item' :index='index' :id='openChat'/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>                 -->
            </div>
        <div class="content">
            <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
                <ChatWith v-if='openChat' :id='openChat' :loading='loading' 
                    @loadMore='page++' :groupInfo='groupInfo' :chatInfo='chatInfo'/>
            </transition>
        </div>
    </div>
</template>

<script>
import ChatItem from './chatItem'
import ChatWith from './chatWith'
import Search from '../components/search/'
export default {
    components:{ChatItem,ChatWith,Search},
    data(){
        return{
            // chatList_lately:[],
            // chatList_lastWeek:[],
            loading:false,
            page:0,
            more:true,//是否有更多 下一页
            groupInfo:{},//如果是群聊则获取群聊信息
            chatInfo:{//当前对话信息
                name:'unknow',
                count:0,
                id:'',
                avatar:''
            },
        }
    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        openChat(){
            return this.$store.state.openChat;
        },
        chatList(){
            return this.$store.state.chatList;
        },
        msgData(){
            return this.$store.state.msgData;
        },
        isGroup(){//当前会话是否是群聊
            for(let i in this.chatList){
                if(this.chatList[i].contactSn===this.openChat){
                    if(this.chatList[i].chatType==='group') {//如果是群聊
                        return true
                    }
                    return false
                }
            }
            return false
        },
        chatSn(){//用openChat（用户id或群id）获取会话id
            for(let i in this.chatList){
                if(this.chatList[i].contactSn===this.openChat){
                    return this.chatList[i].sn;
                }
            }
            return null
        }
    },
    mounted(){
        let height=this.$refs.side.clientHeight-60;
        if(this.$refs.expand){
            for(let i=0;i<this.$refs.expand.length;i++){
                this.$refs.expand[i].height=height+'px'
            }
        }
        //this.splitChatList();
    },
    methods:{
        // splitChatList(){
        //     this.chatList_lately=[];
        //     this.chatList_lastWeek=[];
        //     let now=new Date().getTime();
        //     let oneday=24 * 3600 * 1000;
        //     for(let i in this.chatList){
        //         let diff=Math.floor((now-this.chatList[i].sendTime)/oneday);
        //         if(diff>=7){
        //             this.chatList_lastWeek.push(this.chatList[i])
        //         }else{
        //             this.chatList_lately.push(this.chatList[i]);
        //         }
        //     }
        // },
        getChat(){
            try{
                if(!this.more)  throw "没有更多消息"
                this.$store.commit('setMsgData',[]);
                let url='/message/getChatMessage';
                if(this.isGroup){
                    url='/message/getChatGroupMessage'
                    this.getGroupInfo();//获取群信息
                }
                this.getChatInfo();//获取会话信息
                if(!this.chatSn){
                    throw "chatSn为空"
                }
                this.loading=true;
                this.axios({
                    method:'post',
                    url:this.apiHost+`${url}?page=${this.page}&size=20&chatSn=${this.chatSn}`
                }).then(res=>{
                    if(res.data.code==='10000'){ 
                        let data=JSON.parse(res.data.data);
                        if(data.totalElements===this.msgData.length+data.content.length){
                            this.more=false;
                        }
                        this.$store.commit('setMsgData',data.content);
                    }
                }).finally(()=>{
                    this.loading=false;
                })
            }catch(err){
                console.log(err)
                this.loading=false;
            }
        },
        getGroupInfo(){
            this.axios({
                methods:'get',
                url:this.apiHost+'/chat/getChatGroupInfo?groupSn='+this.openChat
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    this.groupInfo=data;
                    this.chatInfo={
                        avatar:data.profilePhoto,
                        id:data.sn,
                        name:data.groupName,
                        count:data.count,
                        group:this.isGroup
                    }
                } 
            })
        },
        getChatInfo(){
            for(let chat of this.chatList){//首先再会话列表查找
                if(chat.contactSn===this.openChat){
                    console.log()
                    this.chatInfo={
                        id:chat.contactSn,
                        name:chat.remark?chat.remark:chat.nickName,
                        group:this.isGroup
                    }
                    return;
                }
            }
            let friends=this.$store.state.friendList;
            for(let friend of friends){//在好友列表查找
                if(friend.userSn===this.openChat){
                    this.chatInfo={
                        id:friend.sn,
                        name:friend.remark?friend.remark:friend.nickName,
                        group:this.isGroup
                    }
                    return;
                }
            }

            let groups=this.$store.state.groups;
            for(let group of groups){//在群组列表查找
                if(group.sn===this.openChat){
                    this.chatInfo={
                        id:group.sn,
                        name:group.groupName,
                        count:group.count,
                        group:this.isGroup
                    }
                    return;
                }
            }
        }
    },
    watch:{
        // chatList(){
        //     this.splitChatList();
        // },
        openChat(newVal){
            if(newVal){
                this.page=0;
                this.more=true;
                this.getChat();
            }
        },
        page(newVal){
            if(newVal!==0) this.getChat();//避免与上面的冲突
        },
        '$route'(route){
            if(route.name==='msg'){
                if(this.chatSn){//更新会话
                    let url='/message/getChatMessage';
                    if(this.isGroup) url='/message/getChatGroupMessage'
                    this.axios({
                        method:'post',
                        url:this.apiHost+`${url}?page=${0}&size=1&chatSn=${this.chatSn}`
                    })
                }
            }else{
                //清除会话
                this.axios({
                    method:'get',
                    url:this.apiHost+'/chat/clearCurrentChat'
                })
            }
        }
    }
}
</script>

<style lang='scss'>
    #message-container{
        width: 100%;
        height:100%;
        display: flex;
        overflow: hidden;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        background-color: #fff;
        border-radius: 0 20px 20px 0;
        .side{
            flex: 4;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            padding:5px;
            .search-box{
                background-color: #fff;
                height:40px;
                margin: 10px
            }
            // .chats{
            //     height:500px;
            //     overflow-y:scroll;
            //     position:relative
            // }
            .chatlist{
                flex:1;
                overflow: auto;
            }
        }
        .content{
            flex:9;
            overflow: hidden;
            height:100%
        }
    }
    .v-expansion-panel::before{
        box-shadow: none
    }
    .v-item-group, .v-expansion-panels,.v-expansion-panels--accordion{
        height:auto !important;
        max-height: 100% !important;
    }
</style>