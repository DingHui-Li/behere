<template>
        <div id="article-container" :style="{padding:size==='xs'?'0 10px':'0px'}" v-intersect.once='onIntersect'>
            <div id="article" :class="['elevation-2','animated',isIntersect?'fadeInUp':'']" > 
                <div class="content-container" :style="{padding:size==='xs'?'10px 0':'20px 10px'}">
                    <div class="avatar-container">
                        <v-menu offset-y :closeOnContentClick='false' :openOnHover="true">
                            <template v-slot:activator="{ on }">
                                <div class="avatar" v-on="on"></div>
                            </template>
                            <UserInfoCard />
                        </v-menu>
                    </div>
                    <div class="right-box" :style="{color:theme.isBlack()?'#000':theme}">
                        <div class="name">任我行</div>
                        <div class="time">13:48</div>
                        <div class="content">这里是内容，叭啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦，把巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉</div>
                        <div class="likes">
                            <v-icon class="icon" size="19" >mdi-heart</v-icon>
                            任我行等124人觉得很赞
                        </div>
                        <div class="actions" >
                            <v-btn fab small depressed class="btn" @click="openCommentInput=!openCommentInput"  :style="{color:theme.isBlack()?'#000':theme}"><v-icon>mdi-comment-multiple-outline</v-icon></v-btn>
                            <v-btn fab small depressed class="btn" :style="{color:theme.isBlack()?'#000':theme}"><v-icon>mdi-heart-outline</v-icon></v-btn>
                        </div>
                    </div>
                    <ReplyInput :show="openCommentInput" @hidden='openCommentInput=false' />
                </div>
                <div class="comment">
                    <Comment />
                </div>
            </div>
        </div>
</template>

<script>
import Comment from './comment'
import UserInfoCard from './userInfoCard'
import ReplyInput from './replyInput'
export default {
    components:{Comment,UserInfoCard,ReplyInput},
    data(){
        return{
            openCommentInput:false,
            isIntersect:false
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        size(){
            return this.$vuetify.breakpoint.name;
        }
    },
    methods:{
        onIntersect(entries){
            this.isIntersect=entries[0].isIntersecting;
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
        margin-bottom: 20px;
        // padding:20px 10px;
        border-radius: 5px;
        transition: all .2s;
        .content-container{
            position: relative;
            overflow: hidden;
            background-color: #fff;
            width: 100%;
            padding-bottom: 0;
            .avatar-container{
                position: relative;
                float:left;
                width:70px;
                height:100%;
                .avatar{
                    width:45px;
                    height:45px;
                    background-color: green;
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
                }
                .time{
                    font-size: 0.8rem;
                    color:#959595;
                    margin-bottom:10px;
                }
                .content{
                    font-size: 1rem;
                    color:#252525;
                }
                .actions{
                    width:100%;
                    position: relative;
                    padding-right: 10%;
                    overflow: hidden;
                    // background-color: red;
                    padding:5px 20px;
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
            // margin-top:20px;
            width:100%;
            padding-top:10px;
            padding-bottom: 20px;
            position: relative;
            &::before{
                position: absolute;
                content:'';
                display: block;
                border:10px solid transparent;
                border-bottom-color: #f5f5f5;
                top:-20px;
                left:35px;
            }
        }
    }
    
    .v-menu__content{
        box-shadow: none;
        padding:2px 10px 20px 5px;
    }
</style>