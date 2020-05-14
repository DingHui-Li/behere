<template>
    <div id='content'>
        <div class="top">
            <span>详情</span>
            <v-btn icon :style="{float:'right'}" @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <v-progress-linear indeterminate :color="theme" v-show='loading'></v-progress-linear>
        <Article :item='data' :apiHost='apiHost' :serverHost="serverHost" :myInfo='myInfo' v-if='data' :isDelete='true'
            @snackbar="v=>snackbar={text:v.text,color:v.color,open:true}" v-on="$listeners"/>
        <v-snackbar v-model="snackbar.open" :color="snackbar.color" top>
            {{ snackbar.text }}
            <v-btn fab depressed @click="snackbar.open = false" :style="{backgroundColor:'transparent',color:'#fff'}">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import Article from '../article'
export default {
    components:{Article},
    props:['momentId','userInfo'],
    data(){
        return{
            data:null,
            loading:false,
            snackbar:{
                open:false,
                text:'发布成功',
                color:'success'
            },
        }
    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost
        },
        serverHost(){
            return this.$store.state.serverHost
        },
        myInfo(){
            return this.$store.state.myInfo
        },
        theme(){
            return this.$store.state.theme
        }
    },
    created(){
        this.getData()
    },
    methods:{
        getData(){
            this.data=null;
            this.loading=true;
            this.axios({
                method:'post',
                url:this.apiHost+'/moment/getMomentByMomentSn?momentSn='+this.momentId
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    data.profilePhoto=this.userInfo.profilePhoto;
                    data.nickName=this.userInfo.remark?this.userInfo.remark:this.userInfo.nickName
                    this.data=data
                }else this.data=null
            }).catch(()=>{
                this.data=null
            }).finally(()=>{
                this.loading=false
            })
        }
    },
    watch:{
        momentId(){
            this.getData();
        }
    }
}   
</script>

<style lang='scss' scoped>
    #content{
        width:100%;
        max-height:100vh;
        overflow: auto;
        background-color: #fff;
        .top{
            line-height: 40px;
            padding-left: 20px;
            background-color: #e0e0e0;
        }
    }
</style>