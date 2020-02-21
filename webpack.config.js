const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
require('dotenv').config();

const outputDirectory = 'public';
const outputPath = path.join(__dirname, outputDirectory);

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/index.js'],
    serviceWorker: './src/serviceWorker.js',
  },
  output: {
    path: outputPath,
    filename: (file) => file.chunk.name === 'serviceWorker' ? '[name].js' : '[name].[hash].js',
    chunkFilename: '[name].chunk.[hash].js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude:[ /node_modules/],
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg|gif)$/,
        loader: 'url-loader?limit=100000',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
    modules: ['src', 'node_modules'],
  },
  devServer: {
    port: 3000,
    open: true,
    proxy: {
      '/manifest.json': 'https://jhijhi.netlify.com',
      '/favicon.png': 'https://jhijhi.netlify.com',
      '/frustrated.gif': 'https://jhijhi.netlify.com',
    },
  },
  plugins: [
    new webpack.DefinePlugin({
        'process.env.SERVER_URL': `'${process.env.SERVER_URL}'`,
    }),
    new MiniCssExtractPlugin({filename: '[name].[contentHash].css'}),
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './statics/template.html',
      favicon: './statics/favicon.ico',
    }),
    new CopyPlugin([
      { from: './statics', to: '.' },
    ]),
  ],
};
