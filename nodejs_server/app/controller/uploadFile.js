const Controller=require('egg').Controller;
const fs=require('fs')

class uploadFileController extends Controller{

    async uploadImg(){
        const {ctx}=this;
        let paths=[];
        let data={code:200}
        let colors=JSON.parse(ctx.request.body.colors);
        const files=ctx.request.files;

        try{
            for(let i=0;i<files.length;i++){
                let type=files[i].mime.substring(files[i].mime.indexOf('/')+1);
                let name=new Date().getTime()+i;//避免处理过快导致文件重名
                let filename=name+'.'+type;
                fs.copyFileSync(files[i].filepath,'./app/public/social/imgs/'+filename);
                paths.push('/public/social/imgs/'+filename+'?color='+colors[i]);
            }
        }catch(err){
            console.log(err)
            data.code=500;
        }finally{
            ctx.cleanupRequestFiles()
        }
        data.paths=paths;
        ctx.body=data;
    }

    async uploadVoice(){
        const {ctx}=this;
        let data={code:200}
        let paths=[]
        const files=ctx.request.files;
        
        try{
            for(let i=0;i<files.length;i++){
                let filename=new Date().getTime()+i+'.webm';
                fs.copyFileSync(files[i].filepath,'./app/public/social/voices/'+filename);
                paths.push('/public/social/voices/'+filename);
            }
        }catch(err){
            data.code=500
            console.log(err)
        }finally{
            ctx.cleanupRequestFiles();
        }
        data.paths=paths;
        ctx.body=data;
    }

    async uploadVideo(){
        const {ctx}=this;
        let data={code:200}
        let path=''
        
        try{
            let file = ctx.request.files[0];
            let type=file.mime.substring(file.mime.indexOf('/')+1);
            let filename=new Date().getTime()+'.'+type;
            fs.copyFileSync(file.filepath,'./app/public/social/media/'+filename);
            path='/public/social/media/'+filename;

        }catch(err){
            data.code=500
            console.log(err)
        }finally{
            ctx.cleanupRequestFiles();
        }
        data.path=path;
        ctx.body=data;
    }

    async uploadChatFile(){//voice or img or file
        const {ctx}=this;
        let data={code:200}
        let path='';
        try{
            let color=ctx.request.body.color;
            let type=ctx.request.body.type;
            let file = ctx.request.files[0];
            let filename='';
            if(type==='file'){
                filename=file.filename;
            }else{
                let filetype=file.mime.substring(file.mime.indexOf('/')+1);
                filename=new Date().getTime()+'.'+filetype;
            }
            fs.copyFileSync(file.filepath,`./app/public/chat/${type}/${filename}`);
            if(type==='img') path=`/public/chat/${type}/${filename}?color=${color}`;
            else path=`/public/chat/${type}/${filename}`;
            data.path=path;
        }catch(err){
            data.code=500
            console.log(err)
        }finally{
            ctx.cleanupRequestFiles();
        }
        ctx.body=data;
    }

    async uploadAvatar(){
        const {ctx}=this;
        let data={code:200}
        let path='';
        try{
            let file = ctx.request.files[0];
            let filetype=file.mime.substring(file.mime.indexOf('/')+1);
            let filename=new Date().getTime()+'.'+filetype;
            fs.copyFileSync(file.filepath,`./app/public/avatar/${filename}`);
            path=`/public/avatar/${filename}`;
            data.path=path;
        }catch(err){
            data.code=500
            console.log(err)
        }finally{
            ctx.cleanupRequestFiles();
        }
        ctx.body=data;
    }
}
module.exports=uploadFileController;