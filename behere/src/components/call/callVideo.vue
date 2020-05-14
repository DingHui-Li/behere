<template>
    <div :style="{overflow:'hidden',height:'100%'}">
        <VueDragResize id='call-video' v-on:resizing='resize' class="elevation-10" :w="500" :h='400' :minw='200' :minh='300' :z='999'>
            <div ref='video' :style="{width:'100%',height:'100%',position:'relative'}"
                @mouseenter="hideAction=false" @mouseleave="hideAction=true">
                <!-- <v-img :src='avatar' class="background"></v-img> -->
                <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
                    <div class="self-video elevation-3" v-show='!isminmize&&connectStatus==="connected"'>
                        <v-btn fab icon small class="btn" @click="exchange"><v-icon>mdi-arrow-expand</v-icon></v-btn>
                        <video ref='selfVideo' autoplay></video>
                    </div>
                </transition>
                <div class="other-video">
                    <video ref='otherVideo' autoplay :style="{filter:connectStatus==='connected'?'':'blur(5px)'}"></video>
                </div>
            
                <div :class="['topbar','animated',hideAction?'slideOutUp':'slideInDown']">
                    <v-btn icon fab small @click="fullscreen"><v-icon>mdi-fullscreen</v-icon></v-btn>
                    <!-- <v-btn icon fab small @click="minmize"><v-icon>mdi-window-minimize</v-icon></v-btn>
                    <v-btn icon fab small @click="maxmize"><v-icon>mdi-window-maximize</v-icon></v-btn> -->
                    <v-btn icon fab small @click="$emit('hangup')"><v-icon>mdi-close</v-icon></v-btn>
                </div>
                <div class="userinfo" v-if="connectStatus==='pending'">
                    <div class="avatar">
                        <v-img :src='serverHost+userInfo.profilePhoto'></v-img>
                    </div>
                    <div class="right">
                        <div class="name">{{userInfo.remark?userInfo.remark:userInfo.nickName}}</div>
                        <div class="tip">等待对方接听...</div>
                    </div>
                </div>
                <div class="userinfo"  v-else-if="connectStatus==='connecting'">
                    <div :style="{fontWeight:'bold',fontSize:'1.1rem'}">连接中...</div>
                </div>
                <div :class="['actions','animated',hideAction?'slideOutDown':'slideInUp']">
                    <v-btn @click="$emit('mute')" icon fab small class="btn" 
                        :style="{backgroundColor:closeVoice?'#388E3C':'rgba(255,255,255,.3)',color:closeVoice?'#fff':'#000'}">
                        <v-icon>mdi-microphone-off</v-icon>
                    </v-btn>
                    <v-btn icon fab  class="btn hangup" @click="$emit('hangup')"><v-icon>mdi-phone-hangup-outline</v-icon></v-btn>
                    <v-menu>
                        <template v-slot:activator="{on}">
                            <v-btn v-on='on' icon fab small class="btn">
                                <v-icon v-if='source==="back"'>mdi-camera-enhance</v-icon>
                                <v-icon v-if='source==="front"'>mdi-camera</v-icon>
                                <v-icon v-if='source==="screen"'>mdi-monitor</v-icon>
                            </v-btn>
                        </template>
                        <div class="selectSource">
                            <div class="item" v-ripple @click="changeSource('back')"><v-icon>mdi-camera-enhance</v-icon> 后置摄像头</div>
                            <div class="item" v-ripple @click="changeSource('front')"><v-icon>mdi-camera</v-icon> 前置摄像头</div>
                            <div class="item" v-ripple @click="changeSource('screen')"><v-icon>mdi-monitor</v-icon> 屏幕</div>
                        </div>
                    </v-menu>
                    
                </div>
            </div>
        </VueDragResize>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn @click="snackbar.open=false" :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import VueDragResize  from 'vue-drag-resize'
