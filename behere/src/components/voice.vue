<template>
    <div class="voice-container">
        <div class="voice"  :style="{backgroundColor:theme}" >
            <v-btn depressed fab small class="play-btn" :style="{color:theme}">
                <v-icon  v-if='!isplay' @click="play" class="play-icon">mdi-play</v-icon>
                <v-icon  v-else @click="pause" class="play-icon">mdi-pause</v-icon>
            </v-btn>
            <av-waveform :audio-controls='false' :style="{float:'left',marginLeft:'5px'}"
            :canv-height='30' :canv-width='data.width'
            :playtime-with-ms="false" :playtime="false"
            :playtime-font-size="0"
            playtime-line-color="#757575" noplayed-line-color="#fff"
            playtime-slider-color="#fff"
            :playtime-clickable="true" ref-link='voice' />
            <audio :src="src" ref='voice' @ended="isplay=false"></audio>
            <span class="duration">{{data.duration}}"</span>
        </div>
        <!-- <v-btn fab depressed small class="conversion-btn" @click="conversion" :style="{backgroundColor:theme}"><v-icon>mdi-format-text</v-icon></v-btn> -->
        <v-btn fab depressed small class="delete-btn" @click="$emit('delete')" v-if='!msg'><v-icon>mdi-delete-outline</v-icon></v-btn>
        <!-- <div class="voice2txt" :style="{color:theme}">
            <v-progress-linear class="progress" v-show="loading"
                indeterminate
                :color="theme"
                />
            {{txt}}
        </div> -->
    </div>
</template>

<script>
export default {
    props:['data','msg'],
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        serverHost(){
            return this.$store.state.serverHost;
        },
        src(){
            if(this.data.src&&this.data.src.includes('blob')) return this.data.src;
            else if(this.data.path){
                return this.serverHost+this.data.path
            }
            else return this.serverHost+this.data.src
            
        }
    },
    data(){
        return{
            isplay:false,
            loading:false,
            txt:''
        }
    },
    beforeMount(){
    },
    methods:{
        play(){
            this.isplay=true;
            this.$refs.voice.play()
        },
        pause(){
            this.isplay=false;
            this.$refs.voice.pause()
        },
        async conversion(){
            this.loading=true;
            let file=await this.axios({
                url:this.data.src,
                responseType: 'blob'
            }).then(res=>{
                return res.data
            })
            const fd= new FormData();
            fd.append('file',file,'voice.webm');
            this.axios({
                method:'post',
                url:this.serverHost+'/voice2txt',
                data:fd
            }).then(res=>{
                this.loading=false;
                this.txt=res.data[0];
                console.log(res.data)
                //this.voice2txt=res.data.
            }).catch(()=>{
                this.loading=false;
                this.txt='[识别失败，发生错误]'
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .voice-container{
        width: 100%;
        position: relative;
        overflow: hidden;
        transition: all .5s;
        padding: 3px 0;
        .voice{
            position: relative;
            width: fit-content;
            height:30px !important;
            border-radius: 30px;
            overflow: hidden;
            float: left;
            .play-btn{
                position: relative;
                float: left;
                width:30px;
                height:30px;
                background-color: #fff;
            }
            .duration{
                color:#fff;
                font-size: 1rem;
                margin:0 10px;
                line-height: 30px;
                font-weight: normal;
                color:rgba(255,255,255,.8)
            }
        }
        .conversion-btn{
            width:30px;
            height:30px;
            color:#fff;
            float: left;
            margin-top:10px;
            margin-left: 10px;
            .icon{
                font-size: 1rem
            }
        }
        .delete-btn{
            width:30px;
            height:30px;
            background-color: #D32F2F !important;
            color:#fff;
            float: left;
            margin-left: 10px;
            .icon{
                font-size: 1rem
            }
        }
        .play-icon{
            animation: play-icon .5s;
        }
        .voice2txt{
            clear: both;
            width: fit-content;
            min-width: 100px;
            max-width: 100%;
            position: relative;
            padding: 2px 20px;
            font-size: 0.9rem;
            .progress{
                margin-top:20px;
            }
        }
    }
</style>