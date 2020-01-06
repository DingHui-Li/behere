<template>
    <div class="item" >
        <div class="avatar" :style="{backgroundColor:theme}" v-ripple @click="toInfo(apply.from)">
            <img :src="serverHost+apply.profilePhoto" :style="{width:'100%'}">
        </div>
        <div class="mid">
            <div class="name">{{apply.nickName}}</div>
            <div class="text">{{apply.content}}</div>
        </div>
        <div class="actions" v-if='apply.status==="0"'>
            <v-menu>
                <template v-slot:activator='{on}'>
                    <v-btn icon large v-on='on' :style="{backgroundColor:'#4CAF50'}" class="btn"><v-icon>mdi-check</v-icon></v-btn>
                </template>
                <div class="select-group">
                    <div class="tip">选择添加到分组</div>
                    <div class="group-item" v-for="group in friendGroup" :key='group.sn' 
                        v-ripple @click="action(apply.from,apply.sn,1,group.sn)">
                        {{group.groupName}}
                    </div>
                </div>
            </v-menu>
            <v-btn icon large :style="{backgroundColor:'#FF5252'}" class="btn" @click="action(apply.from,apply.sn,2)"><v-icon>mdi-cancel</v-icon></v-btn>
        </div>
        <div class="status" v-else>
            <v-btn icon large :style="{backgroundColor:'#4CAF50'}" class="btn" disabled v-if='apply.status==="1"'><v-icon>mdi-check</v-icon></v-btn>
            <v-btn icon large :style="{backgroundColor:'#FF5252'}" class="btn" disabled v-else-if='apply.status==="2"'><v-icon>mdi-cancel</v-icon></v-btn>
            <v-btn depressed disabled class="btn" v-else>已过期</v-btn>
        </div>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn @click="snackbar.open=false" icon :style="{backgrondColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    props:['apply','index'],
    computed:{
        serverHost(){
            return this.$store.state.serverHost;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        theme(){
            return this.$store.state.theme;
        },
        friendGroup(){
            return this.$store.state.friendGroup;
        }
    },
    data(){
        return{
            snackbar:{
                open:false,
                text:'操作失败',
                color:'error'
            }
        }
    },
    methods:{
        toInfo(id){
            this.$store.commit('updateOpenFriend',id)
            this.$router.replace('/friends/info')
        },
        action(from,id,status,groupSn){
            let oldStatus=this.apply.status;
            this.apply.status=status+'';
            this.axios({
                method:'get',
                url:this.apiHost+`/contact/admitContact?contactSn=${from}&messageSn=${id}&status=${status}&groupSn=${groupSn}`
            }).then(res=>{
                console.log(res)
                if(res.data.code==='10000'){
                    let text='';
                    if(status===1){
                        text='已同意好友申请'
                        this.$store.commit('setUpdateFriendList',true);
                    }
                    if(status===2) text='已拒绝好友申请'
                    this.snackbar={open:true,text,color:'success'}
                }else{this.apply.status=oldStatus}
            }).catch(()=>{
                this.apply.status=oldStatus;
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .item{
        display: flex;
        margin-bottom:20px;
        position: relative;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 20px;
        cursor: pointer;
        .avatar{
            width:50px;
            height:50px;
            border-radius: 50%;
            margin-right: 10px;
            overflow: hidden;
        }
        .mid{
            flex:1;
            overflow: hidden;
            .name{
                font-weight: bold;
                overflow: hidden;
                .time{
                    float:right;
                    font-size: 0.9rem;
                    color:#959595;
                }
            }
            .text{
                word-break: break-all;
                max-height: 100px;
                overflow: auto;
            }
        }
        .actions,.status{
            position: relative;
            display: flex;
            align-items: center;
            .btn{
                margin-left: 10px;
                color:#fff;
            }
        }
    }
    .select-group{
        background-color: #fff;
        .tip{
            font-weight: bold;
            font-size: 0.9rem;
            text-align: center;
            padding:15px;
        }
        .group-item{
            text-align: center;
            font-weight: bold;
            padding:10px;
            border-top: 1px solid #e0e0e0;
            cursor: pointer;
        }
    }
</style>