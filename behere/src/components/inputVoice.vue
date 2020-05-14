<template>
    <div>
        <v-menu transition="scale-transition" :closeOnContentClick="false">
            <template v-slot:activator="{ on }">
                <v-btn depressed class="btn"  v-on="on" @click="getStream">
                    <span :style="{color:theme,filter }">
                        <v-icon class="icon" >mdi-microphone</v-icon>
                        语音
                    </span>
                </v-btn>
            </template>
            <v-card class="inputVoice">
                <v-tooltip right>
                    <template v-slot:activator="{ on }">
                        <v-icon class="help-icon" v-on="on">mdi-help-circle</v-icon>
                    </template>
                    <div>按住以开始录制</div>
                    <div>（最短录制时间为2秒，最长60秒）</div>
                </v-tooltip>
                <div class="duration">{{duration!==60?`0:${duration}`:'1:00'}}</div>
                <div v-if='!error.show'>
                    <v-btn fab depressed class="btn" @mousedown.stop="start" @mouseup.stop="stop" v-if="!confirm" @touchstart.stop='start' @touchend.stop='stop'>
                        <v-progress-circular :rotate="-90" class="progress" size="150" width='15' :style="{color:theme}" :value="progress">
                        </v-progress-circular>
                        <v-icon class="icon">mdi-microphone</v-icon>
                        <div class="text">按住</div>
                    </v-btn>
                    <v-btn depressed fab class="btn check-btn" :style="{borderColor:theme}" v-else @click="handleConfirm">
                        <v-icon class="icon" :style="{color:theme}">mdi-check</v-icon>
                    </v-btn>
                </div>
                <v-btn depressed fab class="btn error-btn" v-else @click='getStream'>
                    <v-icon class="icon">mdi-close</v-icon>
                    <div class="text">{{error.text}}</div>
                </v-btn>
                <v-btn depressed class='restart' :style="{backgroundColor:theme}" @click="handleRestart" v-show='confirm'>重新录制</v-btn>
            </v-card>
        </v-menu>
    </div>
</template>

<script>
export default {
    props:['length'],
    data(){
        return{
            show:false,
            duration:0,//录制时长
            maxDuration:60,//最大时长 s
            progress:0,//进度
            interval:null,//计时器
            confirm:false,//录制完成，等待确认
            stream:null,
            recoder:null,
            data:null,
            error:{
                show:false,
                text:'获取麦克风失败'
            }
        }
    },
    computed:{
        theme(){
            let theme=this.$store.state.theme;
            return theme;
        },
        filter(){
            return `brightness(${this.theme.isBlack()?'85%':'100%'})`
        }
    },
    methods:{
        start(){
            if(this.length>=9){
                this.$emit('overstep');
                this.error={
                    show:true,
                    text:'超出数量'
                }
                return;
            }else{
                this.error.show=false
            }
            this.recoder=new MediaRecorder(this.stream);
            this.recoder.start();
            this.recoder.ondataavailable=e=>{
                this.data=e.data;
            }

            this.duration=0;
            this.confirm=false;
            let _interval=setInterval(()=>{
                this.duration++;
                this.progress=this.duration/this.maxDuration*100;
                if(this.duration===60){
                    this.stop();
                }
            },1000);
            this.interval=_interval;
        },
        stop(){
            this.recoder.stop();
            if(this.duration>2){
                clearInterval(this.interval)
                this.confirm=true;
            }else{
                this.handleRestart();
            }
            console.log(this.length)
        },
        handleRestart(){ 
            this.duration=0;
            this.progress=0;
            this.confirm=false;
            this.recoder=null;
            this.data=null;
            clearInterval(this.interval);
        },
        handleConfirm(){
            if(this.duration<=2){
                return;
            }
            let url=window.URL.createObjectURL(this.data);
            this.$emit('handleInputVoice',{src:url,duration:this.duration});
            this.handleRestart();
        },
        async getStream(){
            if(this.length>=9){
                this.$emit('overstep');
                this.error={
                    show:true,
                    text:'超出数量'
                }
                return;
            }else{
                this.error.show=false
            }
            let stream=await navigator.mediaDevices.getUserMedia({audio:true}).catch(()=>{
                this.error={
                    show:true,
                    text:'获取麦克风失败'
                }
            });
            if(!stream){
                return
            }
            this.stream=stream;
        },
    },
}
</script>

<style lang='scss' scoped>
    .inputVoice{
        position: relative;
        padding:10px;
        .help-icon{
            position: absolute;
            left:5px;
            top:5px;
            font-size: 1rem;
            color:#959595;
        }
        .duration{
            width:100%;
            text-align: center;
            font-size: 1.5rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .btn{
            left:50%;
            transform: translateX(-50%);
            width: 150px;
            height:150px;
            position: relative;
            .icon{
                font-size: 3rem;
            }
            .progress{
                position: absolute;
            }
            .text{
                position: absolute;
                font-size: 0.8rem;
                bottom:-30px;
                color:#959595
            }
        }
        .check-btn{
            border:15px solid transparent;
            .icon{
                font-size: 5rem;
            }
        }
        .error-btn{
            background-color: #F44336 !important;
            position: relative;
            .icon{
                color:#fff;
                font-size: 7rem;
            }
            .text{
                position: absolute;
                top: 0;
                font-weight: bold;
                background-color: rgba(255,255,255,.5);
                padding: 5px 7px;
                height: fit-content
            }
        }
        .restart{
            display: block;
            position: relative;
            left:50%;
            transform: translateX(-50%);
            color:#fff;
            margin:10px 0;
        }
    }
    fade-move{
        transition: all .5s;
    }
</style>