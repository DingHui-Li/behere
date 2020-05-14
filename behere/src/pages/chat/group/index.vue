<template>
    <div id='group'>
        <div class="side">
            <div class="search-box">
                <Search />
            </div>
            <div class="newGroup" v-ripple @click="$router.replace('/group/new')">
                <div class="bg" :style="{backgroundColor:theme}"></div>
                <v-icon class="icon">mdi-account-multiple-plus</v-icon>
                <span class="icon">新的群组</span> 
                <!-- <div class="badge" v-if='badge>0'>{{badge>99?99:badge}}</div> -->
                <v-icon :style="{float:'right'}" class="icon">mdi-chevron-right</v-icon>
            </div>
            <div class="groups">
                <GroupItem v-for="group in data" :key='group.sn' :data='group' :serverHost='serverHost' :selected='group.sn===selectId'/>
            </div>
        </div>
        <div class="content">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import GroupItem from './groupItem'
import Search from '../components/search/'
export default {
    components:{GroupItem,Search},
    data(){
        return{
            selectId:''
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        apiHost(){
            return this.$store.state.apiHost;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        data(){
            return this.$store.state.groups;
        }
    },
    mounted(){
        if(this.$route.name==='groupInfo'){
            this.selectId=this.$route.params.id;
        }
    },
    watch:{
        '$route'(route){
            if(route.name==='groupInfo'){
                this.selectId=route.params.id;
            }else{
                this.selectId=''
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #group{
        width:100%;
        height:100%;
        display: flex;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        background-color: #fff;
        position: relative;
        border-radius: 0 20px 20px 0;
        .side{
            flex:4;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            position: relative;
            padding:0 5px;
            .search-box{
                height:60px;
                margin-top: 10px;
            }
            .newGroup{
                padding:10px 23px;
                padding-right: 10px;
                border-radius: 5px;
                margin-bottom: 10px;
                overflow: hidden;
                position: relative;
                cursor: pointer;
                //color: #fff;
                display: flex;
                justify-content: space-around;
                .icon{
                    position: relative;
                    z-index: 9;
                    color:#fff;
                    margin-right: 10px;
                }
                .bg{
                    position: absolute;
                    width: 100%;
                    height:100%;
                    top:0;
                    left:0;
                   // z-index: -1;
                    opacity: .7;
                }
            }
            .groups{
                flex: 1;
                overflow: auto;
            }
        }
        .content{
            flex:9;
            position: relative;
            overflow: hidden;
        }
    }
</style>