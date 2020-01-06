<template>
    <div id='sidebar'>
        <div class="background"></div>
        <div class="item" v-ripple :class="{'item-selected':selected===0}" @click="selected=0">朋友们</div>
        <div class="item" v-ripple :class="{'item-selected':selected===1}" @click="selected=1">随便看看</div>
        <div class="item" v-ripple :class="{'item-selected':selected===2}" @click="selected=2">提到我的</div>
        <div class="divider"></div>
        <div class="item last-item" v-ripple :class="{'item-selected':selected===3}" @click="selected=3">
            朋友们
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selected:0
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        }
    }
}
</script>

<style lang='scss' scoped>
    #sidebar{
        width:100%;
        min-height:50vh;
        padding-top:20px;
        border-radius: 10px;
        position: relative;
        .background{
            position: absolute;
            width:100%;
            height:100%;
            top:0;
            left:0;
            background:#000;
            opacity: 0.2;
            border-radius: 5px;
        }
        .item{
            position: relative;
            padding:10px 20px;
            font-weight: bold;
            color:#fff;
            &:hover{
                cursor: pointer;
            }
        }
        .item-selected{
            transition: all .5s;
            background-color: rgba(255,255,255,.1);
        }
        .divider{
            position: relative;
            width:calc(100% - 30px);
            height:1px;
            background-color: rgba(255,255,255,.5);
            left:50%;
            transform: translateX(-50%);
            margin:20px 0;
        }
    }
</style>