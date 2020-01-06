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

const FriendInfo=()=>import('./pages/chat/friends/friendInfo')
const NewFriend=()=>import('./pages/chat/friends/newFriend')

const routes=[
    {path:'/',component:Chat,
        children:[
            {path:'/',component:Message},
            {path:'message',component:Message},
            {path:'friends',component:Friedns,
                children:[
                    {path:'info',component:FriendInfo},
                    {path:'new',component:NewFriend}
                ]},
            {path:'group',component:Group},
            {path:'setting',component:Setting},
        ]},
    {path:'/Login',component:Login},
    {path:'/Social',component:Social},
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