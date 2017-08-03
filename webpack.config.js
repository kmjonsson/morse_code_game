
var webpack = require('webpack');
var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
  entry: ['./src/game.ts' ],
  output: {
    library: 'MorseGame',
    filename: 'dist/game.js'
  },
  resolve: {
    extensions: ['.ts']
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader' }
    ]
  },
  plugins: PROD ? [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, dead_code: true },
    })
  ] : []
}
