<template>
    <v-container fluid id='topbar'>
        <v-row justify='center' align="center" class='content-container'>
            <v-col md='10' lg='9' xl='8' class="content">
                <v-row>
                    <v-col sm='2' class="d-none d-sm-flex logo-container">
                        <img :src='logo' class="logo" />
                    </v-col>
                    <v-col xs='12' sm='5' md='4' lg='4' class="user-container" ref='userContainer'>
                        <v-menu offset-y :closeOnContentClick='false' :closeOnClick='!friendListStatus.lock' v-model="friendListStatus.open" transition="scroll-y-transition">
                            <template v-slot:activator="{ on }">
                                <div class="user" v-on="on">
                                    <v-icon class="lock" v-if='friendListStatus.open&&friendListStatus.lock' @click.stop='handleLock(false)'>mdi-lock</v-icon>
                                    <v-icon class="lock" v-if='friendListStatus.open&&!friendListStatus.lock' @click.stop='handleLock(true)'>mdi-lock-open-variant</v-icon>
                                    <div class="avatar" v-ripple></div>
                                    <div class="infos d-none d-sm-flex">
                                        <div class="name text-truncate">任我行</div>
                                        <div class="sign text-truncate">任我行</div>
                                    </div>
                                </div>
                            </template>
                            <div class="friend-list" :style="{width:friendListWidth}">
                                <FriendList />
                            </div>
                        </v-menu>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import logo from '../../assets/img/logo.png'
import FriendList from './friendlist'
export default {
    components:{FriendList},
    data:function(){
        return{
            logo,
            friendListWidth:'200px',//好友列表宽度（与顶栏部分一致）
            friendListStatus:{//好友列表状态
                open:false,
                lock:false
            },
            color:''
        }
    },
    mounted(){
        this.friendListWidth=this.$refs.userContainer.clientWidth+'px'
    },
    methods:{
        handleLock(status){
            this.friendListStatus.lock=status;
        },
    },
    watch:{
    }
}
</script>

<style lang="scss">
    .v-expansion-panel::before{
        box-shadow: none !important;
    }
    #topbar{
        width:100%;
        padding: 0;
        margin:0;
        height:70px;
        left:0;
        right:0;
        z-index: 99;
        background-color: #fff;
        position: fixed;
        .row{
            height:100%;
            margin:0;
            padding:0;
        }
        .content-container{
            height:100%;
            box-shadow: 0 2px 3px 1px rgba(0,0,0,.2);
            .content{
                height:100%;
                padding:10px;
                .col{
                    padding:0 !important;
                }
                .logo-container{
                    height: 100%;
                    .logo{
                        position: relative;
                        width:100px;
                        height:25px;
                        top:50%;
                        transform: translateY(-50%);
                        float:left;
                    }
                }
                .user-container{
                    position: relative;
                    height:100%;
                    overflow: hidden;
                    .user{
                        position: relative;
                        width: 100%;
                        height:100%;
                        //padding:0 20px;
                        &:hover{
                            cursor: pointer
                        }
                        .lock{
                            position: absolute;
                            top:0px;
                            right:25px;
                            z-index: 10;
                            font-size: 1.2rem;
                        }
                        .avatar{
                            float: left;
                            margin-left:10px;
                            width:50px;
                            height: 50px;
                            border-radius: 50%;
                            background-color: green;
                        }
                        .infos{
                            position: relative;
                            float: left;
                            height: 100%;
                            margin-left:10px;
                            .name{
                                font-weight: bold;
                                color:#d49b1d;
                                padding-top:5px;
                            }
                            .sign{
                                position: absolute;
                                bottom:0;
                                font-size: 0.8rem;
                                color:#959595
                            }
                        }
                    }
                }
            }
        }
    }
    .friend-list{
        position: relative;
    }
</style>