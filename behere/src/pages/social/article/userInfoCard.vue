<template>
    <v-card id="user-info-card" :style="{backgroundColor:theme}">
        <div class="user-info" v-ripple @click="$router.push('/social/'+id)">
            <div class="avatar">
                <img :src="serverHost+userInfo.profilePhoto" :style="{width:'100%'}">
            </div>
            <div class="right">
                <div class="name">{{userInfo.nickName}}
                    <v-icon color='red' v-if='userInfo.sex==="0"' size='20'>mdi-gender-female</v-icon>
                    <v-icon color='blue' v-else size='20'>mdi-gender-male</v-icon>
                </div>
                <div class="desc">{{userInfo.description}}</div>
            </div>
        </div>
        <div class="content" v-if='attachment'>
            <div v-html="data.content"></div>
            <div v-if='attachment.imgs.length>0'>
                <span v-for='(img,index) in attachment.imgs' :key='index'>[图片]</span>
            </div>
            <div v-if='attachment.media.length'>[视频]</div>
            <div v-if='attachment.voices.length>0'>[语音]</div>
            <div class="time">{{new Date(data.createTime).parse()}}</div>
        </div>
    </v-card>
</template>

<script>
export default {
    props:['id'],
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        apiHost(){
            return this.$store.state.apiHost
        },
        serverHost(){
            return this.$store.state.serverHost
        },
        attachment(){
            if(this.data.attachment)
                return JSON.parse(this.data.attachment)
            return null
        }
    },
    data(){
        return{
            data:{},
            userInfo:{},
            loading:false
        }
    },
    mounted(){
        this.getUserInfo();
        this.getData();
    },
    methods:{
        getUserInfo(){
            this.axios({
                method:'get',
                url:this.apiHost+'/user/getUserInfo?userSn='+this.id
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    this.userInfo=data;
                }
            })
        },
        getData(){
            this.loading=true
            this.axios({
                method:'post',
                url:this.apiHost+`/moment/getUserMoment?contactSn=${this.id}&page=0&size=1`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    this.data=data.data[0];
                }
            }).finally(()=>{
                this.loading=false
            })
        },
    }

}
</script>

<style lang='scss' scoped>
    #user-info-card{
        max-width: 400px;
        min-width: 300px;
        color:#fff;
        margin-top:8px;
        position: relative;
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
        &:hover{
            cursor: pointer;
        }
        .user-info{
            overflow: hidden;
            display: flex;
            align-items: center;
            padding:20px;
            //padding-bottom: 5px;
            border-bottom:1px solid #e0e0e0;
            .avatar{
                width:60px;
                height:60px;
                border-radius: 50%;
                overflow: hidden;
                background-color: green;
            }
            .right{
                flex:1;
                margin-left:10px;
                overflow: hidden;
                .name{
                    font-weight: bold;
                    color:#fff;
                }
                .desc{
                    font-size: 0.8rem;
                    opacity: 0.7;
                    color:#fff;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
        .content{
            padding:20px;
            padding-top: 5px;
            background-color: #fff;
            color:#000;
            .time{
                color:#e0e0e0;
                font-size: 0.8rem;
                text-align: right;
            }
        }
        
    }
</style>