<template>
  <v-app>
    <v-progress-linear v-if='loading' :height='10' :color='theme' class="loading" indeterminate></v-progress-linear>
    <transition :enter-active-class="transition?`animated ${enterClass}`:''" :leave-active-class="transition?`animated ${leaveClass}`:''"> 
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>


    <transition :enter-active-class="transition?'animated zoomInUp':''" :leave-active-class="transition?'animated zoomOutDown':''">
        <Call v-if='call.open' />
    </transition>
    <transition-group enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" mode="out-in">
        <MediaReq v-for="(req,index) in mediaReq" :key="'mediaReq'+index" :data='req'/>
    </transition-group>
    <transition-group tag='div'
        enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" move-class="animated bounce">
        <AlertMsg v-for="(msg,index) in alertMsg" :key="msg.id" :data='msg' :index='index'/>
    </transition-group>
    <transition-group tag='div'
      enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight" move-class="animated bounce">
        <AlertFriendApply v-for='(apply,index) in alertFriendApply' :key='apply.sn' :data='apply' :index='index' />
    </transition-group>

    <v-snackbar :color="snackbar.color" v-model="snackbar.open" top :timeout="snackbar.timeout">
        {{snackbar.text}} 
        <v-btn v-if='!snackbar.login&&!snackbar.reconnect' fab icon @click="snackbar.open=false"><v-icon>mdi-close</v-icon></v-btn>
        <v-btn v-else-if='snackbar.login' @click="snackbar.open=false;$router.replace('/login')" depressed :style="{color:'#000'}">去登录</v-btn>
        <v-btn v-else-if='snackbar.reconnect' @click="snackbar.open=false;connectWs()" depressed :style="{color:'#000'}">重新连接</v-btn>
    </v-snackbar>
    <audio :src='require("./assets/msg.wav")' ref='beep' :style="{display:'none'}"></audio>
  </v-app>
</template>

