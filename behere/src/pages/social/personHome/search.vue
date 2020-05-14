<template>
    <div id='search'>
        <div class="input-container" :style="{maxWidth:width+'px'}">
            <v-text-field solo flat  dense background-color="rgba(255,255,255,1)"
                placeholder="查找" hide-details :style="{borderRadius: '30px'}" @focus="width=500" @blur="width=140"
                append-icon="mdi-calendar" @click:append='$emit("openDate")'
                v-model="keyword" v-on:keyup.enter='search'
                prepend-inner-icon="mdi-card-search" :color="theme"></v-text-field>
        </div>
        <v-progress-linear indeterminate color="#fff" v-show='loading'></v-progress-linear>
    </div>
</template>

<script>
export default {
    props:['id'],
    computed:{
        theme(){
            return this.$store.state.theme
        },
        apiHost(){
            return this.$store.state.apiHost
        }
    },
    data(){
        return{
            width:140,
            keyword:'',
            loading:false
        }
    },
    mounted(){
        this.search('555')
    },
    methods:{
        search(){
            if(this.keyword.trim().length===0){
                this.$emit('result',null)
                return;
            }
            this.loading=true
            this.axios({
                method:'post',
                url:this.apiHost+`/moment/getUserMomentByContent?contactSn=${this.id}&content=${this.keyword.trim()}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data)
                    //this.split_data(data.data)
                    this.$emit('result',data.data)
                }
            }).finally(()=>{
                this.loading=false;
            })
        },
        split_data(d){
            let data={}
            for(let article of d){
                let date=new Date(article.createTime);
                let year=date.getFullYear();
                let month=date.getMonth()+1;
                let day=date.getDate();
                if(!data[year]) data[year]={}
                if(!data[year][month]) data[year][month]={}
                if(!data[year][month][day]) data[year][month][day]=[]
                data[year][month][day].push(article)
            }
            console.log(data)
            this.$emit('result',data)
        }
    }
}
</script>

<style lang='scss' scoped>
    #search{
        margin-top: 15px;
        overflow: hidden;
        position: relative;
        .input-container{  
            width:100%;
            float:right;
            transition: all .5s;
            margin-bottom: 10px;
        }
    }
</style>