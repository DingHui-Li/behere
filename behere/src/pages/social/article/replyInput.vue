<template>
    <div id='replyInput' v-intersect='onIntersect' v-show="show">
        <v-textarea counter="500" auto-grow :rows='1' class="textarea" :placeholder="placeHolder" v-model="text" :color='theme'></v-textarea>
        <v-btn color="primary" class="btn" :disabled="text.trim().length===0" @click="submit">发布</v-btn>
    </div>
</template>

<script>
export default {
    props:['show','placeHolder','userId','userName','contentId','type'],
    computed:{
        size(){
            return this.$vuetify.breakpoint.name;
        },
        theme(){
            return this.$store.state.theme
        },
        apiHost(){
            return this.$store.state.apiHost
        },
        myInfo(){
            return this.$store.state.myInfo
        }
    },
    data(){
        return{
            text:'',
        }
    },
    methods:{
        onIntersect(entries){
            let isIntersecting=entries[0].isIntersecting;
            if(this.show){
                if(!isIntersecting) this.$emit('hidden')
            }
        },
        submit(){
            this.$emit('hidden');
            this.axios({
                method:'post',
                url:this.apiHost+'/moment/addMomentComment',
                data:{
                    to:this.userId,
                    momentSn:this.contentId,
                    type:this.type,
                    content:this.text.trim()
                }
            }).then(res=>{
                if(res.data.code==='10000'){
                    let time=new Date().getTime();
                    let data={
                        content:this.text,
                        from:this.myInfo.id,
                        fromNickName:this.myInfo.name,
                        sendTime:time,
                        sn:time,
                        to:this.userId,
                        toNickName:this.userName,
                        type:this.type
                    }
                    this.$emit('addComment',data)
                    this.$emit('snackbar',{text:'评论成功',color:'success'})
                    this.text=''
                }else{
                    this.$emit('snackbar',{text:'评论失败',color:'error'})
                }
            })
        }
    }
}
</script>

<style lang='scss' >
    #replyInput{
        position: relative;
        width:100%;
        overflow: hidden;
        padding:5px 5px;
        .btn{
            width:50px;
            position: absolute;
            top:10px;
            right:5px;
        }
        .textarea{
            display: inline-block;
            width: calc(100% - 70px);
            position: relative;
        }
    }
    textarea{
        margin-top:0 !important;
    }
</style>