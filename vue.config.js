module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: './',
  lintOnSave: undefined,
  configureWebpack: {
    externals: {
      dayjs: 'dayjs'
    }
  }
}
