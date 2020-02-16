<template>
    <div>
        <div class="time" :style="{backgroundColor:theme,color:theme.isBlack?'#fff':'#000'}" v-if='showTime'>{{new Date(data.time).parse(true)}}</div>
        <div id="msg-container" v-if='isme'>
            <div class="content-container" :style="{paddingLeft:'45px',justifyContent:'flex-end'}">
                <!-- <v-menu >
                    <template v-slot:activator='{on}'>
                        <v-btn icon v-on='on'>
                            <v-icon v-if='data.status==="error"' color='red'>mdi-alert-circle</v-icon>
                            <v-icon v-if='data.status==="sending"' class="sending" :style="{color:theme}">mdi-loading</v-icon>
                        </v-btn>
                    </template>
                    <div class="resend">
                        <div>重新发送:
                            <span v-if="data.type==='text'">{{data.content}}</span>
                            <span v-else-if="data.type==='img'">[img]</span>
                            <span v-else-if="data.type==='voice'">[voice]</span>
                            <span v-else-if="data.type==='emoji'">[emoji]</span>
                            <span v-else-if="data.type==='file'">[file]{{data.content.name}}</span>
                        </div>
                        <div class="actions">
                            <v-btn depressed>取消</v-btn>
                            <v-btn depressed @click="resend">确定</v-btn>
                        </div>
                    </div>
                </v-menu> -->
                <div :style="{overflow:'hidden',width:'fit-content'}" >
                    <div v-if='data.type!=="img"&&data.type!=="emoji"'>
                        <div class="content me" :style="{ float: 'right',marginLeft: 0}" >
                            <Voice v-if='data.type==="voice"' :data='content' :msg='true'/>
                            <div v-else-if='data.type==="callVideo"'>[视频通话]</div>
                            <div v-else-if='data.type==="callPhone"'>[语音通话]</div>
                            <div v-else-if='data.type==="file"' class="file" v-ripple @click="downloadFile">
                                <div class="left">
                                    <div class="name">{{content.name}}</div>
                                    <div class="size">{{content.size}}</div>
                                </div>
                                <div class="right">
                                    <v-icon :size="50" :color='theme'>mdi-file</v-icon>
                                </div>
                            </div>
                            <pre v-else class="textContent">{{data.content}}</pre>
                        </div>
                        <div class="arrow-right"></div>
                    </div>
                    <div class="img" :style="{backgroundColor:data.type==='emoji'?'transparent':theme,float:'right'}" v-if='data.type==="img"||data.type==="emoji"'>
                        <v-icon v-if='imgErr' class="icon">mdi-folder-image</v-icon>
                        <v-img v-if='data.type==="img"' :src='imgPath' @error="imgErr=true" class="v-img" @click='$emit("openImg",data.id)' v-ripple></v-img>
                        <img v-if='data.type==="emoji"' :src='imgPath' class="emoji" />
                    </div>
                </div>
            </div>
            <div class="avatar" :style="{backgroundColor:theme}" v-ripple @click="$store.commit('updateOpenFriend',myInfo.id);$router.replace('/friends/info')">
                <v-img :src='serverHost+myInfo.avatar' :style="{height:'100%'}" @error="avatarErr=true">
                    <v-icon v-if='avatarErr' class="icon">mdi-folder-image</v-icon>
                </v-img>
            </div>
        </div>
        <div id="msg-container" v-else>
            <div class="avatar" :style="{backgroundColor:theme}" v-ripple @click="$store.commit('updateOpenFriend',userInfo.id);$router.replace('/friends/info')">
                <v-img :src='serverHost+userInfo.avatar' :style="{height:'100%'}"></v-img>
            </div>
            <div class="right">
                <div class="name" v-if='userInfo.type==="group"'>{{userInfo.name}}</div>
                <div class="content-container" :style="{paddingRight:'45px'}">
                    <div v-if='data.type!=="img"&&data.type!=="emoji"'>
                        <div class="content other">
                            <Voice v-if='data.type==="voice"' :data='content' :msg='true'/>
                            <div v-else-if='data.type==="callVideo"'>[视频通话]</div>
                            <div v-else-if='data.type==="callPhone"'>[语音通话]</div>
                            <div v-else-if='data.type==="file"' class="file" v-ripple @click="downloadFile">
                                <div class="left">
                                    <div class="name">{{content.name}}</div>
                                    <div class="size">{{content.size}}</div>
                                </div>
                                <div class="right">
                                    <v-icon :size="50" :color='theme'>mdi-file</v-icon>
                                </div>
                            </div>
                            <pre v-else class="textContent">{{data.content}}</pre>
                        </div>
                        <div class='arrow-left'></div>
                    </div>
                    <div class="img" :style="{backgroundColor:data.type==='emoji'?'transparent':(imgPath.getColor()?imgPath.getColor():theme),float:'left'}" v-if='data.type==="img"||data.type==="emoji"'>
                        <v-icon v-if='imgErr' class="icon">mdi-folder-image</v-icon>
                        <v-img v-if='data.type==="img"' :src='imgPath' @error="imgErr=true" class="v-img" @click='$emit("openImg",data.id)' v-ripple>
                            <template v-slot:placeholder>
                                <v-row
                                class="fill-height ma-0"
                                align="center"
                                justify="center"
                                >
                                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                                </v-row>
                            </template>
                        </v-img>
                        <img v-if='data.type==="emoji"' :src='imgPath' class="emoji" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Voice from '../../../components/voice'
