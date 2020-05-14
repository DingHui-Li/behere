const Controller = require('egg').Controller;

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "1"

const OpenVidu = require('openvidu-node-client').OpenVidu;
const OpenViduRole = require('openvidu-node-client').OpenViduRole;
const request=require('request')

var OV = new OpenVidu('holi.fun:4443','sad123');

let mapSessions={}
let mapSessionUsers={}

class OpenViduController extends Controller{

    async getSessionUsers(){
        const {ctx}=this;
        const sessionName=ctx.query.sessionName;
        if(mapSessionUsers[sessionName]){
            ctx.body=mapSessionUsers[sessionName]
        }else{
            ctx.body=[]
        }
    }
    async leave(){
        const {ctx}=this;
        const sessionName=ctx.request.body.sessionName;
        const userId=ctx.request.body.userId
        let index=mapSessionUsers[sessionName].indexOf(userId)
        if(index!==-1){
            mapSessionUsers[sessionName].splice(index,1)
        }
        if(mapSessionUsers[sessionName].length===0){
            delete mapSessions[sessionName]
        }
        ctx.body=200
    }
    async getToken(){
        const {ctx}=this; 
        let token=ctx.request.headers.authorization;
        if(!verifyToken(token)){//通过中间件验证会404，未知原因，故在此验证
            ctx.response.status=401;
        }
        const sessionName=ctx.request.body.sessionName;
        let role=ctx.request.body.role;//creater joiner
        const userId=ctx.request.body.userId;
        if(!sessionName||!role||!userId){
            return ctx.response.status=400;
        }
        role=OpenViduRole.PUBLISHER

        try{
            let session=null;
            if(mapSessions[sessionName]){
                session=mapSessions[sessionName]
            }else{
                session=await OV.createSession();
                mapSessions[sessionName]=session;
                mapSessionUsers[sessionName]=[];
            }
            let token=await session.generateToken({data:userId,role});
            if(!mapSessionUsers[sessionName].includes(userId)){
                mapSessionUsers[sessionName].push(userId);
            }
            ctx.body=token;
        }catch(err){
            ctx.response.status=500;
            delete mapSessions[sessionName]
            delete mapSessionUsers[sessionName]
        }
    }
}
function verifyToken(token){
    return new Promise(resolve=>{
        request('http://39.108.208.140:8008/behere/user/getUserInfo',{
            headers:{
                authorization:token
            }
        },function(err,res,body){
            resolve(JSON.parse(body).code==='10000')
        })
    })
}
module.exports=OpenViduController