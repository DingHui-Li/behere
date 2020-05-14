<template>
    <div id='notice'>
        <v-btn icon @click="$emit('close')" class="close-btn"><v-icon>mdi-close</v-icon></v-btn>
        <div class="title">群公告</div>
        <div :style="{overflow:'hidden'}" v-if='isAdmin'>
            <v-btn depressed class="new-btn" :style="{backgroundColor:theme}" @click="newNotice.open=!newNotice.open">发布新公告</v-btn>
        </div>
        <div :style="{overflow:'hidden'}">
            <transition enter-active-class="animated fadeInRight"  leave-active-class="animated fadeOutRight">
                <div class="notice-item elevation-1 new-notice" v-if='newNotice.open'>
                    <v-textarea solo flat no-resize rows='5' autofocus :counter='500' placeholder="在此输入" v-model='newNotice.content'></v-textarea>
                    <div class="actions">
                        <v-btn class="cancel-btn btn" depressed :style="{marginRight:'10px'}" @click='newNotice.open=false'>取 消</v-btn>
                        <v-btn class="submit-btn btn" depressed @click="submit" 
                            :disabled="newNotice.content.trim().length===0||newNotice.content.trim().length>500">发 布</v-btn>
                    </div>
                </div>
            </transition>
        </div>
        <v-progress-linear indeterminate :color="theme" v-if='loading'></v-progress-linear>
        <transition-group name='notice' enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
            <div class="notice-item elevation-1" v-for="(notice,index) in data" :key='notice.sn'>
                <div :style="{overflow:'hidden'}">
                    <v-btn icon class="del-btn" v-if='isAdmin&&index===0' @click="editNotice.open=!editNotice.open"><v-icon>mdi-file-edit</v-icon></v-btn>
                    <v-btn icon class="del-btn" v-if='isAdmin' @click="remove(notice.sn,index)"><v-icon>mdi-delete</v-icon></v-btn>
                </div>
                <div v-if='index===0&&editNotice.open'>
                    <v-textarea solo flat no-resize rows='5' autofocus :counter='500' placeholder="在此输入" v-model='editNotice.content'></v-textarea>
                    <div class="actions">
                        <v-btn class="cancel-btn btn" depressed :style="{marginRight:'10px'}" @click='editNotice.open=false'>取 消</v-btn>
                        <v-btn class="submit-btn btn" depressed @click="edit" 
                            :disabled="editNotice.content.trim().length===0||editNotice.content.trim().length>500">修 改</v-btn>
                    </div>
                </div>
                <pre class="content" v-else>{{notice.content}}</pre>
                <div class="notice-info">
                    <div class="user">
                        <div class="avatar">
                            <img :src="serverHost+getUserInfo(notice.sendUser).profilePhoto" :style="{width:'100%'}"/>
                        </div>
                        <div class="name">{{getUserInfo(notice.sendUser).nickName}}</div>
                    </div>
                    <div class="time">{{new Date(notice.sendTime).parse(true)}}</div>
                </div>
            </div>
        </transition-group>
        <div v-if='data.length===0&&!loading' class="tip">暂无公告</div>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon @click='snackbar.open=false' :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    props:['isAdmin','theme','id','members'],
    data(){
        return{
            data:[],
            newNotice:{//发布新公告
                open:false,
                content:''
            },
            editNotice:{
                open:false,
                content:''
            },
            snackbar:{
                open:false,
                text:'',
                color:''
            },
            loading:false
        }
    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        myInfo(){
            return this.$store.state.myInfo;
        }
    },
    mounted(){
        this.getData();
    },
    methods:{
        getData(){
            if(!this.id) return;
            this.loading=true;
            this.axios({
                method:'get',
                url:this.apiHost+'/chat/getAnnouncementList?groupSn='+this.id
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    this.data=data;
                    this.editNotice.content=data[0]?data[0].content:'';
                }
            }).finally(()=>{
                this.loading=false;
            })
        },
        getUserInfo(id){
            if(!id||!this.members) return{profilePhoto:'/public/avatar.png',nickName:'unknow'}
            for(let member of this.members){
                if(member.sn===id) return member;
            }
        },
        submit(){
            this.newNotice.open=false;
            this.axios({
                method:'post',
                url:this.apiHost+`/chat/addAnnouncement?groupSn=${this.id}&content=${this.newNotice.content}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.getData();
                    this.$emit('updateNotice',this.newNotice.content);
                    this.newNotice.content='';
                    this.snackbar={open:true,text:'添加群公告成功',color:'success'}
                }else{
                    this.snackbar={open:true,text:'添加群公告失败',color:'error'}
                }
            })
        },
        edit(){
            this.editNotice.open=false;
            this.axios({
                method:'post',
                url:this.apiHost+`/chat/editAnnouncement?annSn=${this.data[0].sn}&content=${this.editNotice.content}&groupSn=${this.id}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.data[0].content=this.editNotice.content;
                    this.$emit('updateNotice',this.editNotice.content);
                    this.snackbar={open:true,text:'修改群公告成功',color:'success'}
                }else{
                    this.snackbar={open:true,text:'修改群公告失败',color:'error'}
                }
            })
        },
        remove(id,index){
            this.data.splice(index,1)
            this.axios({
                method:'post',
                url:this.apiHost+`/chat/delAnnouncement?annSn=${id}&groupSn=${this.id}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('updateNotice',this.data[0]?this.data[0].content:'暂无公告')
                    this.snackbar={open:true,text:'删除群公告成功',color:'success'}
                }else{
                    this.snackbar={open:true,text:'修改群公告失败',color:'error'}
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    #notice{
        padding:20px;
        height:100%;
        overflow: auto;
        overflow-x: hidden;
        position: relative;
        .tip{
            text-align: center
        }
        .close-btn{
            position: absolute;
            top:0;
            right:0;
            background-color: rgba(0,0,0,.2)
        }
        .title{
            text-align: center;
            margin: 20px;
            font-weight: bold;
        }
        .new-btn{
            float: right;
            margin-bottom: 20px;
            color:#fff;
        }
        .new-notice{
            animation-duration: .5s;
        }
        .actions{
                text-align: right;
                padding-bottom: 10px;
                padding-right: 20px;
                .btn{
                    color:#fff;
                }
                .cancel-btn{
                    background-color: #F44336;
                }
                .submit-btn{
                    background-color: #4CAF50
                }
            }
        .notice-item{
            border-radius: 5px;
            margin-bottom: 20px;
            background-color: #fff;
            position: relative;
            animation-duration: .5s;
            .del-btn{
                float:right;
            }
            .content{
                padding:20px;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .notice-info{
                overflow: hidden;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                padding:0 20px 20px 0; 
                .user{
                    overflow: hidden;
                    display: inline;
                    line-height: 20px;
                    margin-right: 10px;
                    .avatar{
                        width:20px;
                        height:20px;
                        border-radius: 50%;
                        background-color: green;
                        float:left;
                        overflow: hidden;
                    }
                    .name{
                        margin-left: 5px;
                        float:left;
                    }
                }
                .time{
                    font-size: 0.8rem;
                }
            }
        }
    }
    .notice-move{
        transition: all .5s;
    }
</style>