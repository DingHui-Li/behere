<template>
    <div id='content' :style="{padding:size==='xs'?'0':'20px'}">
        <div class="background" :style="{backgroundColor:theme}"></div>
        <Publish />
        <div class="tab-title elevation-1">
            <v-btn depressed class="btn" @click='handleBtnClick'>全部 </v-btn>
            <v-btn depressed class="btn" @click='handleBtnClick'>图片</v-btn>
            <v-btn depressed class="btn" @click='handleBtnClick'>视频</v-btn>
        </div>
        <div class="bottom">
            <div class="triangle" :style='{left:triangle_left,borderBottomColor:theme}'></div>
        </div>

        <div class="content-container" >
            <!-- <div class="triangle" :style='{left:triangle_left}'></div> -->
            <!-- :style="{border:size==='xs'?'none':`1px solid ${theme}`}" -->
            <div class="articles">
                <Article v-for="i in 10" :key="'article'+i" />
            </div>
        </div>
    </div>
</template>

<script>
import Publish from './publish'
import Article from './article'
export default {
    components:{Publish,Article},
    data(){
        return{
            triangle_left:'30px',//小三角左侧的距离
        }
    },
    mounted(){
        
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        size(){
            return this.$vuetify.breakpoint.name;
        }
    },
    methods:{
        handleBtnClick(e){
            let left=e.currentTarget.offsetLeft;//按钮左侧距离
            let width=e.currentTarget.clientWidth;//按钮宽度
            this.triangle_left=left+width/2-10+'px'
        }
    }
}
</script>

<style lang='scss' scoped>
    #content{
        width:100%;
        height:auto;
        border-radius: 10px;
        // padding:20px;
        position: relative;
        .background{    
            position: absolute;
            width:100%;
            height:100%;
            left:0;
            top:0;
            //opacity: 0.2;
            border-radius: 5px;
            filter: brightness(85%)
            //background-color: #000;
        }
        .tab-title{
            margin-top:20px;
            width:100%;
            height:35px;
            background-color: #fff;
            border-radius: 5px 5px 0 0;
            position: relative;
            .btn{ 
                position: relative;
                bottom:0;
                height:100%;
                border-radius: 0;
                margin-left:10px;
                background-color: #fff;
            }
        }
        .bottom{
            width:100%;
            height:10px;
            background-color: #fff;
            position: relative;
            margin-top:-2px;
            border:none;
            border-radius: 0 0 5px 5px;
            .triangle{
                border:10px solid transparent;
                position: absolute;
                top:-10px;
                left:30px;
                transition: all .4s ease-out;
                filter: brightness(85%)
            }
        }

        .content-container{
            width:100%;
            height: auto;
            // background-color: #fff;
            border-radius: 5px;
            position: relative;
            .triangle{
                position: absolute;
                border:10px solid transparent;
                border-bottom-color: #fff;
                top:-20px;
                left:30px;
                transition: all .5s ease-out;
            }

            .articles{
                width:100%;
                height:auto;
                position: relative;
                overflow: hidden;
                padding-top:20px;
                // padding: 20px;
            }
        }
    }
</style>