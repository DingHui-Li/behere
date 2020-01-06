<template>
    <div id='chat-container' :style="{backgroundColor:theme}">
        <v-row justify="center" align="center" :style="{height:'100%'}">
            <v-col xs='12' md='10' xl='8'>
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
                                    <v-btn class="name" depressed v-on="on">{{myInfo.name}}<v-icon>mdi-chevron-down</v-icon></v-btn>
                                </template>
                                <div class="menu">
                                    <div class="item" v-ripple @click="logout"><v-icon>mdi-logout</v-icon> 登出</div>
                                </div>
                            </v-menu>
                            <div class="tabs">
                                <div :class="['tab',selectTab.includes('/message')||selectTab==='/'?'select':'']" v-ripple @click="handleClickTab('/message')">
                                    <v-icon>mdi-chat</v-icon> <span>会话</span>
                                    <div v-if='chatListBadge>0' class="badge">{{chatListBadge>=99?99:chatListBadge}}</div>
                                    <div v-else class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',selectTab.includes('/friends')?'select':'']" v-ripple @click="handleClickTab('/friends')">
                                    <v-icon>mdi-pac-man</v-icon> <span>好友</span>
                                    <div v-if='friendListBadge>0' class="badge">{{friendListBadge>=99?99:friendListBadge}}</div>
                                    <div v-else class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',selectTab.includes('/group')?'select':'']" v-ripple @click="handleClickTab('/group')">
                                    <v-icon>mdi-account-group</v-icon> <span>群组</span>
                                    <div class="badge-placeholder"></div>
                                </div>
                                <div :class="['tab',selectTab.includes('/setting')?'select':'']" v-ripple @click="handleClickTab('/setting')">
                                    <v-icon>mdi-settings</v-icon> <span> 设置</span>
                                    <div class="badge-placeholder"></div>
                                </div>
                            </div>
                        </div>
                        <div class="content">
                            <transition :enter-active-class="transition?'animated fadeIn':''" 
                                :leave-active-class="transition?'animated fadeOut':''" mode="out-in">
                                <keep-alive>
                                    <router-view></router-view>
                                </keep-alive>
                            </transition>
                        </div>
                        <div class="side-right" @click="$router.push('/social')" v-ripple>
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
            let data=this.$store.state.chatList;
            for(let i in data){
                num+=data[i].unreadNum
            }
            return num;
        },
        friendListBadge(){
            let num=0;
            let data=this.$store.state.friendApply;
            for(let i in data){
                if(data[i].status==='0'){
                    num++;
                }
            }
            return num;
        },
        lineStatus(){
            return this.$store.state.lineStatus;
        }
    },
    methods:{
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
            height:80vh;
            position: relative;
            border-radius: 10px;
            display: flex;
            padding:20px;
            padding-right: 0;
            overflow: hidden;
            min-width: 1000px;
            min-height: 600px;
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
                border-radius: 5px 0 0 5px;
                overflow: auto;
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
                        }
                        .badge-placeholder{
                            width: 20px;
                            height:20px;
                        }
                    }
                    .select{
                        background-color: rgba(0,0,0,.2);
                    }
                }
            }
            .content{
                background-color: #fff;
                flex: 1;
                position: relative;
                overflow: hidden;
                border-radius: 0 5px 5px 0;
            }
            .side-right{
                width: 50px;
                position: relative;
                .icon{
                    color:#fff;
                    position: absolute;
                    top: 50%;
                    left:50%;
                    transform: translate(-50%,-50%)
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