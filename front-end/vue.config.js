// const { defineConfig } = require('@vue/cli-service')
// module.exports = defineConfig({
//   transpileDependencies: true
// })

require('dotenv').config({ path: '../.env' });

const port = process.env.SERVER_PORT;

module.exports = {
    devServer: {
        proxy: 'http://localhost:'+port,
    },
    css: {
        loaderOptions: {
          sass: {
            additionalData: `
              @import "../global/scss/custom.scss";
            `
          }
        }
      }
}
