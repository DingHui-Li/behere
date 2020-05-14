<template>
    <div id='add-group'>
        <div class="left">
            <v-text-field placeholder="搜索" prepend-icon='mdi-account-search' 
                solo flat :color='theme' dense hide-details clearable
                v-model="keyword"
                :style="{margin:'15px',marginBottom:0}"></v-text-field>
            <div class="friends">
                <div class="item" v-for='friend in friends.filter(item=>!keyword||(item.remark&&item.remark.includes(keyword))||item.nickName.includes(keyword))' 
                    :key="friend.userSn" v-ripple @click="check(friend)">
                    <div class="avatar">
                        <img :src="serverHost+friend.profilePhoto" :style="{width:'100%'}" />
                    </div>
                    <div class="name" v-html='friend.remark?friend.remark.highLight(keyword,theme):friend.nickName.highLight(keyword,theme)'></div>
                    <div class="icon">
                        <v-icon :color="isSelected(friend.userSn)?'green':''">mdi-check-circle</v-icon>
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <div class="tip">已选择 <span>{{selected.length}}</span> 位联系人</div>
            <div class="items">
                <div class="avatar" v-for="select in selected" :key="select.id">
                    <img :src="serverHost+select.avatar" :style="{width:'100%'}" />
                </div>
            </div>
            <div class="group-name" v-if='!Boolean(groupInfo)'>
                <v-text-field placeholder="请输入群名" :color="theme" v-model="groupName" :counter="20"></v-text-field>
            </div>
            <div class="actions" v-show='selected.length>0'>
                <v-btn v-if='Boolean(groupInfo)' class="btn" depressed :style="{backgroundColor:'#4CAF50'}" @click="handleAddMember">确定</v-btn>
                <v-btn v-else depressed class="btn" :style="{backgroundColor:'#4CAF50'}" @click='handleCreateGroup' 
                    :disabled="groupName.trim().length<=0||groupName.trim().length>20">确定</v-btn>
                <v-btn depressed class="btn" :style="{backgroundColor:'#F44336'}" @click='$emit("close")'>取消</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['theme','friends','serverHost','apiHost','groupInfo'],
    data(){
        return{
            selected:[],
            keyword:'',
            groupName:''
        }
    },
    methods:{
        check(friend){
            for(let i in this.selected){
                if(this.selected[i].id===friend.userSn){
                    this.selected.splice(i,1);
                    return;
                }
            }
            this.selected.push({id:friend.userSn,avatar:friend.profilePhoto});
        },
        isSelected(id){//是否选中
            for(let i of this.selected){
                if(i.id===id) return true;
            }
            return false;
        },
        handleCreateGroup(){
            let ids='';
            this.selected.map((item,index)=>ids+=`${item.id}${this.selected.length===index+1?'':','}`)
            this.axios({
                method:'post',
                url:this.apiHost+'/chat/addChatGroup?contactSn='+ids+'&groupName='+this.groupName
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('success');
                    this.$store.commit('setUpdateGroups',true);
                }
            })
            this.$emit('close')
        },
        handleAddMember(){
            let ids='';
            this.selected.map((item,index)=>ids+=`${item.id}${this.selected.length===index+1?'':','}`)
            this.axios({
                method:'post',
                url:this.apiHost+`/chat/inviteChatGroupUser?groupSn=${this.groupInfo.id}&contactSn=${ids}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('success');
                }
            })
            this.$emit('close')
        }
    },
    watch:{
        members(newVal){
            this.selected=newVal;
        }
    }
}
</script>

<style lang='scss' scoped>
    #add-group{
        background-color: #fff; 
        display: flex;
        width: 500px;
        .left{
            flex:6;
            .friends{
                padding:15px;
                max-height: 300px;
                overflow: auto;
                .item{
                    padding:5px;
                    display: flex;
                    align-items: center;
                    overflow: hidden;
                    cursor: pointer;
                    .avatar{
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        overflow: hidden;
                    }
                    .name{
                        font-weight: bold;
                        margin-left: 5px;
                    }
                    .icon{
                        flex: 1;
                        text-align: right;
                    }
                }
            }
        }   
        .right{
            flex:6;
            .tip{
                padding:15px;
                color:#959595;
                margin-top: 5px;
                span{
                    color:#454545;
                    font-weight: bold;
                }
            }
            .group-name{
                padding:0 15px;
            }
            .items{
                max-height: 300px;
                display: flex;
                flex-wrap: wrap;
                overflow: auto;
                .avatar{
                    width: 60px;
                    height:60px;
                    border-radius: 50%;
                    overflow: hidden;
                    background-color: red;
                    margin:5px;
                }
            }
            .actions{
                margin: 20px 0;
                text-align: center;
                .btn{
                    color:#fff;
                    margin-right: 15px;
                }
            }
        }
    }
</style>