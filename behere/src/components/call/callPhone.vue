<template>
    <VueDragResize id='container' :isResizable='false' parentLimitation :w='300' :h='400' :x='100' :y='100' :z='999' class="elevation-7"> 
        <div class="call-phone">
            <v-img :src="serverHost+userInfo.profilePhoto" alt="" class="bg" />
            <div class="info-container">
                <div class="avatar">
                    <v-img :src='serverHost+userInfo.profilePhoto' />
                </div>
                <div class="name">{{userInfo.remark?userInfo.remark:userInfo.nickName}}</div>
                <hollow-dots-spinner v-if='connectStatus!=="connected"'
                    :animation-duration="1500"
                    :dot-size="10"
                    :dots-num="3"
                    color="#000"
                    />
                <div v-if='connectStatus==="connected"' :style="{textAlign:'center'}">
                    正在通话
                    <div>
                        {{duration}}s
                    </div>
                </div>
            </div>
            <div class="actions">
                <v-btn icon fab  class="btn hangup" @click="$emit('hangup')"><v-icon>mdi-phone-hangup-outline</v-icon></v-btn>
            </div>
            <audio ref='otherAudio' :style="{display:'none'}" autoplay></audio>
        </div>
    </VueDragResize>
</template>

<script>
import VueDragResize from 'vue-drag-resize'
import { HollowDotsSpinner } from 'epic-spinners'
export default {
    components:{VueDragResize,HollowDotsSpinner},
    props:['otherStream','connectStatus','call','userInfo'],
    computed:{
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    data(){
        return{
            duration:0
        }
    },
    mounted(){
        this.$refs.otherAudio.srcObject=this.otherStream;
    },
    watch:{
        otherStream(newVal){
            this.$refs.otherAudio.srcObject=newVal;
        },
        connectStatus(newVal){
            if(newVal==='connected'){
                setInterval(()=>{
                    this.duration++;
                },1000)
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #container{
        position: fixed;
        border-radius: 5px;
        overflow: hidden;
        background-color: #fff;
        animation-duration: .5s;
        .call-phone{
            width:100%;
            height:100%;
            display: flex;
            flex-direction: column;                                                                                                                                                                                                                                                                                                                       
        }
        .bg{
            width:100%;
            position: absolute;
            filter: blur(10px);
            top:0;
            z-index: -1;
            transform: scale(1.8)
        }
        .info-container{
            flex:2;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            .avatar{
                width:80px;
                height:80px;
                border-radius: 50%;
                overflow: hidden;
            }
            .name{
                font-weight: bold;
                text-align: center;
                font-size: 1.2rem;
                margin: 10px 0;
            }
        }
        .actions{
            flex:1;
            display: flex;
            align-items: center;
            justify-content: center;
            .btn{
                background-color: rgba(255,255,255,.3);
                color:#000
            }
            .hangup{
                background-color: red;
                color:#fff;
            }
        }
        
    }
</style>