<template>
    <v-container id="index" fluid :style="{backgroundColor:theme}" ref='container'>
        <v-row justify="center">
            <v-col cols='12' class="topbar">
                <Topbar />
            </v-col>
            <v-col sm='12' md='11' lg='10' xl='8' class="content-container" >
                <v-row>
                    <v-col xs='12' sm='3' class="sidebar">
                        <Sidebar />
                    </v-col>
                    <v-col xs='12' sm='9' lg='8' xl='7' class="content">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-btn fab class="topBtn" @click="handleScrollTop"><v-icon class="icon">mdi-arrow-up-thick</v-icon></v-btn>
        <div class="side-left" :style="{backgroundColor:theme}" @click="$router.replace('/')" v-ripple>
            <div class="badge" v-show='chatNum'>{{chatNum>99?99:chatNum}}</div>
            <v-icon class="icon">mdi-chevron-double-left</v-icon>
        </div>
    </v-container>
</template>

<script>
import Topbar from './topbar'
import Sidebar from './sidebar'
export default {
    components:{Topbar,Sidebar},
    data(){
        return{
            
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        size(){
            return this.$vuetify.breakpoint.name;
        },
        chatNum(){
            let num=0;
            let chatList=this.$store.state.chatList;
            for(let chat of chatList){
                num+=chat.unreadNum;
            }
            return num+this.$store.state.friendApplyNum+this.$store.state.groupApplyNum;
        },
    },
    methods:{
        handleScrollTop(){
            document.documentElement.scrollTop=0;
        }
    }
}
</script>

<style lang='scss' scoped>
    #index{
        padding: 0;
        margin:0;
        position: relative;
        animation-timing-function: ease-out;
        .row{
            margin:0;
        }
        .topBtn{
            position: fixed;
            bottom: 20px;
            right:20px;
            background-color: #F44336;
            .icon{
                color:#fff;
                font-size: 2rem;
            }
        }
        .topbar{
            padding:0;
            // background-color: red
        }
        .content-container{
            margin-top:70px;
            padding: 20px;
            .sidebar{
                padding:0;
                padding-right: 20px;
            }
            .content{
                //min-width: 850px;
                overflow: hidden;
                padding:20px;
                padding-bottom: 0;
                position: relative;
                border-radius: 10px;
                &::after{
                    position: absolute;
                    content: '';
                    width:100%;
                    height:100%;
                    left:0;
                    top:0;
                    background-color: rgba(0, 0, 0, 0.2);
                    z-index:0;
                }
            }
        }
        .side-left{
            position: fixed;
            width:50px;
            filter: brightness(85%);
            height:100vh;
            top:0;
            display: flex;
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
</style>