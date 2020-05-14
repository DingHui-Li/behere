<template>
    <div class="show-video-component">
        <div class="close-video" v-if='!videoActive'>
            <div class="avatar">
                <img :src="serverHost+userInfo.avatar" />
            </div>
        </div>
        <video autoPlay ref='video' :style="{transform:flip?'rotateY(180deg)':''}"></video>
        <div class="top-actions elevation-3">
            <v-btn icon class="btn" @click="$emit('fullScreen')">
                <v-icon class="icon">{{fullscreen?'mdi-fullscreen-exit':'mdi-fullscreen'}}</v-icon>
            </v-btn>
            <div class="btn-container">
                <div class="badge" v-show="newChatNum>0">{{newChatNum>99?'99':newChatNum}}</div>
                <v-btn icon class="btn" @click="$emit('rightSideShow')"><v-icon class="icon">mdi-message-reply</v-icon></v-btn>
            </div>
            <v-btn icon class="btn" @click="$emit('showSetting')"><v-icon class="icon">mdi-settings</v-icon></v-btn>
        </div>
        <div class="actions">
            <v-btn icon large class="btn" @click="handleShowVideo" :style="{backgroundColor:myVideoActive?'#4CAF50':'#FF5252'}">
                <v-icon class="icon">{{myVideoActive?'mdi-video':'mdi-video-off'}}</v-icon>
            </v-btn>
            <v-btn icon large class="btn" @click="mute" :style="{backgroundColor:myAudioActive?'#4CAF50':'#FF5252'}">
                <v-icon class="icon">{{myAudioActive?'mdi-microphone':'mdi-microphone-off'}}</v-icon>
            </v-btn>
            <v-btn icon large class="btn" :style="{backgroundColor:'#FF5252'}" @click="$emit('hangup')">
                <v-icon class="icon">mdi-phone-hangup</v-icon>
            </v-btn>
            <v-btn class="btn" icon large :style="{backgroundColor:'#3F51B5',float:'right'}" @click="flip=!flip">
                <v-icon class="icon">mdi-flip-horizontal</v-icon>
            </v-btn>
        </div>
        <div  :class="['my-video','elevation-4']" @click="$emit('showVideo',-1)"
            v-if='!isMe'>
            <div class="close-video" v-if='!myVideoActive'>
                <div class="avatar">
                    <img :src="serverHost+userInfo.avatar" />
                </div>
            </div>
            <video autoPlay ref='myVideo'></video>
            <div class="status">
                <v-btn v-if='!myAudioActive' class="btn" icon>
                    <v-icon class="icon">mdi-voice-off</v-icon>
                </v-btn >
                <v-btn  v-if='!myVideoActive' class="btn" icon>
                    <v-icon class="icon">mdi-video-off</v-icon>
                </v-btn >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['streamManager','publisher','serverHost','newChatNum','fullscreen'],
    computed:{
        isMe(){
            return this.streamManager===this.publisher
        },
        userInfo(){
            return JSON.parse(this.publisher.stream.connection.data.split('%/%')[0]).clientData
        },
    },
    data(){
        return{
            audioActive:true,
            videoActive:true,
            myAudioActive:true,
            myVideoActive:true,
            flip:false
        }
    },
    created(){
        this.audioActive=this.streamManager.stream.audioActive
        this.videoActive=this.streamManager.stream.videoActive

        this.myAudioActive=this.publisher.stream.audioActive
        this.myVideoActive=this.publisher.stream.videoActive
    },
    mounted(){
        this.streamManager.addVideoElement(this.$refs.video)
        this.publisher.addVideoElement(this.$refs.myVideo)
    },
    methods:{
        mute(){
            this.publisher.publishAudio(!this.myAudioActive)
            this.myAudioActive=!this.myAudioActive
        },
        handleShowVideo(){
            this.publisher.publishVideo(!this.myVideoActive)
            this.myVideoActive=!this.myVideoActive
        }
    },
    watch:{
        'streamManager.stream.audioActive'(newVal){
            this.audioActive=newVal
        },
        'streamManager.stream.videoActive'(newVal){
            this.videoActive=newVal
        },
    }
}
</script>

<style lang='scss' scoped>
    .show-video-component{
        position: relative;
        overflow: hidden;
        z-index: 1;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        video{
            transition: all .5s;
            transition-timing-function: ease-in-out;
        }
        .top-actions{
            position: absolute;
            padding:0 10px;
            background-color: #fff;
            z-index: 3;
            right: 10px;
            top:10px;
            border-radius: 30px;
            .btn{
                float:left;
            }
            .btn-container{
                position: relative;
                float:left;
                .badge{
                    width:20px;
                    height: 20px;
                    border-radius: 50%;
                    background-color: red;
                    position: absolute;
                    right:0;
                    top:0;
                    font-size: 0.8rem;
                    color:#fff;
                    z-index: 1;
                    text-align: center;
                    border:2px solid #fff;
                    font-weight: bold;
                }
            }
        }
        .my-video{
            position: absolute;
            z-index: 3;
            bottom: 100px;
            right:20px;
            width:200px;
            height:150px;
            background-color: #fff;
            border-radius: 10px;
            overflow: hidden;
            transition: all .5s;
            .status{
                position: absolute;
                z-index: 3;
                right: 0;
                bottom: 0;
                border-top-left-radius: 15px;
                border-top:3px solid #fff;
                border-left:3px solid #fff;
                background-color: #FF5252;
                display: flex;
                .icon{
                    color: #fff
                }
            }
        }
        .my-video-large{
            width: 100%;
            height: 100%;
            top:0;
            left:0;
        }
        .actions{
            position: absolute;
            width: 100%;
            z-index: 4;
            bottom:0;
            left:0;
            padding:40px;
            background-image: linear-gradient(rgba(0,0,0,0),rgba(0,0,0,.5));
            text-align: center;
            .btn{
                margin:0 10px;
                background-color: #fff;
                .icon{
                    color:#fff;
                }
            }
        }
    }   
    .close-video{
        position: absolute;
        z-index: 2;
        width: 100%;
        height: 100%;
        top:0;
        left:0;
        background-color: #757575;
        display: flex;
        justify-content: center;
        align-items: center;
        .avatar{
            width:100px;
            height:100px;
            border-radius: 50%;
            overflow: hidden;
            img{
                width: 100%;
            }
        }
    }
</style>