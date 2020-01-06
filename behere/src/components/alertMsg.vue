<template>
    <div id='alert-msg' class="elevation-10" :style="{backgroundColor:theme,color:theme.isBlack()?'#000':'#fff',top:index*110+20+'px'}">
        <div :style="{overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'space-between'}">
            <div class="avatar"></div>
            <div class="right">
                <div :style="{overflow:'hidden',display:'flex',alignItems:'center',justifyContent:'space-between'}">
                    <div class="name">好友名</div>
                    <v-btn class="clear" icon @click="$store.commit('removeAlertMsg',index)"><v-icon>mdi-notification-clear-all</v-icon></v-btn>
                </div>
            </div>
        </div>
        <div class="content">
            <span v-if='data.type==="img"'>[图片]</span>
            <span v-else-if='data.type==="voice"'>[语音]</span>
            <span v-if='data.type==="file"'>[文件]</span>
            <span v-else>{{data.content}}</span>
        </div>
        <div class="duration">{{this.duration}}s</div>
    </div>
</template>

<script>
export default {
    props:['data','index'],
    computed:{
        theme(){
            return this.$store.state.theme
        }
    },
    data(){
        return{
            duration:10,//持续时长
        }
    },
    mounted(){
        let interval=setInterval(()=>{
            this.duration-=1;
            if(this.duration<=0){
                clearInterval(interval);
                this.$store.commit('removeAlertMsg',this.index);
            }
        },1000)
    }
}
</script>

<style lang='scss' scoped>
    #alert-msg{
        position: fixed;
        padding:10px;
        border-radius: 5px;
        animation-duration: .5s;
        right:20px;
        top:20px;
        width: 300px;
        z-index: 999;
        display: flex;
        flex-direction: column;
        .avatar{
            width:40px;
            height:40px;
            border-radius: 50%;
            background-color: green;
        }
        .right{
            margin-left: 10px;
            flex:1;
        }
        .content{
            margin-left: 50px;
            white-space: nowrap;
            font-size: 1rem;
            overflow: hidden;
        }
        .duration{
            text-align:right;
            font-size:0.8rem;
            filter:brightness(85%)
        }
    }
</style>