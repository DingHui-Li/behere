<template>
        <div class="users-item elevation-2" @click='$emit("handleClick")'>
            <!-- <v-img :src="serverHost+'/public/avatar.png'" class="bg" /> -->
            <div class="avatar" v-if='!refresh'>
                <v-img :src="serverHost+data.profilePhoto" :style="{width:'100%',height:'100%'}"/>
            </div>
            <div class="right" :style="{backgroundColor:color?`${color}`:'#fff',color:color&&color.isBlack()?'#454545':'#fff'}"  
                v-if='!refresh'>
                <div class="name">{{data.nickName}}
                    <v-icon color='red' v-if='data.sex==="0"' size='20'>mdi-gender-female</v-icon>
                    <v-icon color='blue' v-else size='20'>mdi-gender-male</v-icon>
                </div>
                <div class="age">{{age}}岁</div>
                <div class="desc">{{data.description}}</div>
                <div class="location"><v-icon class="icon">mdi-map-marker</v-icon>{{location}}</div>
                <div class="num">{{index}}<span>/5</span> </div>
            </div>
            <div  v-if='refresh' class="refresh">
                <BreedingRhombusSpinner :animation-duration='2000' :size='250' v-if='loading' :color='theme'/>
                <v-btn depressed v-else class="btn" :style="{backgroundColor:theme,color:'#fff'}"> 换一换</v-btn>
            </div>
        </div>
</template>

<script>
import  ColorThief from 'colorthief'
import {BreedingRhombusSpinner} from 'epic-spinners'
export default {
    components:{BreedingRhombusSpinner},
    props:['serverHost','theme','index','data','refresh','loading'],
    data(){
        return{
            color:null
        }
    },
    computed:{
        location(){
            try{
                return JSON.parse(this.data.location).name
            }catch(err){
                return '中国'
            }
        },
        age(){
            let year=new Date().getFullYear()
            let birth=new Date(this.data.birthday).getFullYear()
            return year-birth
        }
    },
    mounted(){
        if(!this.refresh)
            this.getColor();
    },
    methods:{
        getColor(){
            const colorThief=new ColorThief();
            this.axios({
                url:this.serverHost+this.data.profilePhoto,
                responseType:'blob'
            }).then(async res=>{
                let img=new Image();
                img.src=window.URL.createObjectURL(res.data);
                const _this=this
                img.onload=async function(){
                    let color=await colorThief.getColor(this);
                    _this.color=_this.rgbToHex(color)
                }
            })
        },
        rgbToHex(color){
            return '#' + color.map(x => {
                const hex = x.toString(16)
                return hex.length === 1 ? '0' + hex : hex
            }).join('')
        }
    },
}
</script>

<style lang='scss' scoped>
        .users-item{
            display: flex;
            //width: 500px;
            width: 100%;
            //margin:0 auto;
            height:250px;
            border-radius: 10px;
            align-items: center;
            //flex-direction: column;
            //background-color: #2196F3;
            overflow: hidden;
            position: relative;
            .bg{
                position: absolute;
                width: 100%;
                height:100%;
                left:0;
                top:0;
                z-index: 0;
                filter: blur(10px);
                transform: scale(1.2)
            }
            .avatar{
                // width: 70px;
                height:100%;
                width:250px;
                //border-radius: 50%;
                overflow: hidden;
            }
            .right{
                flex: 1;
                z-index: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color:#fff;
                position: relative;
                height:100%;
                overflow: hidden;
                .name{
                    font-size: 1.2rem;
                    font-weight: bold;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .age{
                    margin:7px 0;
                }
                .desc{
                    margin: 7px 0;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .location{
                    text-align: center;
                    .icon{
                        color:inherit
                    }
                }
                .num{
                    position: absolute;
                    right: 10px;
                    top:10px;
                    span{
                        font-size: 1.2rem;
                    }
                }
            }
            .refresh{
                width: 100%;
                height: 100%;
                text-align: center;
                background-color: #fff;
                position: relative;
                .btn{
                    position: absolute;
                    top:50%;
                    left: 50%;
                    transform: translate(-50%,-50%);
                }
            }
        }
</style>