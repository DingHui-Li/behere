<template>
    <div id='select-friend'>
        <div :style="{padding:'0 15px'}">
            <v-text-field :color='theme' prepend-inner-icon="mdi-account-search" v-model="search" hide-details></v-text-field>
        </div>
        <div class="selected">
            <v-chip v-for="(user,index) in selected" :key='user.id' class="chip" close
                @click:close='selected.splice(index,1)'>
                <v-avatar left>
                    <img :src="serverHost+user.avatar" />
                </v-avatar>
                <span class="name">{{user.name}}</span>
            </v-chip>
            <v-btn depressed v-if="selected.length>0" @click="submit"
            :style="{width:'100%',marginTop:'10px',backgroundColor:'#4CAF50',color:'#fff'}">确定</v-btn>
        </div>
        <div class="friends">
            <div class="item" v-ripple 
                v-for="(friend,index) in friends.filter(item=>!search||(item.remark&&item.remark.includes(search))||item.nickName.includes(search))" 
                :key="friend.userSn" @click="handleSelect(index)" 
                :style="{backgroundColor:isSelect(friend.userSn)?'rgba(0,0,0,.2)':''}">
                <div class="avatar">
                    <img :src="serverHost+friend.profilePhoto" :style="{width:'100%'}" />
                </div>
                <div class="name">{{friend.remark?friend.remark:friend.nickName}}</div>
                <v-icon size='30' :color='isSelect(friend.userSn)?theme:""' class="icon">
                    {{isSelect(friend.userSn)?'mdi-check-box-outline':'mdi-crop-square'}}
                    </v-icon>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['selectedFriend'],
    data(){
        return{
            search:'',
            selected:[]
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme
        },
        friends(){
            return this.$store.state.friendList
        },
        serverHost(){
            return this.$store.state.serverHost
        },
    },
    created(){
        this.selected=JSON.parse(JSON.stringify(this.selectedFriend));
    },
    methods:{
        handleSelect(index){
            for(let i in this.selected){
                if(this.selected[i].id===this.friends[index].userSn){
                    this.selected.splice(i,1)//若已选中则取消选中
                    return
                }
            }
            this.selected.push({//若未选择则选中
                id:this.friends[index].userSn,
                avatar:this.friends[index].profilePhoto,
                name:this.friends[index].remark?this.friends[index].remark:this.friends[index].nickName
            })
        },
        isSelect(id){//是否选中
            for(let i in this.selected){
                if(this.selected[i].id===id) return true
            }
            return false
        },
        submit(){
                this.$emit('submit',this.selected);
                this.selected=[]
        }
    },
    watch:{
        selectedFriend(){
            this.selected=JSON.parse(JSON.stringify(this.selectedFriend));
        }
    }
}
</script>

<style lang='scss' scoped>
    #select-friend{
        max-height:80vh;
        padding-top: 0;
        width: 100%;
        background-color: #fff;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .selected{
            padding:15px;
            overflow: hidden;
            .chip{
                margin-right: 5px;
                .name{
                    font-size: 1rem;
                    margin:5px 0;
                }
            }
            
        }
        .friends{
            flex: 1;
            overflow: auto;
            padding:15px;
            .item{
                overflow: hidden;
                padding:10px;
                border-radius: 5px;
                margin-top: 2px;
                .avatar{
                    width:40px;
                    height:40px;
                    border-radius: 5px;
                    overflow: hidden;
                    background-color: green;
                    float: left;
                }
                .name{
                    display: inline;
                    line-height: 40px;
                    margin-left: 10px;
                    font-weight: bold;
                }
                .icon{
                    float:right
                }
            }
        }
    }
</style>