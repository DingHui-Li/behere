<template>
    <div id='search-friend-item'>
        <div v-ripple :style="{flex:1,display:'flex',alignItems:'center'}" @click="goInfo">
            <div class="avatar" >
                <v-img :src='serverHost+data.profilePhoto' :style="{height:'100%'}"></v-img>
            </div>
            <div class="right">
                <div class="remark" v-if='data.remark' v-html="data.remark.highLight(keyword,theme)"></div>
                <div v-else class="name-account">
                    <div class="name" v-html="data.nickName.highLight(keyword,theme)"></div>
                    <div class="account" v-html="data.username.highLight(keyword,theme)"></div>
                </div>
                <!-- <v-checkbox v-if='type==="select"' v-model="select" :color='theme' @click="click"></v-checkbox> -->
            </div>
        </div>
        <v-btn v-if='type==="outlander"' icon class="btn" @click="applyFriend=true"><v-icon>mdi-plus</v-icon></v-btn>
        <ApplyFriend :open='applyFriend' @close='applyFriend=false' :id='this.data.sn' />
    </div>
</template>

<script>
import ApplyFriend from '../applyFriend'
export default {
    components:{ApplyFriend},
    props:['data','type','keyword'],
    computed:{
        serverHost(){
            return this.$store.state.serverHost;
        },
        theme(){
            return this.$store.state.theme;
        }
    },
    data(){
        return{
            applyFriend:false
        }
    },
    methods:{
        goInfo(){
            this.$store.commit('updateOpenFriend',this.data.userSn)
            this.$router.replace('/friends/info')
        }
    }
}
</script>

<style lang='scss' scoped>
    #search-friend-item{
        display: flex;
        align-items: center;
        padding:0px 0;
        .avatar{
            width:40px;
            height:40px;
            border-radius: 50%;
            background-color: green;
            overflow: hidden;
        }
        .right{
            flex:1;
            display: flex;
            cursor: pointer;
            align-items: center;
            .remark{
                font-weight: bold;
                flex: 1;
            }
            .name-account{
                flex:1;
                display: flex;
                flex-direction: column;
                margin-left: 10px;
                .name{
                    font-weight: bold;
                }
                .account{
                    font-size: 0.9rem;
                }
            }
        }
        .btn{
            background-color: #4CAF50;
            color:#fff
        }
    }
</style>