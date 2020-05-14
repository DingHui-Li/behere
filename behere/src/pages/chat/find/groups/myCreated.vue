<template>
    <div class="my-created">
        <div class="top">
            <span>我创建的话题</span>
            <v-btn icon class="btn" @click="$emit('close')"><v-icon>mdi-close</v-icon></v-btn>
        </div>
        <div>
            <!-- <Item /> -->
        </div>
    </div>
</template>

<script>
// import Item from './item'
export default {
    // components:{Item}
}
</script>

<style lang='scss' scoped>
    .my-created{
        width:100%;
        max-height:100vh;
        overflow: auto;
        background-color: #fff;
        .top{
            overflow: hidden;
            line-height: 40px;
            background-color: #e0e0e0;
            font-weight: bold;
            padding-left: 20px;
            .btn{
                float: right
            }
        }
    }
</style>