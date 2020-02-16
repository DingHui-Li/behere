<template>
    <div class="account">
        <div class="title-text"><v-icon :size='30' color='#000'>mdi-onepassword</v-icon> 修改密码</div>
        <div class="content">
            <div class="text">旧密码:</div>
            <v-text-field :color="theme" v-model="oldPw" :rules="pwRules"
                :type="showOldPw?'show':'password'" 
                :append-icon="showOldPw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showOldPw=!showOldPw"></v-text-field>
            <div class="text">新密码:</div>
            <v-text-field :color="theme" v-model="newPw" :rules="newPwRules"
                :type="showNewPw?'show':'password'" 
                :append-icon="showNewPw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showNewPw=!showNewPw"></v-text-field>
            <div class="text">确认新密码:</div>
            <v-text-field :color="theme" v-model="confirmPw" :rules="confirmRules"
                :type="showConfirmPw?'show':'password'" 
                :append-icon="showConfirmPw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showConfirmPw=!showConfirmPw"></v-text-field>
                <v-btn depressed class="btn" 
                    :disabled="oldPw.trim().length<6||newPw.trim().length<6||oldPw===newPw||newPw!==confirmPw"
                    @click="submit">
                    修改
                </v-btn>
        </div>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon @click="snackbar.open=false" :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import md5 from 'js-md5'
export default {
    computed:{
        theme(){
            return this.$store.state.theme
        },
        apiHost(){
            return this.$store.state.apiHost
        }
    },
    data(){
        return{
            oldPw:'',
            showOldPw:false,
            newPw:'',
            showNewPw:false,
            confirmPw:'',
            showConfirmPw:false,
            pwRules:[
                v=>!!v&&v.trim().length!==0||'请输入密码',
                v=>!!v&&v.trim().length>=6||'密码长度不小于6位',
            ],
            newPwRules:[
                v=>!!v&&v.trim().length!==0||'请输入密码',
                v=>{this.confirmPw='';return !!v&&v.trim().length>=6||'密码长度不小于6位'},
            ],
            confirmRules:[
                v=>!!v&&v.trim().length!==0||'请输入确认密码',
                v=>!!v&&v===this.newPw||'两次输入密码不同'
            ],
            snackbar:{
                open:false,
                color:'error',
                text:'操作失败'
            },
        }
    },
    methods:{
        submit(){
            if(this.oldPw.trim().length>=6&&this.newPw.trim().length>=6&&this.oldPw!==this.newPw&&this.newPw===this.confirmPw){
                this.axios({
                    method:'post',
                    url:this.apiHost+`/user/changePassword?newPwd=${md5(this.confirmPw)}&oldPwd=${md5(this.oldPw)}`
                }).then(res=>{
                    if(res.data.code==='10000'){
                        this.snackbar={open:true,text:'修改成功，请重新登录',color:'success'}
                    }
                })
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    .account{
        position: relative;
        width: 100%;
        height: 100%;
        padding:20px;
        .title-text{
            font-weight: bold;
            font-size: 1.4rem;
        }
        .content{
            margin-top: 10px;
            padding-left:37px;
            .text{
                
            }
            .btn{
                width: 100%;
                color:#fff;
                background-color: #4CAF50 !important;
                animation-duration: .5s;
                animation-timing-function: ease-in-out;
            }
        }
    }
</style>