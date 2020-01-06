'use strict';

const appid='wx50a925b76bceea0e'
const appsecret='0ff5dfc501832725289b6d9848b5d992'
const baidu={
    api_key:'mgtYAdldYSjDUituKG3EsQZ6',
    secret_key:'4fMg25xTbocBpAD7XUiNzkzPHvCFyA8I'
}

const Controller = require('egg').Controller;
var request =require('request')
const ffmpeg=require('fluent-ffmpeg')
// ffmpeg.setFfmpegPath('D://ffmpeg-4.2.1-win64-shared/bin/ffmpeg.exe')
// ffmpeg.setFfprobePath('D://ffmpeg-4.2.1-win64-shared/bin/ffprobe.exe')
const fs=require('fs')
const os=require("os");

class HomeController extends Controller {
  async index() {
    this.ctx.body="index"
  }

  async getQR(){
    const { ctx } = this;
    const body=ctx.request.body;

    let access_token = await this.getAccessToken();
    let data= await ctx.curl('https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token='+access_token,{method:'POST',data:JSON.stringify({scene:body.socketid})})
    ctx.body = data.data;
  }

  getAccessToken(){
    return new Promise(resolve=>{
        request('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+appid+'&secret='+appsecret,
                function(err,res,body){
                  return resolve(JSON.parse(body).access_token);
                })
    })
  }

  async voice2txt(){
    const{ctx}=this;
    const file=ctx.request.files[0];

    fs.exists('./temp_pcm',function(err,exist){
      if(!exist) fs.mkdir('./temp_pcm',function(err,res){})
    });

    let tempFile='./temp_pcm/'+new Date().getTime()+'.pcm';

    let process_re = await this.processVoice(file.filepath,tempFile); 
    if(!process_re){
      return ctx.body='';
    }

    let result=await this.getResult(tempFile);
    
    ctx.body=result;
  }
  processVoice(file,tempFileName){//使用ffmpeg对音频文件处理
    return new Promise(resolve=>{
      ffmpeg(file).audioCodec('pcm_s16le')
                  .audioChannels(1)
                  .format('s16le')
                  .save(tempFileName)
                  .on('error',function(err){
                      console.log(err)
                      resolve(false)
                  })
                  .on('end',function(){
                      resolve(true)
                  })
    })
  }
  getAccessToken_baidu(){
    return new Promise(resolve=>{
        request('https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id='+baidu.api_key+'&client_secret='+baidu.secret_key,
                  function(err,res,body){
                    resolve(JSON.parse(body).access_token)
                  })
    })
  }
  getResult(tempFile){
    return new Promise(async resolve=>{
        const uid='106.54.29.79';
        let access_token=await this.getAccessToken_baidu();
        const data= fs.readFileSync(tempFile);
        request('http://vop.baidu.com/server_api?cuid='+uid+'&token='+access_token,{
          method:'post',
          headers:{
              'Content-Type': 'audio/pcm;rate=16000',
          },
          body:data
        },function(err,res,body){
            resolve(JSON.parse(body).result)
        })
    })
  }
}

module.exports = HomeController;
