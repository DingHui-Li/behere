<template>
    <div class="setting-container">
        <div class="setting elevation-5">
            <div class="top">
                设置
                <v-btn icon @click="$emit('close')" class="btn"><v-icon class="icon">mdi-close</v-icon></v-btn>
            </div>
            <div class="content">
                <div><v-icon class="icon">mdi-video</v-icon> 视频输入源：</div>
                <div :class="['device',select.video==='screen'?'select':'']" v-ripple
                    @click="switchVideo('screen')">
                    捕获屏幕
                </div>
                <div v-for="device in devices.filter(item=>item.kind==='videoinput')" :key='device.deviceId' 
                    @click="switchVideo(device.deviceId)"
                    :class="['device',select.video===device.deviceId?'select':'']"  v-ripple>
                    {{device.label}}
                </div>
                <div><v-icon class="icon">mdi-microphone</v-icon> 音频输入源：</div>
                <div v-for="device in devices.filter(item=>item.kind==='audioinput')" :key='device.deviceId' 
                    @click="switchAudio(device.deviceId)"
                    :class="['device',select.audio===device.deviceId?'select':'']"   v-ripple>
                    {{device.label}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['videoDevice','audioDevice','theme'],
    data(){
        return{
            devices:[],
            select:{
                video:this.videoDevice,
                audio:this.audioDevice,
            }
        }
    },
    mounted(){
        navigator.mediaDevices.enumerateDevices()
            .then(devices=>{
                this.devices=devices
            })
    },
    methods:{
        switchVideo(device){
            this.$emit('changeVideoDevice',device)
            this.select.video=device
        },
        switchAudio(device){
            this.$emit('changeAudioDevice',device)
            this.select.audio=device
        }
    }
}
</script>

<style lang='scss' scoped>
    .setting-container{
        width: 100%;
        height:100%;
        position: absolute;
        background-color: rgba(0,0,0,.5);
        animation-duration: .5s;
        z-index: 10;
    }
    .setting{
        width: 500px;
        height: 500px;
        position: absolute;
        z-index: 9;
        background-color: rgba(0,0,0,.9);
        border-radius: 20px;
        overflow: hidden;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        .top{
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding:4px 20px;
            padding-right: 5px;
            background-color: rgba(255,255,255,.1);
            color:#fff;
            font-weight: bold;
            font-size: 1.1rem;
            .btn{
                .icon{
                    color:#fff
                }
            }
        }
        .content{
            padding:20px;
            color:#fff;
            .mirror{
                display: flex;
                align-items: center;
                .text{
                    margin:0 5px;
                }
                .btn{
                    margin-left: 10px;
                    padding-top: 8px;
                }
            }
            .icon{
                color:#fff;
            }
            .device{
                width: fit-content;
                margin: 10px 20px;
                padding:5px 15px;
                border-radius: 20px;
                background-color: #fff;
                color:#454545;
                cursor: pointer;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .select{
                background-color: #4CAF50;
                color:#fff;
            }
        }
    }
</style>