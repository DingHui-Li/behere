<template>
    <div>
        <v-menu v-model="openContextMenu">
            <template v-slot:activator='{on}'>
                <div id='chat-item' v-ripple @click="click"   @contextmenu.prevent="openContextMenu=true">
                    <div :class="id===data.contactSn?'bg':''"></div>
                    <div class="avatar-container">
                        <div class="avatar">
                            <v-img :src='serverHost+data.profilePhoto' :style="{height:'100%'}"></v-img>
                        </div>
                        <div class="badge" v-if='data.unreadNum>0'><span>{{data.unreadNum>=99?99:data.unreadNum}}</span></div>
                    </div>
                    
                    <div class="chat-info">
                        <div class="top">
                            <div class="name">{{data.remark?data.remark:data.nickName}}</div>
                            <div class="time">{{new Date(data.sendTime).parse()}}</div>
                        </div>
                        <div class="msg">
                            <span v-if='data.type==="img"'>[图片]</span>
                            <span v-else-if='data.type==="voice"'>[语音]</span>
                            <span v-else-if='data.type==="video"'>[视频通话]</span>
                            <span v-else-if='data.type==="phone"'>[语音通话]</span>
                            <span v-else-if='data.type==="file"'>[文件]</span>
                            <span v-else-if='data.type==="emoji"'>[表情]</span>
                            <span v-else-if='data.type==="callVideo"'>[视频通话]</span>
                            <span v-else-if='data.type==="callPhone"'>[语音通话]</span>
                            <span v-else>{{data.content}}</span>
                        </div>
                    </div>
                </div>
            </template>
            <div class='ctx-menu' v-ripple @click="removeChatlist=true">删 除</div>
        </v-menu>
        <v-dialog v-model='removeChatlist' width="300">
            <div class="remove-chatlist">
                <div class="tip">确认删除与<span class="name"> {{data.remark?data.remark:data.nickName}}</span> 的对话吗？</div>
                <div class="actions">
                    <v-btn :style="{flex:1,backgroundColor:'#4CAF50',marginRight:'20px',color:'#fff'}" depressed @click="removeChatlist=false">取消</v-btn>
                    <v-btn :style="{flex:1,backgroundColor:'#FF5252',color:'#fff'}" depressed @click="remove">删除</v-btn>
                </div>
            </div>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon :style="{color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    props:['data','index','id'],
    computed:{
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    data(){
        return{
            removeChatlist:false,
            snackbar:{
                open:false,
                text:'删除成功',
                color:'success'
            },
            openContextMenu:false
        }
    },
    methods:{
        click(){
            if(this.$store.state.openChat!==this.data.contactSn){
                this.$store.commit('updateOpenChat',null)
                this.$router.replace('/message');
                this.$nextTick(()=>{
                    this.$store.commit('updateOpenChat',this.data.contactSn)
                })
            }
        },
        longpress(){
            this.removeChatlist=true;
        },
        remove(){
            this.removeChatlist=false;
            let temp=this.data;
            this.$store.commit('removeChatList',this.data.sn);
            this.axios({
                method:'get',
                url:this.$store.state.apiHost+'/chat/delChat?chatSn='+this.data.sn,
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.snackbar={open:true,color:'success',text:'删除会话成功'}
                }else{
                    this.snackbar={open:true,color:'error',text:'删除会话失败，code:'+res.data.code}
                    this.$store.commit('addChatList',temp);
                }
            }).catch(()=>{
                this.$store.commit('addChatList',temp);
                this.snackbar={open:true,color:'error',text:'删除失败'}
            })
        }
    }
}
</script>

<style lang='scss' scoped>
.select{
    filter: brightness(85%);
}
    #chat-item{
        width: 100%;
        position: relative;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        padding:5px;
        align-items: center;
        cursor: pointer;
        border-radius: 5px;
        .bg{
            position: absolute;
            top:0;
            left:0;
            width: 100%;
            height:100%;
            background-color: rgba(0,0,0,.2);
        }
        .avatar-container{
            position: relative;
            .avatar{
                width:40px;
                height:40px;
                border-radius: 50%;
                background-color: green;
                margin-right: 10px;
                overflow: hidden;
                position: relative;
            }
            .badge{
                position: absolute;
                width:20px;
                height:20px;
                background-color: red;
                border-radius: 50%;
                z-index: 99;
                top:0;
                right:5px;
                overflow: hidden;
                font-size:0.7rem;
                font-weight: bold;
                display: flex;
                justify-content: center;
                align-items: center;
                color:#fff;
            }
        }
        .chat-info{
            flex: 1;
            background-color: #fff;
            overflow: hidden;
            .top{
                overflow: hidden;
                .name{
                    font-weight: bold;
                    float: left;
                }
                .time{
                    float:right;
                    font-size: 0.7rem;
                    color:#757575
                }
            }
            .msg{
                font-size: 0.9rem;
                white-space: nowrap;
            }
        }
    }
    .remove-chatlist{
        background-color: #fff;
        padding:20px;
        .tip{
            text-align: center;
            overflow: hidden;
            .name{
                font-weight: bold;
            }
        }
        .actions{
            margin-top: 20px;
            display: flex;
        }
    }
    .ctx-menu{
        padding:10px;
        text-align: center;
        cursor: pointer;
        background-color: #F44336;
        color:#fff;
        font-weight: bold;
    }
</style>