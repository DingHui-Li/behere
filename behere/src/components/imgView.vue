<template>
    <transition name='fade'>
    <div class="imgview-container" v-show="open!==-1" @touchmove.prevent>
        <v-btn depressed fab small class="closebtn" @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
        <swiper :options='swiperOption' class="swiper" ref='imgSwiper'>
            <swiper-slide v-for="(img,index) in imgs" :key="'swiperimg'+index" class="swiper-item">
                <swiper :options='swiper2Option' class="swiper">
                    <swiper-slide class="swiper-item">
                        <div class="swiper-zoom-container">
                            <img :src="imgPath(img)" alt="" class="img"/>
                        </div>
                    </swiper-slide>
                </swiper>
            </swiper-slide>
            <div class="swiper-pagination"  slot="pagination" ></div>
        </swiper>
    </div>
    </transition>
</template>

<script>
export default {
    props:['imgs','open'],
    data(){
        return{
            swiperOption:{
                zoom : true,
                pagination: {
                    el: '.swiper-pagination',
                },
            },
            swiper2Option:{
                direction : 'vertical',
                on:{
                    touchMove:e=>{
                        if(e.y<40||e.y>700){
                            this.$emit('close')
                        }
                    }
                },
            }
        }
    },
    computed:{
        swiper(){
            return this.$refs.imgSwiper.swiper;
        }
    },
    methods:{
        imgPath(path){//图片路径
            if(path.includes('blob')) return path;
            else return this.$store.state.serverHost+path;
        },
    },
    mounted(){
        if(this.open) this.swiper.slideTo(this.open,0);
    },
    watch:{
        open:function(newVal){
            if(newVal!==-1) this.swiper.slideTo(newVal);
        }
    }
}
</script>

<style lang='css' scoped>
    .imgview-container{
        width:100vw !important;
        height:100vh !important;
        position: fixed;
        left:0;
        top:0;
        z-index: 999999999;
        padding:0;
        margin:0;
        background-color: rgba(0,0,0,.7);
    }
    .closebtn{
        position: absolute;
        top:20px;
        right: 30px;
        background-color: rgba(255,255,255,.6) !important;
        z-index: 9;
    }
    .swiper{
        position: relative;
        width: 100%;
        height: 100%;
    }
    .swiper-item{
        position: relative;
        height: 100%;
        width:100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .img{
        position: relative;
        max-width:100%;
        max-height:100%;
    }

    .fade-enter-active, .fade-leave-active {
        transition: all .3s ease-out;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        transform: translateY(100%)
    }
</style>