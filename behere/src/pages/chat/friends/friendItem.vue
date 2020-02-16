<template>
    <div>
        <v-menu v-model="openContextMenu" transition='y'>
            <template v-slot:activator='{on}'>
                <div id='friend-item' v-ripple @click="click" :style="{filter:`brightness(${data.userSn===id?'85%':'100%'})`}" @contextmenu.prevent='openContextMenu=true'>
                    <div class="avatar">
                        <v-img :src='avatar' :style="{height:'100%'}"></v-img>
                    </div>
                    <div class="right">
                        <div class="name">{{name}}</div>
                        <div class="desc">{{data.description&&data.description.length>0?data.description:'一条咸鱼'}}</div>
                    </div>
                </div>
            </template>
            <div class="ctx-menu">
                <div class="item" v-ripple @click="deleteFriend=true">删除</div>
            </div>
        </v-menu>
        <v-dialog v-model="deleteFriend" width="300">
            <div class="delete-friend">
                <div class="tip">确认删除好友 -{{name}} ?</div>
                <div class="actions">
                    <v-btn :style="{flex:1,backgroundColor:'#4CAF50',marginRight:'20px',color:'#fff'}" depressed @click="deleteFriend=false">取消</v-btn>
                    <v-btn :style="{flex:1,backgroundColor:'#FF5252',color:'#fff'}" depressed @click="remove">删除</v-btn>
                </div>
            </div>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon :style="{color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
export default {
    props:['data','id'],
    computed:{
        serverHost(){
            return this.$store.state.serverHost;
        },
        avatar(){
            if(this.data.profilePhoto) return this.serverHost+this.data.profilePhoto;
            else return this.serverHost+'/public/avatar.png'
        },
        name(){
            if(this.data.remark) return this.data.remark;
            else return this.data.nickName;
        },
        apiHost(){
            return this.$store.state.apiHost;
        }
    },
    data(){
        return{
            openContextMenu:false,
            deleteFriend:false,//确认删除 弹窗
            snackbar:{
                open:false,
                text:'删除成功',
                color:'success'
            },
        }
    },
    methods:{
        click(){
            this.$store.commit('updateOpenFriend',this.data.userSn);
            this.$router.replace('/friends/info')
        },
        remove(){
            this.deleteFriend=false;
            let temp=this.data;
            this.axios({
                method:'get',
                url:this.apiHost+'/contact/delContactByContactSn?contactSn='+this.data.userSn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.snackbar={open:true,text:'删除好友成功',color:'success'}
                    this.$store.commit('removeFriend',this.data.userSn)
                }else{
                    this.snackbar={open:true,text:'删除好友失败，code：'+res.data.code,color:'error'}
                }
            }).catch(()=>{
                this.snackbar={open:true,text:'删除好友失败',color:'error'}
            })
        }
    },
    watch:{
        '$route'(from){
            if(!from.path.includes('/friends/info')){
                this.$store.commit('updateOpenFriend',null);
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #friend-item{
        width:100%;
        display: flex;
        padding:5px 0;
        cursor: pointer;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        .selected{
            background-color: red;
            filter: brightness(95%)
        }
        .avatar{
            width:40px;
            height:40px;
            border-radius: 50%;
            overflow: hidden;
        }
        .right{
            flex:1;
            height:40px;
            margin-left: 10px;
            .name{
                font-weight: bold;
                font-size: 1rem;
            }
            .desc{
                font-size: 0.7rem;
                white-space: nowrap;
                color:#959595
            }
        }
    }
    .ctx-menu{
        background-color: #fff;
        .item{
            cursor: pointer;
            text-align: center;
            padding:10px;
            background-color: #F44336;
            color:#fff;
            font-weight: bold;
        }
    }
    .delete-friend{
        padding:20px;
        background-color: #fff;
        .tip{
            font-size: 1.1rem;
            text-align: center;
            font-weight: bold;
        }
        .actions{
            margin-top: 20px;
            display: flex;
        }
    }
</style>