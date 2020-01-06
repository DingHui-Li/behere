<template>
    <div id='group-info'>
        <div class="top">群组名称(3)</div>
        <div class="member">
            <div class="tip">群成员</div>
            <div class="members" :style="{maxHeight:showMore?'500px':'140px',overflow:showMore?'auto':'hidden'}">
                <v-btn icon large class="btn"><v-icon>mdi-plus</v-icon></v-btn>
                <v-btn icon large class="btn" @click="deleteMode=!deleteMode"><v-icon>mdi-minus</v-icon></v-btn>
                <div class="avatar-container">
                    <div class="avatar" v-ripple> </div>
                    <div class="btn" v-ripple v-if="deleteMode"><v-icon class="icon">mdi-minus</v-icon></div>
                </div>
                <div class="avatar-container">
                    <div class="avatar" v-ripple> </div>
                    <div class="btn" v-ripple v-if="deleteMode"><v-icon class="icon">mdi-minus</v-icon></div>
                </div>
                <div class="avatar-container">
                    <div class="avatar" v-ripple> </div>
                    <div class="btn" v-ripple v-if="deleteMode"><v-icon class="icon">mdi-minus</v-icon></div>
                </div>
                <div class="avatar-container">
                    <div class="avatar" v-ripple> </div>
                    <div class="btn" v-ripple v-if="deleteMode"><v-icon class="icon">mdi-minus</v-icon></div>
                </div>
                <div class="avatar-container">
                    <div class="avatar" v-ripple> </div>
                    <div class="btn" v-ripple v-if="deleteMode"><v-icon class="icon">mdi-minus</v-icon></div>
                </div>
                <div class="avatar-container">
                    <div class="avatar" v-ripple> </div>
                    <div class="btn" v-ripple v-if="deleteMode"><v-icon class="icon">mdi-minus</v-icon></div>
                </div>
            </div>
            <v-btn depressed @click="showMore=!showMore" :style="{width:'100%',marginTop:'10px'}">
                <v-icon>{{showMore?'mdi-chevron-up':'mdi-chevron-down'}}</v-icon> {{showMore?'收起':'查看全部成员'}}
            </v-btn>
        </div>
        <div class="info-group">
            <div class='item'>
                <div class="tip">群名</div>
                <div class="value">群名称</div>
                <v-menu :close-on-content-click="false" v-model="alterName">
                    <template v-slot:activator='{on}'>
                        <v-btn icon v-on='on'><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                    </template>
                    <div class="alter-name">
                        <v-text-field :counter="20"></v-text-field>
                        <div class="actions">
                            <v-btn depressed class="btn" :style="{backgroundColor:'#F44336',marginRight:'5px'}" @click="alterName=false">取消</v-btn>
                            <v-btn depressed class="btn" :style="{backgroundColor:'#4CAF50'}" @click="alterName=false">确定</v-btn>
                        </div>
                    </div>
                </v-menu>
            </div>
            <div class='item'>
                <div class="tip">群公告</div>
                <div class="notice">
                    <div :style="{flex:1}">顶顶顶顶顶顶顶顶顶顶顶顶是顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶顶 大多数水水水水水水水水水水水水水水水水....................。。。。。。。。。。。。。。。</div>
                    <v-menu :close-on-content-click="false" v-model="alterNotice">
                    <template v-slot:activator='{on}'>
                        <!-- <v-textarea solo flat class="notice" auto-grow append-icon='mdi-circle-edit-outline' @click:append='alterNotice=true' readonly dense
                            :style="{marginLeft:'-13px',height:'fit-content'}" 
                            value="SsssssssssssSss....." /> -->
                            <v-btn icon v-on='on'><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                        </template>
                        <div class="alter-name">
                            <v-textarea :counter="200" :rows="5"/>
                            <div class="actions">
                                <v-btn depressed class="btn" :style="{backgroundColor:'#F44336',marginRight:'5px'}" @click="alterNotice=false">取消</v-btn>
                                <v-btn depressed class="btn" :style="{backgroundColor:'#4CAF50'}" @click="alterNotice=false">确定</v-btn>
                            </div>
                        </div>
                </v-menu>
                </div>
            </div>
            <div class='item'>
                <div class="tip">我在本群的昵称</div>
                <div class="value">昵称</div>
                <v-menu :close-on-content-click="false" v-model="alterNickname">
                    <template v-slot:activator='{on}'>
                        <v-btn icon v-on='on'><v-icon>mdi-circle-edit-outline</v-icon></v-btn>
                    </template>
                    <div class="alter-name">
                        <v-text-field :counter="10"></v-text-field>
                        <div class="actions">
                            <v-btn depressed class="btn" :style="{backgroundColor:'#F44336',marginRight:'5px'}" @click="alterNickname=false">取消</v-btn>
                            <v-btn depressed class="btn" :style="{backgroundColor:'#4CAF50'}" @click="alterNickname=false">确定</v-btn>
                        </div>
                    </div>
                </v-menu>
            </div>
            <div class='item'>
                <div class="tip">消息免打扰</div>
                <v-switch v-model="noWarn" :style="{margin:0}" :color="theme"></v-switch>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            showMore:false,
            alterName:false,//修改群名称
            alterNotice:false,//修改公告
            alterNickname:false,//修改昵称
            noWarn:false,//消息免打扰
            deleteMode:false,//删除模式
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
    #group-info{
        width:100%;
        height:100%;
        background-color:#fff;
        padding:20px;
        overflow: auto;
        .top{
            height:60px;
            font-size: 1.4rem;
        }
        .member{
            .tip{
                color:#858585;
                font-size: 0.9rem;
            }
            .members{
                display: flex;
                flex-wrap: wrap;
                transition: max-height .5s linear;
                .btn{
                    background-color: rgba(0,0,0,.1);
                    margin:5px;
                    width: 60px;
                    height:60px;
                }
                .avatar-container{
                    position: relative;
                    .avatar{
                        width: 60px;
                        height:60px;
                        border-radius: 50%;
                        background-color: green;
                        margin: 5px;
                        overflow: hidden;
                    }
                    .btn{
                        position: absolute;
                        width:20px;
                        height: 20px;
                        background-color: red;
                        border-radius: 50%;
                        right:-5px;
                        top:0;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        .icon{
                            font-size: 1rem;
                            color:#fff
                        }
                    }
                }
            }
        }
        .info-group{
            margin-top: 20px;
            .item{
                margin-bottom: 20px;
                .tip{
                    color: #858585;
                    font-size: 0.9rem;
                }
                .value{
                    display: inline;
                    margin-right: 10px;
                }
                .notice{
                    display: flex;
                    align-items: center;
                    margin-bottom: 10px;
                }
            }
        }
    }
    .alter-name{
        background-color: #fff;
        padding:20px;
        .actions{
            margin-top: 10px;
            text-align: center;
            .btn{
                color:#fff;
            }
        }
    }
</style>