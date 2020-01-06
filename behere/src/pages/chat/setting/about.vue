<template>
    <div id='about'>
        <div class="top">
            <div class="name">Be Here</div>
            <div class="version">Version 0.3</div>
        </div>
        <div class="content">
            <div class="title">v-0.3功能说明  (2020.1.6)</div>
            <ul class="list">
                <li>【新增】修改位置信息</li>
                <li>【新增】聊天记录搜索</li>
            </ul>
            <div class="title">v-0.2.1功能说明  (2020.1.5)</div>
            <ul class="list">
                <li>【修复】注册完成后关闭弹窗</li>
                <li>【修复】主题色保存在本地</li>
                <li>【修复】增加一个默认分组，不可删除</li>
                <li>【修复】修改、移动分组，同意好友请求时会更新好友列表</li>
                <li>【新增】shift+enter换行，enter发送</li>
                <li>【新增】新消息提醒音效</li>
            </ul>
            <div class="title">v-0.2功能说明  (2020.1.5)</div>
            <ul class="list">
                <li>【新增】两人对话：小文件、语音通话、视频通话</li>
            </ul>
            <div class="title">v-0.1功能说明  (2019.12.30)</div>
            <ul class="list">
                <li>两人对话：文字、图片、表情、语音</li>
                <li>搜索本地好友，搜索陌生人（精确匹配）及添加好友功能</li>
                <li>用户资料：基本信息展示，备注修改，分组修改</li>
                <li>个人：可修改除账号外的资料（地理位置暂未实现）</li>
                <li>好友分组：添加、删除、重命名</li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {

}
</script>

<style lang='scss' scoped>
    @font-face{
        font-family:'造字工房力黑常规体';
        src:url('../../../assets/font/造字工房力黑常规体.ttf')
    }
    #about{
        width:100%;
        padding-top: 50px;
        .top{
            text-align: center;
            font-weight: bold;
            .name{
                font-family: 造字工房力黑常规体;
                font-size: 2.1rem;
            }
            .version{
                font-size: 1rem;
            }
        }
        .content{
            padding:50px 10%;
            .title{
                font-size: 0.8rem !important;
                font-weight: bold;
            }
            .list{
                font-weight: bold;
                color:#757575;
            }
        }
    }
</style>