const path = require('path');

module.exports = {
  entry: [
    './src/index.js',
  ],
  output: {
    filename: './game.min.js'
  },
  module: {
    rules: [{
        test: /\.js$/,
        include: path.resolve(__dirname, 'src/js'),
        use: {
          loader: 'babel-loader',
          options: {
            presets: 'env'
          }
        }
      },
    ]
  },
  plugins: [
  ],
  optimization: {
    minimize: true,
  }
};