<template>
    <div id='find'>
        <Users />
        <!-- <Groups /> -->
    </div>
</template>

<script>
import Users from './users'
// import Groups from './groups'
export default {   
    components:{Users}
}
</script>

<style lang='scss' scoped>
    #find{
        width:100%;
        height:100%;
        animation-duration: .5s;
        animation-timing-function: ease-in-out;
        background-color: #fff;
        border-radius: 0 20px 20px 0;
        padding:20px;
        padding-top: 0;
        overflow: auto;
        position: relative;
    }
</style>