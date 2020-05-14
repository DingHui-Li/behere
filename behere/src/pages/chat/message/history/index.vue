<template>
    <div id='history'>
        <v-btn class="close" fab icon small @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
        <div class="tip">与 <span class="name">{{userInfo.name}} </span>的聊天记录 </div>
        <div :style="{padding:'0 15px'}">
            <v-text-field @change="search" v-model="keyword"
                solo flat clearable dense prepend-icon='mdi-comment-search-outline' placeholder='查找' hide-details :color="theme"></v-text-field>
        </div>
        <div>
            <v-tabs fixed-tabs :color="theme" class="tabs" :value='tabSelect'>
                <v-tab class="tab" @click="tabSelect=0">搜索</v-tab>
                <v-tab class="tab" @click="tabSelect=1;searchByType('img')">图片</v-tab>
                <v-tab class="tab" @click="tabSelect=2;searchByType('file')">文件</v-tab>
            </v-tabs>
        </div>
        <div class="result">
            <div class="tabitem" v-if='tabSelect===0'>
                <v-progress-linear indeterminate :color='theme' v-if='searchLoading'></v-progress-linear>
                <div class="searchNum">{{result.length}}条搜索结果</div>
                <HistoryItem v-for="data in result" :key='data.sn' 
                    :data='data' :userInfo='userInfo' :keyword='keyword' :theme='theme' :serverHost='serverHost' :myInfo='myInfo'/>
            </div>
            <div class="tabitem" v-if='tabSelect===1'>
                <v-progress-linear indeterminate :color='theme' v-if='imgLoading'></v-progress-linear>
                <div v-if='imgResult.length===0&&!imgLoading' class="tip">无图片</div>
                <v-img class="img" v-for="(img,index) in imgResult" :key='img.sn' v-ripple
                :src='serverHost+img.content' @click="imgView={open:true,index}"></v-img>
            </div>
            <div class="tabitem" v-if='tabSelect===2'>
                <v-progress-linear indeterminate :color='theme' v-if='fileLoading'></v-progress-linear>
                <div v-if='fileResult.length===0&&!fileLoading' class="tip">无文件</div>
                <FileResult v-for="file in fileResult" :key='file.sn' :data='file' :userInfo='userInfo' :serverHost='serverHost' :myInfo='myInfo'/>
            </div>
        </div>
        <ImgView v-show='imgView.open' @close='imgView.open=false' :imgs='imgResult.map(img=>img.content)' :open='imgView.index'/>
    </div>
</template>

<script>
import HistoryItem from './histortItem'
import ImgView from '../../../../components/imgView'
import FileResult from './fileResult'
export default {
    components:{HistoryItem,ImgView,FileResult},
    props:['userInfo'],
    data(){
        return{
            tabSelect:0,
            keyword:'',
            result:[],
            imgResult:[],
            imgView:{
                open:false,
                index:0
            },
            fileResult:[],
            searchLoading:false,
            imgLoading:false,
            fileLoading:false
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
        },
        myInfo(){
            return this.$store.state.myInfo;
        },
    },
    methods:{
        search(value){
            this.tabSelect=0;
            if(value.trim().length===0) return;
            this.searchLoading=true;
            let url=`/message/getHistoryByContent?content=${value.trim()}&contactSn=${this.userInfo.id}`
            if(this.userInfo.count){
                url=`/message/getGroupHistoryByContent?content=${value.trim()}&groupSn=${this.userInfo.id}`
            }
            this.axios({
                method:'get',
                url:this.apiHost+url
            }).then(res=>{
                if(res.data.code==='10000'){
                    if(this.userInfo.count){
                        this.result=JSON.parse(res.data.data).content;
                    }else{
                        this.result=JSON.parse(res.data.data.content)
                    }
                }
            }).finally(()=>{
                this.searchLoading=false;
            })
        },
        searchByType(type){
            if(type==='img') this.imgLoading=true;
            else this.fileLoading=true;
            let url=`/message/getHistoryByType?contactSn=${this.userInfo.id}&type=${type}`
            if(this.userInfo.content){
                url=`/message/getGroupHistoryByType?groupSn=${this.userInfo.id}&type=${type}`
            }
            this.axios({
                method:'get',
                url:this.apiHost+url
            }).then(res=>{
                if(res.data.code==='10000'){
                    if(type==='img') this.imgResult=JSON.parse(res.data.data.content);
                    if(type==='file') this.fileResult=JSON.parse(res.data.data.content);
                }
            }).finally(()=>{
                this.imgLoading=false;
                this.fileLoading=false;
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    #history{
        position: absolute;
        width:100%;
        height:100%;
        z-index: 99;
        background-color: #fff;
        animation-duration: .5s;
        display: flex;
        flex-direction: column;
        .close{
            position: absolute;
            right:0;
            top:0;
            z-index: inherit;
            background-color: rgba(0,0,0,.2)
        }
        .tip{
            font-size: 1rem;
            font-weight: bold;
            padding:15px;
            color:#757575;
            .name{
                font-size: 1.2rem;
                font-weight: bold;
                color: #454545;
            }
        }
        .tabs{
            overflow: auto;
            padding: 15px;
        }
        .tab{
            font-size: 1rem;
            padding:5px;
            font-weight: bold;
            padding:20px 0;
        }
        .result{
            flex:1;
            overflow: auto;
            .tabitem{
                padding:20px;
                padding-top: 0;
                overflow: auto;
                .tip{
                    text-align: center;
                    color:#959595;
                    font-weight: normal;
                }
                .searchNum{
                    text-align: center;
                    font-size: 0.9rem;
                    color: #757575;
                }
                .img{
                    width:100px;
                    height:100px;
                    overflow: hidden;
                    background-color:pink;
                    float: left;
                    margin:2px
                }
            }
        }
        
    }
</style>