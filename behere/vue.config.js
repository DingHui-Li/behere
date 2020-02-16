module.exports = {
	configureWebpack: {
		externals: { AMap: "AMap" }
	},
	"transpileDependencies": [
		"vuetify"
	],
	configureWebpack: {
		externals: {
			'AMap': 'AMap', // 高德地图配置
			'AMapUI':'AMapUI'
		}
	},
	// devServer:{
	// 	proxy: {
    //         '/openvidu': {
    //             target: 'https://localhost:5000', //API服务器的地址
    //             ws: true,  //代理websockets
    //             changeOrigin: true, // 虚拟的站点需要更管origin
    //             pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
    //                 '^/openvidu': ''
    //             }
    //         }
    //     },
	// }
}