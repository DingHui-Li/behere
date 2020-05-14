<template>
    <div class="find-users">
        <div class="top">也许你想认识的人</div>
        <swiper :options='swiperOpt' class="swiper-container" ref='swiper' >
            <swiper-slide v-for="(user,index) in data" :key='user.sn' :style="{maxWidth:'500px'}">
                <Item :serverHost='serverHost' :theme='theme' :data='user' :index='index+1'
                        @handleClick='handleClick(index)'/>
            </swiper-slide>
            <!-- <swiper-slide :style="{maxWidth:'250px'}">
                <Item :serverHost='serverHost' :theme='theme' @handleClick='handleClick("refresh")' 
                    :refresh='true' :loading='loading'/>
            </swiper-slide> -->
            <!-- <div class="swiper-button-prev" slot="button-prev"><v-icon :size='40'>mdi-chevron-double-left</v-icon></div>
            <div class="swiper-button-next" slot="button-next"><v-icon :size='40'>mdi-chevron-double-right</v-icon></div> -->
        </swiper>
    </div>
</template>

<script>
import Item from './item'
export default {
    components:{Item},
    //el: '#stack',
    data(){
        return{
            data:[],
            loading:false,
            swiperOpt:{
                slidesPerView:'auto',
                spaceBetween :40,
                centeredSlides : true,
                mousewheel: true,
                grabCursor: true,
                // navigation: {
                //     nextEl: '.swiper-button-next',
                //     prevEl: '.swiper-button-prev'
                // }
            }
        }
    },
    computed:{
        serverHost(){
            return this.$store.state.serverHost
        },
        apiHost(){
            return this.$store.state.apiHost
        },
        theme(){
            return this.$store.state.theme
        },
        swiper(){
            return this.$refs.swiper.swiper
        },
        date(){
            let d=new Date();
            return d.getMonth()+'月'+d.getDay()+'日'
        }
    },
    created(){
        this.getData();
    },
    methods:{
        handleClick(index){
            if(index==='refresh'){
                this.getData()
                return
            }
            if(this.swiper.activeIndex===index){
                this.$store.commit('updateOpenFriend',this.data[index].sn);
                this.$router.replace('/friends/info')
            }else{
                this.swiper.slideTo(index)
            }
        },
        getData(){
            this.loading=true
            this.axios({
                method:'get',
                url:this.apiHost+'/find/findFriend'
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.data=res.data.data
                    this.swiper.slideTo(0,1500)
                }
            }).finally(()=>{
                this.loading=false
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .find-users{
        position: relative;
        overflow: hidden;
        .top{
            font-weight: bold;
            font-size: 1.3rem;
            padding:20px;
            padding-bottom: 0;
        }
        .swiper-container{
            padding:20px;
            cursor: pointer;
        }
        .swiper-button-prev,.swiper-button-next{
            background-image:none;
        }
        .swiper-slide-active{
            //transform: scale(1.1)
        }
    }
</style>