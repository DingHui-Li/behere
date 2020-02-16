module.exports=()=>{
    return async function(ctx,next){
        let token=ctx.request.headers.authorization;
        let result=await verifyToken(token)
        if(result){
            next();
        }else{
            ctx.response.status=401
        }
    }
}

const request=require('request');
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