export default {
    props:['myStream','otherStream','connectStatus','call','userInfo','closeVoice'],
    components:{VueDragResize},
    data(){
        return{
            hideAction:false,//隐藏顶栏和底栏 
            isExchange:false,//是否交换过stream
            isminmize:false,//是否是最小尺寸
            source:'screen',
            snackbar:{
                open:false,
                text:'发生错误',
                color:'error'
            },
            option:{
                audio:{
                    noiseSuppression:true,
                    echoCancellation:true
                },
                video:{
                    height:800,
                    width:1000
                }
            }
        }
    },
    computed:{
        serverHost(){
            return this.$store.state.serverHost
        },
        avatar(){
            return this.serverHost+"/public/test.png"
        },
    },
    methods:{
        fullscreen(){
            this.$refs.video.requestFullscreen()
        },
        resize(e){
            if(e.width<300||e.height<400){
                this.isminmize=true;
            }else{
                this.isminmize=false;
            }
        },
        exchange(){
            if(this.isExchange){
                this.$refs.selfVideo.srcObject=this.myStream;
                this.$refs.otherVideo.srcObject=this.otherStream;
            }else{
                this.$refs.selfVideo.srcObject=this.otherStream;
                this.$refs.otherVideo.srcObject=this.myStream;
            }
            this.isExchange=!this.isExchange;
        },
        changeSource(type){
            if(type==='screen'){
                navigator.mediaDevices.getDisplayMedia()
                    .then(stream=>{
                        this.source=type;
                        //this.myStream=stream
                        this.$emit('changeSource',stream)
                        return;
                    }).catch(()=>{
                        this.snackbar={open:true,text:'getDisplayMedia失败',color:'error'}
                    });
            } else{
                let option='';
            let text='';
            if(type==='back'){
                text='获取后摄像头失败'
                this.option.video.facingMode='environment';
            }else if(type==='front'){
                text='获取前摄像头失败'
                this.option.video.facingMode='user';
            }
            navigator.mediaDevices.getUserMedia(this.option)
                .then(stream=>{
                    this.source=type;
                    //this.myStream=stream;
                    this.$emit('changeSource',stream)
                })
                .catch((err)=>{
                    console.log(err)
                    this.snackbar={open:true,text,color:'error'}
                });
            }
        }
    },
    watch:{
        myStream(newVal){
            if(this.connectStatus==='pending'){
                this.$refs.otherVideo.srcObject=newVal;
            }else{
                this.$refs.selfVideo.srcObject=newVal;
            }
        },
        otherStream(newVal){
            this.$refs.otherVideo.srcObject=newVal;
        },
        connectStatus(newVal){
            if(newVal==='connected'){
                this.$refs.selfVideo.srcObject=this.myStream;
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #call-video{
        background-color: rgba(255,255,255);
        position: fixed;
        top:0;
        z-index: 99;
        // animation-duration: .5s;
        // transition:width .5s,height .5s;
        border-radius: 5px;
        overflow: hidden;
        animation-duration: .5s;
        // width:500px;
        // height:400px;
        //transform: translate(50%,50%);
        .self-video{
            position: absolute;
            width:150px;
            height:200px;
            right:0;
            z-index: 99;
            background-color: #fff;
            border-radius: 5px;
            animation-duration: .5s;
            video{
                width:100%;
                height:100%;
            }
            .btn{
                position:absolute;
                bottom: 0;
                background-color: rgba(0,0,0,.3);
                z-index: inherit;
            }
        }
        .other-video{
            z-index: -1;
            width:100%;
            height:100%;
            // filter: blur(10px);
            // transform: scale(1.1);
            video{
                position: absolute;
                width:100%;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%)
            }
        }
        .topbar{
            position: absolute;
            width:100%;
            text-align: right;
            background-color: rgba(255,255,255,.2);
            animation-duration: .5s;
            z-index: 100;
            top:0;
        }
        .userinfo{
            width: 100%;
            overflow: hidden;
            padding:20px;
            display: flex;
            z-index: 99;
            position: absolute;
            top:50%;
            left:50%;
            transform: translate(-50%,-50%);
            display: flex;
            justify-content: center;
            align-items: center;
            .avatar{
                width:60px;
                height:60px;
                border-radius: 50%;
                overflow: hidden;
            }
            .right{
                margin-left: 20px;
                .name{
                    font-size: 1.3rem;
                    font-weight: bold;
                }
                .tip{
                    font-size: 0.8rem;
                    color:#454545;
                    font-weight: bold;
                }
            }
        }
        .actions{
            position: absolute;
            width:100%;
            bottom:0;
            padding: 30px;
            display: flex;
            justify-content: space-around;
            align-items: center;
            background-color: rgba(0,0,0,.3);
            animation-duration: .5s;
            z-index: inherit;
            .btn{
                background-color: rgba(255,255,255,.3);
                color:#000
            }
            .hangup{
                background-color: red;
                color:#fff;
            }
        }
    }
    .selectSource{
        background-color: #fff;
        .item{
            width:100%;
            padding:10px 20px;
            cursor: pointer;
        }
    }
</style>