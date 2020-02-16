<template>
<div :style="{height:'100%',width:'100%',position:'relative',backgroundColor:'red'}" v-show='show'>
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
    <div id='group-info'>
        <div class="cover">
            <div class="group-name">{{data.groupName}}</div>
            <div class="img" :style="{backgroundImage:`url(${serverHost+data.profilePhoto})`}"  v-ripple></div>
            <v-btn icon class="btn" @click.stop="$refs.inputFile.click()" v-if='isAdmin'><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
            <input type="file" accept="image/*" :style="{display:'none'}" ref='inputFile' @change="handleFileChange"/>
            <v-btn icon class="message-btn" large :style="{backgroundColor:theme}" @click="toMessage"><v-icon>mdi-message</v-icon></v-btn>
        </div>
        <div class="member">
            <div class="tip">群成员 ({{data.count}})</div>
            <div class="members" :style="{maxHeight:showMore?'500px':'140px',overflow:showMore?'auto':'hidden'}">
                <v-menu v-model="openAddMembers" :close-on-content-click="false" v-if='isMember'>
                    <template v-slot:activator='{on}'>
                        <v-btn icon large class="btn" v-on='on'><v-icon>mdi-plus</v-icon></v-btn>
                    </template>
                    <AddGroup :theme='theme' :apiHost='apiHost' :serverHost='serverHost' :friends='friends' 
                        :groupInfo='{id:data.sn,name:data.groupName}'   
                        @close='openAddMembers=false'
                        @success='snackbar={open:true,text:"邀请成功",color:"success"}'/>
                </v-menu>
                <v-btn icon large class="btn" @click="deleteMode=!deleteMode" v-if='isAdmin'><v-icon>mdi-minus</v-icon></v-btn>
                <div class="avatar-container" v-for="user in data.chatGroupUserList" :key='user.sn'>
                    <div class="avatar" v-ripple @click="$store.commit('updateOpenFriend',user.sn);$router.push('/friends/info')">
                        <img :src="serverHost+user.profilePhoto" :style="{width:'100%'}"/>
                    </div>
                    <div class="btn" v-ripple v-if="deleteMode&&user.sn!==data.groupAdmin                    "  
                        @click="handleRemoveMember(user.sn)">
                        <v-icon class="icon">mdi-minus</v-icon>
                    </div>
                </div>
            </div>
            <v-btn depressed @click="showMore=!showMore" :style="{width:'100%',marginTop:'10px'}">
                <v-icon>{{showMore?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon> {{showMore?'收起':'查看全部成员'}}
            </v-btn>
        </div>
        <div class="info-group">
            <div class='item'>
                <div class="tip">群名</div>
                <div class="value">{{data.groupName}}</div>
                <v-menu :close-on-content-click="false" v-model="alterGroupName.open" v-if='isAdmin'>
                    <template v-slot:activator='{on}'>
                        <v-btn icon v-on='on'><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                    </template>
                    <div class="alter-name">
                        <v-text-field :counter="20" v-model="alterGroupName.content"></v-text-field>
                        <div class="actions">
                            <v-btn depressed class="btn" :style="{backgroundColor:'#F44336',marginRight:'5px'}" 
                                @click="alterGroupName.open=false">取消</v-btn>
                            <v-btn depressed class="btn" :style="{backgroundColor:'#4CAF50'}" 
                                :disabled="alterGroupName.content.trim().length===0||alterGroupName.content.trim().length>20"
                                @click="handleAlterGroupName">确定</v-btn>
                        </div>
                    </div>
                </v-menu>
            </div>
            <div class='item'>
                <div class="tip">群公告</div>
                <div class="notice" v-ripple @click="openNotice=true">
                    <pre class="notice-content">{{data.announcement?data.announcement.content:'暂无公告'}}</pre>
                    <v-icon>mdi-chevron-right</v-icon>
                </div>
            </div>
            <div class='item' v-if='isMember'>
                <div class="tip">我在本群的昵称</div>
                <div class="value">{{data.nickName}}</div>
                <v-menu :close-on-content-click="false" v-model="alterNickname.open">
                    <template v-slot:activator='{on}'>
                        <v-btn icon v-on='on'><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                    </template>
                    <div class="alter-name">
                        <v-text-field :counter="10" v-model="alterNickname.content"></v-text-field>
                        <div class="actions">
                            <v-btn depressed class="btn" :style="{backgroundColor:'#F44336',marginRight:'5px'}" @click="alterNickname.open=false">取消</v-btn>
                            <v-btn depressed class="btn" :style="{backgroundColor:'#4CAF50'}" @click="handleAlterNickName"
                                :disabled="alterNickname.content.trim().length===0||alterNickname.content.trim().length>20">确定</v-btn>
                        </div>
                    </div>
                </v-menu>
            </div>
            <div class='item' v-if='isMember'>
                <div class="tip">消息免打扰</div>
                <v-switch v-model="noWarn" :style="{margin:0}" :color="theme" @change="handleChangeNoWarn"></v-switch>
            </div>
            <v-btn depressed class="applyInGroupBtn" @click="applyInGroup.open=true" v-if="!isMember">加入</v-btn>
            <div v-else>
                <v-btn depressed class="applyInGroupBtn" @click="disbandGroup=true" v-if='isAdmin' :style="{backgroundColor:'#F44336'}">解散该群</v-btn>
                <v-btn depressed class="applyInGroupBtn" @click="outGroup=true" v-else :style="{backgroundColor:'#F44336'}">退出</v-btn>
            </div>
        </div>
    </div>
    <v-dialog v-model="cropper.open" width="800">
        <Cropper :img='cropper.file' @submit='handleAlterAvatar'/>
    </v-dialog>
    <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
        <div class="notice-page" v-if='openNotice'>
            <Notice :theme='theme' :isAdmin='isAdmin' :id='id' :members='data.chatGroupUserList'
                @close='openNotice=false' @updateNotice='updateNotice'/>
        </div>
    </transition>
    <v-dialog v-model="applyInGroup.open" width="300">
        <div class="applyInGroup">
            <div class="tip">请求加入群聊 <span class="name">{{data.groupName}}</span></div>
            <div class="subtip">附加信息</div>
            <v-textarea v-model="applyInGroup.content" solo flat background-color="#f5f5f5" no-resize :counter="50"></v-textarea>
            <div class="actions">
                <v-btn class="btn" depressed :style="{backgroundColor:'#F44336',marginRight:'10px'}" @click="applyInGroup.open=false">取消</v-btn>
                <v-btn class="btn" depressed
                    :style="{backgroundColor:'#4CAF50'}" @click="handleApplyInGroup" 
                    :disabled="applyInGroup.content.length>50">发送</v-btn>
            </div>
        </div>
    </v-dialog>
    <v-dialog v-model="outGroup" width="300">
        <div class="applyInGroup">
            <div class="tip">确认退出群聊</div>
            <div class="actions">
                <v-btn class="btn" depressed :style="{backgroundColor:'#F44336',marginRight:'10px'}" @click="outGroup=false">取消</v-btn>
                <v-btn class="btn" depressed :style="{backgroundColor:'#4CAF50'}" @click="handleActionGroup('out')">退出</v-btn>
            </div>
        </div>
    </v-dialog>
    <v-dialog v-model="disbandGroup" width="300">
        <div class="applyInGroup">
            <div class="tip">确认解散该群</div>
            <div class="actions">
                <v-btn class="btn" depressed :style="{backgroundColor:'#F44336',marginRight:'10px'}" @click="disbandGroup=false">取消</v-btn>
                <v-btn class="btn" depressed :style="{backgroundColor:'#4CAF50'}" @click="handleActionGroup('disband')">解散</v-btn>
            </div>
        </div>
    </v-dialog>
    <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
        {{snackbar.text}} <v-btn icon @click='snackbar.open=false' :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
    </v-snackbar>
</div>
</template>

<script>
import Cropper from '../../components/cropper'
import Notice from './notice'
import AddGroup from '../../components/search/addGroup'
export default {
    components:{Cropper,Notice,AddGroup},
    props:['id'],
    data(){
        return{
            show:true,
            showMore:false,
            alterGroupName:{//修改群名称
                open:false,
                content:''
            },
            alterNotice:false,//修改公告
            alterNickname:{
                open:false,
                content:''//修改昵称
            },
            noWarn:false,//消息免打扰
            deleteMode:false,//显示移除成员按钮
            data:{},
            cropper:{
                open:false,
                file:null
            },
            loading:false,
            openNotice:false,
            openAddMembers:false,//添加新成员
            applyInGroup:{//请求入群
                open:false,
                content:'请求进入群聊'
            },
            snackbar:{
                open:false,
                text:'',
                color:'error'
            },
            outGroup:false,
            disbandGroup:false
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
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
        isAdmin(){//我是否是群管理员
            return this.data.groupAdmin===this.myInfo.id;
        },
        isMember(){
            if(this.data.chatGroupUserList){
                for(let member of this.data.chatGroupUserList){
                    if(member.sn===this.myInfo.id) return true;
                }
            }
            return false;
        },
        friends(){
            let data=JSON.parse(JSON.stringify(this.$store.state.friendList));
            let members=[];
            if(this.data.chatGroupUserList){
                members= this.data.chatGroupUserList.map(item=>item.sn)
            }
            for(let i in members){
                for(let j in data){
                    if(data[j].userSn===members[i]){//去除掉已经是群成员的用户
                        data.splice(j,1);break
                    }
                }
            }
            return data;
        },
        updateGroups(){
            return this.$store.state.updateGroups
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            this.openNotice=false;
            if(!this.id) {return}
            this.loading=true;
            this.axios({
                methods:'get',
                url:this.apiHost+'/chat/getChatGroupInfo?groupSn='+this.id
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    data.nickName='';//群昵称
                    this.data=data;
                    this.alterGroupName.content=data.groupName;
                    this.noWarn=data.mute==='1';
                    this.getGroupNickName();
                }
            }).finally(()=>{
                this.loading=false;
            })
        },
        getGroupNickName(){//获取群昵称
            if(this.data.chatGroupUserList){
                for(let member of this.data.chatGroupUserList){
                    if(member.sn===this.myInfo.id){
                        let name= member.remark||member.nickName;
                        this.data.nickName=name;
                        this.alterNickname.content=name;
                        break;
                    }
                }
            }
        },
        handleFileChange(e){
            this.cropper.file=window.URL.createObjectURL(e.target.files[0]);
            this.cropper.open=true;
            e.target.value=''
        },
        updateNotice(v){
            if(this.data.announcement){
                this.data.announcement.content=v
            }else{
                this.$set(this.data,'announcement',{content:v})
            }
        },
        handleApplyInGroup(){//请求入群
            this.applyInGroup.open=false;
            this.axios({
                method:'get',
                url:this.apiHost+`/chat/requestChatGroup?chatGroupSn=${this.id}&content=${this.applyInGroup.content}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.snackbar={text:'发送申请成功',color:'success',open:true}
                }else{
                    this.snackbar={text:'发送申请失败',color:'error',open:true}
                }
            })
        },
        handleChangeNoWarn(newVal){
            let status=0;
            if(newVal) status=1;
            this.axios({
                method:'get',
                url:this.apiHost+`/chat/switchMute?chatSn=${this.data.chatSn}&mute=${status}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$store.commit('updateChatListField',{id:this.data.chatSn,field:'mute',value:status+''})
                    this.snackbar={text:'修改成功',color:'success',open:true}
                }else{
                    this.snackbar={text:'修改失败',color:'error',open:true}
                }
            })
        },
        async handleAlterGroupName(){
            this.alterGroupName.open=false;
            let groupName=this.alterGroupName.content.trim();
            let result=await this.alterGroupInfo('groupName',groupName)
            if(result){
                this.$store.commit('updateChatListField',{id:this.data.chatSn,field:'nickName',value:groupName})
                this.data.groupName=groupName;
            }
        },
        handleAlterAvatar(data){
            this.cropper.open=false;
            let fd=new FormData();
            fd.append('file',data,'img.png');
            this.axios({
                method:'post',
                url:this.serverHost+'/uploadAvatar',
                data:fd
            }).then(async res=>{
                if(res.data.code===200){
                    let result=await this.alterGroupInfo('profilePhoto',res.data.path)
                    if(result){
                        this.$store.commit('updateChatListField',{id:this.data.chatSn,field:'profilePhoto',value:res.data.path})
                        this.data.profilePhoto=res.data.path;
                    }
                }else{
                    this.snackbar={text:'上传头像失败',color:'error',open:true}
                }
            }).catch(()=>{
                this.snackbar={text:'上传头像失败',color:'error',open:true}
            })
        },
        alterGroupInfo(field,value){
            return new Promise(resolve=>{
                let data={sn:this.data.sn};
                data[field]=value;
                this.axios({
                    method:'post',
                    url:this.apiHost+'/chat/changeGroupInfo',
                    data
                }).then(res=>{
                    console.log(res)
                    if(res.data.code==='10000'){
                        this.snackbar={text:'修改成功',color:'success',open:true}
                        this.$store.commit('updateGroupsItem',{id:this.data.sn,field,value})
                        resolve(true)
                    }else{
                        this.snackbar={text:'修改失败',color:'error',open:true}
                        resolve(false)
                    }
                }).catch(()=>{
                    resolve(false)
                })
            })
        },
        handleAlterNickName(){
            this.alterNickname.open=false;
            let name=this.alterNickname.content.trim();
            this.axios({
                method:'get',
                url:this.apiHost+`/chat/editRemark?chatGroupSn=${this.data.sn}&remark=${name}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.data.nickName=name;
                    this.snackbar={text:'修改成功',color:'success',open:true}
                }else{
                    this.snackbar={text:'修改失败',color:'error',open:true}
                }
            })
        },
        handleActionGroup(action){
            this.outGroup=false;
            this.disbandGroup=false;
            let url=`/chat/releaseChatGroup?chatGroupSn=${this.data.sn}`;
            let text='解散群聊'
            if(action==='out'){
                text='退出群聊'
                url=`/chat/quitChatGroup?groupSn=${this.data.sn}`
            } 
            this.$store.commit('removeGroup',this.data.sn)
            this.axios({
                method:'post',
                url:this.apiHost+url
            }).then(res=>{
                if(res.data.code==='10000'){
                    if(action==='out'){
                        this.getData();
                    }else{
                        this.$router.replace('/group')
                    }
                    this.snackbar={text:text+'成功',color:'success',open:true}
                }else{
                    this.snackbar={text:text+'失败',color:'error',open:true}
                    this.$store.commit('setUpdateGroups',true);
                }
            }).catch(()=>{
                    this.$store.commit('setUpdateGroups',true);
            })
        },
        handleRemoveMember(id){
            for(let i in this.data.chatGroupUserList){
                if(this.data.chatGroupUserList[i].sn===id){
                    this.data.chatGroupUserList.splice(i,1)
                }
            }
            this.axios({
                method:'post',
                url:this.apiHost+`/chat/removeChatGroupUser?chatGroupSn=${this.data.sn}&contactSn=${id}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.snackbar={text:'移除成功',color:'success',open:true}
                }else{
                    this.getData();
                    this.snackbar={text:'移除失败',color:'error',open:true}
                }
            }).catch(()=>{
                this.getData();
            })
        },
        toMessage(){
            if(this.$store.state.openChat!==this.data.contactSn){//避免重复执行
                this.$store.commit('updateOpenChat',null)
                this.$router.replace('/message');
                this.$nextTick(()=>{
                    this.$store.commit('updateOpenChat',this.data.sn)
                })
            }
        }
    },
    watch:{
        id(){
            if(!this.id) this.show=false;
            else{
                this.show=true;
                this.getData();
            }
        },
        updateGroups(newVal){//群列表更新=》更新资料页
            if(newVal){
                this.getData()
            }
        }
    }
}
</script>

