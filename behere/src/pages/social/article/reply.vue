<template>
    <div id="reply">
        <div class="avatar-container">
            <v-menu offset-y :closeOnContentClick='false' :openOnHover='true'>
                <template v-slot:activator="{ on }">
                    <div class="avatar"  v-on="on"></div>
                </template>
                <UserInfoCard />
            </v-menu>
        </div>
        <div class="right-container" :style="{color:theme.isBlack()?'#000':theme}">
            <span class="name">任我行</span>
            <span class="text">回复</span>
            <span class="name"> 子木</span>：
            <span class="text">这里是回复，巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉</span>
            <div class="actions">
                <span class="time">13:59</span>
                <v-btn class="btn" depressed @click="openReplyInput=!openReplyInput">回复</v-btn>
            </div>
            <ReplyInput :show='openReplyInput' @hidden='openReplyInput=false'/>
        </div>
    </div>
</template>

<script>
import UserInfoCard from './userInfoCard'
import ReplyInput from './replyInput'
export default {
    components:{UserInfoCard,ReplyInput},
    computed:{
        theme(){
            return this.$store.state.theme;
        },
    },
    data(){
        return{
            openReplyInput:false
        }
    }
}
</script>

<style lang='scss' scoped>
    #reply{
        width:100%;
        position: relative;
        overflow: hidden;
        .avatar-container{
            float: left;
            width:50px;
            .avatar{
                width:35px;
                height:35px;
                background-color: green;
                margin:0 auto;
                border-radius: 50%;
            }
        }
        .right-container{
            position: relative;
            float: right;
            width:calc(100% - 50px);
            font-size: 0.8rem;
            padding-top:8px;
            .name{
                margin-right:5px;
                font-weight: bold;
            }
            .text{
                color:#252525;
            }
            .actions{
                width:100%;
                margin-top: 5px;
                .time{
                    font-weight: normal;
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
        }
    }
    .v-menu__content{
        box-shadow: none;
        padding:2px 10px 20px 5px;
    }
</style>