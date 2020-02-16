<template>
    <div id='person-home' >
        <div class="user-info">
            <div class="avatar" :style="{backgroundColor:theme}">
                <img :src="serverHost+userInfo.profilePhoto" :style="{width:'100%'}" />
            </div>
            <div class="name">
                {{userInfo.remark?userInfo.remark:userInfo.nickName}}
                <v-icon color='red' v-if='userInfo.sex==="0"' size='20'>mdi-gender-female</v-icon>
                <v-icon color='blue' v-else size='20'>mdi-gender-male</v-icon>
            </div>
            <div class="desc">
                {{userInfo.description&&userInfo.description.length>0?userInfo.description:'咸鱼罢了'}}
            </div>
            <v-btn class="btn" depressed small @click="goInfo">查看资料</v-btn>
        </div>
        <v-tabs grow color='#fff' :style="{borderRadius:'5px'}" background-color='rgba(255,255,255,.2)'>
            <v-tab @click="type='all'" class="tab">动态</v-tab>
            <v-tab @click="type='img'">相册</v-tab>
            <v-tab @click="type='video'">视频</v-tab>
        </v-tabs>
        <TimeScale :id='id' @changeDate="changeDate"/>
        <Search @openDate='dates.open=true' :id='id' @result='v=>searchResult=v'/>
        <transition enter-active-class="animated fadeInRight" leave-active-class="animated fadeOutRight">
            <div class="select-date" v-show="dates.open">
                <v-btn icon class="btn" @click="dates.open=false;selectDate=null"><v-icon>mdi-close</v-icon></v-btn>
                <v-date-picker v-model="dates.value" range full-width :color="theme" locale='ch'></v-date-picker>
            </div>
        </transition>
        <div class="item" v-for="year in Object.keys(data).reverse()" :key="'year-'+year">
            <div class="year">{{year}}<span>年</span></div>
            <div v-for="month in Object.keys(data[year]).reverse()" :key="'month-'+month">
                <div class="day" v-for="day in Object.keys(data[year][month]).reverse()" :key="'day-'+day">
                    <div class="left">
                        <span>{{day}}</span>
                        <span class="month">{{month}}月</span>
                    </div>
                    <div class="right">
                        <Item @openArticle='id=>openArticle={open:true,id}' v-for="data in data[year][month][day]"
                            :key='data.sn' :propData='data' :serverHost='serverHost' :showType='type'/>
                    </div>
                </div>
            </div>
        </div>
        <div :style="{textAlign:'center',marginTop:'10px'}" v-show="nextPage.loading">
            <v-progress-circular indeterminate :color="theme"></v-progress-circular>
        </div>
        <div class="no-more" v-show="!nextPage.loading&&!isMore">没有更多了</div>
        <div :style="{zIndex:3,position:'relative',width:'100%',height:'10px',backgroundColor:'rgba(0,0,0,0)'}"
            v-intersect="loadMore"></div>
        <v-dialog v-model="openArticle.open" width="600">
            <Content @close='openArticle.open=false' :momentId='openArticle.id' :userInfo='userInfo' @deleteOne='deleteOne'/>
        </v-dialog>
    </div>
</template>

