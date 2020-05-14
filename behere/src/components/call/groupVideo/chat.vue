<template>
    <div class="chat">
        <div class="tip">
            <v-icon color='#e0e0e0'>mdi-information</v-icon> 
            本对话框仅为临时对话框，消息记录不同步，重要信息请自己保存。
        </div>
        <div class="msg" ref='msg'>
            <ChatItem v-for="(msg,index) in data" :data='msg' :key="'msg-'+index"
                :myInfo='myInfo' :serverHost='serverHost'/>
        </div>
        <div class="input-container">
            <v-textarea hide-details solo flat class="input"  v-model="text"  :rows="4" filled no-resize
            placeholder="（enter=发送，shift+enter=换行）"
            @keydown.enter.exact="handleSend" @keyup.enter.exact="text=''" color='#fff'></v-textarea>
        </div>
    </div>
</template>

<script>
import ChatItem from './chatItemComponent'
export default {
    props:['session','data'],
    components:{ChatItem},
    data(){
        return{
            text:''
        }
    },
    computed:{
        myInfo(){
            return this.$store.state.myInfo
        },
        serverHost(){
            return this.$store.state.serverHost
        }
    },
    updated(){
        this.$refs.msg.scrollTop=this.$refs.msg.scrollHeight
    },
    methods:{
        handleSend(){
            let text=this.text.trim()
            if(text.length===0) return;
            this.session.signal({data:text,to:[],type:'chat'})
                .then(res=>{
                    
                })
        }
    }
}
</script>

<style lang='scss' scoped>
    .chat{
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .tip{
            color:#e0e0e0;
            padding:20px;
            font-size: 0.9rem;
        }
        .msg{
            flex:1;
            overflow: auto;
        }
        .input-container{
            background-color: #BDBDBD;
            .input{
                //background-color: #607D8B;
            }
        }
    }
</style>