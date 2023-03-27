const { defineConfig } = require('@vue/cli-service');
const path = require('path');

module.exports = defineConfig({
  transpileDependencies: true,
  outputDir: path.resolve(__dirname, '../server/public'),
  chainWebpack: (config) => {
    config.plugin('copy').tap((entries) => {
      entries[0].patterns.push({
        from: path.resolve(__dirname, 'src/assets/uploads'),
        to: path.resolve(__dirname, '../server/public/uploads'),
        toType: 'dir',
        noErrorOnMissing: true,
        globOptions: { ignore: ['.DS_Store'] },
      })

      return entries
    })
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000'
      }
    }
  }
})
