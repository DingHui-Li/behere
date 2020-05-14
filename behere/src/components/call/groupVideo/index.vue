<template>
    <!-- <VueDragResize parentLimitation :w='750' :h='600'> -->
        <div id='group-video' class="elevation-5" ref='container'>
            <div class="left" :style="{maxWidth:leftSideShow?'400px':'0'}">
                <div class="top">
                    <div class="num">
                        <v-icon class="icon">mdi-message-video</v-icon> {{users.length+1}}
                    </div> 
                </div>
                <div class="content" v-if='!updateUserList'>
                    <transition-group name='user-video' enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
                        <UserVideoComponent v-for="(user,index) in users" :key="'uservideo-'+index"
                        :streamManager='user' :serverHost='serverHost' :index='index'
                        :style="{borderColor:theme}"  :select='user===showUser'
                        :class="[user===showUser?'video select elevation-4':'video']" 
                        @showVideo='setShowVideo'/>
                    </transition-group>
                </div>
                <div class="hide-show-btn" @click="leftSideShow=!leftSideShow" v-ripple
                    :style="{   backgroundColor:theme,
                                borderRadius:leftSideShow?'30px 0 0 30px':'0 30px 30px 0',
                                right:leftSideShow?'0':'-44px'}">
                    <v-icon class="icon">{{leftSideShow?'mdi-chevron-left':'mdi-chevron-right'}}</v-icon>
                </div>
            </div>
            <div class="middle">
                <transition enter-active-class="animated zoomIn">
                    <ShowVideoComponent v-if='showUser&&publisher' :streamManager='showUser' :publisher='publisher'
                        :style="{width:'100%',height:'100%'}" :serverHost='serverHost' :newChatNum='newChatNum'
                        @rightSideShow='rightSideShow=!rightSideShow;newChatNum=0'  @showVideo='setShowVideo'
                        @showSetting='setting.open=true' @hangup='hangup' @fullScreen='fullScreen' :fullscreen='fullscreen'/>
                </transition>
            </div>
            <div class="right" :style="{maxWidth:rightSideShow?'400px':'0'}">
                <Chat :session='session' :data='chatData'/>
            </div>
            <transition enter-active-class="animated slideInDown" leave-active-class="animated slideOutUp">
                <Setting v-if="setting.open" @close='setting.open=false'
                    :videoDevice='setting.videoDevice' :audioDevice='setting.audioDevice'
                    @changeVideoDevice='v=>setting.videoDevice=v'
                    @changeAudioDevice='v=>setting.audioDevice=v'/>
            </transition>
            <div class="error-info" v-show='error.open'>
                <v-icon class="icon" size='100'>{{error.icon}}</v-icon>
                <div class="text">{{error.text}}</div>
                <div class="msg">{{error.msg}}</div>
                <v-btn depressed :loading="error.loading" @click='retry'><v-icon>mdi-reload</v-icon></v-btn>
            </div>
        </div>
    <!-- </VueDragResize> -->
</template>

