<template>
    <div id='item' v-show="isShow">
        <div class="left">{{new Date(data.createTime).parse('time')}}</div>
        <div class="right" v-ripple @click.stop="$emit('openArticle',data.sn)">
            <div class="content elevation-2">
                <div v-html="data.content" @click.stop='atClick'></div>
                <v-row>
                    <v-col cols="4" v-for="(img,index) in attachment.imgs" :key="'img'+index" :style="{padding:'5px'}">
                        <v-img class="img" :src='serverHost+img' :aspect-ratio="1/1" v-ripple
                            @click.stop="openImgView=index"
                            :style="{backgroundColor:img.getColor()||theme,borderRadius:'5px'}"/>
                    </v-col>
                </v-row>
                <div v-if='attachment.media&&attachment.media.type' class="media">
                    <video :src="serverHost+attachment.media.path" @click.prevent =""
                        v-if='attachment.media.type.includes("video")' controls></video>
                    <audio v-else :src="serverHost+attachment.media.path" controls  @click.prevent =""></audio>
                </div>
                <Voice v-for="(v,index) in attachment.voices" :key="'voice'+index" :data='v' :msg='true'/>
                <!-- <div class="status">
                    <v-btn depressed class="btn">
                        <v-icon color='red' size='18'>mdi-heart</v-icon>
                        <span>45</span>
                    </v-btn>
                    <v-btn depressed class="btn">
                        <v-icon color='blue' size='18' >mdi-comment-multiple-outline</v-icon>
                        <span>85</span>
                    </v-btn>
                </div> -->
            </div>
        </div>
        <ImgView v-if='attachment.imgs'  :imgs='attachment.imgs' :open='openImgView' @close='openImgView=-1'/>
    </div>
</template>

<script>
import ImgView from '../../../components/imgView'
import Voice from '../../../components/voice'
export default {
    props:['propData','serverHost','showType'],
    components:{ImgView,Voice},
    data(){
        return{
            data:this.propData,
            openImgView:-1
        }
    },
    computed:{
        attachment(){
            if(this.data.attachment){
                let data= JSON.parse(this.data.attachment)
                if(data.voices){
                    let fullwidth=200;
                    for(let i in data.voices){
                        let width=data.voices[i].duration/60*fullwidth;
                        if(width<30) width=30;
                        if(width>fullwidth*0.8) width=fullwidth*0.8;
                        data.voices[i].width=width;
                    }
                }
                return data
            }
            return{}
        },
        isShow(){
            if(this.showType==='all') return true;
            else if(this.showType==='img'){
                return this.attachment.imgs&&this.attachment.imgs.length>0
            }else if(this.showType==='video'){
                return this.attachment.media&&JSON.stringify(this.attachment.media)!=='{}'
            }
            return true;
        }
    },
    methods:{
        atClick(e){
            if(e.target.title)
                this.$router.push(`/social/${e.target.title}`)
            else this.$emit('openArticle',this.data.sn)
        }
    }
}
</script>

<style lang='scss' scoped>
    #item{
        display: flex;
        .left{ 
            padding-top: 15px;
            width: 80px;
            text-align: center;
            color:#fff;
            border-left: 5px solid #fff;
        }
        .right{
            flex:1;
            .content{
                padding:15px;
                padding-bottom: 10px;
                background-color: #fff;
                overflow: hidden;
                .media{
                    overflow: hidden;
                    width: 100%;
                    video{
                        //height: 100%;
                        max-width: 100%;
                        max-height:300px;
                        outline: none;
                    }
                    audio{
                        outline: none
                    }
                }
                .status{
                    text-align: right;
                    .btn{
                        background-color: transparent;
                        span{
                            margin-left: 3px;
                            color:#959595;
                            font-size: 0.8rem;
                        }
                    }
                }
            }
        }
    }
</style>