<template>
    <v-menu offset-y :close-on-content-click="false" v-model='showResult'>
        <template v-slot:activator='{on}'>
            <div :style="{display:'flex',alignItems:'center'}">
                <v-text-field solo flat clearable dense hide-details
                v-model="keyword"
                @change="search"
                :color='theme' background-color='#e0e0e0'
                :style="{padding:'10px 10px 10px 0',marginBottom:'10px',borderRadius:'0',flex:1,borderRadius:'5px'}"
                prepend-inner-icon='mdi-account-search' placeholder='查找' v-on='on' @focus="showResult=true"/>
                <v-menu :close-on-content-click="false">
                    <template v-slot:activator='{on}'>
                        <v-btn icon :style="{marginTop:'-10px',backgroundColor:'#e0e0e0',borderRadius:'5px'}" v-on='on'><v-icon>mdi-plus-thick</v-icon></v-btn>
                    </template>
                    <div class="add-group">
                        <div class="left">
                            <v-text-field placeholder="搜索" prepend-icon='mdi-account-search' solo flat :color='theme' dense hide-details clearable></v-text-field>
                            <div class="friends">
                                <FriendItem v-for='friend in friends' :key="friend.userSn" :data='friend' type='select'/>
                            </div>
                        </div>
                        <div class="right"></div>
                    </div>
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
                        <FriendItem v-for="group in groupResult" :key='group.sn'/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                    <v-expansion-panel-header :style="{color:outlanderResult.length>0?'#4CAF50':''}">{{`或许你想找 (${outlanderResult.length})`}}
                        <v-progress-linear class="searching" indeterminate :color="theme" v-if='searching'></v-progress-linear>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content :style="{maxHeight:'500px',overflow:'scroll'}">
                        <div class="no-result" v-if='outlanderResult.length===0'>{{searching?'搜索中...':'无结果'}}</div>
                        <FriendItem v-for='people in outlanderResult' :key='people.sn' :data='people' :keyword='keyword' type='outlander'/>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </div>
    </v-menu>
</template>

<script>
import FriendItem from './friendItem'
export default {
    components:{FriendItem},
    data(){
        return{
            showResult:false,
            keyword:'',
            friendsResult:[],//查询出的好友结果
            groupResult:[],
            outlanderResult:[],//非好友结果
            searching:false,
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        friends(){
            return this.$store.state.friendList;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
    },
    methods:{
        search(value){
            this.showResult=true;
            if(!value||value.trim().length==0) {
                this.friendsResult=[];
                this.outlanderResult=[];
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
                    this.outlanderResult=data;
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
            margin:5px;
            padding-left: 20px;
            margin-bottom: 0;
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
    .add-group{
        background-color: #fff; 
        display: flex;
        width: 500px;
        .left{
            padding:15px;
            flex:6
        }   
        .right{
            flex:6;
            padding:15px;
            background-color: red;
        }
    }
</style>