<style lang='scss' scoped>  
    .loading{
        position: absolute;
        width: 100%;
        height:100%;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: center;
        animation-duration: .5s;
        background-color: #fff;
    }
    #group-info{
        width:100%;
        height:100%;
        background-color:#fff;
        overflow: auto;
        position: relative;
        .cover{
            height: 200px;
            width:100%;
            position: relative;
            .img{
                position: absolute;
                width:100%;
                height:100%;
                background-position: center;
                background-repeat: no-repeat;
                background-size: cover;
                filter: blur(5px);
                transform: scale(1.1);
                //background-attachment: fixed;
            }
            .btn{
                position:absolute;
                right: 0;
                top:0;
                z-index: 9;
                background-color:rgba(255,255,255,.2) 
            }
            .group-name{
                font-size: 2rem;
                font-weight: bold;
                position: absolute;
                top:50%;
                left:50%;
                transform: translate(-50%,-50%);
                z-index: 9;
                overflow: hidden;
                max-height: 200px;
            }
            .message-btn{
                position: absolute;
                right:20px;
                bottom:-20px;
                z-index: 9;
                color:#fff;
                width:50px;
                height: 50px;
            }
        }
        .member{
            padding:20px;
            background-color: #fff;
            .tip{
                color:#858585;
                font-size: 0.9rem;
            }
            .members{
                display: flex;
                flex-wrap: wrap;
                transition: max-height .5s linear;
                .btn{
                    background-color: rgba(0,0,0,.1);
                    margin:5px;
                    width: 60px;
                    height:60px;
                }
                .avatar-container{
                    position: relative;
                    .avatar{
                        width: 60px;
                        height:60px;
                        border-radius: 50%;
                        background-color: green;
                        margin: 5px;
                        overflow: hidden;
                    }
                    .btn{
                        position: absolute;
                        width:20px;
                        height: 20px;
                        background-color: red;
                        border-radius: 50%;
                        right:-5px;
                        top:0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .icon{
                            font-size: 1rem;
                            color:#fff
                        }
                    }
                }
            }
        }
        .info-group{
            padding: 20px;
            padding-top: 0;
            .item{
                margin-bottom: 20px;
                .tip{
                    color: #858585;
                    font-size: 0.9rem;
                }
                .value{
                    display: inline;
                    margin-right: 10px;
                }
                .notice{
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                    cursor: pointer;
                    .notice-content{
                        flex:1;
                        white-space: pre-wrap;
                        word-wrap: break-word;
                        text-align: left;
                    }
                }
            }
        }
        .applyInGroupBtn{
            width:100%;
            background-color: #4CAF50;
            color:#fff;
        }
    }
    .notice-page{
        position: absolute;
        width: 100%;
        height:100%;
        top:0;
        left:0;
        background-color: #fff;
        z-index: 99;
        overflow: hidden;
        animation-duration: .5s;
    }
    .alter-name{
        background-color: #fff;
        padding:20px;
        .actions{
            margin-top: 10px;
            text-align: center;
            .btn{
                color:#fff;
            }
        }
    }
    .applyInGroup{
        background-color: #fff;
        padding:15px;
        .tip{
            text-align: center;
            .name{
                font-weight: bold;
            }
        }
        .subtip{
            font-size: 0.8rem;
            color:#959595;
            margin-top: 10px;
        }
        .actions{
            text-align: center;
            margin-top: 20px;
            .btn{
                color: #fff;
            }
        }
    }
</style>