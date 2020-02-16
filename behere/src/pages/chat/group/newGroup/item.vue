<template>
    <div id='item'>
        <div class="time" :style="{backgroundColor:theme}">{{new Date(data.sendTime).parse()}}</div>
        <div class="content">
            <div class="avatar" v-ripple @click='toInfo'>
                <img :src="serverHost+data.profilePhoto" :style="{width:'100%'}" />
            </div>
            <div class="right">
                <div class="name">
                    <span @click="toInfo">{{data.nickName}} </span> 
                    <span class="tip">{{data.type==='sys_group_add'?'请求加入':'邀请你进入'}}</span> 
                    <span @click="goGroupInfo"> {{data.chatGroup?data.chatGroup.groupName:'unknow'}}</span>
                </div>
                <div class="msg"><span class="tip">验证信息：</span> {{data.content}}</div>
            </div>
            <div class="actions" v-if='data.status==="0"||data.status==="1"'>
                <v-btn icon large class="disagree" @click="handleAction(3)"><v-icon class="icon">mdi-cancel</v-icon></v-btn>
                <v-btn icon large class="agree" @click="handleAction(2)"><v-icon class="icon">mdi-check</v-icon></v-btn>
            </div>
            <div v-else class="actions">
                <v-btn icon large class="disagree" v-if='data.status==="3"' disabled><v-icon class="icon">mdi-cancel</v-icon></v-btn>
                <v-btn icon large class="agree" v-else-if='data.status==="2"' disabled><v-icon class="icon">mdi-check</v-icon></v-btn>
                <v-btn large class="agree" disabled v-else-if='data.status==="4"'>已过期</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['theme','data','apiHost','serverHost'],
    methods:{
        toInfo(){
            this.$store.commit('updateOpenFriend',this.data.from);
            this.$router.push('/friends/info')
        },
        goGroupInfo(){
            if(!this.data.chatGroup) return;
            this.$router.push('/group/info/'+this.data.groupSn)
        },
        handleAction(status){
            this.data.status=status+'';
            let url='/chat/admitChatGroupInvite';
            if(this.data.type==='sys_group_add'){
                url='/chat/admitChatGroup'
            }
            this.axios({
                method:'post',
                url:this.apiHost+`${url}?chatGroupSn=${this.data.groupSn}&contactSn=${this.data.from}&messageSn=${this.data.sn}&status=${status}`
            }).then(res=>{
                if(res.data.code!=='10000'){
                    this.data.status='0'
                    this.$emit('error','操作失败')
                }else{
                    if(this.data.type==='sys_group_invite'){
                        this.$store.commit('setUpdateGroups',true);
                    }
                    this.$emit('success',`已${status===2?'同意':'拒绝'}${this.data.nickName}的${this.data.type==='sys_group_add'?'入群申请':'邀请'}`)
                }
            }).catch(()=>{
                this.data.status='0'
                this.$emit('error','操作失败')
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    #item{
        .time{
            width:fit-content;
            padding:2px 10px;
            border-radius: 20px;
            font-size: 0.8rem;
            color:#fff;
            margin:0 auto;
            margin-top: 20px;
        }
        .content{
            margin-top: 10px;
            padding:20px;
            border-radius: 10px;
            overflow: hidden;
            display: flex;
            align-items: center;
            border:1px solid #e0e0e0;
            .avatar{
                width:50px;
                height:50px;
                border-radius: 50%;
                overflow: hidden;
            }
            .right{
                flex:1;
                margin:0 10px;
                overflow: hidden;
                .name{
                    font-weight: bold;
                    white-space: wrap;
                    cursor: pointer;
                }
                .tip{
                    color:#959595;
                    font-size: 0.9rem;
                    font-weight: normal;
                }
            }
            .actions{
                .icon{
                    color:#fff
                }
                .agree{
                    background-color: #4CAF50;
                }
                .disagree{
                    background-color:#FF5252;
                    margin-right: 10px;
                }
            }
        }
    }
</style>