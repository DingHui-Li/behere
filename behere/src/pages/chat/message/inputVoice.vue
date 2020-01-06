<template>
    <div id='input-voice' class="elevation-10" :style="{backgroundColor:error?'red':theme}" v-ripple @mousedown="pressed=true" @mouseup="pressed=false">
        <div v-if='error' >
            <div class="icon">
                <v-icon :style="{color:'#fff'}" size="50">mdi-close</v-icon>
            </div>
            <div class="tip" :style="{color:'#fff'}">请检查麦克风权限</div>
        </div>
        <div v-else>
            <div class="duration" :style="{color}">{{duration!==60 ?'00:'+duration:'01:00'}}</div>
            <div v-if='!Boolean(data)'>
                <div class="icon">
                    <v-icon size="50" :style="{color}">{{pressed?'mdi-microphone-settings':'mdi-microphone'}}</v-icon>
                </div>
                <div class="tip" :style="{color}">{{pressed?'松开 结束':'按住 说话'}}</div>
            </div>
            <div v-else >
                <v-btn icon fab class="btn" small :style="{backgroundColor:'#F44336'}"><v-icon>mdi-close</v-icon></v-btn>
                <v-btn icon fab class="btn" @mousedown.stop='send' :style="{backgroundColor:'#4CAF50'}"><v-icon>mdi-check</v-icon></v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['id'],
    data(){
        return{
            pressed:false,//按下
            recoder:null,
            data:null,
            duration:0,
            interval:null,
            error:false,//发生错误
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        color(){
            return this.theme.isBlack()?'#000':'#fff'
        },
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    watch:{
        pressed(status){
            if(status){
                this.start()
            }else{
                this.stop()
            }
        }
    },
    methods:{
        async getStream(){
            return new Promise(async resolve=>{
                let stream=await navigator.mediaDevices.getUserMedia({audio:true}).catch(()=>{this.error=true});
                if(!stream){
                    this.error=true;
                    return resolve(false)
                } 
                this.recoder=new MediaRecorder(stream);
                this.error=false;
                return resolve(true);
            })
        },
        async start(){
            let st=await this.getStream();
            if(!st) return;
            this.duration=0;
            this.data=null;
            this.recoder.start();
            this.recoder.ondataavailable=e=>{
                if(this.duration>=1){
                    this.data=e.data;
                }else{
                    this.duration=0;
                }
            }
            let _interval=setInterval(()=>{
                this.duration++;
                if(this.duration===60){
                    this.stop();
                }
            },1000);
            this.interval=_interval;
        },
        stop(){
            clearInterval(this.interval);
            if(this.recoder.state==='recording'){
                this.recoder.stop();
            }
        },
        send(){
            let url=window.URL.createObjectURL(this.data);
            let data={
                id:this.$store.state.msgData.length+1,
                from:this.$store.state.myInfo.id,
                content:{width:100,src:url,duration:this.duration},
                type:'voice',
                to:this.id,
                status:'success',
                time:new Date().getTime()
            }
            this.$store.commit('newMsg',data)
            this.$nextTick(()=>{
                this.$emit('toBottom')
                this.$emit('close')
            })
            let fd=new FormData();
            fd.append('type','voice');
            fd.append('voice',this.data,'voice.webm')
            this.axios({
                method:'post',
                url:this.serverHost+'/uploadChatFile',
                data:fd
            }).then(res=>{
                this.data=null;
                if(res.data.code===200){
                    data.content.src=res.data.path;
                    this.$emit('send',data.content,'voice',data.id)
                }else{
                    this.$store.commit('updateMsgStatus',{status:'error',id:data.id})
                }
            }).catch(()=>{
                    this.$store.commit('updateMsgStatus',{status:'error',id:data.id})
            })
            
        }
    }
}
</script>

<style lang='scss' scoped>
    #input-voice{
        padding:20px;
        position: absolute;
        animation-duration: .3s;
        z-index: 99;
        border-radius: 10px;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        width:150px;
        height:150px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        .duration{
            text-align: center;
        }
        .icon{
            text-align: center;
            padding:10px;
        }
        .tip{
            text-align: center;
            font-size: 0.8rem;
        }
        .btn{
            color:#fff
        }
    }
</style>