<script>
import Call from './components/call'
import MediaReq from './components/mediaReq'
import AlertMsg from './components/alertMsg'
import AlertFriendApply from './components/alertFriendApply'
export default {
  name: 'App',
  components:{Call,MediaReq,AlertMsg,AlertFriendApply},
  data(){
    return{
        enterClass:'slideInLeft',
        leaveClass:'slideOutLeft',
        snackbar:{
          open:false,
          text:'获取数据失败',
          color:'error',
          timeout:0,
          login:false,//登录按钮
          reconnect:false,//重连按钮
        },
        loading:false
    }
  },
  computed:{
      call(){
        return this.$store.state.call;
      },
      mediaReq(){//未处理的媒体请求
        return this.$store.state.mediaReq;
      },
      alertMsg(){//未处理的消息通知
        return this.$store.state.alertMsg;
      },
      alertFriendApply(){//未处理的好友申请通知
        return this.$store.state.alertFriendApply;
      },
      transition(){
          return this.$store.state.transition;
      },
      token(){
        return this.$store.state.myInfo.token;
      },
      apiHost(){
        return this.$store.state.apiHost;
      },
      theme(){
        return this.$store.state.theme
      },
      updateFriendList(){
        return this.$store.state.updateFriendList;
      },
      beep(){
        return this.$store.state.beep;
      }
  },
  watch:{
      '$route'(from){
        if(from.path==='/social'){
          this.enterClass='slideInRight'
          this.leaveClass='slideOutLeft'
        }else{
          this.enterClass='slideInLeft'
          this.leaveClass='slideOutRight'
        }
      },
      token(){//token更新时重新设置axios拦截器
            this.axiosInit();
            this.connectWs();
            this.getChatList();
            this.getFriendGroup();
            this.getFriendList();
            this.getFriendApply();
      },
      updateFriendList(newVal){
        if(newVal){
          this.getFriendList();
          this.$store.commit('setUpdateFriendList',false);
        }
      }
  },
  mounted(){
    if(localStorage['myInfo']){//获取本地的用户信息
          let data=JSON.parse(localStorage['myInfo']);
          this.$store.commit('updateMyInfo',data);
          // this.axiosInit();
          // this.connectWs();
          // this.getChatList();
          // this.getFriendList();
      }
  },
  methods:{
    reqFilter(url){
        let urls=['login','register','checkEmail','checkUsername'];//这些请求不加token
        for(let i in urls){
            if(url.includes(urls[i])) return true;
        }
        return false;
    },
    connectWs(){
          let ws=new WebSocket(this.$store.state.wsHost+'?token='+this.token);
          ws.onopen=()=>{
              this.$store.commit('updateLineStatus',true)
              this.snackbar={open:true,text:'消息服务器连接成功',color:'success',timeout:3000}
          }
          ws.onclose=()=>{
              //this.connectWs();
              //console.log('ws断开连接，正在重连');
              this.$store.commit('updateLineStatus',false)
              this.snackbar={open:true,text:'消息服务器断开连接',color:'error',timeout:0,reconnect:true};
          }
          ws.onerror=()=>{
              this.$store.commit('updateLineStatus',false)
              this.snackbar={open:true,text:'消息服务器断开连接',color:'error',timeout:0,reconnect:true};
          }
          ws.onmessage=(res)=>{
              let data=JSON.parse(res.data);
              if(data.type==='sys_add'){
                  this.$store.commit('addAlterFriendApply',data);
              }
              else if(data.type==='rtc'){
                  let content=JSON.parse(data.content);
                  if(content.act){
                      if(content.act==='agree'){
                        this.$store.commit('startPeerConnection');
                      }else if(content.act==='hangup'){
                          this.$store.commit('closeCall');
                          this.snackbar={open:true,text:'对方已挂断',color:'success',timeout:5000}
                      }else{
                        this.$store.commit('closeCall');
                        this.snackbar={open:true,text:'对方已拒绝',color:'error',timeout:5000}
                      }
                  }else if(content.answer){
                      this.$store.commit('updateCallAnswer',content.answer);
                  }else if(content.offer){
                      this.$store.commit('updateCallOffer',content.offer);
                  }else if(content.candidate){
                      this.$store.commit('updateCallCandidate',content.candidate);
                  }
                  
              }
              else{
                if(this.beep==='true'){
                  this.$refs.beep.play();
                }
                this.$store.commit('newMsg',{
                  id:data.sn,
                  from:data.from,
                  content:data.content,
                  time:data.sendTime,
                  type:data.type
                })
              }
              
          }
          this.$store.commit('updateWs',ws);
    },
    axiosInit(){
        this.axios.interceptors.request.use(req=>{
            if(this.reqFilter(req.url)) return req;
            req.headers.authorization=this.token
            return req;
          })
        this.axios.interceptors.response.use(res=>{
            return res;
          },err=>{
            console.log(err)
            if(err.response.status===401){
                this.snackbar={open:true,text:'未登录',login:true,color:'error',timeout:0}
                this.$router.replace('/login');
            }else{
                this.snackbar={open:true,text:'服务器错误，code：'+err.response.status,color:'error',timeout:0}
            }
            return Promise.reject(err.response.status);
          })
    },
    getChatList(){
      this.loading=true;
      this.axios({
            method:'get',
            url:this.apiHost+'/chat/getChatList?page=0&size=20'
        }).then(res=>{
            if(res.data.code==='10000'){
                let data=JSON.parse(res.data.data).content;
                console.log('获取会话列表成功')
                this.$store.commit('setChatList',data);
            }else{
              this.snackbar={open:true,text:'获取会话列表失败，code:'+res.data.code,color:'error',timeout:10000}
            }
        }).finally(()=>{
          this.loading=false;
        })
    },
    getFriendList(){
        this.loading=true;
        //this.$store.commit('setFriendList',[]);
        this.axios({
            method:'get',
            url:this.apiHost+'/contact/getContactList'
        }).then(res=>{
            if(res.data.code==='10000'){
                if(!res.data.data) return;
                let data=JSON.parse(res.data.data);
                console.log('获取好友列表成功')
                console.log(data)
                this.$store.commit('setFriendList',data);
            }else{
              this.snackbar={open:true,text:'获取好友列表失败，code:'+res.data.code,color:'error',timeout:10000}
            }
        }).finally(()=>{
          this.loading=false;
        })
    },
    getFriendGroup(){
      this.loading=true;
      this.axios({
                method:'get',
                url:this.apiHost+'/contactGroup/getGroupList'
            }).then(res=>{
                if(res.data.code==='10000'){
                    let data=JSON.parse(res.data.data);
                    this.$store.commit('setFriendGroup',data);
                }else{
                    this.snackbar={open:true,text:'获取好友分组失败，code:'+res.data.code,color:'error',timeout:10000}
                }
            }).finally(()=>{
          this.loading=false;
        })
    },
    getFriendApply(){
      this.loading=true;
      this.axios({
        method:'get',
        url:this.apiHost+'/message/getContactReqMessage'
      }).then(res=>{
        if(res.data.code==='10000'){
          console.log('获取申请列表成功')
          let data=JSON.parse(res.data.data);
          this.$store.commit('setFriendApply',data.content);
        }else{
              this.snackbar={open:true,text:'获取好友申请列表失败，code:'+res.data.code,color:'error',timeout:10000}
        }
      }).finally(()=>{
          this.loading=false;
        })
    }
  },
};
</script>
<style lang="scss">
  *{
    margin:0;
    padding:0;
    font-family: normal;
    scroll-behavior:smooth;
  }
  *::-webkit-scrollbar {/*滚动条整体样式*/
          width: 5px;     /*高宽分别对应横竖滚动条的尺寸*/
          height: 1px;
      }
  *::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
          border-radius: 5px;
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
          background: #535353;

      }
  *::-webkit-scrollbar-track {/*滚动条里面轨道*/
          -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
          border-radius: 5px;
          background: #EDEDED;
  }
  .loading{
    position:fixed;
    top:0;
    left:0;
    z-index:99;
    filter: brightness(55%);
    border-radius: 5px;
  }
</style>
