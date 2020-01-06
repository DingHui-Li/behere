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
                <div class="searchNum">{{result.length}}条搜索结果</div>
                <HistoryItem v-for="data in result" :key='data.sn' 
                    :data='data' :userInfo='userInfo' :keyword='keyword' :theme='theme' :serverHost='serverHost' :myInfo='myInfo'/>
            </div>
            <div class="tabitem" v-if='tabSelect===1'>
                <v-img class="img" v-for="(img,index) in imgResult" :key='img.sn' v-ripple
                :src='serverHost+img.content' @click="imgView={open:true,index}"></v-img>
            </div>
            <div class="tabitem" v-if='tabSelect===2'>
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
            fileResult:[]
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
            this.axios({
                method:'get',
                url:this.apiHost+`/message/getHistoryByContent?content=${value}&contactSn=${this.userInfo.id}`
            }).then(res=>{
                this.result=res.data.data.content;
                //console.log(JSON.parse(res.data.data))
            })
        },
        searchByType(type){
            this.axios({
                method:'get',
                url:this.apiHost+`/message/getHistoryByType?contactSn=${this.userInfo.id}&type=${type}`
            }).then(res=>{
                if(type==='img') this.imgResult=res.data.data.content;
                if(type==='file') this.fileResult=res.data.data.content;
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