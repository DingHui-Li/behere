<template>
    <div id='about'>
        <div class="top">
            <div class="name">Be Here</div>
            <div class="version">Version 2.0</div>
        </div>
        <div class="content">
            <div class="title">v-2.0更新说明  (2020.2.16)</div>
            <ul class="list">
                <li>【新增】多人视频</li>
                <li>【新增】修改密码</li>
                <li>【新增】发现页面：推荐用户</li>
            </ul>
            <div class="title">v-1.3更新说明  (2020.2.4)</div>
            <ul class="list">
                <li>【新增】朋友圈相关通知</li>
            </ul>
            <div class="title">v-1.2更新说明  (2020.2.3)</div>
            <ul class="list">
                <li>【新增】朋友圈个人主页，日期搜索、关键字搜索、分类显示</li>
                <li>【新增】查看动态详情，删除动态，修改可见范围</li>
            </ul>
            <div class="title">v-1.1更新说明  (2020.1.29)</div>
            <ul class="list">
                <li>【新增】朋友圈首页动态发布、浏览、点赞、评论</li>
            </ul>
            <div class="title">v-1.0更新说明  (2020.1.21)</div>
            <ul class="list">
                <li>【新增】群聊相关更新（音视频的群聊暂未实现）</li>
            </ul>
            <div class="title">v-0.3更新说明  (2020.1.6)</div>
            <ul class="list">
                <li>【新增】修改位置信息</li>
                <li>【新增】聊天记录搜索，图片、文件查看</li>
                <li>【新增】消息时间显示</li>
            </ul>
            <div class="title">v-0.2.1更新说明  (2020.1.5)</div>
            <ul class="list">
                <li>【修复】注册完成后关闭弹窗</li>
                <li>【修复】主题色保存在本地</li>
                <li>【修复】增加一个默认分组，不可删除</li>
                <li>【修复】修改、移动分组，同意好友请求时会更新好友列表</li>
                <li>【新增】shift+enter换行，enter发送</li>
                <li>【新增】新消息提醒音效</li>
            </ul>
            <div class="title">v-0.2更新说明  (2020.1.5)</div>
            <ul class="list">
                <li>【新增】两人对话：小文件、语音通话、视频通话</li>
            </ul>
            <div class="title">v-0.1更新说明  (2019.12.30)</div>
            <ul class="list">
                <li>两人对话：文字、图片、表情、语音</li>
                <li>搜索本地好友，搜索陌生人（精确匹配）及添加好友</li>
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
        //padding-top: 50px;
        display: flex;
        flex-direction: column;
        height:100%;
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
            flex:1;
            overflow: auto;
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