<script>
import Item from './item'
import Content from './content'
import TimeScale from './timeScale'
import Search from './search'
export default {
    components:{Item,Content,TimeScale,Search},
    props:['id'],
    data(){
        return{
            openArticle:{//打开详情
                open:false,
                id:0
            },
            dates:{//打开日历
                open:false,
                value:[]
            },
            userInfo:{},
            data:{},
            selectDate:null,//选择的日期 {startDate，endDate}
            nextPage:{//下一页
                page:0,
                total:10+1,
                size:10,
                loading:false
            },
            type:'all',///显示的动态类型--tab
            searchResult:null//搜索结果=>data
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
        isMore(){//是否还有更多
            return (this.nextPage.page+1)*this.nextPage.size<this.nextPage.total
        },
    },
    mounted(){
        this.getUserInfo();
        this.getData();
    },
    methods:{
        getUserInfo(){
            this.axios({
                method:'get',
                url:this.apiHost+'/user/getUserInfo?userSn='+this.id
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    this.userInfo=data;
                }
            })
        },
        getData(){
            this.nextPage.loading=true;
            this.axios({
                method:'post',
                url:this.apiHost+`/moment/getUserMoment?contactSn=${this.id}&page=${this.nextPage.page}&size=${this.nextPage.size}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    this.nextPage.total=data.totalElement;
                    this.splitData(data.data)
                }
            }).finally(()=>{
                this.nextPage.loading=false;
            })
        },
        changeDate(date){
            if(date) this.selectDate={startDate:date.startDate,endDate:date.endDate}
            else this.selectDate=date;
        },
        getDataByDate(){
            this.nextPage.loading=true;
            this.axios({
                method:'post',
                url:this.apiHost+`/moment/getUserMomentByTime?contactSn=${this.id}&startTime=${this.selectDate.startDate}&endTime=${this.selectDate.endDate}&&page=${this.nextPage.page}&size=${this.nextPage.size}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    this.nextPage.total=data.totalElement;
                    this.splitData(data.data)
                }
            }).finally(()=>{
                this.nextPage.loading=false;
            })
        },
        splitData(data){
            for(let article of data){
                let date=new Date(article.createTime);
                let year=date.getFullYear();
                let month=date.getMonth()+1;
                let day=date.getDate();
                if(!this.data[year]) this.$set(this.data,year,{})
                if(!this.data[year][month]) this.$set(this.data[year],month,{})
                if(!this.data[year][month][day]) this.$set(this.data[year][month],day,[])
                this.data[year][month][day].push(article)
            }
        },
        loadMore(entries){
            if(entries[0].isIntersecting){
                if(this.isMore&&!this.nextPage.loading&&!this.searchResult){
                    this.nextPage.page++;
                }
            }
        },
        initData(){
            this.nextPage={
                page:0,
                total:10+1,
                size:10,
                loading:false
            };
            this.data={};
        },
        goInfo(){
            this.$store.commit('updateOpenFriend',this.id);
            this.$router.replace('/friends/info')
        },
        deleteOne(params){//{date,id}
            try{
                let d=new Date(params.date);
                let year=d.getFullYear();
                let month=d.getMonth()+1;
                let day=d.getDate();
                let data=this.data[year][month][day];
                for(let i in data){
                    if(data[i].sn===params.id){
                        this.data[year][month][day].splice(i,1);
                        break;
                    }
                }
            }catch(err){
                console.log(err)
            }
        }
    },
    watch:{
        id(){
            if(this.id){
                this.initData()
                this.getUserInfo();
                this.getData();
                this.$nextTick(()=>{
                    document.documentElement.scrollTop=0;
                })
            }
        },
        selectDate(newVal){
            this.initData()
            if(newVal){
                this.getDataByDate();
            }else{
                this.getData();
            }
        },
        'nextPage.page'(newVal){
            if(newVal!==0){
                if(this.selectDate){
                    this.getDataByDate()
                }else{
                    this.getData();
                }
            }
        },
        'dates.value'(newVal){
            if(newVal.length>1){
                let date1=new Date(newVal[0]).getTime();
                let date2=new Date(newVal[1]).getTime();
                if(date1<date2){
                    this.selectDate={startDate:newVal[0],endDate:newVal[1]}
                }else{
                    this.selectDate={startDate:newVal[1],endDate:newVal[0]}
                }
            }
        },
        searchResult(newVal){
            this.initData()
            if(newVal){
                this.splitData(newVal)
            }
            else{
                this.getData()
            }
        },
        '$route'(route){
            if(route.name==='person'){
                document.documentElement.scrollTop=0
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #person-home{
        width: 100%;
        height:100%;
        min-height: 100vh;
        position: relative;
        border-radius: 10px;
        overflow: hidden;
        padding:20px;
        z-index:3;
        // .bg{
        //     position: absolute;
        //     z-index: 0;
        //     width: 100%;
        //     height:100%;
        //     left:0;
        //     top:0;
        //     filter: brightness(85%);
        // }
        .user-info{
            margin: 0 auto;
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 20px;
            .avatar{
                width:80px;
                height: 80px;
                overflow: hidden;
                border-radius: 50%
            }
            .name{
                font-weight: bold;
                color:#fff;
                font-size: 1.2rem;
                margin: 10px 0;
            }
            .desc{
                font-size: 0.9rem;
                color:#e0e0e0;
            }
            .btn{
                margin-top:10px;
                background-color:rgba(255,255,255,.2);
                color:#fff;
                position: absolute;
                right:0;
            }
        }
        .tab{
            height:40px;
        }
        .select-date{
            padding:20px;
            padding-right: 0;
            position: relative;
            animation-duration: .5s;
            .btn{
                position: absolute;
                z-index: 3;
                top:20px;
                right: 0;
                background-color: rgba(0,0,0,.2);
                color:#fff;
            }
        }
        .item{
            z-index:9;
            position: relative;
            .year{
                font-weight: bold;
                font-size: 3rem;
                color:#fff;
                position: relative;
                //padding-left: 10px;
                // &::before{
                //     content:'';
                //     width:10px;
                //     height:50%;
                //     background-color: #fff;
                //     position: absolute;
                //     left:0;
                //     top:60%;
                //     transform: translateY(-50%)
                // }
                span{
                    font-size:1.5rem;
                    font-weight: normal;
                    margin-left: 5px;
                }
            }
            .day{
                position: relative;
                width: 100%;
                padding-top: 20px;
                display: flex;
                overflow: hidden;
                .left{
                    position: absolute;
                    width: 100px;
                    text-align: center;
                    color:#fff;
                    overflow: hidden;
                    span{
                        font-size: 2.7rem;
                        font-weight: bold;
                        //font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif
                    }
                    .month{
                        font-size: 1rem;
                        font-weight: normal;
                        margin-left: 5px;
                    }
                }
                .right{
                    flex:1;
                    margin-left: 100px;
                }
            }
        }
        .no-more{
            text-align: center;
            position: relative;
            z-index: 2;
            margin-top: 10px;
            color:#fff;
        }
    }
    @font-face{
        font-family:'造字工房力黑常规体';
        src:url('../../../assets/font/造字工房力黑常规体.ttf')
    }
</style>