<template>
    <div id='alert-friend-apply' class="elevation-5" 
        :style="{backgroundColor:theme,color:theme.isBlack()?'#000':'#fff',top:index*150+40+'px'}" 
        v-ripple @click="handleAction">
        <div :style="{display:'flex',padding:'10px'}" >
            <div class="avatar" @click.stop="toInfo">
                <v-img :src='serverHost+data.profilePhoto'></v-img>
            </div>
            <div class="content">
                <div class="top">{{data.nickName}} <span v-if='data.type==="sys_personal_add"'>请求添加您为好友</span>
                    <v-btn icon :style="{float:'right'}" @click="$store.commit('removeAlterFriendApply',index)"><v-icon>mdi-notification-clear-all</v-icon></v-btn>
                </div>
                <div class="text">{{data.content}}</div>
            </div>
        </div>
        <div :style="{float:'right',marginRight:'10px',color:'#959595'}">{{duration}}s</div>
    </div>
</template>

<script>
export default {
    props:['index','data'],
    data(){
        return{
            duration:10
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        apiHost(){
            return this.$store.state.apiHost;
        }
    },
    mounted(){
        let interval=setInterval(()=>{
            this.duration-=1;
            if(this.duration<=0){
                clearInterval(interval);
                this.$store.commit('removeAlterFriendApply',this.index)
            }
        },1000)
    },
    methods:{
        toInfo(){
            this.$store.commit('updateOpenFriend',this.data.from);
            this.$router.replace('/friends/info')
            this.$store.commit('removeAlterFriendApply',this.index)
        },
        handleAction(){
            if(this.data.type==='sys_personal_add'){
                this.$router.push('/friends/new')
            }else{
                this.$router.push('/group/new')
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #alert-friend-apply{
        position: fixed;
        border-radius: 5px;
        animation-duration: .5s;
        right:20px;
        top:20px;
        width: 300px;
        z-index: 999;
        cursor: pointer;
        .avatar{
            width:40px;
            height: 40px;
            border-radius: 50%;
            background-color:green;
            overflow: hidden;
            margin-right: 10px;
        }
        .content{
            flex:1;
            .top{
                overflow: hidden;
                display: inline;
                vertical-align: middle;
                font-weight: bold;
            }
            .text{
                overflow:hidden;
                white-space: nowrap;
            }
        }
        .actions{
            display: flex;
            padding: 10px;
            padding-bottom: 0;
            justify-content:space-evenly;
            .btn{
                color:#fff;
            }
        }
    }
</style>