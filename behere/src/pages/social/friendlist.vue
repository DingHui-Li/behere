<template>
    <div id="friend-list">
        <v-expansion-panels :accordion="true" :focusable='true'>
            <v-expansion-panel>
                <v-expansion-panel-header>
                    我的好友（3/6）
                </v-expansion-panel-header>
                <v-expansion-panel-content class="friends">
                    <draggable v-model="friends">
                        <transition-group name='firend-item'>
                            <div class="one-friend" v-for="i in friends" :key="'friend'+i">
                                <div class="avatar" v-ripple></div>
                                <div class="user">
                                    <div class="name text-truncate">好友{{i}}</div>
                                    <div class="desc text-truncate">这个人很懒，什么都没有留下ssssssssssdasdas</div>
                                </div>
                            </div>
                        </transition-group>
                    </draggable>
                </v-expansion-panel-content>
            </v-expansion-panel>

            <v-expansion-panel>
                <v-expansion-panel-header>
                    自定义分组
                </v-expansion-panel-header>
                <v-expansion-panel-content class="friends">
                        <div class="one-friend" v-for="i in 20" :key="'friend'+i">
                            <div class="avatar" v-ripple></div>
                            <div class="user">
                                <div class="name text-truncate">好友{{i}}</div>
                                <div class="desc text-truncate">这个人很懒，什么都没有留下ssssssssssdasdas</div>
                            </div>
                        </div>
                </v-expansion-panel-content>
            </v-expansion-panel>
        </v-expansion-panels>
    </div>
</template>

<script>
import draggable from 'vuedraggable'
export default {
    components:{draggable},
    data(){
        return{
            friends:[]
        }
    },
    mounted(){
        for(let i=0;i<20;i++){
            this.friends.push(i);
        }
    }
}
</script>

<style lang='scss' scoped>
    $avatar-size:45px;
    #friend-list{
        width:100%;
        height:fit-content;
        max-height:80vh;
        background-color: #fff;
        position: relative;
        overflow-y: hidden;
        padding-top:20px;
        .friends{
            position: relative;
            height:70vh;
            overflow-y: scroll;
            padding-right: 0;
            .firend-item-move{
                transition: transform .5s;
            }
            .one-friend{
                width: 100%;
                height:$avatar-size;
                overflow: hidden;
                position: relative;
                margin-bottom: 20px;
                .avatar{
                    position: absolute;
                    width:$avatar-size;
                    height:$avatar-size;
                    border-radius: 50%;
                    background-color: green;
                    z-index: 2;
                }
                .user{
                    position: absolute;
                    z-index: 1;
                    padding-left:$avatar-size+5;
                    height:fit-content;
                    width: 100%;
                    top:50%;
                    transform: translateY(-50%);
                    .name{
                        font-weight: bold;
                        font-size: 0.9rem;
                        color:#454545;
                    }
                    .desc{
                        font-size: 0.8rem;
                        color:#959595;
                    }
                }
            }
        }
    }
</style>