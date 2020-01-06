import  ColorThief from 'colorthief'

export default function compressImg(data,type){ //@params data:blob type:string
    return new Promise(resolve=>{
        const colorThief=new ColorThief();
        let img=new Image();
        img.src=data;
        img.onload=async function(){
            let color=await colorThief.getColor(this);
            color=rgbToHex(color);

            if((this.width>1920&&this.height>1080)&&!type.includes('gif')) {
                let canvas = document.createElement('canvas'), 
                    context = canvas.getContext('2d'),
                    data = ''

                let scale=this.width/this.height;
                canvas.width=1920;
                canvas.height=1920/scale;
                context.drawImage(this, 0, 0, canvas.width,canvas.height)
                data = canvas.toDataURL(type);
                return resolve({data:convertBase64UrlToBlob(data),color});
            }else{
                return resolve({data:null,color});
            }
        }
    })
}
function convertBase64UrlToBlob(urlData) {
    var arr = urlData.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {
        type: mime
    });
}

const rgbToHex = (rgb) =>rgb.map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
}).join('')