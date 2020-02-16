<template>
        <div id="article-container" v-intersect.once='onIntersect'>
            <div id="article" :class="['elevation-1','animated',isIntersect?'fadeInUp':'']" > 
                <div class="content-container">
                    <div class="avatar-container">
                        <v-menu offset-y :closeOnContentClick='false' :openOnHover="true">
                            <template v-slot:activator="{ on }">
                                <div class="avatar" v-on="on" v-ripple @click="$router.push('/social/user/'+data.userSn)">
                                    <img :src="serverHost+data.profilePhoto" :style="{width:'100%'}"/>
                                </div>
                            </template>
                            <UserInfoCard :id="data.userSn"/>
                        </v-menu>
                    </div>
                    <div class="right-box">
                        <div class="name" v-ripple @click="$router.push('/social/user/'+data.userSn)">{{data.nickName}}</div>
                        <div class="time">{{new Date(data.createTime).parse(true)}}</div>
                        <div class="content" ref='content'>
                            <div v-html='data.content' @click="atClick"></div>
                            <v-row>
                                <v-col cols="4" v-for="(img,index) in attachment.imgs" :key="'img'+index" :style="{padding:'5px'}">
                                    <v-img class="img" :src='serverHost+img' :aspect-ratio="1/1" v-ripple
                                        @click="openImgView=index"
                                        :style="{backgroundColor:img.getColor()||theme,borderRadius:'5px'}"/>
                                </v-col>
                            </v-row>
                            <div v-if='attachment.media&&attachment.media.type' class="media">
                                <video :src="serverHost+attachment.media.path" 
                                    v-if='attachment.media.type.includes("video")' controls></video>
                                <audio v-else :src="serverHost+attachment.media.path" controls></audio>
                            </div>
                            <Voice v-for="(v,index) in attachment.voices" :key="'voice'+index" :data='v' :msg='true'/>
                        </div>
                        <div class="actions">
                            <SelectVisibility :style="{float:'left'}" :value='data.permission' v-if='!look&&isDelete&&isMe'
                            @visibility='v=>data.permission=v' @selectFriend="selectFriend.open=true"/>
                            <v-menu>
                                <template v-slot:activator='{on}'>
                                    <v-btn v-if='!look&&isDelete&&isMe' v-on='on' :loading='deleteLoading'
                                        depressed class="btn" :style="{float:'right',backgroundColor:'#F44336'}">
                                        <v-icon color="#fff">mdi-delete</v-icon>
                                        <span :style="{color:'#fff'}">删除</span> 
                                    </v-btn>
                                </template>
                                <div class="elevation-5" :style="{backgroundColor:'#fff',padding:'20px',borderRadius:'5px'}">
                                    <div :style="{textAlign:'center',marginBottom:'10px'}">确定删除吗？无法撤销</div>
                                    <div :style="{display:'flex'}">
                                        <v-btn depressed @click="handleDelete"
                                            :style="{flex:1,marginRight:'5px',backgroundColor:'red',color:'#fff'}">
                                            删了吧
                                        </v-btn>
                                        <v-btn depressed :style="{flex:1,backgroundColor:'#4CAF50',color:'#fff'}">算了</v-btn>
                                    </div>
                                </div>
                            </v-menu>
                            <v-btn v-if='!look' fab small depressed class="btn"
                                @click="openCommentInput=!openCommentInput">
                                <v-icon color='blue'>mdi-comment-multiple-outline</v-icon>
                            </v-btn>
                            <v-btn fab small depressed class="btn" @click="handleLike" :loading="liking">
                                <v-icon color='red'>{{liked?'mdi-heart':'mdi-heart-outline'}}</v-icon>
                                <span v-if="look">{{data.likeNum}}</span>
                            </v-btn>
                        </div>
                        <div class="likes" v-if='!look&&data.momentLikes.length>0'>
                            <v-icon class="icon" size="19" >mdi-heart</v-icon>
                            <span v-for="user in data.momentLikes" :key='user.userSn'>{{user.nickName}},</span> 
                                等{{data.momentLikes.length}}人觉得很赞
                        </div>
                    </div>
                    <div :style="{marginLeft:'70px'}" v-if='!look'>
                        <ReplyInput :show="openCommentInput" @hidden='openCommentInput=false' placeHolder='评论' 
                            :userId='data.userSn' :contentId='data.sn' type='comment'
                            @addComment='addComment'
                            v-on="$listeners"/>
                    </div>
                </div>
                <div class="comment" v-if='!look&&data.momentComment.length>0'>
                    <Comment v-for="comment in data.momentComment" :key='comment.sn' :data='comment' :contentId='data.sn'
                        :myInfo='myInfo' :apiHost='apiHost'
                        @removeComment='removeComment'
                        @addComment='addComment'
                        v-on="$listeners"/>
                </div>
            </div>
            <ImgView v-if='attachment.imgs'  :imgs='attachment.imgs' :open='openImgView' @close='openImgView=-1'/>
            <v-dialog v-model="selectFriend.open" width="500">
                <SelectFriend v-if='data.permission==="part"' @submit="data=>{selectFriend.open=false;selectFriend.value=data}"
                    :selectedFriend='selectFriend.value' @close='selectFriend.open=false'/>
            </v-dialog>
        </div>
