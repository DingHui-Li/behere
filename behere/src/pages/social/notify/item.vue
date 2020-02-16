<template>
    <div class="item">
        <div class="avatar" v-ripple @click="$router.push('/social/user/'+data.from)">
            <img :src="serverHost+data.fromInfo.profilePhoto" :style="{width:'100%'}">
        </div>
        <div class="right">
            <div class="name" @click="$router.push('/social/user/'+data.from)">{{data.fromInfo.nickName}}</div>
            <div class="time">{{new Date(data.sendTime).parse()}}</div>
            <div class="content">
                <div :style="{fontWeight:'bold'}"> 
                    <span v-if="data.type==='reply'">回复
                        <span class="toUser" @click="$router.push('/social/user/'+data.to)"
                        :style="{color:theme}">@{{data.toInfo.nickName}} </span>:
                    </span>
                    <span v-if='data.type==="like"'>赞了你的动态</span>
                    <span v-if='data.type==="mention"'>@ 提到我</span>
                    <span :style="{fontWeight:'normal'}" v-if='data.type!=="mention"'>{{data.content}}</span> 
                </div>
                <div class="context" v-if='article' v-ripple @click="$emit('open',article)">
                    <div v-html="article.content"></div>
                    <v-row>
                        <v-col cols='2' v-for="(img,index) in article.attachment.imgs" :key="'img-'+index">
                            <v-img class="img" 
                            :src="serverHost+img" :aspect-ratio="1/1"></v-img>
                        </v-col>
                    </v-row>
                    <div v-if='article.attachment.media&&article.attachment.media.type' class="media">
                        <video :src="serverHost+article.attachment.media.path" 
                            v-if='article.attachment.media.type.includes("video")' controls></video>
                        <audio v-else :src="serverHost+article.attachment.media.path" controls></audio>
                    </div> 
                    <Voice v-for="(v,index) in article.attachment.voices" :key="'voice'+index" :data='v' :msg='true'/>
                </div>
            </div>
            <!-- <div class="actions">
                <v-btn depressed class="btn" @click="$emit('open',article)">
                    <v-icon :color="theme">mdi-comment-text-multiple</v-icon> 
                    查看对话
                </v-btn>
            </div> -->
        </div>
    </div>
</template>

<script>
import Voice from '../../../components/voice'
export default {
    props:['theme','data','articles','apiHost','serverHost','myInfo'],
    components:{Voice},
    data(){
        return{
        
        }
    },
    computed:{
        article(){
            for(let article of this.articles){
                if(article.sn===this.data.momentSn){
                    return article
                }
            }
            return null
        }
    }
}
</script>

<style lang='scss' scoped>
    .item{
        position: relative;
        display: flex;
        margin-bottom:20px;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        .avatar{
            width:50px;
            height:50px;
            border-radius: 50%;
            overflow: hidden;
            background-color: green;
            cursor: pointer;
        }
        .right{
            flex:1;
            margin-left: 10px;
            .name{
                font-weight: bold;
                cursor: pointer;
            }
            .time{
                font-size: 0.8rem;
                color:#959595;
            }
            .content{
                //border-bottom:1px solid #eeeeee;
                padding-bottom: 10px;
                .toUser{
                    font-weight: bold;
                    cursor: pointer;
                }
                .context{
                    width: 100%;
                    padding:15px;
                    background-color: #e0e0e0;
                    border-radius: 5px;
                    margin-top: 10px;
                    position: relative;
                    max-height: 300px;
                    overflow: hidden;
                    .img{
                        border-radius: 5px;
                    }
                }
            }
            .actions{
                display: flex;
                justify-content: space-around;
                margin-top:5px;
                .btn{
                    background-color: transparent;
                }
            }
        }
    }
</style>