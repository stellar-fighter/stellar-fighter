const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        include: path.join(__dirname),
        exclude: /node_modules/,
        loader: "eslint-loader"
       },
       
       {
         test: /\.js$/,
         include: path.join(__dirname),
         exclude: /(node_modules)|(dist)/,
         use: {
           loader: 'babel-loader',
         }
       },
       {
         test: /\.(jpg|jpeg|png|gif|svg)$/,
         use: {
           loader: "url-loader",
           options: {
             name: "[path][name].[hash].[ext]",
             publicPath: "./",
             limit: 8192
           }
         }
       },
       {
         test: /\.scss$/,
         use: [
           MiniCssExtractPlugin.loader,
           'css-loader',
           'postcss-loader',
           'sass-loader'
         ]
       }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      'template': './src/index.html',
      'filename': './index.html',
      'meta': {
        'viewport': 'width=device-width, initial-scale=1, shrink-to-fit=no',
        'theme-color': '#FF0000',
        'charset': 'UTF-8'
      },
    }),
    new CopyWebpackPlugin([
      {from: 'asset', to: 'asset'}
    ]),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    })
  ],
  devServer: {
    contentBase: path.resolve(__dirname, 'src'),
    watchContentBase: true,
    publicPath: '/'
  },
};
