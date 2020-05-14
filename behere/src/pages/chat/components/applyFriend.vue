<template>
    <div>       
        <v-dialog v-model="on" width="300">
            <div class="apply-friend">
                <div class="tip">申请添加朋友</div>
                <div :style="{fontSize:'0.8rem',color:'#959595'}">填写申请信息</div>
                <v-textarea :rows="3" hide-details no-resize solo flat background-color='#e0e0e0' v-model="applyText"></v-textarea>
                <div class="group">
                    <div :style="{fontSize:'0.8rem',color:'#959595'}">添加到分组</div>
                    <v-menu>
                        <template v-slot:activator='{on}'>
                            <v-btn depressed v-on='on' :style="{backgroundColor:'#e0e0e0'}">{{selectGroup.groupName}} <v-icon>mdi-chevron-down</v-icon></v-btn>
                        </template>
                        <div class="select-group">
                            <div class="item" v-for="group in friendGroup" :key='group.sn' v-ripple @click="selectGroup=group">
                                {{group.groupName}} 
                            </div>
                        </div>
                    </v-menu>
                </div>
                <div class="actions">
                    <v-btn depressed :style="{width:'100%',backgroundColor:'#4CAF50',color:'#fff'}" @click="sendApply">发送</v-btn>
                </div>
            </div>
        </v-dialog>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
export default {    
    props:['open','id'],
    computed:{
        myInfo(){
            return this.$store.state.myInfo;
        },
        friendGroup(){
            return this.$store.state.friendGroup;
        }
    },
    data(){
        return{
            on:this.open,
            applyText:'',
            selectGroup:'',
            snackbar:{
                open:false,
                text:'发送好友申请失败',
                color:'error'
            }
        }
    },
    mounted(){
        this.selectGroup=this.friendGroup[0];
        this.applyText='我是'+this.myInfo.name;
    },
    methods:{
        sendApply(){
            this.on=false;
            this.axios({
                method:'get',
                url:this.$store.state.apiHost+'/contact/addContact?contactSn='+this.id+'&content='+this.applyText+'&groupSn='+this.selectGroup.sn
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.snackbar={open:true,text:'发送好友申请成功',color:'success'}
                }else{
                    this.snackbar={open:true,text:'发送好友申请失败',color:'error'}
                }
            })
        }
    },
    watch:{
        on(newVal){
            if(!newVal) this.$emit('close')
        },
        open(){
            this.on=this.open;
        }
    }
}
</script>

<style scoped lang='scss'>
    .apply-friend{
        background-color: #fff;
        padding: 20px;
        .tip{
            text-align: center;
            font-size: 1.2rem;
            font-weight: bold;
            margin-bottom: 10px;
            color:#454545;
        }
        .group{
            margin-top: 10px;
            display: flex;
            flex-direction: column;
        }
        .actions{
            display: flex;
            margin-top: 20px;
        }
    }
    .select-group{
        background-color: #fff;
        .tip{
            font-weight: bold;
            font-size: 1.1rem;
            text-align: center;
            padding:15px;
            padding-bottom: 0;
        }
        .item{
            padding: 15px;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
        }
    }
</style>