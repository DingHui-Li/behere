<template>
    <div class="video-container">
        <GroupVideo v-if='call.group' :myInfo='myInfo' :serverHost='serverHost' :data='call'/>
        <div v-if='!call.group'>
            <CallVideo v-if="call.type==='callVideo'"
                @hangup='hangup' @changeSource='changeSource' @mute='mute' :closeVoice='closeVoice'
                :myStream='myStream' :otherStream='otherStream' :connectStatus='connectStatus' :call='call' :userInfo='userInfo'/>
            <CallPhone v-else 
                @hangup='hangup' @changeSource='changeSource' @mute='mute'
                :otherStream='otherStream' :connectStatus='connectStatus' :call='call' :userInfo='userInfo'/>
        </div>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn @click="snackbar.open=false" :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}" icon><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import CallVideo from './callVideo'
import CallPhone from './callPhone'
import GroupVideo from './groupVideo'
import adapter from 'webrtc-adapter'; 
export default {
    components:{CallVideo,CallPhone,GroupVideo},
    data(){
        return{
            myStream:null,
            //audioTrack:null,
            otherStream:null,
            streams:[],
            pc:null,//RTC peer connection
            closeVoice:false,//是否静音-两人视频
            iceServers:{
                iceServers: [
                    {
                        urls:'turn:106.54.29.79:3478',
                        username:'zimu',
                        credential:'sad12345'
                    }
                ]   
            },
            connectStatus:'pending',//rpc连接状态
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
                    height:1000,
                    width:1000
                }
            },
        }
    },
    async mounted(){
        if(this.call.group){ 
            return;
        }
        let result=await this.getStream();
        if(result){ 
            if(this.call.receiver){
                this.receiverInit();
            }else{//反之，为发起方
            let data={
                content:'',
                from:this.$store.state.myInfo.id,
                to:this.userInfo.userSn,
                type:this.call.type,
                time:new Date()
            }
            this.$store.commit('newMsg',data)
            this.$store.state.ws.send(JSON.stringify(data));
                //等待对方同意才能下一步
            }
        }
    },
    computed:{
        call(){
            return this.$store.state.call;
        },
        start(){
            return this.$store.state.call.start;
        },
        answer(){
            return this.$store.state.call.answer;
        },
        offer(){
            return this.$store.state.call.offer;
        },
        candidate(){
            return this.$store.state.call.candidate;
        },
        userInfo(){
            let friends=this.$store.state.friendList;
            let userSn=this.call.userSn;
            for(let i in friends){
                if(friends[i].userSn===userSn){
                    return friends[i]
                }
            }
            return null;
        },
        myInfo(){
            return this.$store.state.myInfo;
        },
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    beforeDestroy(){
        if(this.pc){
            this.onicecandidate=null;
            this.onconnectionstatechange=null;
            this.ontrack=null;
            this.pc.close();
            this.pc=null;
        } 
        if(this.myStream){
            this.myStream.getTracks().forEach(track => track.stop());
        }
        if(this.otherStream){
            this.otherStream.getTracks().forEach(track => track.stop());
        }
    },
    methods:{
        getStream(){
            return new Promise(async resolve=>{
                if(this.call.type==='callVideo'){
                    this.option.video.facingMode='user';
                    let frontStream=await navigator.mediaDevices.getUserMedia(this.option)
                    if(frontStream){
                        this.myStream=frontStream;
                        return resolve(true);
                    }
                    this.option.video.facingMode='environment';
                    let backStream=await navigator.mediaDevices.getUserMedia(this.option);
                    if(backStream){
                        this.myStream=backStream;
                        return resolve(true);
                    }
                    let displayStream=await navigator.mediaDevices.getDisplayMedia({video:true,audio:this.option.audio})
                    if(displayStream){
                        this.myStream=displayStream;
                        return resolve(true);
                    }

                    this.snackbar({open:true,text:'获取视频源失败',color:'error'})
                    return resolve(false);
                }else{
                    navigator.mediaDevices.getUserMedia({audio:this.option.audio})
                        .then(stream=>{
                            this.myStream=stream;
                            return resolve(true)
                        }).catch(err=>{
                            console.log(err);
                            resolve(false)
                        })
                }
                
            //     let option={};
            //     if(this.call.type==='callVideo'){
            //         option={audio:true,video:true}
            //     }else{
            //         option={audio:true}
            //     }
            //     navigator.mediaDevices.getUserMedia(option)
            //         .then(stream=>{
            //             this.myStream=stream;
            //             this.$refs.otherVideo.srcObject=stream;
            //             resolve(true);
            //         })
            //         .catch((err)=>{
            //             console.log(err);
            //             resolve(false)
            //         });
            })
        },
        sendOffer(){
            let pc=new RTCPeerConnection(this.iceServers);
            for(let track of this.myStream.getTracks()){
                pc.addTrack(track,this.myStream);
            }
            pc.createOffer(offer=>{
                pc.setLocalDescription(new RTCSessionDescription(offer),()=>{
                    //发送offer
                    console.log('发送offer')
                    this.$store.state.ws.send(JSON.stringify({
                        content:{offer},
                        from:this.$store.state.myInfo.id,
                        to:this.userInfo.userSn,
                        type:'rtc'
                    }));
                },(err)=>{
                    console.log(err)
                });
            },(err)=>{
                console.log(err)
            });
            pc.onconnectionstatechange=(e)=>{
                this.connectStatus=e.target.connectionState;
            }
            // let newStream=new MediaStream();
            // pc.getReceivers().forEach(track=>{
            //     console.log(track)
            //     //newStream.addTrack(track);
            // })
            // newStream.addTrack(pc.getReceivers()[0].track);
            // this.otherStream=newStream;
            this.pc=pc;
        },
        receiverInit(){
            let pc=new RTCPeerConnection(this.iceServers);
            this.pc=pc;
            this.$store.state.ws.send(JSON.stringify({//通知对方我准备好了 发送offer过来吧
                content:{act:'agree'},
                from:this.$store.state.myInfo.id,
                to:this.userInfo.userSn,
                type:'rtc'
            }));
            pc.onconnectionstatechange=(e)=>{
                this.connectStatus=e.target.connectionState;
            }
            pc.ontrack=(e)=>{
                this.otherStream=(e.streams[0])
            }
        },
        hangup(){
            this.$store.state.ws.send(JSON.stringify({
                    content:{act:'hangup'},
                    from:this.$store.state.myInfo.id,
                    to:this.userInfo.userSn,
                    type:'rtc'
                }));
            this.$store.commit('closeCall');
        },
        
        minmize(){
            this.isminmize=true;
            this.$refs.video.style.cssText='width:200px;height:300px;';
            this.isMove=true;
        },
        maxmize(){
            this.isMove=false;
            this.isminmize=false;
            this.$refs.video.style.width='500px';
            this.$refs.video.style.height='400px';
        },
        
        async mute(){
            if(this.closeVoice){
                if(this.pc&&this.myStream){
                    //this.myStream.addTrack(this.audioTrack);
                    this.myStream.getAudioTracks()[0].enabled = true
                }
            }else{
                if(this.pc&&this.myStream){
                    this.myStream.getAudioTracks()[0].enabled = false
                    // let audio=this.myStream.getAudioTracks();
                    // this.audioTrack=audio[0];
                    // this.myStream.removeTrack(audio[0])
                }
            }
            let temp=this.myStream;
            this.myStream=null;
            this.myStream=temp;
            this.closeVoice=!this.closeVoice
        },
        changeSource(stream){
            this.myStream=stream;
        }
    },
    watch:{
        start(newVal){
            if(newVal){
                this.sendOffer();
            }
        },
        myStream:{
            handler(newStream){
                console.log(newStream.getAudioTracks())
                //this.$refs.selfVideo.srcObject=newVal;
                if(this.pc){
                        //this.pc.getSenders().forEach(sender=>this.pc.removeTrack(sender));
                        let senders= this.pc.getSenders();
                        for(let track of newStream.getTracks()){
                            console.log(track)
                            console.log(senders)
                            for(let sender of senders){
                                if(sender.track.kind===track.kind){
                                    sender.replaceTrack(track)
                                }
                            }
                            
                        }
                }
            },
            deep:false
        },
        otherStream(newVal){
            //this.$refs.otherVideo.srcObject=newVal;
        },
        offer(newVal){
            if(!newVal||!this.pc) return;
            console.log('收到offer')
            for(let track of this.myStream.getTracks()){
                this.pc.addTrack(track,this.myStream);
            }
            this.pc.setRemoteDescription(new RTCSessionDescription(newVal))
            this.pc.createAnswer(answer=>{
                console.log('发送answer')
                this.pc.setLocalDescription(new RTCSessionDescription(answer),()=>{
                    this.$store.state.ws.send(JSON.stringify({
                        content:{answer},
                        from:this.$store.state.myInfo.id,
                        to:this.userInfo.userSn,
                        type:'rtc'
                    }));
                },err=>{
                    console.log(err)
                });
            },err=>{
                console.log(err)
            }) ;
            // let newStream=new MediaStream();
            // this.pc.getReceivers().forEach(track=>{
            //     console.log(track)
            //     //newStream.addTrack(track);
            // })
            // newStream.addTrack(this.pc.getReceivers()[0].track);
            // this.otherStream=newStream;
            this.pc.onicecandidate=e=>{
                if(e.candidate){
                    this.$store.state.ws.send(JSON.stringify({
                        content:{candidate:e.candidate},
                        from:this.$store.state.myInfo.id,
                        to:this.userInfo.userSn,
                        type:'rtc'
                    }));
                }
            }
        },
        answer(newVal){
            if(!newVal||!this.pc) return;
            console.log('收到answer')
            this.pc.setRemoteDescription(new RTCSessionDescription(newVal));
            this.pc.onicecandidate=e=>{
                if(e.candidate){
                    this.$store.state.ws.send(JSON.stringify({
                        content:{candidate:e.candidate},
                        from:this.$store.state.myInfo.id,
                        to:this.userInfo.userSn,
                        type:'rtc'
                    }));
                }
            }
            this.pc.ontrack=(e)=>{
                this.otherStream=e.streams[0];
            }
        },
        candidate(newVal){
            if(!newVal||!this.pc) return;
            this.pc.addIceCandidate(new RTCIceCandidate(newVal));
        }
    },
}
</script>
<style lang="scss" scoped>
    .video-container{
        overflow:hidden;
        width:100vw;
        height:100vh;
        animation-duration:.5s;
        padding:30px;
        box-sizing: border-box;
    }
</style>