<template>
    <div class="file-result elevation-2" v-ripple @click="click">
        <div class="top">
            <div class="avatar">
                <img :src="serverHost+user.avatar" :style="{width:'100%'}" />
            </div>
            <div class="name">{{user.name}}</div>
            <div class="time">{{new Date(data.sendTime).parse()}}</div>
        </div>
        <div class="bottom">
            <v-icon :size='70' class="icon">mdi-file</v-icon>
            <div class="right">
                <div class="file-name">{{content.name}}</div>
                <div class="file-size">{{content.size}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['data','userInfo','serverHost','myInfo'],
    computed:{
        user(){
            if(this.data.from===this.myInfo.id){
                return this.myInfo
            }else return this.userInfo;
        },
        content(){
            try{
                return JSON.parse(this.data.content)
            }catch(err){
                return {name:this.data.content,path:this.data.content,size:'unknow'}
            }
            
        }
    },
    methods:{
        click(){
            window.open(this.serverHost+this.content.path)
        }
    }
}
</script>

<style lang='scss' scoped>
    .file-result{
        padding:15px;
        border-radius: 5px;
        cursor: pointer;
        .top{
            overflow: hidden;
            .avatar{
                width:25px;
                height:25px;
                border-radius: 5px;
                background-color: green;
                float:left;
                overflow: hidden;
            }
            .name{
                float:left;
                margin-left: 10px;
            }
            .time{
                float:right;
            }
        }
        .bottom{
            overflow: hidden;
            .icon{
                float: left;
                margin-left: 20px;
            }
            .right{
                padding-top: 10px;
                .file-name{
                    font-weight: bold;
                    word-break: break-all;
                }
                .file-size{
                    font-size: 0.9rem;
                    color:#757575
                }
            }
        }
    }
</style>