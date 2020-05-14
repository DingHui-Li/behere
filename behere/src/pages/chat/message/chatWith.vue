<template>
    <div id='chat-with' ref='withChat'>
        <div class="topbar">
            <div class="name">
                {{chatInfo.name}} 
                <span v-if='chatInfo.count'>({{chatInfo.count}})</span>
            </div>
            <v-btn icon :style="{float:'right'}" v-if='chatInfo.count' @click='$router.push("/group/info/"+chatInfo.id)'>
                <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
        </div>
        <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
            <div :class="['elevation-5','has-video']" v-if='chatInfo.count&&liveUsers.length>0'>
                <v-btn class="zoom-btn" icon @click="liveUsers=[]">
                    <v-icon>mdi-notification-clear-all</v-icon>
                </v-btn>
                <div class="item" v-for="user in liveUsersInfo" :key='user.id'>
                    <div class="avatar">
                        <img :src="serverHost+user.avatar" />
                        <div class="name">{{user.name}}</div>
                    </div>
                </div>
                <div class="join">
                    <v-btn class="btn" depressed @click="call('callVideo')">
                        <v-icon class="icon">mdi-video-plus</v-icon> 
                        加入
                    </v-btn>
                </div>
            </div>
        </transition>
        <div class="chat" @click="openVoice=false" ref='chat'  v-intersect='onShow' @scroll="onScroll()">
            <v-progress-linear v-if='loading'
                indeterminate
                :color="theme"
                ></v-progress-linear>
                <transition-group enter-active-class="animated rubberBand">
                    <Msg v-for="(msg,index) in msgData" :key='msg.id' 
                        :data='msg' @openImg='openImgView' :userInfo='userInfo(msg.from)' 
                        :showTime='showTime(index)'/>
                </transition-group>
        </div>
        <div class="input-container" @click="openVoice=false">
            <div class="tool">
                <!-- emoji在这里 -->
                <v-menu :close-on-content-click="false" v-model="openEmoji">
                    <template v-slot:activator="{on}">  
                        <v-btn fab icon small v-on="on"><v-icon>mdi-emoticon-happy</v-icon></v-btn>
                    </template>
                    <Emoji @toBottom='toBottom' @send='send' :id='id' @close='openEmoji=false'/>
                </v-menu>
                <v-btn fab icon small @click="$refs.inputFile.click()"><v-icon>mdi-file</v-icon></v-btn>
                <input type="file" ref="inputFile" :style="{display:'none'}" @change="handleSelectFile"/>
                <v-btn fab icon small @click="$refs.inputImg.click()"><v-icon>mdi-image</v-icon></v-btn>
                <input multiple="multiple" type="file" accept="image/*" ref="inputImg" :style="{display:'none'}" @change="handleSelectImg"/>
                <v-btn fab icon small @click.stop='openVoice=!openVoice'><v-icon>mdi-microphone</v-icon></v-btn>
                <v-btn fab icon small @click="openHistory=true"><v-icon>mdi-history</v-icon></v-btn>
                <div :style="{float:'right',marginRight:'20px'}">
                    <v-btn fab icon small @click="call('callVideo')"><v-icon>mdi-message-video</v-icon></v-btn>
                    <v-btn fab icon small @click="call('callPhone')"><v-icon>mdi-phone</v-icon></v-btn>
                </div>
            </div>
            <div class="input">
                <div class="imgs" v-if='imgs.length>0'>
                    <v-img v-for="(img,index) in imgs" :key="'img'+index" :src='img' class="img">
                        <v-btn fab icon small class="btn" @click="removeImg(index)"><v-icon size='10'>mdi-close</v-icon></v-btn>
                    </v-img>
                </div>
                <v-textarea v-else class="input-area" placeholder="输入..." solo flat dense append-icon='' v-model='text' counter="500" 
                    @keydown.enter.exact="handleSend" @keyup.enter.exact="text=''"></v-textarea>
                <transition enter-active-class="animated slideInRight" leave-active-class="animated bounceOutRight">
                    <v-btn v-show='text.trim().length>0||imgs.length>0' class="send" depressed @click="handleSend"><v-icon :style="{color:'#fff'}">mdi-send</v-icon></v-btn>
                </transition>
            </div>
        </div>
        <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <History v-if="openHistory" @close='openHistory=false' :userInfo='chatInfo'/>
        </transition>
        <transition enter-active-class="animated zoomIn" leave-active-class="animated zoomOut">
            <InputVoice v-show='openVoice' @close='openVoice=false' @toBottom='toBottom' @send='send' :id='id'/>
        </transition>
        <v-snackbar v-model="snackbar.open" :color="snackbar.color" top>
            {{ snackbar.text }}
            <v-btn fab depressed @click="snackbar.open = false" :style="{backgroundColor:'transparent',color:'#fff'}">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
        <ImgView v-show='imgView' @close='imgView=false' :imgs='msgImgs.map(i=>i.src)' :open='imgIndex'/>
    </div>
