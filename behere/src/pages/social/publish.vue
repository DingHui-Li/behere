<template>
    <v-card id="publish" elevation='1' :style="{padding:size==='xs'?'10px 5px':'10px 20px'}">
        <div class="logo">
            <img :src="logo" />
        </div>
        <!-- <textarea class="textarea" :style="{border:`1px solid ${theme}`}" rows="20"></textarea> -->
        <v-textarea counter="1000" auto-grow solo flat :rows='1' placeholder="在此输入..." v-model="text" :style="{border:`1px solid ${theme}`}"></v-textarea>

        <div class="voices" ref="voices">
            <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <v-icon class="help" v-on="on" v-show="voices.length>1">mdi-help-circle-outline</v-icon>
                </template>
                <span>拖动可调整顺序</span>
            </v-tooltip>
            <draggable v-model="voices" >
                <transition-group name="voice" tag="span">
                    <Voice v-for="(voice,index) in voices" :key="'voice'+voice.id" :data='voice'  @delete='removeVoice(index)' />
                </transition-group>
            </draggable>
        </div>

        <div class="imgs" v-show="imgs.length>0">
            <v-tooltip left>
                <template v-slot:activator="{ on }">
                    <v-icon class="help" v-on="on">mdi-help-circle-outline</v-icon>
                </template>
                <div>最多可上传9张图片</div>
                <span>（拖动可调整顺序）</span>
            </v-tooltip>
            <input multiple="multiple" type="file" accept="image/*" ref="inputImg" :style="{display:'none'}" @change="handleSelectImg"/>
            <v-row :style="{padding:'5px',maxWidth:'80%'}">
                <draggable v-model="imgs" :style="{width:'100%'}" draggable='.img-drag' ghost-class='ghost' class="drag">
                        <transition-group name="voice" tag="div">
                            <v-col cols="4" v-for="(img,index) in imgs" :key="img.id" class="img-drag" ref="imgs">
                                <v-btn fab depressed small class="remove-img" @click="removeImg(index)">
                                    <v-icon>mdi-delete-outline</v-icon>
                                </v-btn>
                                <v-img class="img" :src='img.src' @click="openImgView=index"></v-img>
                            </v-col>
                            <v-col cols='4' key='add-img-btn' v-if="showAddImg" :style="{padding:'5px'}">
                                <v-responsive :aspect-ratio="1/1">
                                    <div class="add-img" v-ripple @click="$refs.inputImg.click()" >
                                        <div class="circle">
                                            <v-icon class="icon">mdi-plus-thick</v-icon>
                                        </div>
                                    </div>
                                </v-responsive>
                            </v-col>
                        </transition-group>
                </draggable>
            </v-row>
            <ImgView :imgs='imgs.map(item=>item.src)' :open='openImgView' @close='openImgView=-1'/>
        </div>

        <div class="video-container" v-show='Boolean(video.src)'>
            <input type="file" accept="video/MP4,video/WebM,video/Ogg,audio/mpeg,audio/ogg,audio/wav" 
                ref='inputVideo' :style="{display:'none'}" @change="handleSelectVideo" />
            <video :src="video.src" controls autoplay v-if="video.type.includes('video')"></video>
            <audio :src="video.src" controls v-else></audio>
            <v-btn fab depressed small class="remove-video" @click="removeVideo">
                <v-icon>mdi-delete-outline</v-icon>
            </v-btn>
        </div>

        <v-card-actions>
            <v-btn depressed class="btn" >
                <span :style="{color:theme,filter}">
                    <v-icon class="icon">mdi-emoticon-happy</v-icon>表情
                </span>
            </v-btn>
            <v-btn depressed class="btn" @click="$refs.inputImg.click()" :disabled="Boolean(video.src)">
                <span :style="{color:theme,filter}">
                    <v-icon class="icon">mdi-image-size-select-actual</v-icon>图片
                </span>
            </v-btn>
            <v-btn depressed class="btn" :style="{marginRight:'10px'}" :disabled="imgs.length!==0" @click="$refs.inputVideo.click()">
                <span :style="{color:theme,filter}">
                    <v-icon class="icon">mdi-file-video</v-icon>视频
                </span>
            </v-btn>
            <InputVoice @handleInputVoice='handleInputVoice' :length='this.voices.length' @overstep='snackbar={text:"最多发布9条语音",open:true,color:"error"}'/>
        </v-card-actions>

        <v-btn class="submitBtn" depressed :disabled="disable_publish" @click="publish">发表</v-btn>
        <v-menu transition="scale-transition">
            <template v-slot:activator="{ on }">
                <v-btn depressed class="selectBtn" :style="{backgroundColor:theme,filter,color:theme.isBlack()?'#757575':'#fff'}" v-on="on">{{visibility}}<v-icon>mdi-menu-down</v-icon></v-btn>
            </template>
            <v-list class="selectVisibility" :style="{backgroundColor:theme,filter}">
                <v-list-item v-ripple class="item" @click="visibility='公开'" >
                    <span :style="{color:theme.isBlack()?'#757575':'#fff'}">公开 </span> 
                    <v-tooltip left>
                        <template v-slot:activator="{ on }">
                            <v-icon class="icon" v-on='on'>mdi-help-circle</v-icon>
                        </template>
                        <div>所有人可见</div>
                    </v-tooltip>
                </v-list-item>
                <v-list-item v-ripple class="item" @click="visibility='好友可见'"><span :style="{color:theme.isBlack()?'#757575':'#fff'}">好友可见</span> </v-list-item>
                <v-list-item v-ripple class="item" @click="visibility='私密'">
                    <span :style="{color:theme.isBlack()?'#757575':'#fff'}">私密</span> 
                    <v-tooltip left>
                        <template v-slot:activator="{ on }">
                            <v-icon class="icon" v-on='on'>mdi-help-circle</v-icon>
                        </template>
                        <div>仅自己可见</div>
                    </v-tooltip>
                </v-list-item>
            </v-list>
        </v-menu>
        <v-snackbar v-model="snackbar.open" :color="snackbar.color" top>
            {{ snackbar.text }}
            <v-btn fab depressed @click="snackbar.open = false" :style="{backgroundColor:'transparent',color:'#fff'}">
                <v-icon>mdi-close</v-icon>
            </v-btn>
        </v-snackbar>
        <div class="uploading" v-show="uploading.open">
            <div class="uploading-container" :style="{color:uploading.error?'red':'#757575'}">
                <!-- <v-progress-linear
                    color="deep-purple accent-4"
                    indeterminate
                    rounded
                    height="6"
                ></v-progress-linear> -->
                {{uploading.text}}<span v-show="!uploading.error&&uploading.progress!==100" class="progress" :style='{color:theme}'> {{uploading.progress}}%</span>
            </div>
        </div>
    </v-card>
