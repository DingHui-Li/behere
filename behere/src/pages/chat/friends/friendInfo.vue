<template>
    <div :style="{width:'100%',height:'100%',padding:'10px'}">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="loading" v-if='loading'>
                <v-progress-circular
                    :size="70"
                    :width="7"
                    :color="theme"
                    indeterminate
                    ></v-progress-circular>
            </div>
        </transition>
        <div id='friend-info' v-if="userInfo">
            <div class="top">
                <div class="left">
                    <div class="name">
                        <v-menu>
                            <template v-slot:activator='{on}'>
                                <v-btn icon v-on='on'>
                                    <v-icon class="icon" :style="{color:sex==='0'?'#E91E63':'#3F51B5'}">{{sex==='0'?'mdi-gender-female':'mdi-gender-male'}}</v-icon>
                                </v-btn>
                            </template>
                            <div class="select-sex" v-if='isme'>
                                <div class="item" v-ripple @click="handleAlterSex('1')">
                                    <v-icon class="icon" :style="{color:'#3F51B5'}" >mdi-gender-male</v-icon>男
                                </div>
                                <div class="item" v-ripple @click="handleAlterSex('0')">
                                    <v-icon class="icon" :style="{color:'#E91E63'}" >mdi-gender-female</v-icon>女
                                </div>
                            </div>
                        </v-menu>
                        <v-menu :close-on-content-click="false" v-model="alterName">
                            <template v-slot:activator='{on}'>
                                <span :style="{cursor:'pointer'}" v-on='on'>{{userInfo.nickName}}</span> 
                            </template>
                            <div class="alter" v-if='isme'>
                                <v-text-field :counter="15" v-model="inputName"></v-text-field>
                                <div class="actions">
                                    <v-btn depressed @click="()=>{this.alterName=false;this.inputName=this.userInfo.nickName}">取消</v-btn>
                                    <v-btn depressed @click="handleAlterName">确定</v-btn>
                                </div>
                            </div>
                        </v-menu>
                    </div>
                    <div class="desc">
                        <v-textarea solo flat auto-grow :counter="100" :rows="3" :readonly="!alterDesc" v-if='isme' hide-details
                            :style="{border:alterDesc?`1px solid ${theme}`:'1px solid #e0e0e0',marginLeft:'20px'}"
                            v-model="inputDesc" />
                        <div :style="{maxWidth:'200px',float:'right'}" v-else>{{userInfo.description}}</div>
                        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut" mode="out-in" v-if='isme'>
                            <v-btn icon @click="alterDesc=true" v-if='!alterDesc' :style="{marginLeft:'20px',animationDuration:'.2s'}">
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                            <div v-else :style="{animationDuration:'.2s',marginTop:'10px'}">
                                <v-btn depressed icon @click="()=>{this.alterDesc=false;this.inputDesc=this.userInfo.description}" :style="{backgroundColor:'#FF5252',color:'#fff',marginRight:'10px'}"><v-icon>mdi-close</v-icon></v-btn>
                                <v-btn depressed icon @click="handleAlterDesc" :style="{backgroundColor:'#4CAF50',color:'#fff'}"><v-icon>mdi-check</v-icon></v-btn>
                            </div>
                        </transition>
                    </div>
                </div>
                <div class="avatar" v-ripple @click="()=>{if(isme)$refs.selectAvatar.click()}" :style="{backgroundColor:theme}">
                    <img :src="serverHost+userInfo.profilePhoto" :style="{width:'100%'}">
                </div>
                <input type="file" accept="image/*" :style="{display:'none'}" ref='selectAvatar' @change="selectAvatar"/>
            </div>
            <div class="friend-info">
                <div class="item" v-if='!isme&&isFriend'>
                    <v-icon class="icon">mdi-cat</v-icon>
                    <span class="tip">备注</span> 
                    <span>{{userInfo.remark}}</span>
                    <v-menu v-model="alterRemark" :close-on-content-click="false">
                        <template v-slot:activator='{on}'>
                            <v-btn icon v-on='on' :style="{marginLeft:'20px'}">
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                        </template>
                        <div class="alter">
                            <v-text-field v-model="inputRemark" :counter="15"></v-text-field>
                            <div class="actions">
                                <v-btn depressed @click="()=>{this.alterRemark=false;this.inputRemark=this.userInfo.remark}">取消</v-btn>
                                <v-btn depressed @click="handleAlterRemark">确定</v-btn>
                            </div>
                        </div>
                    </v-menu>
                </div>
                <div class="item">
                    <v-icon class="icon">mdi-account-card-details-outline</v-icon>
                    <span class="tip">账号</span> 
                    <span>{{userInfo.username}}</span>
                </div>
                <div class="item">
                    <v-icon class="icon">mdi-map-marker</v-icon>
                    <span class="tip">位置</span> 
                    <span>{{location.name}}</span>
                    <v-btn icon @click="alterLocation=true" v-if='isme'>
                        <v-icon>mdi-square-edit-outline</v-icon>
                    </v-btn>
                </div>
                <div class="item">
                    <v-icon class="icon">mdi-cake</v-icon>
                    <span class="tip">生日</span> 
                    <span>{{userInfo.birthday}}</span>
                    <v-menu :close-on-content-click="false" v-model="alterBirth">
                        <template v-slot:activator='{on}'>
                            <v-btn icon @click="alterRemark=false" v-if='isme' v-on='on'>
                                <v-icon>mdi-square-edit-outline</v-icon>
                            </v-btn>
                        </template>
                        <v-btn v-if='userInfo.birthday' depressed @click="handleAlterBirth"
                            :style="{width:'100%',backgroundColor:theme,fontSize:'1.3rem',color:'#fff',zIndex:'99',marginBottom:'-4px'}">确定</v-btn>
                        <div>
                            <v-date-picker v-model="userInfo.birthday" locale='ch' :color="theme"></v-date-picker>
                        </div>
                    </v-menu>
                </div>
                <div class="item">
                    <v-icon class="icon">mdi-music-rest-quarter</v-icon>
                    <span class="tip">星座</span> 
                    <span>{{getAstro}}座</span>
                </div>
                <div class="item" v-if='!isme&&isFriend'>
                    <v-icon class="icon">mdi-folder</v-icon>
                    <span class="tip">分组</span> 
                    <v-menu>
                        <template v-slot:activator="{ on }">
                            <v-btn class="name" depressed v-on="on">{{nowGroup}}<v-icon>mdi-chevron-down</v-icon></v-btn>
                        </template>
                        <div class="menu">
                            <div class="select-group" v-ripple v-for='group in friendGroup' :key="group.sn" @click="handleAlterGroup(group)">{{group.groupName}}</div>
                        </div>
                    </v-menu>
                </div>
            </div>
            <div class="actions" v-if='!isme&&isFriend'>
                <v-btn fab icon large :style="{backgroundColor:'#536DFE'}" @click="communicate('callVideo')"><v-icon class="icon">mdi-message-video</v-icon></v-btn>
                <v-btn fab icon large :style="{backgroundColor:'#009688'}" @click="communicate('callPhone')"><v-icon class="icon">mdi-phone</v-icon></v-btn>
                <v-btn fab icon large :style="{backgroundColor:'#388E3C'}" @click="communicate('msg')"><v-icon class="icon">mdi-message-processing</v-icon></v-btn>
            </div>
            <div class="del-add">
                <v-btn  :style="{backgroundColor:'#4CAF50'}" class="btn" v-if='!isme&&!isFriend' @click="applyFriend=true">添 加</v-btn >
            </div>
            <!-- 头像剪裁区 -->
        </div>
        <v-dialog v-model="cropper" width="800">
            <Cropper :img='avatarOrigin' @submit='handleAlterAvatar'/>
        </v-dialog>
        <v-dialog v-model="alterLocation" width="800">
            <Location @success='(v)=>{
                this.alterLocation=false;
                this.snackbar={open:true,text:"修改位置成功",color:"success"}
                this.userInfo.location=v;}'
                @error='snackbar={open:true,text:"修改位置失败",color:"error"}'/>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon @click="snackbar.open=false" :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
        <ApplyFriend :open='applyFriend' @close='applyFriend=false' :id='this.id'/>
    </div>
