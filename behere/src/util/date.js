Date.prototype.parse=function(detail){
    let now=new Date();
    let Y=now.getFullYear();
    let M=now.getMonth()+1;
    let D=now.getDate();

    let y=this.getFullYear();
    let m=this.getMonth()+1;
    let d=this.getDate();
    let h=this.getHours();
    let min=this.getUTCMinutes();
    min=min<10?'0'+min:min

    if(detail==='time') return h+':'+min
    if(Y===y&&M===m&&D===d){
        return h+':'+min;
    }else if(Y===y&&M===m){
        if(D-d===1) return `昨天 ${detail?(h+':'+min):''}`;
        else return `${m}月${d}日 ${detail?(h+':'+min):''}`;
    }else if(Y===y){
        return `${m}月${d}日 ${detail?(h+':'+min):''}`;
    }else{
        return `${y}年${m}月${d}日 ${detail?(h+':'+min):''}`;
    }
}

Date.prototype.isLately=function(){
    let now=new Date();
    let Y=now.getFullYear();
    let M=now.getMonth()+1;
    let D=now.getDate();

    let y=this.getFullYear();
    let m=this.getMonth()+1;
    let d=this.getDate();
    if(Y===y&&M===m&&D-d<=7) return true;
    else return false;
}