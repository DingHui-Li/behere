<template>
    <div id='chat-container' :style="{backgroundColor:theme}">
        <v-row justify="center" align="center" :style="{height:'100%',padding:'0'}">
            <v-col xs='12' md='10' lg='9' :style="{padding:0}">
                <div class="panel" >
                        <div class="background" :style="{backgroundColor:theme}"></div>
                        <div class="side-left">
                            <div class="avatar-container">
                                <div class="avatar elevation-5" v-ripple @click="toInfo" :style="{backgroundColor:theme}">
                                    <v-img :src='serverHost+avatar' :style="{height:'100%'}"></v-img>
                                </div>
                                <div class="lineStatus" :style="{backgroundColor:lineStatus?'#4CAF50':'#F44336'}"></div>
                            </div>
                            <v-menu>
                                <template v-slot:activator="{ on }">
                                    <v-btn class="name" depressed v-on="on">
                                        <span class="text">{{myInfo.name}}</span>
                                        <v-icon>mdi-chevron-down</v-icon>
                                    </v-btn>
                                </template>
                                <div class="menu">
                                    <div class="item" v-ripple @click="logout"><v-icon>mdi-logout</v-icon> 登出</div>
                                </div>
                            </v-menu>
                            <div class="tabs">
                                <div :class="['tab',isSelected('/message')||selectTab==='/'?'select':'']" v-ripple @click="handleClickTab('/message')">
                                    <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
                                        <div class="selected" :style="{backgroundColor:theme}" v-if="isSelected('/message')||selectTab==='/'"></div>
                                    </transition>
                                    <v-icon class="icon">mdi-chat</v-icon> 
                                    <span>会话</span>
                                    <div v-if='chatListBadge>0' class="badge">{{chatListBadge>=99?99:chatListBadge}}</div>
                                    <div v-else class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',isSelected('/friends')?'select':'']" v-ripple @click="handleClickTab('/friends')">
                                    <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
                                        <div class="selected" :style="{backgroundColor:theme}" v-if="isSelected('/friends')"></div>
                                    </transition>
                                    <v-icon class="icon">mdi-pac-man</v-icon> <span>好友</span>
                                    <div v-if='friendListBadge>0' class="badge">{{friendListBadge>=99?99:friendListBadge}}</div>
                                    <div v-else class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',isSelected('/group')?'select':'']" v-ripple @click="handleClickTab('/group')">
                                    <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
                                        <div class="selected" :style="{backgroundColor:theme}" v-if="isSelected('/group')"></div>
                                    </transition>
                                    <v-icon class="icon">mdi-account-group</v-icon> <span>群组</span>
                                    <div v-if='groupApplyNum' class="badge">{{groupApplyNum>=99?99:groupApplyNum}}</div>
                                    <div v-else class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',selectTab.includes('/find')?'select':'']" v-ripple @click="handleClickTab('/find')">
                                    <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
                                        <div class="selected" :style="{backgroundColor:theme}" v-if="isSelected('/find')"></div>
                                    </transition>
                                    <v-icon class="icon">mdi-compass</v-icon> <span>发现</span>
                                    <div class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',isSelected('/setting')?'select':'']" v-ripple @click="handleClickTab('/setting')">
                                    <transition enter-active-class="animated slideInLeft" leave-active-class="animated slideOutLeft">
                                        <div class="selected" :style="{backgroundColor:theme}" v-if="isSelected('/setting')"></div>
                                    </transition>
                                    <v-icon class="icon">mdi-settings</v-icon> <span> 设置</span>
                                    <div class="badge-placeholder"></div>
                                </div>
                            </div>
                        </div>
                        <div class="content" >
                            <transition :enter-active-class="transition?'animated slideInLeft':''" 
                                :leave-active-class="transition?'animated slideOutLeft':''" mode="out-in">
                                <keep-alive>
                                    <router-view></router-view>
                                </keep-alive>
                            </transition>
                        </div>
                        <div class="side-right" @click="$router.push('/social')" v-ripple>
                            <div class="badge" v-show='socialNum'>{{socialNum>99?99:socialNum}}</div>
                            <v-icon class="icon">mdi-chevron-double-right</v-icon>
                        </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selectTab:this.$route.path,
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme
        },
        transition(){
            return this.$store.state.transition;
        },
        myInfo(){
            return this.$store.state.myInfo;
        },
        avatar(){
            if(!this.myInfo.avatar) return '/public/avatar.png'
            else return this.myInfo.avatar
        },
        serverHost(){
            return this.$store.state.serverHost
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        chatListBadge(){
            let num=0;
            let chatList=this.$store.state.chatList;
            for(let chat of chatList){
                num+=chat.unreadNum;
            }
            return num;
        },
        friendListBadge(){
            return this.$store.state.friendApplyNum;
        },
        lineStatus(){
            return this.$store.state.lineStatus;
        },
        socialNum(){
            return this.$store.state.socialNum
        },
        groupApplyNum(){
            return this.$store.state.groupApplyNum
        }
    },
    methods:{
        isSelected(path){
            return this.selectTab.includes(path)
        },
        handleClickTab(router){
            this.$router.push(router);
            this.selectTab=router;
        },
        logout(){
            this.$router.replace('/login')
            this.axios({
                method:'get',
                url:this.apiHost+'/user/logout'
            })
        },
        toInfo(){//去资料页面
            this.$router.replace('/friends/info')
            this.$store.commit('updateOpenFriend',this.myInfo.id);
        }
    },
    mounted(){
        console.log(this.$store.state.ws)
    },
    watch:{
        '$route'(route,from){
            if(from.path==='/login'){
                window.location.reload(); 
            }
            this.selectTab=route.path
        }
    }
}
</script>

