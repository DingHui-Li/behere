<template>
    <div id='media-request' class="elevation-5" :style="{backgroundColor:theme,color:theme.isBlack()?'#000':'#fff'}">
        <v-btn icon fab small class="closebtn" @click="$store.commit('removeMediaReq')">
            <v-icon :style="{color:theme.isBlack()?'#000':'#fff'}">mdi-notification-clear-all</v-icon>
        </v-btn>
        <div class="top">
            <div class="avatar">
                <img :src="serverHost+userInfo.profilePhoto" :style="{width:'100%'}">
            </div>
            <div class="tip">{{userInfo.remark?userInfo.remark:userInfo.nickName}}邀请你<span>{{data.type==='callVideo'?'视频':'语音'}}</span>聊天</div>
        </div>
        <div :style="{textAlign:'center'}">
            <v-icon size='60' :style="{color:theme.isBlack()?'#000':'#fff'}">{{data.type==='callVideo'?'mdi-camera-outline':'mdi-microphone-outline'}}</v-icon>
        </div>
        <div class="actions">
            <v-btn small depressed :style="{backgroundColor:'#FF5252',color:'#fff'}" @click="action('reject')"><v-icon>mdi-close</v-icon>拒绝</v-btn>
            <v-btn small depressed :style="{backgroundColor:'#388E3C',color:'#fff'}" @click="action('agree')"><v-icon>mdi-check</v-icon>接听</v-btn>
        </div>
    </div>
</template>

<script>
export default {
    props:['data'],
    computed:{
        theme(){
            return this.$store.state.theme
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        userInfo(){
            let friends=this.$store.state.friendList;
            let userSn=this.data.from;
            for(let i in friends){
                if(friends[i].userSn===userSn){
                    return friends[i]
                }
            }
            return '';
        }
    },
    methods:{
        action(act){
            this.$store.commit('removeMediaReq');
            if(act==='agree'){
                this.data.open=true;
                this.data.userSn=this.data.from;
                this.data.receiver=true;
                this.$store.commit('openCall',this.data);
            }else{
                this.$store.state.ws.send(JSON.stringify({
                    content:{act:'reject'},
                    from:this.data.to,
                    to:this.data.from,
                    type:'rtc'
                }));
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #media-request{
        position: fixed;
        padding:20px;
        border-radius: 5px;
        animation-duration: .5s;
        right:20px;
        top:20px;
        width: 300px;
        z-index: 999;
        .closebtn{
            float: right;
        }
        .top{
            overflow: hidden;
            .avatar{
                float: left;
                width:40px;
                height:40px;
                border-radius: 50%;
                background-color: green;
                overflow: hidden;
            }
            .tip{
                line-height: 40px;
                padding-left: 50px;
            }
        }
        .actions{
            display: flex;
            margin-top: 10px;
            justify-content: space-evenly;
        }
    }
</style>