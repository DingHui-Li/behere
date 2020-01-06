<template>
    <div id="comment" :style="{paddingLeft:size==='xs'?'0':'60px'}">
        <div class="avatar-container">
            <v-menu offset-y :closeOnContentClick='false' :openOnHover='true'>
                <template v-slot:activator="{ on }">
                    <div class="avatar" v-on="on"></div>
                </template>
                <UserInfoCard />
            </v-menu>
        </div>
        <div class="right-container">
            <div class="name" :style="{color:theme.isBlack()?'#000':theme}">子木</div>
            <div class="content">这里是评论内容，巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉</div>
            <div class="actions">
                <span class="time">13:59</span>
                <v-btn class="btn" depressed @click="openReplyInput=!openReplyInput">回复</v-btn>
            </div>
            <ReplyInput :show='openReplyInput' @hidden='openReplyInput=false'/>
            <div class="replys">
                <Reply />
            </div>
        </div>
    </div>
</template>

<script>
import Reply from './reply'
import UserInfoCard from './userInfoCard'
import ReplyInput from './replyInput'
export default {
    components:{Reply,UserInfoCard,ReplyInput},
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        size(){
            return this.$vuetify.breakpoint.name;
        }
    },
    data(){
        return{
            openReplyInput:false
        }
    }
}
</script>

<style lang='scss' scoped>
    #comment{
        width:100%;
        height:100%;
        position: relative;
        padding-right:20px;
        overflow: hidden;
        .avatar-container{
            float:left;
            width:60px;
            height:100%;
            .avatar{
                width:40px;
                height:40px;
                border-radius: 50%;
                margin:0 auto;
                background-color: green;
            }
        }
        .right-container{
            float:right;
            width:calc(100% - 60px);
            height:100%;
            .name{
                font-weight: bold;
                font-size: 0.9rem;
                color:#303F9F;
                filter: brightness(.8);
            }
            .actions{
                width:100%;
                margin-top: 5px;
                .time{
                    color:#959595;
                    font-size: 0.8rem;
                    margin-bottom:10px;
                    line-height: 30px;
                }
                .btn{
                    background-color: transparent;
                    font-size: 0.8rem;
                    color:#757575;
                    margin-left:10%;
                    height:30px;
                }
            }
            .content{
                font-size: 0.8rem;
                color:#252525;
            }
            .replys{
                width:100%;
            }
        }
    }
    .v-menu__content{
        box-shadow: none;
        padding:2px 10px 20px 5px;
    }
</style>