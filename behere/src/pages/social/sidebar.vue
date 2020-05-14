<template>
    <div id='sidebar'>
        <div class="background"></div>
        <div class="item" v-ripple :class="{'item-selected':selected==='home'}" @click="$router.replace('/social')">朋友们</div>
        <div class="item" v-ripple :class="{'item-selected':selected==='look'}"  @click="$router.replace('/social/look')">随便看看</div>
        <div class="item" v-ripple :class="{'item-selected':selected==='notify'}" @click="$router.replace('/social/notify')">
            通知
            <div class="badge" v-if='socialNum>0'>{{socialNum>99?99:socialNum}}</div>
        </div>
        <div class="divider"></div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            selected:this.$route.name
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        socialNum(){
            return this.$store.state.socialNum
        }
    },
    watch:{
        '$route'(route){
            this.selected=route.name
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
            overflow: hidden;
            &:hover{
                cursor: pointer;
            }
            .badge{
                width:25px;
                height:25px;
                background-color: red;
                border-radius: 50%;
                text-align: center;
                float:right;
                line-height: 25px;
                font-size: 0.8rem;
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