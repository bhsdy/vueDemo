'use strict'
const path = require('path')
//引入前一篇文章的utils文件
const utils = require('./utils')
//引入config文件
const config = require('../config')
//判断当前是否为生产环境，如果是则返回true
const vueLoaderConfig = require('./vue-loader.conf')
//配置访问后台接口
// var DEV_HOST = JSON.stringify('http://localhost:8081/')
// var PUB_HOST = JSON.stringify('http://localhost:8081/')
//resolve函数返回根路径下的文件或文件夹
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}



module.exports = {
  //返回根路径
  context: path.resolve(__dirname, '../'),
  //设置入口文件
  entry: {
    app: './src/main.js'
  },
  //出口文件
  output: {
    //根据config模块得知是根目录下的dist文件夹
    path: config.build.assetsRoot,
    filename: '[name].js',
    //公共路径，统一为“/”
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },

/*  plugins: [
    new webpack.DefinePlugin({
      HOST: process.env.NODE_ENV === 'production' ? PUB_HOST : DEV_HOST
    })
  ],*/



  resolve: {
    //自动解析的扩展，js,vue,json这三种格式的文件引用时不需要加上扩展了
    // import File from '../path/to/file'
    extensions: ['.js', '.vue', '.json'],
    alias: {
      //精准匹配，使用vue来替代vue/dist/vue.esm.js路径
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      //vue-loader,module里的配置可以查看webpack文档
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
