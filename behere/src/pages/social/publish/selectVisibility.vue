<template>
    <div>
        <v-menu transition="scale-transition">
            <template v-slot:activator="{ on }">
                <v-btn depressed class="selectBtn" :style="{backgroundColor:theme,color:'#fff'}" v-on="on">
                    {{visibility}}<v-icon>mdi-menu-down</v-icon>
                </v-btn>
            </template>
            <v-list class="selectVisibility" :style="{backgroundColor:theme}">
                <v-list-item v-ripple class="item" @click="data='public'" >
                    <span :style="{color:'#fff',marginRight:'100px'}">公开 </span> 
                    <v-tooltip left>
                        <template v-slot:activator="{ on }">
                            <v-icon class="icon" v-on='on' color="#fff">mdi-help-circle</v-icon>
                        </template>
                        <div>所有人可见</div>
                    </v-tooltip>
                </v-list-item>
                <v-list-item v-ripple class="item" @click="data='friend'">
                    <span :style="{color:'#fff'}">仅好友可见</span> 
                </v-list-item>
                <v-list-item v-ripple class="item" @click="data='part';$emit('selectFriend')">
                    <span :style="{color:'#fff'}">部分好友可见</span> 
                </v-list-item>
                <v-list-item v-ripple class="item" @click="data='private'">
                    <span :style="{color:'#fff'}">仅自己可见</span> 
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
export default {
    props:['value'],
    data(){
        return{
            data:this.value,
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme
        },
        visibility(){
            if(this.data==='public') return '公开'
            if(this.data==='private') return '仅自己可见'
            if(this.data==='part') return '部分好友可见'
            return '仅好友可见'
        }
    },
    watch:{
        data(newVal){
            this.$emit('visibility',newVal)
        }
    }
}
</script>

<style>

</style>