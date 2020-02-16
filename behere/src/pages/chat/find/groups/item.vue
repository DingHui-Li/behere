<template>
    <div class="groups-item">
        <div class="avatar" :style="{backgroundColor:color?`rgb(${color})`:theme}">
            {{data.topicName.substr(0,1).toUpperCase()}}
        </div>
        <div class="right">
            <div class="name">{{data.topicName}}</div>
            <div class="action">
                <v-btn class="btn" depressed :loading="joing" @click="joinTopic" 
                    :disabled="data.joined||data.currentNum===data.numLimit">
                    <v-icon>mdi-chat</v-icon> 
                {{data.joined?'已加入':'加入聊天'}}({{data.currentNum}}/{{data.numLimit}})
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import ColorThief from 'colorthief'
export default {
    props:['item','theme','serverHost','apiHost'],
    data(){
        return{
            color:null,
            joing:false,//加入中
            data:this.item
        }
    },
    created(){
        this.getColor()
    },
    methods:{
        getColor(){
            if(!this.data.ownerInfo.profilePhoto) return
            const colorThief=new ColorThief();
            this.axios({
                url:this.serverHost+this.data.ownerInfo.profilePhoto,
                responseType:'blob'
            }).then(async res=>{
                let img=new Image();
                img.src=window.URL.createObjectURL(res.data);
                const _this=this
                img.onload=async function(){
                    let color=await colorThief.getColor(this);
                    _this.color=color
                }
            })
        },
        joinTopic(){
            this.joing=true
            this.axios({
                method:'post',
                url:this.apiHost+'/find/joinTopic?topicSn='+this.data.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.data.joined=true
                    this.data.currentNum++
                    this.$emit('snackbar',{text:'加入话题成功',color:'success'})
                }else{
                    this.$emit('snackbar',{text:'加入话题失败',color:'error'})
                }
            }).finally(()=>{
                this.joing=false
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .groups-item{
        display: flex;
        //padding:0 20px;
        align-items: center;
        .avatar{
            width:70px;
            height:70px;
            border-radius: 50%;
            overflow: hidden;
            color:#fff;
            text-align: center;
            line-height: 70px;
            font-weight: bold;
            font-size: 2rem;
        }
        .right{
            flex:1;
            overflow: hidden;
            margin-left: 10px;
            .name{
                font-weight: bold;
                font-size: 1.1rem;
                text-overflow:ellipsis;
                white-space: nowrap;
            }
            .action{
                color:#757575;
                .btn{
                    background-color: transparent;
                    color:#757575
                }
            }
        }
    }
</style>