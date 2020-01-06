<template>
    <div id='setting'>
        <v-tabs vertical :color='theme.isBlack()?"#000":theme'>
            <v-tab class="tab-name">常规</v-tab>
            <v-tab class="tab-name">聊天</v-tab>
            <v-tab class="tab-name">关于</v-tab>
            <v-tab-item class="tab-item">
                <div class="item">
                    <v-icon>mdi-format-horizontal-align-right</v-icon>
                    <span>过渡动画</span>
                    <v-switch v-model='tranSwitch' :color='theme' @change="(value)=>$store.commit('updateTransition',value)"></v-switch>
                </div>
                <div class="item">
                    <v-icon>mdi-format-color-fill</v-icon>
                    <span>主题颜色</span>
                    <v-menu offset-y :closeOnContentClick='false'>
                        <template v-slot:activator="{ on }">
                            <v-btn v-on="on" :style="{backgroundColor:theme}" class="elevation-2" depressed fab small></v-btn>
                        </template>
                        <v-card>
                            <v-color-picker v-model="color" show-swatches></v-color-picker>
                            <v-btn @click="$store.commit('updateTheme',color)" :style="{width:'100%',fontWeight:'bold',fontSize:'1.1rem'}">应用</v-btn>
                        </v-card>
                    </v-menu>
                </div>
                <div class="item">
                    <v-icon>mdi-bell-ring</v-icon>
                    <span>提醒音效</span>
                    <v-switch v-model='beep' :color='theme'></v-switch>
                </div>
            </v-tab-item>
            <v-tab-item>2</v-tab-item>
            <v-tab-item>
                <About />
            </v-tab-item>
        </v-tabs>
    </div>
</template>

<script>
import About from './about'
export default {
    components:{About},
    data(){
        return{
            color:'',
            tranSwitch: this.$store.state.transition,
            beep:this.$store.state.beep==='true'
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme
        },
        transition(){
            return this.$store.state.transition;
        }
    },
    watch:{
        beep(newVal){
            if(newVal){
                this.$store.commit('updateBeep','true')
            }else{
                this.$store.commit('updateBeep','false')
            }
        }
    }
}
</script>

<style lang='scss' scoped>
    #setting{
        width: 100%;
        height:100%;
        padding:20px;
        animation-duration: .3s;
        .tab-name{
            font-weight: bold;
        }
        .tab-item{
            .item{
                display: flex;
                align-items: center;
                span{
                    margin-left: 20px;
                    margin-right: 50px;
                    font-weight: bold;
                    color:#454545;
                }
            }
        }
    }
</style>