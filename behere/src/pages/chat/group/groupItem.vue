<template>
    <div id='group-item' v-ripple @click="$router.replace('/group/info/'+data.sn)" :class="selected?'selected':''">
            <div class="avatar">
                <img :src="serverHost+data.profilePhoto" :style="{width:'100%'}"/>
            </div>
        <div class="right">
            <div class="name">{{data.groupName}}</div>
            <div class="count">（{{data.count}}）</div>
        </div>
    </div>
</template>

<script>
export default {
    props:['data','serverHost','selected']
}
</script>

<style lang='scss' scoped>
    .selected{
        filter: brightness(85%)
    }
    #group-item{
        position: relative;
        display: flex;
        cursor: pointer;
        padding:5px;
        padding-right: 10px;
        align-items: center;
        background-color: #fff;
        border-radius: 5px;
        overflow: hidden;
        .avatar{
            float:left;
            position: relative;
            width:40px;
            height:40px;
            border-radius: 50%;
            display: flex;
            overflow: hidden;
            flex-wrap: wrap;
            flex-direction: column;
        }
        .right{
            flex:1;
            overflow: hidden;
            margin-left: 10px;
            display: flex;
            .name{
                font-weight: bold;
                flex: 1;
            }
        }
    }
</style>