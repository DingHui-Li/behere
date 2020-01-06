<template>
    <v-form>
        <div class="tiptext">用户名</div>
        <v-text-field :rules='nameRule' 
            outlined rounded dense solo clearable flat
            @input="$emit('input',{name:$event})">
        </v-text-field>
        <div class="tiptext">密码</div>
        <v-text-field :rules='pwRule' 
                outlined rounded dense solo clearable flat 
                :type="showPw?'show':'password'" 
                :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPw=!showPw"
                @input="handleInputPw">
        </v-text-field>
    </v-form>
</template>

<script>
import md5 from 'js-md5'
export default {
    data(){
        return{
            showPw:false,
            nameRule:[
                v=>!!v&&v.trim().length!==0||'请输入用户名或邮箱'
            ],
            pwRule:[
                v=>!!v||'请输入密码',
                v=>!!v&&v.trim().length!==0||'不能输入空格'
            ]
        }
    },
    methods:{
        handleInputPw(value){
            if(value&&value.trim().length>0) this.$emit('input',{pw:md5(value)})
        }
    }
}
</script>

<style lang='scss' scoped>
    @import './index.scss';
</style>