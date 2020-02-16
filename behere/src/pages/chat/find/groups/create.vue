<template>
    <div class="groups-create">
        <div class="top">创建临时群聊
            <!-- <v-tooltip>
                <template v-slot:activator="{ on }">
                    <v-icon v-on='on'>mdi-help-circle</v-icon>
                </template>
                sdsadasd
            </v-tooltip> -->
            <v-btn icon class="btn" @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <div class="content">
            <div class="tip">想一个话题吧：</div>
            <v-text-field dense :counter='12' :color="theme" v-model="topic"></v-text-field>
            <!-- <div class="tip">参与人数(拖动修改)：</div>
            <v-slider :max='10' :min='2' thumb-label="always" ticks="always" :color="theme" :track-color='theme'
            :style="{marginTop:'35px'}"></v-slider> -->
            <div class="action">
                <v-btn depressed class="btn" :style="{backgroundColor:theme}" 
                    :disabled="topic.trim().length===0||topic.trim().length>12" @click="handleCreate">创建</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['theme'],
    data(){
        return{
            topic:''
        }
    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost
        }
    },
    methods:{
        handleCreate(){
            this.$emit('close')
            this.axios({
                method:'post',
                url:this.apiHost+'/find/creaetTopic?topicName='+this.topic.trim()
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('snackbar',{text:'创建话题成功',color:'success'})
                }else{
                    this.$emit('snackbar',{text:'创建话题失败',color:'error'})
                }
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .groups-create{
        width: 100%;
        background-color: #fff;
        .top{
            overflow: hidden;
            line-height: 40px;
            background-color: #e0e0e0;
            font-weight: bold;
            padding-left: 20px;
            .btn{
                float: right
            }
        }
        .content{
            padding:20px;
            .tip{
                color: #757575;
                font-weight: bold;
            }
            .action{
                text-align: center;
                .btn{
                    color:#fff
                }
            }
        }
    }
</style>