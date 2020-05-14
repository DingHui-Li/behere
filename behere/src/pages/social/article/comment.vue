<template>
    <div>
        <div id="comment" v-ripple @click="openReplyInput=!openReplyInput">
            <span class="name" >
                <span @click.stop="$router.push('/social/user/'+data.from)">{{data.fromNickName}}</span>
                <span v-if='data.type==="reply"'> 
                    <span :style="{color:'#959595'}">回复</span> 
                    <span @click.stop="$router.push('/social/user/'+data.to)">{{data.toNickName}} </span> 
                </span>
                <span class="time">({{new Date(data.sendTime).parse(true)}})</span>
                : 
            </span>
            <span class="content">{{data.content}}</span>
            <v-btn icon v-if="isMe" @click.stop="handleDeleteComment"><v-icon color='red'>mdi-close-circle</v-icon></v-btn>
            </div>
            <div :style="{paddingLeft:'5px'}">
                <ReplyInput :show='openReplyInput' @hidden='openReplyInput=false' :placeHolder="'回复 '+data.fromNickName"
                v-on="$listeners"
                :userId='data.from' :userName='data.fromNickName' :contentId='contentId' type="reply"/>
            </div>
            
    </div>
</template>

<script>
// import Reply from './reply'
import ReplyInput from './replyInput'
export default {
    props:['data','contentId','myInfo','apiHost'],
    components:{ReplyInput},
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        isMe(){
            return this.data.from===this.myInfo.id
        }
    },
    data(){
        return{
            openReplyInput:false
        }
    },
    methods:{
        handleDeleteComment(){
            this.axios({
                method:'post',
                url:this.apiHost+'/moment/delMomentComment?messageSn='+this.data.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('snackbar',{text:"删除评论成功",color:'success'})
                    this.$emit('removeComment',this.data.sn)
                }else{
                    this.$emit('snackbar',{text:"删除评论失败",color:'error'})
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    #comment{
        width:100%;
        height:100%;
        position: relative;
        overflow: hidden;
        padding:10px;
        padding-bottom: 0;
        cursor: pointer;
        // .avatar-container{
        //     float:left;
        //     width:60px;
        //     height:100%;
        //     .avatar{
        //         width:40px;
        //         height:40px;
        //         border-radius: 50%;
        //         margin:0 auto;
        //         background-color: green;
        //     }
        // }
            .name{
                font-weight: bold;
                .time{
                    color:#959595;
                    font-size: 0.8rem;
                    //margin-bottom:10px;
                    line-height: 30px;
                    font-weight: normal;
                }
            }
            .actions{
                width:100%;
                margin-top: 5px;
                .btn{
                    background-color: transparent;
                    font-size: 0.9rem;
                    color:#757575;
                    margin-left:10%;
                    height:30px;
                }
            }
            .content{
                color:#252525;
            }
            .replys{
                width:100%;
            }
        }
    .v-menu__content{
        box-shadow: none;
        padding:2px 10px 20px 5px;
    }
</style>