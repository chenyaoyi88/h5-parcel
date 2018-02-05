module.exports = {
  // 样式局部化
  modules: false,
  plugins: [
    require('autoprefixer')({
      browsers: ['last 2 versions', 'iOS >= 7', 'Android >= 4']
    })
  ]
}