String.prototype.isBlack = function(){

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.replace('#','').substr(0,6));
    let rgb=[parseInt(result[1], 16),parseInt(result[2], 16),parseInt(result[3], 16)];

    return (
        0.213 * rgb[0] +  
        0.715 * rgb[1] +
        0.072 * rgb[2] >
        255 / 2
        );
};

String.prototype.getColor=function(){

    let index=this.indexOf('?color=')
    if(index) return '#'+this.substr(index+7);
    else return false;
}

String.prototype.highLight=function(keyword,color){
    let replaceReg = new RegExp(keyword+'', 'g')
    let replaceString =`<span style='color:${color};font-weight:bold'>${keyword}</span>`
    let text=this.replace(replaceReg,replaceString)
    return text;
}