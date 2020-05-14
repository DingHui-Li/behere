<template>
    <div class="cropper elevation-1">
        <div :style="{width:'500px',height:'500px'}">
            <VueCropper  ref='cropper' :img='img' @realTime='preview'
            :fixed='true' :maxImgSize='1000' :info='false'
            :outputSize='0.5' :fixedBox='true' :autoCrop='true' :canMoveBox='false' :centerBox='true'/>
        </div>
        <div class="right">
            <div class="preview" :style="{flex:1}">
                <div v-if='avatarPreview' class="preview-item"
                :style="{width:avatarPreview.w+'px',height:avatarPreview.h+'px',zoom:40/avatarPreview.w}" >
                    <div :style="avatarPreview.div" class="img">
                        <img :src="avatarPreview.url" :style="avatarPreview.img">
                    </div>
                </div>
                <div v-if='avatarPreview' class="preview-item"
                :style="{width:avatarPreview.w+'px',height:avatarPreview.h+'px',zoom:60/avatarPreview.w}" >
                    <div :style="avatarPreview.div" class="img">
                        <img :src="avatarPreview.url" :style="avatarPreview.img">
                    </div>
                </div>
                <div v-if='avatarPreview' class="preview-item"
                :style="{width:avatarPreview.w+'px',height:avatarPreview.h+'px',zoom:90/avatarPreview.w}" >
                    <div :style="avatarPreview.div" class="img">
                        <img :src="avatarPreview.url" :style="avatarPreview.img">
                    </div>
                </div>
            </div>
            <div class="actions">
                <v-btn depressed class="btn" @click="cropper=false">取消</v-btn>
                <v-btn depressed class="btn" @click="handleSubmit">确定</v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import {VueCropper } from 'vue-cropper'
export default {
    components:{VueCropper},
    props:['img'],
    data(){
        return{
            avatarPreview:null
        }
    },
    methods:{
        preview(data){
            this.avatarPreview=data;
        },
        handleSubmit(){
            this.$refs.cropper.getCropBlob((data) => {
                this.$emit('submit',data)
            })
        }
    }
}
</script>

<style lang='scss' scoped>
    .cropper{
        background-color: #fff;
        display: flex;
        .right{
            flex:1;
            .preview{
                position: relative;
                display: flex;
                align-items: flex-end;
                justify-content: space-around;
                height:50%;
                .preview-item{
                    overflow:hidden;
                    border-radius:50%;
                }
            }
            .actions{
                display: flex;
                height:50%;
                justify-content: space-evenly;
                align-items: center;
                .btn{
                    flex:1;
                }
            }
        }
    }
</style>