<style lang='scss' scoped>  
    #chat-container{
        width: 100vw;
        height:100vh;
        position: fixed; 
        .panel{
            height:90vh;
            // width:100vw;
            position: relative;
            border-radius: 30px;
            display: flex;
            padding:20px;
            padding-right: 0;
            overflow: hidden;
            top:0;
            left:0;
            min-width: 1000px;
            min-height: 700px;
            .background{
                position: absolute;
                width:100%;
                height:100%;
                left:0;
                top:0;
                filter: brightness(85%);
            }
            .side-left{
                position: relative;
                background-color:#fff;
                border-radius: 20px 0 0 20px;
                overflow: auto;
                overflow: hidden;
                .avatar-container{
                    position: relative;
                    margin: 20px 50px;
                    .avatar{
                        width:90px;
                        height:90px;
                        border-radius: 50%;
                        background-color: green;
                        overflow: hidden;
                    }
                    .lineStatus{
                        width:20px;
                        height:20px;
                        border-radius: 50%;
                        position: absolute;
                        right:0;
                        top:0;
                    }
                }
                .name{
                    font-weight: bold;
                    background-color: #fff;
                    width:100%;
                    overflow: hidden;
                    .text{
                        max-width: 100px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }
                .tabs{
                    width:100%;
                    margin-top:20px;
                    .tab{
                        padding:10px;
                        padding-left: 20px;
                        font-weight: bold;
                        font-size: 1.1rem;
                        color: #454545;
                        margin-bottom: 10px;
                        background-color: #fff;
                        cursor: pointer;
                        transition: all .4s;
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        border-radius: 0 30px 30px 0;
                        overflow: hidden;
                        position: relative;
                        .selected{
                            position: absolute;
                            width: 100%;
                            height:100%;
                            top:0;
                            left:0;
                            z-index: 0;
                            animation-duration: .5s;
                        }
                        span,.icon{
                            z-index: 1;
                            color:inherit;
                            //transition: color .2s;
                        }
                        .badge{
                            width: 20px;
                            height:20px;
                            border-radius: 50%;
                            background-color: red;
                            font-size: 0.7rem;
                            color:#fff;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            z-index: 1;
                        }
                        .badge-placeholder{
                            width: 20px;
                            height:20px;
                        }
                    }
                    .select{
                        color:#fff;
                    }
                }
            }
            .content{
                flex: 1;
                position: relative;
                overflow: hidden;
                border-radius: 0 20px 20px 0;
            }
            .side-right{
                width: 50px;
                position: relative;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                .badge{
                    width:25px;
                    height:25px;
                    background-color: red;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 25px;
                    font-size: 0.8rem;
                    color:#fff;
                }
                .icon{
                    color:#fff;
                }
            }
        }
    }
    .menu{
        background-color: #fff;
        .item{
            padding:10px 20px;
            cursor: pointer;
        }
    }
</style>