<template>
    <v-hover v-slot:default="{ hover }">
        <div class="user-video-component">
            <div class="top">{{userInfo.name}}</div>
            <div :class="['action','animated',hover?'slideInDown':'slideOutUp']">
                <div class="user-info">
                    <div class="avatar">
                        <img :src="serverHost+userInfo.avatar" />
                    </div>
                    <div class="name">{{userInfo.name}}</div>
                </div>
                <div class="actions">
                    <v-btn icon class="btn" large
                        :style="{backgroundColor:hasAudio&&audioActive?'#4CAF50':'#FF5252'}" @click="mute" >
                        <v-icon class="icon">{{audioActive?'mdi-microphone':'mdi-microphone-off'}}</v-icon>
                    </v-btn>
                    <v-btn icon large class="btn" @click="$emit('showVideo',index)" v-show='!select'>
                        <v-icon >mdi-dock-right</v-icon>
                    </v-btn>
                </div>
                
            </div>
            <div class="status" v-if='!audioActive||!hasAudio||!hasVideo'>
                <v-btn v-if='!hasAudio' class="btn" icon>
                    <v-icon class="icon">mdi-voice-off</v-icon>
                </v-btn >
                <v-btn  v-if='!hasVideo' class="btn" icon>
                    <v-icon class="icon">mdi-video-off</v-icon>
                </v-btn >
                <v-btn  v-if='!audioActive' class="btn" icon>
                    <v-icon class="icon">mdi-microphone-off</v-icon>
                </v-btn >
            </div>
            <div class="select" v-show="select">
                <v-btn icon>
                    <v-icon class="icon">mdi-airplay</v-icon>
                </v-btn>
            </div>
            <div class="close-video" v-if='!hasVideo'>
                <div class="avatar">
                    <img :src="serverHost+userInfo.avatar" />
                </div>
            </div>
            <video autoPlay ref='video'></video>
        </div>
    </v-hover>
</template>

<script>
export default {
    props:['streamManager','serverHost','index','select'],
    computed:{
        userInfo(){
            return JSON.parse(this.streamManager.stream.connection.data.split('%/%')[0]).clientData
        },
    },
    data(){
        return{
            hasAudio:true,//对方是否开启声音
            hasVideo:true,//对方是否开启视频
            audioActive:true,//我是否关闭了对方声音
        }
    },
    created(){
        this.hasAudio=this.streamManager.stream.audioActive
        this.hasVideo=this.streamManager.stream.videoActive
    },
    mounted(){
        this.streamManager.addVideoElement(this.$refs.video)
    },
    methods:{
        mute(){
            this.streamManager.subscribeToAudio(!this.audioActive)
            this.audioActive=!this.audioActive
        },
    },
    watch:{
        'streamManager.stream.audioActive'(newVal){
            this.hasAudio=newVal
        },
        'streamManager.stream.videoActive'(newVal){
            this.hasVideo=newVal
        },
        index(newVal){
            console.log(newVal)
        }
        // streamManager:{
        //     handler:newVal=>{
        //         console.log(newVal.stream.audioActive)
        //     },
        //     deep:true
        // }
    }
}
</script>

<style lang='scss' scoped>
    .user-video-component{
        position: relative;
        z-index: 2;
        margin-bottom: 10px;
        overflow: hidden;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        .top{
            width: 100%;
            padding:10px;
            padding-top: 5px;
            position: absolute;
            top:0;
            left:0;
            background-image:linear-gradient(#000, rgba(0,0,0,0));
            z-index: 1;
            color:#fff;
        }
        .select{
            position: absolute;
            z-index: 3;
            right: 0;
            top: 0;
            border-radius: 15px;
            // border:3px solid #fff;
            // border-left:3px solid #fff;
            // padding:5px;
            background-color: #536DFE;
            .icon{
                color:#fff
            }
        }
        .status{
            position: absolute;
            z-index: 3;
            right: 0;
            bottom: 0;
            border-top-left-radius: 15px;
            border-top:3px solid #fff;
            border-left:3px solid #fff;
            // padding:5px;
            background-color: #FF5252;
            display: flex;
            .icon{
                color: #fff
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
        .action{
            width: 100%;
            height: 100%;
            position: absolute;
            z-index: 4;
            left:0;
            top:0;
            animation-duration: .5s;
            animation-timing-function: ease-in-out;
            background-color: rgba(0,0,0,.8);
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color:#fff;
            .user-info{
                overflow: hidden;
                .avatar{
                    width: 50px;
                    height:50px;
                    border-radius: 50%;
                    overflow: hidden;
                    float: left;
                    img{
                        width: 100%;
                    }
                }
                .name{
                    float: left;
                    line-height: 50px;
                    margin-left: 10px;
                    font-size: 1.2rem;
                }
            }
            .actions{
                margin-top: 20px;
                .btn{
                    background-color: #fff;
                    margin: 0 10px;
                    .icon{
                        color:#fff
                    }
                }
            }
            
        }
    }
</style>