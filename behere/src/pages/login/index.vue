<template>
<!-- <v-container> -->
    <v-row id="login">
        <v-col md='7' class="left d-none d-sm-flex" >
            <v-col :cols='6' class="side" :style="{backgroundColor:theme}">
                    <div class="logo-container">
                        <img src='../../assets/img/logo.png' class="logo" />
                        <img src='../../assets/img/slogan.png' class="slogan" />
                    </div>
            </v-col>
            <img src='../../assets/img/login-people.png' class="people"/>
        </v-col>
        <v-col md='5' class="right">
            <v-col xs='10' lg='8' l="6" class="login-panel">
                        <div class="title">登录您的Be Here账号</div>
                        <div class="icon-container">
                            <img src="../../assets/icon/qq.png" alt="qq" class="icon"/>
                            <img src="../../assets/icon/weixin.png" alt="weixin" class="icon" @click="openWxQR=false"/>
                            <img src="../../assets/icon/weibo.png" alt="weibo" class="icon"/>
                        </div>
                        <v-divider class="divider">Or</v-divider>
                        <loginForm @input='handleInput' />
                        <div class="btn-container">
                            <v-row>
                                <v-col cols='6'>
                                    <v-btn class="btn btn-register" @click="openRegister=true" depressed >注册</v-btn>
                                </v-col>
                                <v-col cols='6'>
                                    <v-btn class="btn btn-login" depressed @click="login()" 
                                        :style="{backgroundColor:theme,color:'#fff'}">登录</v-btn>
                                </v-col>
                            </v-row>
                        </div>
                </v-col>
        </v-col>
        <v-dialog v-model="openRegister" persistent max-width="500">
            <v-card class="register-card">
                <div class="tit">
                    可选择通过以下方式注册
                </div>
                <div class="icon-container">
                    <img src="../../assets/icon/qq.png" alt="qq" class="icon"/>
                    <img src="../../assets/icon/weixin.png" alt="weixin" class="icon wx"/>
                    <img src="../../assets/icon/weibo.png" alt="weibo" class="icon"/>
                </div>
                <v-divider class="divider">Or</v-divider>
                <registerForm @input='handleInput' @close='openRegister=false' 
                    @success='()=>{snackbar={open:true,color:"success",text:"注册成功"};openRegister=false;}'/>
            </v-card>
        </v-dialog>
        <v-dialog v-model="openWxQR" max-width="300">
            <v-card class="qr-card">
                <div class="text">打开微信扫一扫</div>
                <v-progress-linear class="loading" v-show="showLoading"
                    :size="70"
                    :width="7"
                    color="primary"
                    indeterminate
                ></v-progress-linear>
                <v-img :src='QR' class="img"></v-img>
            </v-card>
        </v-dialog>
        <v-dialog v-model="logining" persistent max-width="300">
            <div class="logining">
                <!-- <v-progress-circular :size="50" color="primary" indeterminate></v-progress-circular> -->
                <FingerprintSpinner  
                    :animation-duration="1500"
                    :size="100"
                    :color="theme"
                    />
                <div class="tip">登陆中</div>
            </div>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}}<v-btn text @click="snackbar.open = false">Close</v-btn>
        </v-snackbar>
    </v-row>
<!-- </v-container> -->
</template>
<script>
import loginForm from './loginForm'
import registerForm from './registerForm'
import { FingerprintSpinner   } from 'epic-spinners'
// import {serverHost} from '../../config'
export default {
    components:{loginForm,registerForm,FingerprintSpinner  },
    data:function(){
        return{
            openRegister:false,//打开注册modal
            openWxQR:false,//打开二维码modal
            showLoading:false,//显示二维码加载
            QR:'',
            userInput:{
                name:'',
                pw:'',
            },
            logining:false,//登录中
            snackbar:{
                open:false,
                text:'登录失败',
                color:'error'
            },//登录失败提示
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        }
    },
    methods:{
        handleInput(value){
            if('name' in value){
                this.userInput.name=value['name'];
            }else if('pw' in value){
                this.userInput.pw=value['pw'];
            }
        },
        async getQR(){
            this.axios({
                method:'post',
                url:'/server/getqr',
                data:{socketid:'#sdfsdf234'},
                responseType: 'blob'
            }).then(res=>{
                this.showLoading=false;
                let fr = new FileReader();
                fr.onload =(e)=>{ 
                    this.QR=e.target.result   
                }
                fr.readAsDataURL(res.data);
            })
        },
        login(){
            if(this.userInput.name.trim().length>0){
                this.logining=true;
                this.axios({
                    method:'post',
                    url:this.$store.state.apiHost+'/user/login',
                    data:{
                        username:this.userInput.name,
                        password:this.userInput.pw
                    }
                }).then(res=>{
                    if(res.data.code==='10000'){
                        let data={
                            id:res.data.data.id,
                            name:res.data.data.nickname,
                            avatar:res.data.data.profilePhoto,
                            token:res.headers.authorization,
                            refreshToken:res.headers.refreshtoken
                        }
                        this.$store.commit('updateMyInfo',data);
                        this.$router.replace('/')
                    }
                }).finally(()=>{
                    this.logining=false;
                })
            }
        }
    },
    watch:{
        openWxQR:function(newVal){
            if(newVal){
                this.showLoading='true'
                this.getQR();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
    @import './index.scss';
    .logining{
        margin:0 auto;
        width:300px;
        height:300px;
        display:flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        .tip{
            margin-top: 20px;
            font-weight: bold;
        }
    }
</style>>