</template>

<script>
import Cropper from '../components/cropper'
import ApplyFriend from '../components/applyFriend'
import Location from './location'
export default {
    components:{Cropper,ApplyFriend,Location},
    data(){
        return{
            alterRemark:false,
            alterDesc:false,
            alterBirth:false,
            alterName:false,
            alterLocation:false,//修改位置--弹窗状态
            cropper:false,//剪裁头像
            avatarOrigin:'',//头像原始文件
            userInfo:null,//用户资料
            snackbar:{
                open:false,
                color:'error',
                text:'操作失败'
            },
            inputDesc:'',
            inputName:'',
            inputRemark:'',//输入框 值
            applyFriend:false,//申请好友dialog
            loading:false,
        }
    },
    computed:{
        myInfo(){
            return this.$store.state.myInfo;
        },
        isme(){
            return this.myInfo.id===this.id;
        },
        isFriend(){
            for(let i in this.friendList){
                if(this.friendList[i].userSn===this.userInfo.sn){
                    return true;
                }
            }
            return false;
        },
        theme(){
            return this.$store.state.theme;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        friendList(){
            return this.$store.state.friendList;
        },
        sex(){
            if(this.userInfo.sex) return this.userInfo.sex;
            else return 'male'
        },
        getAstro(){
            let date=new Date(this.userInfo.birthday);
            let month=date.getMonth()+1;
            let day=date.getDate();
            let s="魔羯水瓶双鱼牡羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯";
            let arr=[20,19,21,21,21,22,23,23,23,23,22,22];
            return s.substr(month*2-(day<arr[month-1]?2:0),2);
        },
        id(){
            return this.$store.state.openFriend;
        },
        friendGroup(){
            return this.$store.state.friendGroup;
        },
        nowGroup(){//当前分组
            let groupSn=''
            for(let i in this.friendList){
                if(this.friendList[i].userSn===this.userInfo.sn){
                    groupSn=this.friendList[i].groupSn;
                    break;
                }
            }
            for(let i in this.friendGroup){
                if(this.friendGroup[i].sn===groupSn){
                    return this.friendGroup[i].groupName;
                }
            }
            return ''
        },
        location(){
            try{
                return JSON.parse(this.userInfo.location)
            }catch{
                return ''
            }
        },
        updateFriendList(){
            return this.$store.state.updateFriendList
        }
    },
    mounted(){
        this.getUserInfo();
    },
    methods:{
        communicate(action){
            if(action==='callVideo'||action==='callPhone'){
                this.call(action);
            }
            this.$store.commit('updateOpenChat',this.userInfo.sn);
            this.$router.push('/message')
        },
        async call(type){
            if(this.$store.state.call.open){
                this.$store.commit('reset');
                return;
            }
            
            let data={
                type,
                open:true,
                userSn:this.userInfo.sn
            }
            this.$store.commit('openCall',data);
        },
        selectAvatar(e){
            this.avatarOrigin=window.URL.createObjectURL(e.target.files[0]);
            this.cropper=true;
            e.target.value=''
        },
        getUserInfo(){
            if(!this.id) return
            this.loading=true;
            this.axios({
                method:'get',
                url:this.apiHost+'/user/getUserInfo?userSn='+this.id
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    for(let i in this.friendList){
                        if(this.friendList[i].userSn===data.sn){//从好友列表数据中获取备注和分组信息
                            data.remark=this.friendList[i].remark;
                        }
                    }
                    if(!data.description) data.description='一条咸鱼'
                    if(!data.location) data.location=''
                    this.inputDesc=data.description;//初始化输入框的值
                    this.inputName=data.nickName;
                    this.inputRemark=data.remark;
                    this.userInfo=data;
                }
            }).finally(()=>{
                this.loading=false
            })
        },
        handleAlterDesc(){
            this.alterDesc=false;
            this.alterInfo('description',this.inputDesc,'修改个人简介成功')
        },
        handleAlterBirth(){
            this.alterBirth=false;
            this.alterInfo('birthday',this.userInfo.birthday,'修改生日成功')
        },
        handleAlterSex(sex){
            console.log(sex)
            this.userInfo.sex=sex;
            this.alterInfo('sex',sex,'修改性别成功')
        },
        handleAlterName(){
            if(!this.inputName||this.inputName.trim().length===0||this.inputName.trim().length>15) return;
            this.alterName=false;
            this.userInfo.nickName=this.inputName.trim();
            this.alterInfo('nickName',this.inputName.trim(),'修改昵称成功')
        },
        handleAlterRemark(){
            let remark=this.inputRemark.trim()
            if(!this.inputRemark||remark.length>15) return;
            this.alterRemark=false;
            let backup=this.userInfo.remark;
            this.userInfo.remark=remark;
            this.axios({
                method:'get',
                url:this.apiHost+`/contact/editRemark?contactSn=${this.userInfo.sn}&remark=${remark}`
            }).then(res=>{
                console.log(res)
                if(res.data.code==='10000'){
                    this.$store.commit('updateFriendList',{userSn:this.userInfo.sn,type:'remark',value:remark})
                    this.snackbar={open:true,color:'success',text:'修改好友备注成功'}
                }else{
                    this.userInfo.remark=backup;
                }
            }).catch(()=>{
                this.userInfo.remark=backup;
            })
        },
        handleAlterAvatar(data){//修改头像
            this.cropper=false;
            try{
                let fd=new FormData();
                fd.append('file',data,'avatar.jpg')
                this.axios({
                    method:'post',
                    url:this.serverHost+'/uploadAvatar',
                    data:fd
                }).then(res=>{
                    if(res.data.code===200){
                        let path=res.data.path;
                        this.alterInfo('profilePhoto',path,'修改头像成功')
                    }
                })
            }catch(err){
                console.log(err);
                this.snackbar={open:true,color:'error',text:'操作失败'}
            }
        },
        handleAlterGroup(group){
            this.axios({
                method:'get',
                url:this.apiHost+'/contact/editUserGroup?contactSn='+this.userInfo.sn+'&groupSn='+group.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$store.commit('updateFriendList',{userSn:this.userInfo.sn,type:'groupSn',value:group.sn})
                    this.snackbar={open:true,color:'success',text:'修改分组成功'}
                }else{
                    this.snackbar={open:true,color:'error',text:'修改分组失败，code:'+res.data.code}
                }
            })
        },
        alterInfo(type,value,text){//type:要修改的字段 value:值 text:提示信息
            this.axios({
                method:'post',
                url:this.apiHost+`/user/editUserInfo?${type}=${value}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.snackbar={open:true,color:'success',text}
                    if(type==='profilePhoto'){
                        this.userInfo[type]=value;
                        this.$store.commit('updateMyInfo',{...this.myInfo,avatar:value})
                    }else if(type==='nickName'){
                        this.userInfo[type]=value;
                        this.$store.commit('updateMyInfo',{...this.myInfo,name:value})
                    }
                    
                }
            })
        }
    },
    watch:{
        id(newVal){
            if(newVal){
                this.getUserInfo();
            }
        },
        updateFriendList(newVal){//好友列表更新 =》资料页更新
            if(newVal){
                this.getUserInfo()
            }
        },
        '$route'(route){
            if(route.name==='friendInfo'){
                this.getUserInfo();
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    @import './friendInfo.scss'
</style>