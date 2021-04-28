const isDev = process.env.NODE_ENV === 'development'

module.exports = {
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false
    }
  },
  publicPath: './',
  lintOnSave: undefined,
  configureWebpack: {
    externals: !isDev ? {
      dayjs: 'dayjs'
    } : {}
  }
}