</template>

<script>
import Comment from './comment'
import UserInfoCard from './userInfoCard'
import ReplyInput from './replyInput'
import ImgView from '../../../components/imgView'
import Voice from '../../../components/voice'
import SelectFriend from '../publish/selectFriend'
import SelectVisibility from '../publish/selectVisibility'
export default {
    components:{Comment,UserInfoCard,ReplyInput,ImgView,Voice,SelectFriend,SelectVisibility},
    props:['item','apiHost','myInfo','serverHost','isDelete','look'],
    data(){
        return{
            openCommentInput:false,
            isIntersect:false,
            liked:false,//点赞状态
            liking:false,//点赞操作中
            data:{},
            openImgView:-1,
            deleteLoading:false,//删除中
            selectFriend:{
                open:false,
                value:[]
            },
        }
    },
    created(){
        this.data=this.item 
        this.isLike();
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        comments(){
            let temp=JSON.parse(JSON.stringify(this.data.momentComment));
            return temp.reverse()
        },
        attachment(){
            if(typeof this.data.attachment==='object') return this.data.attachment
            if(this.data.attachment){
                let data= JSON.parse(this.data.attachment)
                if(data.voices){
                    let fullwidth=200;
                    for(let i in data.voices){
                        let width=data.voices[i].duration/60*fullwidth;
                        if(width<30) width=30;
                        if(width>fullwidth*0.8) width=fullwidth*0.8;
                        data.voices[i].width=width;
                    }
                }
                return data
            }
            return{}
        },
        isMe(){
            let myInfo=this.$store.state.myInfo;
            return this.data.userSn===myInfo.id
        }
    },
    methods:{
        onIntersect(entries){
            this.isIntersect=entries[0].isIntersecting;
        },
        isLike(){
            if(this.look){
                this.liked=this.data.liked
                return
            }
            for(let user of this.data.momentLikes){
                if(user.userSn===this.myInfo.id){
                    this.liked=true
                    return
                }
            }
            this.liked=false;
        },
        handleLike(){
            this.liking=true
            this.liked=!this.liked;
            this.axios({
                method:'post',
                url:this.apiHost+'/moment/addMomentLike?momentSn='+this.data.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('snackbar',{text:'操作成功',color:'success'})
                }else{
                    this.$emit('snackbar',{text:'操作失败',color:'error'})
                    this.liked=!this.liked;
                }
            }).catch(err=>{
                this.liked=!this.liked;
            }).finally(()=>{
                if(this.liked){
                    if(this.look) this.likeNum++;
                    else this.data.momentLikes.push({userSn:this.myInfo.id,nickName:this.myInfo.name})
                }else{
                    if(this.look) this.likeNum--;
                    else{
                        for(let i in this.data.momentLikes){
                            if(this.data.momentLikes[i].userSn===this.myInfo.id){
                                this.data.momentLikes.splice(i,1);
                                break
                            }
                        }
                    }
                    
                }
                this.liking=false
            })
        },
        addComment(data){
            this.data.momentComment.push(data);
        },
        removeComment(id){
            for(let i in this.data.momentComment){
                if(this.data.momentComment[i].sn===id){
                    this.data.momentComment.splice(i,1) 
                    break
                }
            }
        },
        atClick(e){
            if(e.target.title)
                this.$router.replace(`/social/user/${e.target.title}`)
        },
        handleDelete(){
            this.deleteLoading=true;
            this.axios({
                method:'post',
                url:this.apiHost+'/moment/delMoment?momentSn='+this.data.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('snackbar',{text:'删除成功',color:'success'})
                    setTimeout(()=>{
                        this.$emit('deleteOne',{date:this.data.createTime,id:this.data.sn})
                        this.$emit('close')
                    },1000)
                }else{
                    this.$emit('snackbar',{text:'操作失败',color:'error'})
                }
            }).finally(()=>{
                this.deleteLoading=false;
            })
        },
        modifyVisibility(visibility,ids=[]){
            let temp=this.data.permission;
            this.data.permission=visibility;
            this.axios({
                method:'post',
                url:this.apiHost+`/moment/editMomentPermission?momentSn=${this.data.sn}&permission=${visibility}&contactSn=${ids}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('snackbar',{text:'修改成功',color:'success'})
                }else{
                    this.data.permission=temp;
                    this.$emit('snackbar',{text:'修改失败',color:'error'})
                }
            }).catch(err=>{
                this.data.permission=temp;
            })
        }
    },
    watch:{
        'data.permission'(newVal,old){
            if(!old) return//初始化
            if(newVal==='part') return;
            this.modifyVisibility(newVal);    
        },
        'selectFriend.value'(newVal){
            let ids='';
            newVal.map((item,index)=>ids+=`${item.id}${newVal.length===index+1?'':','}`)
            this.modifyVisibility('part',ids);    
        }
    }
}
</script>

<style lang='scss' scoped> 
    #article-container{
        width:100%;
    }
    #article{
        width:100%;
        overflow: hidden;
        margin-bottom: 0px;
        border-bottom: 1px solid #e0e0e0;
        background-color: #fff;
        // padding:20px 10px;
        //border-radius: 5px;
        transition: all .2s;
        animation-duration: .5s;
        .content-container{
            position: relative;
            overflow: hidden;
            background-color: #fff;
            width: 100%;
            padding:20px 0;
            .avatar-container{
                position: relative;
                float:left;
                width:70px;
                height:100%;
                .avatar{
                    width:45px;
                    height:45px;
                    overflow: hidden;
                    border-radius: 50%;
                    position: relative;
                    margin: 0 auto;
                    }
            }
            .right-box{
                float: right;
                width:calc(100% - 70px);
                height:100%;
                padding-right: 20px;
                position: relative;
                .name{
                    font-weight: bold;
                    font-size: 1rem;
                    cursor: pointer;
                    width:fit-content;
                }
                .time{
                    font-size: 0.8rem;
                    color:#959595;
                    margin-bottom:10px;
                }
                .content{
                    font-size: 1rem;
                    color:#252525;
                    .media{
                        width:100%;
                        overflow: hidden;
                        video{
                            //width: 100%;
                            max-height:300px;
                            outline: none;
                        }
                        audio{
                            outline: none
                        }
                    }
                }
                .actions{
                    width:100%;
                    position: relative;
                    padding-right: 10%;
                    overflow: hidden;
                    margin-top: 10px;
                    // background-color: red;
                    padding:5px 0;
                    .btn{
                        float: right;
                        margin-left:20px;
                        background-color: transparent;
                    }
                }
                .likes{
                    position: relative;
                    width: 100%;
                    font-size: 0.8rem;
                    padding-top: 10px;
                    .icon{
                        color:red;
                    }
                }
            }         
        }
        .comment{
            background-color: #f5f5f5;
            margin-left:70px;
            margin-right: 20px;
            margin-bottom: 20px;
            padding-bottom: 5px;
            position: relative;
            // &::before{
            //     position: absolute;
            //     content:'';
            //     display: block;
            //     border:10px solid transparent;
            //     border-bottom-color: #f5f5f5;
            //     top:-20px;
            //     left:35px;
            // }
        }
    }
    
    .v-menu__content{
        box-shadow: none;
        padding:2px 10px 20px 5px;
    }
</style>