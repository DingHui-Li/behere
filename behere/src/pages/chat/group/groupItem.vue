<template>
    <div id='group-item' v-ripple>
            <div class="avatar">
                <div class="item" :style="{backgroundColor:'red',flex:'50%'}"></div>
                <div class="item" :style="{backgroundColor:'blue',flex:'50%'}"></div>
                <div class="item" :style="{backgroundColor:'pink',flex:'50%'}"></div>
            </div>
        <div class="right">
            <div class="top">
                <div class="name">群名称（9）</div>
                <div class="time">昨天</div>
            </div>
            <div class="msg">最近一条消息，嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻 嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻嘻</div>
        </div>
        
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss' scoped>
    #group-item{
        position: relative;
        display: flex;
        cursor: pointer;
        padding:5px;
        padding-right: 10px;
        align-items: center;
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
            .item{
                width:50%;
                height:50%;
            }
        }
        .right{
            flex:1;
            overflow: hidden;
            margin-left: 10px;
            .top{
                overflow: hidden;
                display: flex;
                .name{
                    font-weight: bold;
                }
                .time{
                    flex: 1;
                    text-align: right;
                    font-size: 0.8rem;
                    color:#959595;
                }
            }
            
            .msg{
                font-size: 0.8rem;
                color: #757575;
                white-space: nowrap;
                overflow: hidden;
            }
        }
    }
</style>