</template>

<script>
import Msg from './msg'
import History from './history'
import InputVoice from './inputVoice'
import Emoji from './emoji'
import compressImg from '../../../util/compressImg'
import ImgView from '../../../components/imgView'
export default {
    components:{Msg,History,InputVoice,Emoji,ImgView},
    props:['id','loading','groupInfo','chatInfo'],
    data(){
        return{
            text:'',//输入文字内容
            imgs:[],
            snackbar:{
                open:false,
                text:'发布成功',
                color:'success'
            },
            openHistory:false,//打开消息历史记录组件
            openVoice:false,//打开录制语音组件
            imgView:false,//打开图片浏览组件
            imgIndex:0,//打开图片的下标
            downShift:false,//按下左shift
            openEmoji:false,//打开emoji--menu
            msgLength:0,//消息列表长度 用于判断是否是收到新消息
            liveUsers:[],//正在视频的用户
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme
        },
        msgData(){
            return this.$store.state.msgData
        },
        msgImgs(){//消息列表中的图片
            let imgs=[];
            for(let i in this.msgData){
                if(this.msgData[i].type==='img'){
                    imgs.push({src:this.msgData[i].content,id:this.msgData[i].id});
                }
            }
            return imgs;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        myInfo(){
            return this.$store.state.myInfo;
        },
        chatList(){
            return this.$store.state.chatList;
        },
        liveUsersInfo(){
            let users=[];
            for(let id of this.liveUsers){
                for(let user of this.groupInfo.chatGroupUserList){
                    if(user.sn===id){
                        users.push({
                            avatar:user.profilePhoto,
                            id:user.sn,
                            name:user.remark?user.remark:user.nickName,
                        })
                        break
                    }
                }
            }
            return users
        }
    },
    mounted(){
        if(this.chatInfo.group){
            this.getLiveUsers();
        }
    },
    methods:{
        openImgView(id){
            let index=0;
            for(let i=0;i<this.msgImgs.length;i++){//获取所属消息id的图片在msgImgs中的下标
                if(this.msgImgs[i].id===id){
                    index=i;
                }
            }
            this.imgView=true;
            this.imgIndex=index;
        },
        async call(type){
            let group=false;
            if(this.chatInfo.group){
                group=true;
                this.liveUsers=[]
            }
            if(this.$store.state.call.open){
                return;
            }
            let data={
                type,
                open:true,
                userSn:this.id,
                group,
            }
            this.$store.commit('openCall',data);
        },
        handleInputVoice(data){//选择语音
            let fullwidth=this.$refs.withChat.clientWidth;
            let width=data.duration/60*fullwidth;
            if(width<30) width=30;
            if(width>fullwidth*0.8) width=fullwidth*0.8;
            data.width=width;
            console.log(data)
        },
        handleSend(){
            let msgid=new Date().getTime();//临时id
            let text=this.text.trim();
            if(this.imgs.length>0)
            {
                this.sendImg(msgid);
            }else{
                if(text.trim().length===0) return; 
                this.text='';
                let data={
                    id:msgid,
                    from:this.myInfo.id,
                    content:text.trim(),
                    type:'text',
                    to:this.id,
                    status:'success',
                    time:new Date().getTime()
                }
                this.$store.commit('newMsg',data);//单条
                this.send(data.content,'text',msgid);
            }
            this.$nextTick(()=>{
                this.text='';
                this.toBottom()
            })
        },
        send(content,type){
            this.$store.state.ws.send(JSON.stringify({
                content,
                from:this.myInfo.id,
                to:this.id,
                type,
				groupSn:this.chatInfo.group?this.id:''
            }));
            let exist=false;
            for(let i in this.chatList){
                if(this.id===this.chatList[i].contactSn){
                    exist=true;break;
                }
            }
            if(!exist){
                this.$nextTick(()=>{
                    this.$store.commit('setUpdateChatList',true)
                })
            }
            // this.axios({
            //     method:'post',
            //     url:this.apiHost+'/message/sendMessage',
            //     data:{
            //         content,
            //         from:this.myInfo.id,
            //         to:this.id,
            //         type
            //     }
            // }).then(res=>{
            //     this.$store.commit('updateMsgStatus',{status:'success',id:msgid})
            //     console.log(res)
            // }).catch(()=>{
            //     this.$store.commit('updateMsgStatus',{status:'error',id:msgid})
            // })
        },
        async sendImg(msgid){//获取blob=>压缩&获取color=>上传文件服务器=>发送path
            let datas=[]
            for(let i=0;i<this.imgs.length;i++){
                datas.push({
                    id:msgid++,
                    from:this.$store.state.myInfo.id,
                    content:this.imgs[i],
                    type:'img',
                    to:this.id,
                    status:'sending',
                    time:new Date().getTime()
                })
            }
            this.imgs=[];
            this.$store.commit('newMsg',datas);//数组
            for(let i in datas){//用objectURl获取文件
                let file=await this.axios({
                    url:datas[i].content,
                    responseType:'blob'
                }).then(res=>res.data);
                let res=await compressImg(datas[i].content,file.type);
                let fd=new FormData();
                fd.append('color',res.color)
                fd.append('type','img');
                fd.append('img',res.data?res.data:file,'img.jpg')
                this.axios({//上传服务器
                    method:'post',
                    url:this.serverHost+'/uploadChatFile',
                    data:fd
                }).then(res=>{
                    if(res.data.code===200){
                        this.send(res.data.path,'img',datas[i].id);
                        this.$store.commit('updateMsgStatus',{status:'success',id:datas[i].id})
                    }else{
                        this.$store.commit('updateMsgStatus',{status:'error',id:datas[i].id})
                    }
                }).catch(()=>{
                        this.snackbar={open:true,text:'上传服务器失败',color:'error'}
                        this.$store.commit('updateMsgStatus',{status:'error',id:datas[i].id})
                })
            }
        },
        userInfo(id){
            if(id===this.myInfo.id) return;
            let data=this.chatList;
            for(let i in data){
                if(data[i].contactSn===this.id){
                    if(data[i].chatType==='group'){
                        let userInfo=null;
                        if(this.groupInfo&&this.groupInfo.chatGroupUserList){
                            for(let user of this.groupInfo.chatGroupUserList){//从群信息的用户列表查询出发送消息者的用户信息
                                if(user.sn===id) userInfo=user;
                            }
                            return{
                                avatar:userInfo.profilePhoto,
                                id:userInfo.sn,
                                name:userInfo.remark?userInfo.remark:userInfo.nickName,
                                type:'group'
                            }
                        }
                        return{
                                avatar:'/public/avatar.png',
                                name:'unknow',
                                id:-1
                        }
                    }else{
                        return {
                                    avatar:data[i].profilePhoto,
                                    id:data[i].contactSn,
                                }
                    }
                    
                }
            }
            return {avatar:'/public/avatar.png',name:'unknow'}
        },
        toBottom(){
            this.$refs.chat.scrollTop=this.$refs.chat.scrollHeight;
        },
        handleSelectImg(e){//选择图片
            let files=e.currentTarget.files;
            if(files.length+this.imgs.length>9){
                this.snackbar={
                    open:true,
                    text:'最多选择9张图片',
                    color:'error'
                }
                e.currentTarget.value='';
                return;
            }
            for(let i=0;i<files.length;i++){
                this.imgs.push(window.URL.createObjectURL(files[i]))
            }
            e.currentTarget.value='';
        },
        handleSelectFile(e){
            try{
                let msgid=this.msgData.length+1;
                let file=e.currentTarget.files[0];
                if(file.size/1024/1024>100){
                    throw {msg:'最大支持100M的文件发送'};
                }
                let fd=new FormData();
                fd.append('file',file,file.name)
                fd.append('type','file');
                console.log(file)
                this.axios({
                    method:'post',
                    url:this.serverHost+'/uploadChatFile',
                    data:fd
                }).then(res=>{
                    if(res.data.code===200){
                        let data={
                            id:msgid,
                            from:this.$store.state.myInfo.id,
                            content:{path:res.data.path,name:file.name,size:(file.size/1024/1024).toFixed(2)+'M'},
                            type:'file',
                            to:this.id,
                            status:'success',
                            time:new Date().getTime()
                        }
                        this.$store.commit('newMsg',data);//单条
                        this.send(data.content,'file',msgid);
                    }
                }).catch((err)=>{
                    if(err===400){
                        alert('不支持此文件类型的发送')
                    }
                })
            }catch(err){
                this.snackbar={open:true,text:err.msg,color:'error'}
            }finally{
                e.currentTarget.value='';
            }
            
        },
        removeImg(index){//移除图片
            window.URL.revokeObjectURL(this.imgs[index]);
            this.imgs.splice(index,1);
        },
        onShow(entries){//如果聊天窗口出现，则自动滑动到最底部 --交叉观察者
            let show= entries[0].isIntersecting;
            if(show){
                this.toBottom();
            }
        },
        onScroll(){
            if(this.$refs.chat.scrollTop===0){
                this.$emit('loadMore')
            }
        },
        showTime(index){//是否显示消息时间
            if(index>0){
                let preTime=new Date(this.msgData[index-1].time).getTime();
                let time=new Date(this.msgData[index].time).getTime();
                let diff=(time-preTime)/(1000*60);//相差分数
                if(diff>=10){
                    return true;
                }
                return false;
            }
        },
        getLiveUsers(){
            this.axios({
                method:'get',
                url:this.serverHost+'/openvidu/get-users?sessionName='+this.chatInfo.id
            }).then(res=>{
                this.liveUsers=res.data
            })
        }
    },
    watch:{
        msgData(newVal){
            if(newVal.length-this.msgLength===1){
                this.$nextTick(()=>{
                    this.toBottom();
                })
            }
            else{
                if(newVal.length<=20){//若消息列表长度小于20，说明是第一页
                    this.$nextTick(()=>{
                        this.toBottom();
                    })
                }
            }
            this.msgLength=newVal.length
        }
    }
}
</script>

<style lang='scss' scoped>
    #chat-with{
        width:100%;
        height:100%;
        display: flex;
        position: relative;
        flex-direction: column;
        animation-duration: .5s;
        .topbar{
            padding:0 20px;
            margin-top:10px;
            position: relative;
            overflow: hidden;
            .name{
                font-weight: bold;
                font-size: 1.2rem;
                float:left;
            }
        }
        .has-video{
            position: absolute;
            z-index: 10;
            height: 200px;
            width: 400px;
            top:45px;
            left:50%;
            transform: translateX(-50%);
            margin:0 auto;
            background-color: #fff;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            overflow: hidden;
            animation-duration: .5s;
            .zoom-btn{
                position: absolute;
                top:0;
                right: 0;
                background-color: #fff;
            }
            .item{
                margin: 5px;
                .avatar{
                    width: 80px;
                    height:80px;
                    border-radius: 50%;
                    overflow: hidden;
                    position: relative;
                    img{
                        width:100%;
                    }
                    .name{
                        position: absolute;
                        z-index: 2;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5);
                        text-align: center;
                        line-height: 80px;
                        top:0;
                        left:0;
                        color:#fff;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }
                }
            }
            .join{
                position: absolute;
                left:0;
                bottom: 0;
                width: 100%;
                .btn{
                    background-color: #536DFE;
                    width: 100%;
                    color:#fff;
                    font-weight: bold;
                    .icon{
                        margin-right: 5px;
                        color:#fff
                    }
                }
            }
        }
        .chat{
            flex: 1;
            position: relative;
            overflow: auto;
            overflow-x: hidden;
        }
        .input-container{
            .tool{
                overflow: hidden;
            }
            .input{
                display: flex;
                align-items: center;
                position: relative;
                .input-area{
                    padding:5px 10px;
                }
                .imgs{
                    flex:1;
                    height:150px;
                    overflow: auto;
                    .img{
                        width:100px;
                        height:100px;
                        border-radius: 5px;
                        margin:3px;
                        float:left;
                        .btn{
                            position: absolute;
                            right:0;
                            top:0;
                            background-color: rgba(255,255,255,.5);
                            width:20px;
                            height:20px;
                        }
                    }
                }
                .send{
                    margin-right: 10px;
                    background-color: #4CAF50;
                    animation-duration: .4s;
                }
            }
        }
    }
</style>