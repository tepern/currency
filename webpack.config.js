const path = require('path')
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlagin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const devMode = process.env.NODE_ENV !== 'production';
const { createProxyMiddleware } = require('http-proxy-middleware');

const config = {
  entry: path.resolve(__dirname,"src","index.js"),
  devtool: 'inline-source-map',
  mode: 'development',
  devServer: {
    hot: true,
    open: true,
    //inline: true, 
    static: {
        directory: path.join(__dirname, "dist")
      },
    //contentBase: path.join("dist"),
    headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    },
    proxy: {
        '/api': {
          target: 'http://www.cbr.ru/scripts/XML_daily.asp',
          secure: false,
          changeOrigin: true,
        },
        '/weather': {
          target: 'http://api.weatherapi.com/v1/current.xml?key=8725a21b10ea48b1b95215348222512&q=Moscow&lang=ru&q=lond',
          secure: false,
          changeOrigin: true,
        },   
      },
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'sass-loader',
          {
            loader: 'postcss-loader', // Run post css actions
          }
        ],
      },
      {
        test: /\.(jpg|png|gif|svg)$/, 
        type: 'asset/resource',
      },
      {
        test: /\.html$/, 
        loader: 'html-loader',
      },
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        type: 'asset/resource',
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new MiniCssExtractPlugin({filename: 'main.css'}),
    new HtmlWebpackPlagin({
      template: 'src/index.html',
      inject: 'body',
      publicPath: ""
    }),
    new CopyPlugin({
      patterns: [
        { 
          from: 'src/images',
          to: 'images'
        },
      ],
    })
  ]
};

module.exports = config;