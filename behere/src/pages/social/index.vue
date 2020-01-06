<template>
    <v-container id="index" fluid :style="{backgroundColor:theme}" ref='container'>
        <v-row justify="center">
            <v-col cols='12' class="topbar">
                <Topbar />
            </v-col>
            <v-col sm='12' md='11' lg='10' xl='8' class="content-container" >
                <v-row>
                    <v-col xs='12' sm='3' class="sidebar" :style="{padding:size==='xs'?'0':'12px'}">
                        <Sidebar />
                    </v-col>
                    <v-col xs='12' sm='9' class="content" :style="{padding:size==='xs'?'0':'12px'}">
                        <Content />
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <v-btn fab class="topBtn" @click="handleScrollTop"><v-icon class="icon">mdi-arrow-up-thick</v-icon></v-btn>
        <div class="side-left" :style="{backgroundColor:theme}" @click="$router.back()" v-ripple>
            <v-icon class="icon">mdi-chevron-double-left</v-icon>
        </div>
    </v-container>
</template>

<script>
import Topbar from './topbar'
import Sidebar from './sidebar'
import Content from './content'
export default {
    components:{Topbar,Sidebar,Content},
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
        }
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
            padding: 0;
        }
        .side-left{
            position: fixed;
            width:50px;
            filter: brightness(85%);
            height:100vh;
            top:0;
            .icon{
                color:#fff;
                position: absolute;
                top: 50%;
                left:50%;
                transform: translate(-50%,-50%)
            }
        }
    }
</style>