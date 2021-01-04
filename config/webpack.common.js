const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './src/index.js',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      // name this file main, so that it does not get automatically requested as a static file
      filename:'main.html',
      inject: true,
      template: path.resolve(__dirname, '..', 'src', 'index.html'),
      // a favicon can be included in the head. use this config to point to it
      // favicon: resolve(__dirname, '..', 'src', 'favicon.png'),
      alwaysWriteToDisk: true,
    }),
  ],
  output: {
    filename: '[name]-[contenthash].bundle.js',
    path: path.resolve(__dirname, '../dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // regex to see which files to run babel on
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
          },
          'sass-loader',
        ],
      },
    ],
  },
};
