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
	}
}