<template>
    <div>
        <div class="chat-item" v-if='!isMe'>
            <div class="avatar">
                <img :src="serverHost+userInfo.avatar" />
            </div>
            <div class="right">
                <div class="name">{{userInfo.name}}</div>
                <div class="text-container" >
                    <span class="text">{{data.text}}</span>
                </div>
            </div>
        </div>
        <div class="chat-item-me" v-else>
            <div class="right">
                <div class="text-container">
                    <span class="text">
                        {{data.text}}
                    </span>
                </div>
            </div>
            <div class="avatar">
                <img :src="serverHost+userInfo.avatar" />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['data','serverHost','myInfo'],
    computed:{
        userInfo(){
            try{
                return JSON.parse(this.data.user.data.split('%/%')[0]).clientData
            }catch(err){
                return {name:'unknow',avatar:'public/avatar.png',id:-1}
            }
        },
        isMe(){
            return this.myInfo.id===this.userInfo.id
        }
    },
}
</script>

<style lang='scss' scoped>
    .chat-item{
        width: 100%;
        position: relative;
        display: flex;
        padding:0 10px;
        margin:5px 0;
        .avatar{
            width:40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background-color: pink;
            img{
                width: 100%;
            }
        }
        .right{
            margin-left: 5px;
            flex:1;
            margin-right: 50px;
            .name{
                font-size: .9rem;
                color:#757575;
            }
            .text-container{
                padding:5px 10px;
                background-color: #536DFE;
                position: relative;
                border-radius: 5px;
                width: fit-content;
                color:#fff;
                .text{
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                &::before{
                    content: '';
                    position: absolute;
                    left:-13px;
                    top:7px;
                    border:7px solid transparent;
                    border-right-color: #536DFE;
                }
            }
        }
    }
    .chat-item-me{
        width: 100%;
        position: relative;
        display: flex;
        padding:0 10px;
        justify-content: flex-end;
        margin:5px 0;
        .avatar{
            width:40px;
            height: 40px;
            border-radius: 50%;
            overflow: hidden;
            background-color: pink;
            img{
                width: 100%;
            }
        }
        .right{
            flex: 1;
            margin-right: 10px;
            margin-left: 45px;
            position: relative;
            .text-container{
                padding:5px 10px;
                background-color: #009688;
                color:#fff;
                position: relative;
                border-radius: 5px;
                margin-top: 5px;
                width: fit-content;
                float: right;
                .text{
                    white-space: pre-wrap;
                    word-break: break-all;
                }
                &::before{
                    content: '';
                    position: absolute;
                    right:-13px;
                    top:7px;
                    border:7px solid transparent;
                    border-left-color: #009688;
                }
            }
        }
    }
</style>