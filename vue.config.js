module.exports = {
  // 基本路径
  publicPath: '/',
  outputDir: 'dist', // 当运行 vue-cli-service build 时生成的生产环境构建文件的目录。
  lintOnSave: true, // eslint-loader 是否在保存的时候检查
  devServer: {
    open: true, // 配置自动启动浏览器
    port: 8888,
    // 关闭域名检查
    disableHostCheck: true,
    // 错误或警告的全屏覆盖层
    overlay: {
      // 警告
      warnings: false,
      // 错误
      errors: true
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080/bear_blog',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'Bear'
      return args
    })
  }
}
