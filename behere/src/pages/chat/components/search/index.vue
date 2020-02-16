<template>
    <div>
        <v-menu offset-y :close-on-content-click="false" v-model='showResult'>
            <template v-slot:activator='{on}'>
                <div :style="{display:'flex',alignItems:'center'}">
                    <v-text-field solo flat clearable dense hide-details
                    v-model="keyword"
                    @change="search"
                    :color='theme' background-color='#e0e0e0'
                    :style="{padding:'10px 10px 10px 0',marginBottom:'10px',borderRadius:'0',flex:1,borderRadius:'5px'}"
                    prepend-inner-icon='mdi-account-search' placeholder='查找' v-on='on' @focus="showResult=true"/>
                    <!-- 创建群组按钮 -->
                    <v-menu :close-on-content-click="false" v-model='openAddGroup'>
                        <template v-slot:activator='{on}'>
                            <v-btn icon :style="{marginTop:'-10px',backgroundColor:'#e0e0e0',borderRadius:'5px'}" v-on='on'><v-icon>mdi-plus-thick</v-icon></v-btn>
                        </template>
                        <AddGroup :theme='theme' :friends='friends' :serverHost='serverHost' :apiHost='apiHost'
                            @close='openAddGroup=false'
                            @success='snackbar={open:true,text:"创建群组成功",color:"success"}'
                            @error='snackbar={open:true,text:"创建群组失败",color:"error"}'/>
                    </v-menu>
                </div>
            </template>
            <div class="result">
                <div class="tip">查找结果：</div>
                <v-expansion-panels :value='0' accordion>
                    <v-expansion-panel>
                        <v-expansion-panel-header :style="{color:friendsResult.length>0?'#4CAF50':''}">{{`好友 (${friendsResult.length})`}}</v-expansion-panel-header>
                        <v-expansion-panel-content :style="{maxHeight:'500px',overflow:'scroll'}">
                            <div class="no-result" v-if='friendsResult.length===0'>无结果</div>
                            <FriendItem v-for="friend in friendsResult" :key='friend.userSn' :data='friend' :keyword='keyword'/>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header :style="{color:groupResult.length>0?'#4CAF50':''}">{{`群组 (${groupResult.length})`}}</v-expansion-panel-header>
                        <v-expansion-panel-content :style="{maxHeight:'500px',overflow:'scroll'}">
                            <div class="no-result" v-if='groupResult.length===0'>无结果</div>
                            <FriendItem v-for="group in groupResult" :key='group.sn' :data='group' :isGroup='true'/>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                    <v-expansion-panel>
                        <v-expansion-panel-header 
                            :style="{color:outlanderResult.friends.length>0||outlanderResult.groups.length>0?'#4CAF50':''}">
                            {{`或许你想找 (${outlanderResult.friends.length+outlanderResult.groups.length})`}}
                            <v-progress-linear class="searching" indeterminate :color="theme" v-if='searching'></v-progress-linear>
                        </v-expansion-panel-header>
                        <v-expansion-panel-content :style="{maxHeight:'500px',overflow:'scroll'}">
                            <div class="no-result" v-if='outlanderResult.friends.length===0&&outlanderResult.groups.length===0'>{{searching?'搜索中...':'无结果'}}</div>
                            <FriendItem v-for='people in outlanderResult.friends' :key='people.sn' :data='people' :keyword='keyword' type='outlander'/>
                            <FriendItem v-for='group in outlanderResult.groups' :key='group.sn' :data='group' :keyword='keyword' type='outlander' :isGroup='true'/>
                        </v-expansion-panel-content>
                    </v-expansion-panel>
                </v-expansion-panels>
            </div>
        </v-menu>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} 
            <v-btn depressed @click='snackbar.open=false' :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import FriendItem from './friendItem'
import AddGroup from './addGroup'
export default {
    components:{FriendItem,AddGroup},
    data(){
        return{
            showResult:false,
            keyword:'',
            friendsResult:[],//查询出的好友结果
            groupResult:[],
            outlanderResult:{//非本地结果
                friends:[],
                groups:[]
            },
            searching:false,
            openAddGroup:false,//打开创建群组 弹窗
            snackbar:{
                open:false,
                color:'error',
                text:'错误'
            }
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        friends(){
            return this.$store.state.friendList;
        },
        groups(){
            return this.$store.state.groups;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    methods:{
        search(value){
            this.showResult=true;
            if(!value||value.trim().length==0) {
                this.friendsResult=[];
                this.outlanderResult={friends:[],groups:[]};
                this.groupResult=[];
                return;
            }
            this.searching=true;
            this.friendsResult=[];
            for(let i in this.friends){
                if(this.friends[i].nickName.includes(value)||(this.friends[i].remark&&this.friends[i].remark.includes(value))){
                    this.friendsResult.push(this.friends[i])
                }
            }
            this.groupResult=[];
            for(let group of this.groups){
                if(group.groupName.includes(value)){
                    this.groupResult.push(group);
                }
            }
            this.axios({
                method:'get',
                url:this.apiHost+'/user/findUser?search='+this.keyword,
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    for(let i in data){
                        data[i].userSn=data[i].sn;
                        for(let j in this.friends){//去除已经是好友的结果
                            if(data[i].sn===this.friends[j].userSn){
                                data.splice(i,1);break;
                            }
                        }
                    }
                    this.outlanderResult.friends=data;
                }
            }).finally(()=>{
                this.searching=false;
            })
            this.axios({
                method:'get',
                url:this.apiHost+'/chat/findChatGroup?groupName='+value
            }).then(res=>{
                if(res.data.code==='10000'){
                    let result=JSON.parse(res.data.data);
                    for(let i in result){
                        for(let group of this.groups){
                            if(result[i].sn===group.sn){
                                result.splice(i,1);break;
                            }
                        }
                    }
                    console.log(result)
                    this.outlanderResult.groups=result;
                }
            }).finally(()=>{
                this.searching=false;
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .result{
        background-color: #fff; 
        border-radius: 0;
        max-height: 800px;
        width: 100%;
        overflow: hidden;
        .tip{
            font-weight: bold;
            padding:10px 25px;
        }
        .no-result{
            text-align: center;
            color:#D32F2F;
            font-weight: bold;
        }
        .searching{
            position: absolute;
            bottom:0;
        }
    }
</style>