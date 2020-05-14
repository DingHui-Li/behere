<template>
    <div id='location'>
        <transition enter-active-class="animated slideInRight" leave-active-class="animated slideOutRight">
            <div class="show-select elevation-2" :style="{backgroundColor:theme}" v-if='Boolean(selectLocation.name)'>
                <v-icon :size="30" color='#fff'>mdi-map-marker</v-icon>
                {{selectLocation.name}}
                <v-btn depressed class="btn" @click="submit">确定</v-btn>
            </div>
        </transition>
    </div>
</template>

<script>
import AMap from 'AMap'
import AMapUI from 'AMapUI'
export default {
    data(){
        return{
            selectLocation:{
                name:'',
                adcode:100000
            }
        }
    },
    computed:{
        theme(){
            return this.$store.state.theme;
        },
        apiHost(){
            return this.$store.state.apiHost;
        }
    },
    mounted(){
        let map = new AMap.Map('location',{resizeEnable: true});
        AMapUI.loadUI(['geo/DistrictExplorer'], (DistrictExplorer)=>{
            //启动页面
            //创建一个实例
            var districtExplorer = new DistrictExplorer({
                map: map ,//关联的地图实例
                eventSupport:true,
                setAreaNodesForLocating :true
            });
            var acode = 100000; //全国的区划编码
            let currentAreaNode=''
            districtExplorer.loadAreaNode(acode, function(error, areaNode) {
                if (error) {
                    console.error(error);
                    return;
                }
                //绘制载入的区划节点
                renderAreaNode(districtExplorer, areaNode);
            });
            function renderAreaNode(districtExplorer, areaNode) {
                    //清除已有的绘制内容
                    districtExplorer.clearFeaturePolygons();
                    //just some colors
                    var colors = ["#3366cc", "#dc3912", "#ff9900", "#109618", "#990099", "#0099c6", "#dd4477", "#66aa00"];
                    //绘制子级区划
                    districtExplorer.renderSubFeatures(areaNode, function(feature, i) {
                        var fillColor = colors[i % colors.length];
                        var strokeColor = colors[colors.length - 1 - i % colors.length];
                        return {
                            cursor: 'default',
                            bubble: true,
                            strokeColor: strokeColor, //线颜色
                            strokeOpacity: 1, //线透明度
                            strokeWeight: 1, //线宽
                            fillColor: fillColor, //填充色
                            fillOpacity: 0.35, //填充透明度
                        };
                    });
                    //绘制父级区划，仅用黑色描边
                    districtExplorer.renderParentFeature(areaNode, {
                        cursor: 'default',
                        bubble: true,
                        strokeColor: 'black', //线颜色
                        fillColor: null,
                        strokeWeight: 3, //线宽
                    });
                    //更新地图视野以适合区划面
                    map.setFitView(districtExplorer.getAllFeaturePolygons());
                }
            // districtExplorer.on('featureMousemove', function(e, feature) {
            //     //更新提示位置
            //     tipMarker.setPosition(e.originalEvent.lnglat);
            // });

            //feature被点击
            districtExplorer.on('featureClick', (e, feature)=>{
                let props = feature.properties;
                districtExplorer.loadAreaNode(props.adcode, (error, areaNode)=>{
                    if (error) {
                        console.error(error);
                        return;
                    }
                    if(this.selectLocation.adcode!==props.adcode){//避免重复设置
                        this.selectLocation={
                            name:this.selectLocation.name+props.name+' ',
                            adcode:props.adcode
                        };
                    }
                    // if (props.childrenNum > 0) { //如果存在子节点
                        districtExplorer.setAreaNodesForLocating([areaNode]);
                    // }
                    //绘制载入的区划节点
                    renderAreaNode(districtExplorer, areaNode);
                });
            });

            districtExplorer.on('outsideClick',e=>{
                this.selectLocation={name:'',adcode:100000};
                districtExplorer.loadAreaNode(100000, function(error, areaNode) {
                    if (error) {
                        console.error(error);
                        return;
                    }
                    districtExplorer.setAreaNodesForLocating([areaNode]);
                    //绘制载入的区划节点
                    renderAreaNode(districtExplorer, areaNode);
                });
            })
        });
    },
    methods:{
        submit(){
            let str=JSON.stringify(this.selectLocation);
            let param=`%7B%22name%22:%22${this.selectLocation.name}%22,%22adcode%22:%22${this.selectLocation.adcode}%22%7D`
            this.axios({
                method:'post',
                url:this.apiHost+`/user/editUserInfo?location=${param}`
            }).then(res=>{
                if(res.data.code==='10000'){
                    this.$emit('success',JSON.stringify(this.selectLocation))
                }else{
                    this.$emit('error')
                }
            }).catch(err=>{
                this.$emit('error')
            })
        }
    },
    
}
</script>

<style lang='scss' scoped>
    #location{
        width: 100%;
        height:500px;
        position: relative;
        .show-select{
            width:fit-content;
            padding:5px 10px;
            background-color:#fff;
            position: absolute;
            z-index: 9;
            border-radius: 5px;
            right: 0;
            color:#fff;
            .btn{
                margin-left: 10px;
            }
        }
    }
</style>