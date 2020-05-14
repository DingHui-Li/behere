<template>
    <div id='new-group'>
        <div class="tip">新的群聊</div>
        <div class="content">
            <Item :theme='theme' v-for="item in data" :key='item.sn' :data='item' :apiHost='apiHost' :serverHost='serverHost'
                @success='v=>snackbar={open:true,text:v,color:"success"}'
                @error='v=>snackbar={open:true,text:v,color:"error"}'/>
        </div>
        <v-snackbar v-model="snackbar.open" :color='snackbar.color' top>
            {{snackbar.text}} <v-btn icon @click='snackbar.open=false' :style="{backgroundColor:'rgba(0,0,0,0)',color:'#fff'}"><v-icon>mdi-close</v-icon></v-btn>
        </v-snackbar>
    </div>
</template>

<script>
import Item from './item'
export default {
    components:{Item},
    data(){
        return{
            data:[],
            snackbar:{
                open:false,
                text:'',
                color:'error'
            },
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    mounted(){
        console.log(this.$store.state.myInfo.id)
        this.getData();
    },
    methods:{
        getData(){
            this.axios({
                method:'get',
                url:this.apiHost+'/message/getChatGroupReqMessage'
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    this.$store.commit('setGroupApplyNum',0)
                    this.data=data.content
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    #new-group{
        width:100%;
        height:100%;
        animation-duration: .5s;
        display: flex;
        flex-direction: column;
        background-color: #fff;
        .tip{
            padding:10px 20px;
            font-size: 1.3rem;
            font-weight: bold;
            margin-top: 10px;
        }
        .content{
            overflow: auto;
            padding:20px;
        }
    }
</style>