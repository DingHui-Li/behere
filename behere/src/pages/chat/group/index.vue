<template>
    <div id='group'>
        <div class="side">
            <div class="search-box">
                <Search />
            </div>
            <div class="groups">
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
                <GroupItem />
            </div>
        </div>
        <div class="content">
            <GroupInfo />
        </div>
    </div>
</template>

<script>
import GroupItem from './groupItem'
import Search from '../components/search/'
import GroupInfo from './groupInfo'
export default {
    components:{GroupItem,Search,GroupInfo}
}
</script>

<style lang='scss' scoped>
    #group{
        width:100%;
        height:100%;
        display: flex;
        animation-duration: .3s;
        .side{
            flex:4;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            .search-box{
                height:60px;
                margin-top: 10px;
            }
            .groups{
                flex: 1;
                overflow: auto;
            }
        }
        .content{
            flex:9;
            background-color: blue;
        }
    }
</style>