</template>

<script>
import draggable from 'vuedraggable'
import ImgView from '../../components/imgView'
import InputVoice from '../../components/inputVoice'
import Voice from '../../components/voice'
import compressImg from '../../util/compressImg'

export default {
    components:{draggable,ImgView,InputVoice,Voice},
    data(){
        return{
            logo:require('../../assets/img/letstalk.png'),
            imgs:[],//图片
            video:{//视频或音频
                src:null,
                type:''
            },
            openImgView:-1,
            text:'',//文字
            voices:[],//语音 {id,width,src,duration}
            visibility:'好友可见',//可见性
            snackbar:{
                open:false,
                text:'发布成功',
                color:'success'
            },
            uploading:{
                open:false,
                text:'开始上传',
                progress:0,
                error:false
            }
        }
    },
    computed:{
        showAddImg(){
            return this.imgs.length>0&&this.imgs.length<9
        },
        theme(){
            let theme=this.$store.state.theme;
            return theme;
        },
        filter(){
            return `brightness(${this.theme.isBlack()?'85%':'100%'})`
        },
        disable_publish(){
            return this.text.trim().length===0&&this.imgs.length===0&&this.video.src===null&&this.voices.length===0;
        },
        size(){
            return this.$vuetify.breakpoint.name;
        },
        serverHost(){
            return this.$store.state.serverHost;
        }
    },
    updated(){
        if(this.$refs.imgs&&this.$refs.imgs.length>0){
            for(const img of this.$refs.imgs)
                img.style.height=img.clientWidth+'px'
        }
    },
    methods:{
        handleSelectImg(e){//选择图片
            let files=e.currentTarget.files;
            if(files.length+this.imgs.length>9){
                this.snackbar={
                    open:true,
                    text:'最多选择9张图片',
                    color:'error'
                }
                e.currentTarget.value='';
                return;
            }
            for(let i=0;i<files.length;i++){
                this.imgs.push({
                        src:window.URL.createObjectURL(files[i]),
                        id:this.imgs.length})
            }
            e.currentTarget.value='';
        },
        removeImg(index){//移除图片
            window.URL.revokeObjectURL(this.imgs[index]);
            this.imgs.splice(index,1);
        },

        handleSelectVideo(e){//选择视频或音频
            if(this.video.src){
                window.URL.revokeObjectURL(this.video.src);
            }
            let file=e.currentTarget.files[0];
            let size=file.size/1024/1024;
            if(size>100){
                this.snackbar={
                    open:true,
                    text:'最大支持100M',
                    color:'error'
                }
                e.currentTarget.value='';
                return;
            }
            this.video.type=file.type;
            this.video.src=window.URL.createObjectURL(file)
            e.currentTarget.value='';
        },
        removeVideo(){//移除视频或音频
            window.URL.revokeObjectURL(this.video.src);
            this.video.src=null;
        },

        handleInputVoice(data){//选择语音
            let fullwidth=this.$refs.voices.clientWidth;
            let width=data.duration/60*fullwidth;
            if(width<30) width=30;
            if(width>fullwidth*0.8) width=fullwidth*0.8;
            data.width=width;
            data.id=this.voices.length;
            this.voices.push(data);
        },
        removeVoice(index){//移除语音
            window.URL.revokeObjectURL(this.voices[index].src);
            this.voices.splice(index,1);
        },

        async publish(){
            if(this.disable_publish) return;
            this.uploading.open=true;
            let imgs=[];
            if(this.imgs.length>0){
                let res=await this.uploadImg();
                if(res.code===200){
                    imgs=res.paths;
                }else{
                    this.uploading={
                        ...this.uploading,
                        text:'上传图片失败',
                        error:true
                    }
                    return;
                }
            }
            console.log(imgs)

            let voices=[];
            if(this.voices.length>0){
                let res=await this.uploadVoice();
                if(res.code===200){
                    for(let i=0;i<this.voices.length;i++){
                        voices.push({path:res.paths[i],duration:this.voices[i].duration})
                    }
                }else{
                    this.uploading={
                        ...this.uploading,
                        text:'上传语音失败',
                        error:true
                    }
                    return;
                }
            }
            console.log(voices)

            let media={};
            if(this.video.src){
                let res=await this.uploadVideo();
                if(res.code===200){
                    media.path=res.path;
                    media.type=this.video.type;
                }else{
                    this.uploading={
                        ...this.uploading,
                        text:'上传媒体文件失败',
                        error:true
                    }
                    return;
                }
            }
            console.log(media)
            this.uploading.text='全部文件上传完成，开始发布'
        },
        async uploadImg(){
            return new Promise(async resolve=>{
                let files=[];
                for(const img of this.imgs){//由createObjectURL获取blob
                    let file=await this.axios({
                        url:img.src,
                        responseType:'blob'
                    }).then(res=>res.data);
                    files.push(file)
                }

                let formData=new FormData();
                let colors=[];//所有图片的颜色值
                formData.append('type','imgs')
                this.uploading.text='处理图片中'
                for(let i=0;i<files.length;i++){//压缩
                    let res=await compressImg(this.imgs[i].src,files[i].type);
                    if(!res.data){
                        res.data=files[i];
                    }
                    formData.append('imgs',res.data,i+'.jpg');
                    colors.push(res.color);

                    this.uploading.progress=parseInt((i+1)/this.imgs.length*100);//处理进度
                }
                formData.append('colors',JSON.stringify(colors));

                this.uploading.text='上传图片中';
                this.axios({
                    method:'post',
                    url:this.serverHost+'/uploadimg',
                    data:formData,
                    onUploadProgress: progressEvent => {
                        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0);
                        this.uploading.progress=complete;//上传进度
                    }
                }).then(res=>{
                    resolve(res.data)
                }).catch(err=>{
                    console.log(err)
                    return resolve({code:500})
                })
            })
        },
        uploadVoice(){
            return new Promise(async resolve=>{
                let formData=new FormData();
                for(let i=0;i<this.voices.length;i++){//由createObjectURL获取blob
                    let file=await this.axios({
                        url:this.voices[i].src,
                        responseType:'blob'
                    }).then(res=>res.data);
                    
                    formData.append('voice',file,i+'.webm')
                }
                this.uploading.text='上传语音中';
                this.axios({
                    method:'post',
                    url:this.serverHost+'/uploadvoice',
                    data:formData,
                    onUploadProgress: progressEvent => {
                        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
                        this.uploading.progress=complete;//上传进度
                    }
                }).then(res=>{
                    resolve(res.data)
                }).catch(err=>{
                    console.log(err)
                    return resolve({code:500})
                })
            })
        },
        uploadVideo(){
            return new Promise(async resolve=>{
                let formData=new FormData();
                let file = await this.axios({
                    url:this.video.src,
                    responseType:'blob'
                }).then(res=>res.data).catch(err=>{
                    console.log(err);
                });

                formData.append('file',file,'file.mp4');
                this.uploading.text='上传媒体文件中';
                this.axios({
                    method:'post',
                    url:this.serverHost+'/uploadvideo',
                    data:formData,
                    onUploadProgress: progressEvent => {
                        let complete = (progressEvent.loaded / progressEvent.total * 100 | 0) 
                        this.uploading.progress=complete;//上传进度
                    }
                }).then(res=>{
                    resolve(res.data)
                }).catch(err=>{
                    console.log(err)
                    return resolve({code:500})
                })
            })
        }
    },
    beforeDestroy(){
        for(let i=0;i<this.imgs.length;i++){
            window.URL.revokeObjectURL(this.imgs[i]);
        }
        window.URL.revokeObjectURL(this.video.src);
    }
}
</script>

<style lang='scss' scoped>
    @import './publish.scss'
</style>