export default {
    components:{Voice},
    props:['data','userInfo','showTime'],
    data(){
        return{
            avatarErr:false,
            imgErr:false
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        isme(){
            return this.myInfo.id===this.data.from;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        myInfo(){
            return this.$store.state.myInfo
        },
        imgPath(){//图片路径
            if(this.data.content.includes('blob')) return this.data.content;
            else return this.serverHost+this.data.content;
        },
        content(){
            try{
                if(typeof this.data.content==='object'){
                    console.log(typeof this.data.content)
                    return this.data.content;
                }else{
                    return JSON.parse(this.data.content)
                }
            }catch(err){
                return this.data.content
            }
        },
    },
    methods:{
        resend(){
            this.$store.commit('updateMsgStatus',{status:'sending',id:this.data.id})
            this.axios({
                method:'post',
                url:this.apiHost+'/message/sendMessage',
                data:{
                    content:this.data.content,
                    to:this.data.to,
                    type:this.data.type
                }
            }).then(res=>{
                this.$store.commit('updateMsgStatus',{status:'success',id:this.data.id})
                console.log(res)
            }).catch(()=>{
                this.$store.commit('updateMsgStatus',{status:'error',id:this.data.id})
            })
        },
        downloadFile(){
            window.open(this.serverHost+this.content.path)
        }
    }
}
</script>

<style lang='scss' scoped>
    $me-color:#1976D2;
    $other-color:#4CAF50;
    .time{
            padding:1px 10px;
            border-radius: 20px;
            width:fit-content;
            font-size: 0.5rem;
            margin:0 auto;
            margin-bottom: 10px;
        }
    #msg-container{
        width: 100%;
        padding:0 20px;
        position: relative;
        overflow: hidden;
        display: flex;
        padding-bottom: 20px;
        .avatar{
            width:40px;
            height:40px;
            border-radius: 50%;
            position: relative;
            overflow: hidden;
            .icon{
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%)
            }
        }
        .img{
            border-radius: 10px;
            margin:0 5px;
            overflow: hidden;
            position: relative;
            .v-img{
                width:150px;
                height:150px;
            }
            .emoji{
                max-width: 150px;
                max-height: 150px;
            }
            .icon{
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                z-index:99;
            }
        }
        .name{
            margin-left: 10px;
            font-size: 0.8rem
        }
        .content-container{
            flex:1;
            position: relative;
            display: flex;
            align-items:center;
            .me{
                background-color: $me-color;
            }
            .other{
                background-color: $other-color;
            }
            .content{
                margin:5px 15px;
                //background-color: #1976D2;
                border-radius: 20px;
                padding: 5px 15px;
                color:#fff;
                width: fit-content;
                display: flex;
                align-items: center;
                .textContent{
                    white-space: pre-wrap;
                    word-break: break-all;
                    font-family:Arial, Helvetica, sans-serif;
                }
                .file{
                    display: flex;
                    cursor: pointer;
                    .left{
                        .name{
                            font-size: 0.9rem;
                        }
                        .size{
                            font-size: 0.8rem;
                            filter: brightness(75%)
                        }
                    }
                }
            }
            .arrow-left{
                position: absolute;
                z-index: 9;
                width:20px;
                height:20px;
                border-bottom:10px solid $other-color;
                border-left-width: 0px;
                border-bottom-left-radius: 20px 20px;
                top:10px;
                left:8px;
            }
            .arrow-right{
                position: absolute;
                width:20px;
                height:20px;
                border-bottom:10px solid $me-color;
                border-right-width: 0px;
                border-bottom-right-radius: 20px 20px;
                top:10px;
                right:8px;
            }
            .sending{
                animation: sending .5s linear infinite ;
            }
        }
    }
    .resend{
        padding:20px;
        padding-bottom: 0;
        background-color: #fff;
        .actions{
            margin: 10px 0;
        }
    }
    @keyframes sending {
        from{
            transform: rotateZ(0)
        }to{
            transform: rotateZ(360deg)
        }
    }
</style>