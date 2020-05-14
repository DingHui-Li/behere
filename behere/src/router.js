import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter);

const Login=()=>import('./pages/login')
const Social=()=>import('./pages/social')
const Chat=()=>import('./pages/chat')

const Message=()=>import('./pages/chat/message')
const Friedns=()=>import('./pages/chat/friends')
const Group=()=>import('./pages/chat/group')
const Setting=()=>import('./pages/chat/setting')
const Find=()=>import('./pages/chat/find')

const FriendInfo=()=>import('./pages/chat/friends/friendInfo')
const NewFriend=()=>import('./pages/chat/friends/newFriend')

const GroupInfo=()=>import('./pages/chat/group/groupInfo')
const NewGroup=()=>import('./pages/chat/group/newGroup')

const Content=()=>import('./pages/social/content')
const PersonHome=()=>import('./pages/social/personHome')
const Notify=()=>import('./pages/social/notify')
const Look=()=>import('./pages/social/look')
const routes=[
    {path:'/',component:Chat,
        children:[
            {path:'/',name:'msg',component:Message},
            {path:'message',name:'msg',component:Message},
            {path:'friends',component:Friedns,
                children:[
                    {path:'info',name:'friendInfo',component:FriendInfo},
                    {path:'new',name:'newFriend',component:NewFriend}
                ]},
            {path:'group',component:Group,
                children:[
                    {path:'info/:id',component:GroupInfo,name:'groupInfo',props:route=>({id:route.params.id})},
                    {path:'new',name:'newGroup',component:NewGroup},
                ]},
            {path:'find',component:Find},
            {path:'setting',component:Setting},
        ]},
    {path:'/Login',component:Login},
    {path:'/Social',component:Social,
        children:[
            {path:'/',component:Content,name:'home'},
            {path:'user/:id',component:PersonHome,name:'person',props:route=>({id:route.params.id})},
            {path:'notify',component:Notify,name:'notify'},
            {path:'look',component:Look,name:'look'},
        ]},
]

const router=new VueRouter({routes});


const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)//捕获添加相同路由时的错误
}
const originalReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function replace(location) {
    return originalReplace.call(this, location).catch(err => err)//捕获添加相同路由时的错误
}

export default router;