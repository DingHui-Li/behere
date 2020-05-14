<template>
    <div id='time-scale'>
        <div class="axis"></div>
        <div class="scale-container">
            <div v-for="year in years" :key="'year-'+year">
                <div class="scale-year" @click="select.year=year">
                    <div :class="['num',select.year===year?'select':'']" v-ripple>{{year}}</div>
                    <div class="line"></div>
                </div>
                <transition-group enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutLeft">
                    <div class="scale-month" v-for="i in (nowYear===year?nowMonth:12)" 
                        :key="'month'+i" v-show="select.year===year" 
                        :style="{animationDelay:i*0.1+'s'}">
                        <div class="line"></div>
                        <div :class="['num',select.month===i?'select':'']" v-ripple @click="select.month=i">{{i}}月</div>
                    </div>
                </transition-group>
            </div>
            <div class="scale-year"  @click="select.year='最近'">
                <div :class="['num',select.year==='最近'?'select':'']" v-ripple>最近</div>
                <div class="line"></div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:['id'],
    data(){
        return{
            nowMonth:new Date().getMonth()+1,
            nowYear:new Date().getFullYear(),
            years:[2019,2020],
            select:{
                year:'最近',
                month:0,
            }
        }
    },
    mounted(){

    },
    computed:{
        apiHost(){
            return this.$store.state.apiHost;
        }
    },
    methods:{
        search(){
            if(isNaN(this.select.year)){
                this.$emit('changeDate',null);
                return;
            }
            let month_days=30;
            let year=this.select.year
            if([1,3,5,7,8,10,12].includes(this.select.month)){
                month_days=31;
            }else if(this.select.month===0){
                month_days=31
            }else if(this.select.month===2){
                if(year % 4 == 0 && year % 100 !== 0 || year % 400 == 0){//闰年
                    month_days=29
                }else{
                    month_days=28
                }
            }
            let startDate=`${this.select.year}-${this.select.month!==0?this.select.month:1}-1`;
            let endDate=`${this.select.year}-${this.select.month!==0?this.select.month:12}-${month_days}`;
            this.$emit('changeDate',{startDate,endDate});
        }
    },
    watch:{
        'select.year'(newVal){
            this.select.month=0;
            this.search()
        },
        'select.month'(newVal){
            if(newVal!==0){
                this.search();
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #time-scale{
        width:100%;
        height:110px;
        position: relative;
        z-index: 1;
        margin-top: 20px;
        .axis{
            width: 100%;
            height:3px;
            border-radius: 5px;
            background-color: #fff;
            opacity: .5;
            position: absolute;
            top:50%;
            transform: translateY(-50%);
            z-index: 3;
            &::after{
                content: '';
                position: absolute;
                border:10px solid transparent;
                border-left-color: #fff;
                right:-10px;
                top:-8px;
            }
        }
        .scale-container{
            width: fit-content;
            position: absolute;
            height:120px;
            top:50%;
            transform: translateY(-50%);
            z-index: 2;
            display: flex;
            flex-wrap: nowrap;
            overflow: hidden;
            .scale-year{
                cursor: pointer;
                width: 55px;
                display: flex;
                align-items: center;
                flex-direction: column;
                transform: translateY(2px);
                padding:0 5px;
                .num{
                    font-size: 1rem;
                    font-weight: bold;
                    background-color: rgba(255,255,255,.3);
                    color:#fff;
                    border-radius: 30px;
                    padding:5px;
                    white-space: nowrap;
                }
                .select{
                    background-color: rgba(0,0,0,.3);
                }
                .line{
                    width: 2px;
                    height:22px;
                    background-color: #fff;
                    opacity: .3;
                }
            }
            .scale-month{
                float:left;
                width:50px;
                padding:5px;
                //margin-top:50px;
                align-self: flex-end;
                display: flex;
                align-items: center;
                flex-direction: column;
                animation-duration: .3s;
                transform: translateX(3px);
                cursor: pointer;
                .num{
                    width:100%;
                    font-size: 0.9rem;
                    background-color: rgba(255,255,255,.3);
                    color:#fff;
                    padding:5px 0;
                    text-align: center;
                    position: relative;
                    border-radius: 5px;
                }
                .select{
                    background-color: rgba(0,0,0,.3);
                }
                .line{
                    width:1px;
                    height:15px;
                    background-color: #fff;
                    opacity: .4;
                }
            }
        }
    }
</style>