<template>
    <div id='emoji'>
        <v-row>
            <!-- <v-col cols='3' v-for='i in data' :key="'emoji'+i">
                <v-img class="img" :src="serverHost+`/public/emoji/${i}`" aspect-ratio="1" v-ripple @click="send(i)">
                <template v-slot:placeholder>
                    <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                    >
                    <v-progress-circular indeterminate></v-progress-circular>
                    </v-row>
                </template>
                </v-img>
            </v-col> -->
            <v-tabs>
                <v-tab v-for="(t,index) in type" :key="'emojiType'+index" :style="{padding:'20px 0'}">{{t}}</v-tab>
                <v-tab-item v-for="(t,index) in type" :key="'emoji'+index" :style="{ maxHeight:'300px',overflow:'auto'}">
                    <img v-for="(emoji,index) in data[t]" :key="'emoji'+index" 
                    @click="send('/public/emoji/'+t+'/'+emoji)"
                    :src="serverHost+'/public/emoji/'+t+'/'+emoji" class="emoji">
                </v-tab-item>
            </v-tabs>
        </v-row>
        
    </div>
</template>

<script>
export default {
    props:['id'],
    data(){
        return{
            data:[]
        }
    },
    created(){
        this.axios({
            url:this.serverHost+'/emoji/get',
            method:'get',
        }).then(res=>{
            this.data=res.data;
        })
    },
    computed:{
        serverHost(){
            return this.$store.state.serverHost;
        },
        type(){
            return Object.keys(this.data)
        }
    },
    methods:{
        send(src){
            let data={
                id:this.$store.state.msgData.length+1,
                from:this.$store.state.myInfo.id,
                content:src,
                type:'emoji',
                to:this.id,
                status:'success',
                time:new Date().getTime()
            }
            this.$store.commit('newMsg',data);
            this.$emit('send',data.content,'emoji',data.id);
            this.$nextTick(()=>{
                this.$emit('toBottom')
            })
            this.$emit('close')
        }
    }
}
</script>

<style lang='scss' scoped>
    #emoji{
        background-color: #fff;
        max-width: 450px;
        overflow: hidden;
        padding:15px;
        .img{
            width:100px;
            height:100px;
            float:left;
        }
        .emoji{
            margin:3px;
            cursor: pointer;
        }
    }
</style>