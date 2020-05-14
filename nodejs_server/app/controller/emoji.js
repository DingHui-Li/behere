const Controller = require('egg').Controller;
const fs = require('fs')

class emojiController extends Controller{

    async get(){
        //let files=fs.readdirSync('./app/public/emoji')
        let components = []
        let path = fs.readdirSync('./app/public/emoji')
        path.forEach(function (item, index) {
            let stat = fs.lstatSync("./app/public/emoji/" + item)
            if (stat.isDirectory() === true) { 
            components.push(item)
            }
        })
        let files={};
        for(let comp of components){
            files[comp]=fs.readdirSync('./app/public/emoji/'+comp)
        }
        const {ctx}=this;
        ctx.body=files;
    }
}

module.exports=emojiController