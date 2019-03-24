const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  runtimeCompiler: true,
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          red: '#00C1C9',
          // blue: '#3eaf7c',
          // orange: '#f08d49',
          // 'text-color': '#111',
          // 'gray-darker': '#f3f3f3',
          'button-primary-background-color': '#ff7f66',
          'button-primary-border-color': '#ff7f66'
        }
      },
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ['*'],
            selectorBlackList: ['van-']
          })
        ]
      }
    }
  }
};