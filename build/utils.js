'use strict'
//引入path模块
const path = require('path')
//引入之前的config模块
const config = require('../config')
//引入“extract-text-webpack-plugin”，它的作用是打包后将生成css文件通过link的方式引入到html中，
// 如果不使用这个插件，那么css就打包到<head>的style中
const ExtractTextPlugin = require('extract-text-webpack-plugin')
//引入package.json
const packageConfig = require('../package.json')

exports.assetsPath = function (_path) {
  //结合config文件的代码可以知道，当环境为生产环境时，assetSubDirectory为“static”,开发环境也是“static”
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory
// path.posix.join()是path.join的一种兼容性写法，它的作用是路径的拼接，比如path.posix.join("/c/aa',"bb"); // "c/aa/bb"
  return path.posix.join(assetsSubDirectory, _path)
}
//用来生成Loader的函数 ，本身可以用在vue-loader的配置上(vue-loader.config.js文件，
// 以后我会提这个文件)，同时也是为styleLoader函数使用（后面说）
exports.cssLoaders = function (options) {
  //如果没有传参就默认空对象
  options = options || {}
  //配置css-loader，css-loader可以让处理css中的@import或者url()
  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  //配置postcss-loader，主要功能是补全css中的兼容性前缀，比如“-webkit-”等
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }
  //生成loader的私有方法
  // generate loader string to be used with extract text plugin
  function generateLoaders (loader, loaderOptions) {
    //参数的usePostCss属性是否为true，是就使用两个loader，否则只使用css-loader
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      //给generateLoaders传loader参数的话，比如“less或者sass”，就将这个loader的配置传到loaders数组中
      loaders.push({
        loader: loader + '-loader',
        //Object.assign()是es6的语法，用来合并对象
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }
    //如果options参数的extract属性为true，就使用extract text plugin将css抽成单独的文件，否则就将css写进style里
    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        //vue-style-loader可以理解为vue版的style-loader，它可以将css放进style中
        fallback: 'vue-style-loader'
      })
    } else {

      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    //返回各种loader
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}
//生成开发环境下loader的配置，使用在（webpack.dev.conf.js中）
// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  //调用cssLoaders方法，返回loaders的对象
  const loaders = exports.cssLoaders(options)
//遍历每一个loader，并配置成对应的格式，传给output数组
  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
