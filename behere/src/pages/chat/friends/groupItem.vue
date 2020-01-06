<template>
    <div id='group-item'>
        <v-menu v-model="openContextMenu" offset-y>
            <template v-slot:activator='{on}'>
                <v-expansion-panel-header @contextmenu.prevent='openContextMenu=true' :style="{fontWeight:'bold',color:'#454545'}">
                        {{item.groupName+`(${item.friends.length})`}}
                </v-expansion-panel-header>
            </template>
            <div class="ctx-menu" >
                <div class="item" v-ripple @click="alterGroupName.open=true" v-if='item.defaultGroup!=="1"'><v-icon class="icon" >mdi-playlist-edit</v-icon>重命名</div>
                <div class="item" v-ripple @click="removeGroup=true" v-if='item.defaultGroup!=="1"'><v-icon class="icon">mdi-playlist-minus</v-icon>删除分组</div>
                <div class="item" v-ripple @click="newGroup.open=true"><v-icon class="icon">mdi-playlist-plus</v-icon>添加分组</div>
            </div>
        </v-menu>
        <v-expansion-panel-content class="chats" ref='expand'>
            <FriendItem v-for='friend in item.friends' :key='friend.userSn' :data='friend' :id='openFriend' />
        </v-expansion-panel-content>
        <v-dialog v-model="alterGroupName.open" width="300">
            <div class="alter-group-name">
                <v-text-field solo flat background-color='#e0e0e0' :counter="15" v-model="alterGroupName.value"></v-text-field>
                <div class="actions">
                    <v-btn class="btn" depressed :style="{backgroundColor:'#F44336'}" @click="alterGroupName={open:false,value:''}">取消</v-btn>
                    <v-btn class="btn" depressed :style="{backgroundColor:'#4CAF50'}" @click='handleAlterName'>确定</v-btn>
                </div>
            </div>
        </v-dialog>
        <v-dialog v-model="newGroup.open" width="300">
            <div class="new-group">
                <v-text-field solo flat background-color='#e0e0e0' :counter="15" v-model="newGroup.value"></v-text-field>
                <div class="actions">
                    <v-btn class="btn" depressed :style="{backgroundColor:'#F44336'}" @click="newGroup={open:false,value:''}">取消</v-btn>
                    <v-btn class="btn" depressed :style="{backgroundColor:'#4CAF50'}" @click="handleNewGroup">确定</v-btn>
                </div>
            </div>
        </v-dialog>
        <v-dialog v-model="removeGroup" width='300'>
            <div class="remove-group">
                <div class="tip">确定删除分组[{{item.groupName}}]吗？</div> 
                <div class="sub-tip" v-if='item.friends.length>0'>分组内{{item.friends.length}}人将被移动到默认分组</div>
                <div class="actions">
                    <v-btn class="btn" depressed :style="{backgroundColor:'#F44336'}" @click="removeGroup=false">取消</v-btn>
                    <v-btn class="btn" depressed :style="{backgroundColor:'#4CAF50'}" @click="handleRemoveGroup">确定</v-btn>
                </div>
            </div>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon :style="{backgroundColor:'rgba(0,0,0,0)'}" @click="snackbar.open=false"><v-icon :style="{color:'#fff'}">mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import FriendItem from './friendItem'
export default {
    components:{FriendItem},
    props:['item'],
    data(){
        return{
            openContextMenu:false,//右键分组名 菜单
            alterGroupName:{
                open:false,
                value:this.item.groupName
            },//修改分组名 弹窗
            newGroup:{
                open:false,
                value:''
            },//新增分组 弹窗
            snackbar:{
                open:false,
                text:'操作失败',
                color:'error'
            },
            removeGroup:false,//删除分组 弹窗
        }
    },
    computed:{
        openFriend(){
            return this.$store.state.openFriend;
        },
        apiHost(){
            return this.$store.state.apiHost
        },
    },
    methods:{
        handleNewGroup(){
            if(this.newGroup.value.length===0&&this.newGroup.value.length>15) return;
            this.newGroup.open=false;
            this.axios({
                method:'get',
                url:this.apiHost+'/contactGroup/createGroup?groupName='+this.newGroup.value
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data={
                        groupName:this.newGroup.value,
                        count:0,
                        sn:res.data.data
                    }
                    this.$store.commit('newFriendGroup',data);
                    this.snackbar={open:true,text:'添加分组成功',color:'success'}
                    this.newGroup.value='';
                }else{
                    this.snackbar={open:true,text:'添加分组失败',color:'error'}
                }
            })
        },
        handleAlterName(){
            if(this.newGroup.value.length===0&&this.newGroup.value.length>15) return;
            this.alterGroupName.open=false;
            this.axios({
                method:'get',
                url:this.apiHost+'/contactGroup/editGroup?groupName='+this.alterGroupName.value+'&groupSn='+this.item.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.item.groupName=this.alterGroupName.value;
                    this.snackbar={open:true,text:'修改分组成功',color:'success'}
                }else{
                    this.snackbar={open:true,text:'修改分组失败',color:'error'}
                }
            })
        },
        handleRemoveGroup(){
            this.removeGroup=false;
            this.axios({
                method:'get',
                url:this.apiHost+'/contactGroup/delGroup?groupSn='+this.item.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$store.commit('removeFriendGroup',this.item.sn);
                    this.snackbar={open:true,text:'删除分组成功',color:'success'}
                }else{
                    this.snackbar={open:true,text:'删除分组失败',color:'error'}
                }
            })
        }
    },
    watch:{
        item(){
            console.log('newItem')
        }
    }
}
</script>

<style lang='scss' scoped>
    .ctx-menu{
        background-color: #fff;
        .item{
            padding:10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            color:#454545;
            .icon{
                margin-right: 20px;
            }
        }
    }
    .alter-group-name,.new-group,.remove-group{
        background-color: #fff;
        .tip{
            padding:10px;
            text-align: center;
            font-size: 1.2rem;
        }
        .sub-tip{
            font-size: 0.9rem;
            color:#969696;
            text-align: center;
            padding-bottom: 10px;
        }
        .actions{
            display: flex;
            .btn{
                flex:1;
                border-radius: 0;
                color:#fff;
            }
        }
    }
</style>    