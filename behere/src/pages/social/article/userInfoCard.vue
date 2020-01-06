<template>
    <v-card id="user-info-card" :style="{backgroundColor:theme}">
        <div class="triangle" :style="{borderBottomColor:theme}"></div>
        <div class="name" :style="{color:theme.isBlack()?'#000':'#fff'}">任我行</div>
        <div class="desc" :style="{color:theme.isBlack()?'#000':'#fff'}">xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx</div>
    </v-card>
</template>

<script>
export default {
    computed:{
        theme(){
            return this.$store.state.theme;
        },
    }

}
</script>

<style lang='scss' scoped>
    #user-info-card{
        padding:20px;
        max-width: 400px;
        color:#fff;
        margin-top:8px;
        position: relative;
        box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12) !important;
        &:hover{
            cursor: pointer;
        }
        .triangle{
            position: absolute;
            top:-18px;
            left:10px;
            display: block;
            border:10px solid transparent;
        }
        .name{
            font-weight: bold;
            filter: grayscale(100%)
        }
        .desc{
            font-size: 0.8rem;
            opacity: 0.7;
        }
    }
</style>