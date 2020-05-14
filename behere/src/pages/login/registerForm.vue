<template>
    <div>
    <v-form ref="form">
        <div class="tiptext">邮箱</div>
        <v-text-field :rules='mailRule' placeholder="请使用常用邮箱注册" v-model="userInfo.mail"
            outlined rounded dense solo clearable flat>
        </v-text-field>
        <div class="tiptext">用户名</div>
        <v-text-field :rules='nameRule' placeholder="可以包含汉字、字母、数字或下划线 不区分大小写"
            outlined rounded dense solo clearable flat 
            v-model="userInfo.name">
        </v-text-field>
        <div class="tiptext">密码</div>
        <v-text-field :rules='pwRule' placeholder="请输入至少6位数密码"
                outlined rounded dense solo clearable flat 
                :type="showPw?'show':'password'" 
                :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                v-model="userInfo.pw"
                @click:append="showPw=!showPw">
        </v-text-field>
        <div class="tiptext">确认密码</div>
        <v-text-field :rules='confirmPwRule' placeholder="请再次输入密码"
                outlined rounded dense solo clearable flat 
                :type="showPw?'show':'password'" 
                :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                v-model="userInfo.confirmPw"
                @click:append="showPw=!showPw">
        </v-text-field>
    </v-form>
    <v-row class="btns">
        <v-col cols="6">
            <v-btn class="btn cancel" depressed @click="$emit('close')">取消</v-btn>
        </v-col>
        <v-col cols="6">
            <v-btn class="btn register" depressed @click="handleRegister">注册</v-btn>
        </v-col>
    </v-row>
    <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
        {{ snackbar.text }}
        <v-btn text @click="snackbar.open = false">Close</v-btn>
    </v-snackbar>
    </div>
</template>

<script>
import md5 from 'js-md5'
export default {
    data(){
        return{
            pw:'',
            showPw:false,
            userInfo:{
                mail:'',
                name:'',
                pw:'',
                confirmPw:''
            },
            mailValid:true,
            nameValid:true,
            mailRule: [
                v => !!v|| '请输入邮箱',
                v => /.+@.+\..+/.test(v)||'邮箱格式错误',
                () => this.mailValid||'邮箱不可用'
            ],
            nameRule:[
                v=>!!v||'请输入用户名',
                v=>!!v&&v.trim().length!==0||'不能输入空格',
                v=>!!v&&v.trim().length>=1&&v.trim().length<=15||'长度为1至15个字符',
                ()=>this.nameValid||'用户名不可用'
            ],
            pwRule:[
                v=>!!v||'请输入密码',
                v=>!!v&&v.trim().length!==0||'不能输入空格',
                v=>!!v&&v.trim().length>=6&&v.trim().length<=15||'长度为6至15位之间'
            ],
            confirmPwRule:[
                v=> !!v||'请再次输入密码',
                v=> !!v&&v===this.userInfo.pw||'两次输入的密码不相同'
            ],
            snackbar:{
                open:false,
                text:'注册成功',
                color:'success'
            }
        }
    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost;
        }
    },
    methods:{
        async handleRegister(){
            let re=await this.checkMail();
            let re2=await this.checkName();
            if(!re&&!re2) return;
            if(this.$refs.form.validate()){
                this.axios({
                    method:'post',
                    url:this.apiHost+'/user/register',
                    data:{ 
                            mail:this.userInfo.mail,
                            username:this.userInfo.name,
                            password:md5(this.userInfo.pw)
                        }
                }).then(res=>{
                    console.log(res)
                    if(res.data.code==='10000'){
                        this.$refs.form.reset();
                        this.$emit('success')
                    }else{
                        this.snackbar={open:true,text:'注册失败',color:'error'}
                    }
                }).catch(err=>{
                    console.log(err)
                    this.snackbar={open:true,text:'注册失败',color:'error'}
                })
            }
        },
        checkMail(){
            return new Promise(resolve=>{
                if(!this.userInfo.mail&&this.userInfo.mail.trim().length===0) return resolve(false);
                this.axios({
                    method:'get',
                    url:this.apiHost+'/user/checkEmail?email='+this.userInfo.mail
                }).then(res=>{
                    console.log(res)
                    let result=false;
                    if(res.data.code==='10000'){
                        result=true;
                    }else{
                        result=false;
                    }
                    this.mailValid=result;
                    this.$refs.form.validate();
                    return resolve(result)
                }).catch(err=>{
                    console.log(err)
                    this.mailValid=false;
                    this.$refs.form.validate();
                    return resolve(false)
                })
            })
        },
        checkName(){
            return new Promise(resolve=>{
                if(!this.userInfo.name&&this.userInfo.name.trim().length===0) return resolve(false);
                this.axios({
                    method:'get',
                    url:this.apiHost+'/user/checkUsername?username='+this.userInfo.name
                }).then(res=>{
                    console.log(res)
                    let result=false;
                    if(res.data.code==='10000'){
                        result=true;
                    }else{
                        result=false;
                    }
                    this.nameValid=result;
                    this.$refs.form.validate();
                    return resolve(result)
                }).catch(err=>{
                    console.log(err)
                    this.nameValid=false;
                    this.$refs.form.validate();
                    return resolve(false)
                })
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    @import './index.scss';
    
</style>