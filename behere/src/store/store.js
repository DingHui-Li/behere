import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import hosts from '../config'
let host=hosts.pro;

const store=new Vuex.Store({
    state:{
        myInfo:{id:1,name:'unknow',avatar:'/public/avatar.png',token:'',refreshToken:''},//当前登录用户的信息
        theme:localStorage['theme']||'#4CAF50',
        beep:localStorage['beep']||'true',//提示音
        lineStatus:false,//ws连接状态
        transition:true,//启用过渡动画
        serverHost:host.serverHost,//文件服务器---nodejs
        apiHost:host.apiHost,
        wsHost:host.wsHost,
        ws:null,//websocket
        call:{//视频通话界面参数
            open:false,//界面打开状态
            type:'',
            userSn:'',//对方id
            start:false,//是否开始协商 peer connection  收到对方的同意消息才会开始
            answer:null,
            offer:null,
            candidate:null
        },
        mediaReq:[//未处理的媒体请求 通知 3条
            // {type:'video'},
            // {type:'call'}
        ],
        alertMsg:[],//未处理的新消息 通知 3条
        alertFriendApply:[],//新收到的好友请求 通知

        msgData:[],// id:消息id,user：发送者id,content：内容,type：类型,time：时间
        openChat:null,//已打开的聊天界面的对方id或群id
        openFriend:null,//打开的好友资料
        chatList:[],//会话列表
        friendList:[],//好友列表
        updateFriendList:false,//更新好友列表
        friendGroup:[],//好友分组
        friendApply:[],//好友申请
    },
    mutations:{
        updateMyInfo(state,data){
            localStorage['myInfo']=JSON.stringify(data);
            state.myInfo=data;
        },
        updateTheme(state,color){//修改主题色
            state.theme=color;
            localStorage['theme']=color;
        },
        updateBeep(state,status){//更新是否启用提示音
            state.beep=status;
            localStorage['beep']=status;
        },
        updateLineStatus(state,status){
            state.lineStatus=status;
        },
        updateTransition(state,status){
            state.transition=status;
        },
        updateServer(state,host){
            state.apiHost=host.apiHost;
            state.serverHost=host.serverHost;
            state.wsHost=host.wsHost;
        },
        updateWs(state,ws){
            state.ws=ws;
        },

        closeCall(state){//关闭视频界面
            state.call={open:false};
        },
        openCall(state,data){//打开视频界面 
            state.call=data;
        },
        setCallType(state,type){//音视频 界面转换
            state.call={...state.call,type};
        },
        updateCallAnswer(state,data){
            state.call={...state.call,answer:data}
        },
        updateCallOffer(state,data){
            state.call={...state.call,offer:data}
        },
        updateCallCandidate(state,data){
            state.call={...state.call,candidate:data}
        },
        startPeerConnection(state){//开始连接
            state.call={...state.call,start:true};
        },

        removeMediaReq(state){//移除顶层的音视频消息通知
            state.mediaReq.pop();
        },
        removeAlertMsg(state,index){
            state.alertMsg.splice(index,1);
        },

        newMsg(state,data){//新消息
            if(Array.isArray(data)){//只有发送 才会有数组的情况 （一次发送多张图片 会分解为一个个消息）
                for(let i=0;i<data.length;i++){
                    state.msgData.push(data[i]);
                }
                let i=exist(data[0]);
                if(i){
                    state.chatList[i].type='img';
                    state.chatList[i].sendTime=data[0].time;
                    state.chatList[i].unreadNum=0;
                    let temp=state.chatList[i];
                    state.chatList.splice(i,1)
                    state.chatList.unshift(temp);
                }
            }else{
                let i=exist(data);//在会话列表中存在
                if(i){//更新会话列表
                    state.chatList[i].content=data.content;
                    state.chatList[i].sendTime=data.time;
                    state.chatList[i].type=data.type;
                    let temp=state.chatList[i];
                    state.chatList.splice(i,1)
                    state.chatList.unshift(temp);
                }
                if((data.type==='callVideo'||data.type==='callPhone')&&data.from!==state.myInfo.id){
                    state.mediaReq.push(data);
                }else{
                    if(data.from!==state.openChat&&data.from!==state.myInfo.id){//显示通知 没有打开会话，且排除自己 
                        if(state.alertMsg.length>=3){
                            state.alertMsg.shift();
                        }
                        state.chatList[i].unreadNum+=1;
                        state.alertMsg.push(data);//消息通知
                    }else{
                        state.msgData.push(data);
                        if(i) state.chatList[i].unreadNum=0;
                    }
                }
                
            }
            function exist(msg){
                for(let i in state.chatList){
                    if(state.chatList[i].contactSn===msg.to||state.chatList[i].contactSn===msg.from){
                        return i;
                    }
                }
                return false;
            }
        },
        updateMsgStatus(state,data){//更新消息状态
            for(let i in state.msgData){
                if(data.id===state.msgData[i].id){
                    state.msgData[i].status=data.status;
                }
            }
        },
        updateOpenChat(state,id){//更新打开的会话
            state.openChat=id;
            state.msgData=[];
            for(let i in state.chatList){
                if(state.chatList[i].contactSn===id){//清空打开会话的未读消息数
                    state.chatList[i].unreadNum=0;
                    break;
                }
            }
        },
        updateOpenFriend(state,id){
            state.openFriend=id;
        },

        setChatList(state,data){//获取会话列表
            state.chatList=data;
        },
        removeChatList(state,id){
            for(let i in state.chatList){
                if(state.chatList[i].sn===id){
                    state.chatList.splice(i,1);
                }
            }
        },
        addChatList(state,data){
            state.chatList.unshift(data);
        },

        setFriendList(state,data){//获取好友列表
            state.friendList=data;
        },
        setUpdateFriendList(state,status){
            state.updateFriendList=status;
        },
        removeFriend(state,id){//移除一个朋友
            for(let i in state.friendList){
                if(state.friendList.userSn===id){
                    state.friendList.splice(i,1);
                    break;
                }
            }
        },
        // addFriend(state,data){//添加一个朋友
        //     state.friendList.unshift(data);
        // },
        updateFriendList(state,data){//更新一个好友的信息  data={userSn:用户id,type:字段,value:值}
            for(let i in state.friendList){
                if(state.friendList[i].userSn===data.userSn){
                    state.friendList[i][data.type]=data.value;
                    break;
                }
            }
        },

        setFriendGroup(state,data){
            state.friendGroup=data;
        },
        newFriendGroup(state,data){//添加一个新的分组
            state.friendGroup.push(data);
        },
        removeFriendGroup(state,id){//删除一个分组
            let defaultId=0;//默认分组
            for(let i in state.friendGroup){
                if(state.friendGroup[i].defaultGroup==='1'){
                    defaultId=state.friendGroup[i].sn;
                }
            }
            for(let i in state.friendList){
                if(state.friendList[i].groupSn===id){//将分组内的好友移动到默认分组
                    state.friendList[i].groupSn=defaultId;
                }
            }
            for(let i in state.friendGroup){
                if(state.friendGroup[i].sn===id){
                    state.friendGroup.splice(i,1);
                    break;
                }
            }
        },

        setMsgData(state,data){
            //data.reverse();
            for(let i in data){
                data[i].id=data[i].sn;
                state.msgData.unshift(data[i]);
            }
            
        },

        addAlterFriendApply(state,data){//增加一条好友申请通知
            if(state.alertFriendApply.length>3){
                state.alertFriendApply.unshift();
            }
            state.alertFriendApply.push(data);
            state.friendApply.unshift(data);//添加到好友申请列表
        },
        removeAlterFriendApply(state,index){//移除一条好友申请通知
            state.alertFriendApply.splice(index,1);
        },
        setFriendApply(state,data){//设置好友申请列表数据
            state.friendApply=data;
        },
    }
})
export default store;