<script>
// import VueDragResize  from 'vue-drag-resize'
import {OpenVidu} from 'openvidu-browser'
import UserVideoComponent from './userVideoComponent'
import ShowVideoComponent from './showVideoComponent'
import Setting from './setting'
import Chat from './chat'
export default {
    // components:{VueDragResize},
    components:{UserVideoComponent,ShowVideoComponent,Setting,Chat},
    props:['stream','myInfo','serverHost','data'],
    data(){
        return{
            large:0,//index
            OV:new OpenVidu(),
            session:null,
            users:[],//用户列表
            showUser:null,//显示的用户
            publisher:null,//我的发布
            leftSideShow:true,//显示左侧
            rightSideShow:false,//显示右侧
            setting:{//设置
                open:false,
                videoDevice:undefined,
                audioDevice:undefined,
            },
            chatData:[],//文字聊天数据
            newChatNum:0,//新消息数 右侧未打开时
            error:{
                open:false,
                icon:'',
                text:'',
                msg:'',
                type:'',
                loading:false,//btn
            },
            fullscreen:false,
            updateUserList:false
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme
        }
    },
    mounted(){
        this.session=this.OV.initSession();
        this.publish()
    },
    methods:{
        hangup(){
            this.axios({
                method:'post',
                url:this.serverHost+'/openvidu/leave',
                data:{
                    sessionName:this.data.userSn,
                    userId:this.myInfo.id
                }
            })
            this.session.disconnect()
            this.$store.commit('closeCall');
        },
        async publish(){
            this.axios({
                method:'post',
                url:this.serverHost+'/openvidu/get-token',
                data:{sessionName:this.data.userSn,userId:this.myInfo.id,role:'publisher'},
            }).then(res=>{
                let token=res.data;
                this.session.connect(token,{clientData:{id:this.myInfo.id,name:this.myInfo.name,avatar:this.myInfo.avatar}})
                    .then(()=>{
                        this.error.open=false
                        try{
                            let publisher = this.OV.initPublisher(undefined, {
                                audioSource: this.setting.audioDevice, // The source of audio. If undefined default microphone
                                videoSource: this.setting.videoDevice, // The source of video. If undefined default webcam
                                publishAudio: true,     // Whether you want to start publishing with your audio unmuted or not
                                publishVideo: this.data.type==="callVideo",     // Whether you want to start publishing with your video enabled or not
                                resolution: '640x480',  // The resolution of your video
                                frameRate: 30,          // The frame rate of your video
                                insertMode: 'REPLACE',   // How the video is inserted in the target element 'video-container'
                                mirror: true           // Whether to mirror your local video or not
                            });
                            this.session.publish(publisher)
                            this.showUser=publisher
                            this.publisher=publisher
                        }catch(err){
                            console.log(err)
                        }
                    })
                this.session.on('streamCreated',e=>{//其他用户加入
                    this.updateUserList=true
                    let subscriber=this.session.subscribe(e.stream,undefined);
                    this.users.push(subscriber)
                    this.$nextTick(()=>{
                        this.updateUserList=false
                    })
                })
                this.session.on('streamDestroyed',e=>{//其他用户退出或切换
                    let index = this.users.indexOf(e.stream.streamManager, 0);
                    if(index>-1){
                        this.users.splice(index,1)
                    }
                })
                this.session.on('signal:chat',e=>{
                    if(!this.rightSideShow) this.newChatNum++
                    this.chatData.push({
                        text:e.data,
                        user:e.from,
                    })
                })
            }).catch(err=>{
                console.log(err)
                this.error={
                    open:true,
                    text:'连接错误',
                    icon:'mdi-close-network',
                    msg:'',
                    type:'get-token',
                    loading:false
                }
            }).finally(()=>{this.error.loading=false})
        },
        setShowVideo(index){
            this.showUser=null;
            this.$nextTick(()=>{
                if(index===-1){
                    this.showUser=this.publisher
                }else{
                    this.showUser=this.users[index]
                }
            })
        },
        changeStream(){
            let publisher = this.OV.initPublisher(undefined, {
                audioSource: this.setting.audioDevice, // The source of audio. If undefined default microphone
                videoSource: this.setting.videoDevice, // The source of video. If undefined default webcam
                publishAudio: true,     // Whether you want to start publishing with your audio unmuted or not
                publishVideo: true,     // Whether you want to start publishing with your video enabled or not
                resolution: '640x480',  // The resolution of your video
                frameRate: 30,          // The frame rate of your video
                insertMode: 'APPEND',   // How the video is inserted in the target element 'video-container'
                mirror: true         // Whether to mirror your local video or not
            });
            this.session.unpublish(this.publisher);
            this.session.publish(publisher)
            this.publisher=publisher
            this.showUser=null
            this.$nextTick(()=>{
                this.showUser=publisher
            })
        },
        retry(){
            if(this.error.type==='get-token'){
                this.error.loading=true
                this.publish();
            }
        },
        fullScreen(){
            if(this.fullscreen){
                document.exitFullscreen()
            }else{
                this.$refs.container.requestFullscreen()
            }
            this.fullscreen=!this.fullscreen
        }
    },
    watch:{
        'setting.videoDevice'(newVal){
            this.changeStream()
        },
        'setting.audioDevice'(newVal){
            this.changeStream()
        },
    }
}
</script>

<style lang='scss' scoped>
    #group-video{
        width:100%;
        height:100%;
        position: relative;
        z-index: 9999;
        overflow: hidden;
        display: flex;
        background-color: #fff;
        border-radius: 20px;
        .left{
            width:400px;
            background-color: #fff;
            //overflow: auto;
            position: relative;
            transition: all .5s;
            transition-timing-function: ease-in-out;
            .top{
                color:#fff;
                font-weight: bold;
                font-size: 1.1rem;
                overflow: hidden;
                .num{
                    float: right;
                    padding:3px 13px;
                    background-color: #3F51B5;
                    border-radius: 20px;
                    margin-right: 10px;
                    margin-top: 10px;
                    .icon{
                        color:#fff
                    }
                }
                
            }
            .content{
                width: 100%;
                height: 100%;
                overflow-y: auto;
                padding:20px;
                .video{
                    width: 100%;
                    height:200px;
                    background-color:#454545;
                    overflow: hidden;
                    transition: all .5s;
                    position: relative;
                    border-radius: 15px;
                    border: none;
                }
                .select{
                    border-width: 2px;
                    border-style: solid;
                }
            }
            .hide-show-btn{
                position: absolute;
                z-index:5;
                top:50%;
                transform: translateY(-50%);
                right:0;
                padding:5px 10px;
                border-radius: 30px;
                transition: all .5s;
                cursor: pointer;
                .icon{
                    color:#fff
                }
            }
        }
        .middle{
            flex:1;
            background-color: #e0e0e0
        }
        .right{
            width:400px;
            transition: all .5s;
            transition-timing-function: ease-in-out;
        }
        .error-info{
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: red;
            top:0;
            left:0;
            z-index: 11;
            color:#fff;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            .icon{
                color:#fff
            }
            .text{
                font-size: 1.5rem;
                margin-top: 10px;
            }
        }
    }
    .user-video-move{
        transition: all .5s;
    }
</style>