<template>
    <div id='history-item' v-ripple>
        <div class="avatar">
            <img :src="serverHost+user.avatar" :style="{width:'100%'}" />
        </div>
        <div class="right">
            <div class="top">
                <div class="name">{{user.name}}</div>
                <div class="time">{{new Date(data.sendTime).parse()}}</div>
            </div>
            <div class="content">
                <div v-html='data.content.highLight(keyword,theme)' class='text'></div>
            </div>
        </div>
    </div>
</template>
<script>

export default {
    props:['type','data','userInfo','theme','keyword','serverHost','myInfo'],
    computed:{
        user(){
            if(this.data.from===this.myInfo.id){
                return this.myInfo
            }else return this.userInfo;
        }
    }
}
</script>

<style lang='scss' scoped>
    #history-item{
        position: relative;
        display: flex;
        padding:5px;
        cursor: pointer;
        .avatar{
            width:40px;
            height:40px;
            border-radius: 50%;
            background-color: green;
            overflow: hidden;
        }
        .right{
            flex:1;
            margin-left: 5px;
            border-bottom: 1px solid #e0e0e0;
            overflow: hidden;
            padding-bottom: 10px;
            .top{
                overflow: hidden;
                .name{
                    font-weight: bold;
                    float: left;
                }
                .time{
                    font-size: 0.8rem;
                    float: right;
                }
            }
            .content{
                .text{
                    word-break: break-all;
                }
            }
        }
    }
</style>