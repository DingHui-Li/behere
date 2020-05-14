<template>
    <v-container fluid id='topbar'>
        <v-row justify='center' align="center" class='content-container'>
            <v-col md='10' lg='9' xl='8' class="content">
                    <img :src='logo' class="logo" />
                    <v-menu offset-y :closeOnContentClick='true' transition="scroll-y-transition">
                        <template v-slot:activator="{ on }">
                            <div class="user" v-on="on" v-ripple>
                                <div class="avatar">
                                    <img :src="serverHost+myInfo.avatar" :style="{width:'100%'}" />
                                </div>
                                <div class="right">
                                    <div class="name text-truncate">{{myInfo.name}}</div>
                                    <v-icon class="icon">mdi-chevron-down</v-icon>
                                </div>
                            </div>
                        </template>
                        <v-list>
                            <v-list-item v-ripple @click="$router.replace('/social/user/'+myInfo.id)">个人主页</v-list-item>
                            <v-list-item v-ripple @click="logout">登出</v-list-item>
                        </v-list>
                    </v-menu>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import logo from '../../assets/img/logo.png'
// import FriendList from './friendlist'
export default {
    // components:{FriendList},
    data:function(){
        return{
            logo,
        }
    },
    computed:{
        myInfo(){
            return this.$store.state.myInfo
        },
        serverHost(){
            return this.$store.state.serverHost
        },
        apiHost(){
            return this.$store.state.apiHost
        }
    },
    methods:{
        logout(){
            this.$router.replace('/login')
            this.axios({
                method:'get',
                url:this.apiHost+'/user/logout'
            })
        },
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
            overflow: hidden;
            .content{
                height:100%;
                padding:10px;
                overflow: hidden;
                display: flex;
                align-items: center;
                .logo{
                    position: relative;
                    width:100px;
                    height:25px;
                    // top:50%;
                    // transform: translateY(-50%);
                    // float:left;
                }
                .user{
                    width: fit-content;
                    display: flex;
                    align-items: center;
                    margin-left: 50px;
                    cursor: pointer;
                    border-radius: 5px;
                    overflow: hidden;
                    .avatar{
                        width:60px;
                        height:60px;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                    .right{
                        overflow: hidden;
                        .name{
                            font-weight: bold;
                            margin-left: 5px;
                            font-size: 1.1rem;
                            float: left;
                        }
                    }
                }
            }
        }
    }
</style>