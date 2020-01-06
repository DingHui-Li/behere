<template>
    <div id='replyInput' :style="{paddingLeft:size==='xs'?'0':'70px'}" v-intersect='onIntersect' v-show="show">
        <v-textarea counter="500" solo auto-grow :rows='1' class="textarea" placeholder="回复 子木" v-model="text" ></v-textarea>
        <v-btn color="primary" class="btn" :disabled="text.trim().length===0">发布</v-btn>
    </div>
</template>

<script>
export default {
    props:['show'],
    computed:{
        size(){
            return this.$vuetify.breakpoint.name;
        }
    },
    data(){
        return{
            text:'',
            hidden:true,
        }
    },
    methods:{
        onIntersect(entries){
            let isIntersecting=entries[0].isIntersecting;
            if(this.show){
                if(!isIntersecting) this.$emit('hidden')
            }
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
            width:calc(100% - 70px);
            position: relative;
        }
    }
    textarea{
        margin-top:0 !important;
    }
</style>