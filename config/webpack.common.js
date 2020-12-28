const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './js/src/index.js',
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.resolve(__dirname, '..', 'js', 'src', 'index.html'),
      // favicon: resolve(__dirname, '..', 'src', 'client', 'static', 'favicon.png'),
      alwaysWriteToDisk: true
    }),
  ],
  output: {
    filename: '[name]-[contenthash].bundle.js',
    path: path.resolve(__dirname, '../js/dist'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/, // regex to see which files to run babel on
        use: {
          loader: 'babel-loader',
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
          },
          "sass-loader"
      ]}
    ],
  },
 };
