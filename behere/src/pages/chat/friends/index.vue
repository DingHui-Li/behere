<template>
    <div id='friends-container'>
        <div class="friends">
            <Search />
            <div class="new-friend" v-ripple @click="$router.replace('/friends');$router.replace('/friends/new')">
                <div class="bg" :style="{backgroundColor:theme}"></div>
                <v-icon class="icon">mdi-account-plus</v-icon>
                <span>新的朋友</span>
                <div class="badge" v-if='badge>0'>{{badge>99?99:badge}}</div>
                <v-icon :style="{float:'right'}" class="icon">mdi-chevron-right</v-icon>
            </div>
            <!-- <FriendItem v-for='friend in friendList' :key='friend.userSn' :data='friend' :id='openFriend'/> -->
            <v-expansion-panels accordion :value='0'>
                <v-expansion-panel v-for='item in data' :key='item.sn' >  
                    <GroupItem :item='item' />
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
        <div class="content" ref='content'>
                <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
                    <router-view :style="{padding:0}"></router-view>
                </transition>
        </div>
    </div>
</template>

<script>
// import FriendItem from './friendItem'
import Search from '../components/search/'
import GroupItem from './groupItem'
export default {
    components:{Search,GroupItem},
    data(){
        return{
            data:[]
        }
    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost
        },
        friendList(){
            return this.$store.state.friendList;
        },
        openFriend(){
            return this.$store.state.openFriend;
        },
        theme(){
            return this.$store.state.theme;
        },
        friendGroup(){
            return this.$store.state.friendGroup;
        },
        badge(){
            return this.$store.state.friendApplyNum;
        }
    },
    mounted(){
        this.friend2group();
    },
    methods:{
        friend2group(){//把好友放到相应的分组
            this.data=[]
            this.$nextTick(()=>{
                let data=this.friendGroup; 
                for(let i in data){
                    data[i].friends=[];
                }
                for(let i in this.friendList){
                        for(let j in data){
                            if(data[j].sn===this.friendList[i].groupSn){
                                data[j].friends.push(this.friendList[i])
                            }
                        }
                    }
                this.data=data;
            })
        },
    },
    watch:{
        friendList:{
            handler(){
                console.log('updateFriendList')
                this.friend2group();
            },
            deep:true
        },
        friendGroup(){
            this.friend2group();
        },
    }
}
</script>

<style lang='scss' scoped>
    #friends-container{
        width:100%;
        height:100%;
        display: flex;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        background-color: #fff;
        border-radius: 0 20px 20px 0;
        .new-friend{
            padding:10px 23px;
            overflow: hidden;
            border-radius: 5px;
            color:#fff;
            position: relative;
            display: flex;
            justify-content: space-around;
            cursor: pointer;
            .bg{
                position: absolute;
                width: 100%;
                height:100%;
                top:0;
                left:0;
                z-index: -1;
                opacity: .7;
            }
            .icon{
                color:#fff;
            }
            span{
                margin-left: 10px;
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
            }
        }
        .friends{
            flex:4;
            height:100%;
            position: relative;
            z-index: 99;
            background-color: #fff;
            .chats{
                height:500px;
                overflow-y:scroll;
                position:relative
            }
        }
        .content{
            flex:9;
            position: relative;
        }
    }
    .v-expansion-panel::before{
        box-shadow: none
    }
    .v-item-group, .v-expansion-panels,.v-expansion-panels--accordion{
        height:auto !important;
        max-height: 100% !important;
    }
</style>