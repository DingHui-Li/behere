<template>
    <div id='message-container'>
        <div class="side" ref='side'>
            <Search />
            <v-expansion-panels accordion :value='0'>
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
            </v-expansion-panels>                
            </div>
        <div class="content">
            <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutRight">
                <ChatWith v-show='openChat' :id='openChat' :loading='loading' @loadMore='page++'/>
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
            chatList_lately:[],
            chatList_lastWeek:[],
            loading:false,
            page:0
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
        }
    },
    mounted(){
        let height=this.$refs.side.clientHeight-60;
        if(this.$refs.expand){
            for(let i=0;i<this.$refs.expand.length;i++){
                this.$refs.expand[i].height=height+'px'
            }
        }
        this.splitChatList();
    },
    methods:{
        splitChatList(){
            this.chatList_lately=[];
            this.chatList_lastWeek=[];
            let now=new Date().getTime();
            let oneday=24 * 3600 * 1000;
            for(let i in this.chatList){
                let diff=Math.floor((now-this.chatList[i].sendTime)/oneday);
                if(diff>=7){
                    this.chatList_lastWeek.push(this.chatList[i])
                }else{
                    this.chatList_lately.push(this.chatList[i]);
                }
            }
        },
        getChat(){
            this.loading=true;
            let chatSn='';
            this.$store.commit('setMsgData',[]);
            for(let i in this.chatList){
                if(this.chatList[i].contactSn===this.openChat){
                    chatSn=this.chatList[i].sn;
                    break;
                }
            }
            if(!chatSn) return;
            this.axios({
                method:'get',
                url:this.apiHost+`/message/getChatMessage?page=${this.page}&size=20&chatSn=${chatSn}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data).content;
                    this.$store.commit('setMsgData',data);
                }
            }).finally(()=>{
                this.loading=false;
            })
        }
    },
    watch:{
        chatList(){
            this.splitChatList();
        },
        openChat(newVal){
            if(newVal){
                this.getChat();
            }
        },
        page(){
            this.getChat();
        }
    }
}
</script>

<style lang='scss'>
    #message-container{
        width: 100%;
        height:100%;
        background-color: #fff;
        display: flex;
        overflow: hidden;
        animation-duration: .3s;
        .side{
            flex: 4;
            overflow: hidden;
            // display: flex;
            // flex-direction: column;
            .search-box{
                background-color: #fff;
                height:40px;
                margin: 10px
            }
            .chats{
                height:500px;
                overflow-y:scroll;
                position:relative
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