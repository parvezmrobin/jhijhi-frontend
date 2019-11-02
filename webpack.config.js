const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

require('dotenv').config();
const outputDirectory = 'public';
const outputPath = path.join(__dirname, outputDirectory);

module.exports = {
  entry: {
    main: ['babel-polyfill', './src/client/index.js'],
    serviceWorker: './src/client/serviceWorker.js',
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
  },
  devServer: {
    port: 3000,
    open: true,
    historyApiFallback: true,
    proxy: {
      '/manifest.json': 'http://localhost:8080',
      '/favicon.png': 'http://localhost:8080',
      '/frustrated.gif': 'http://localhost:8080',
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
  ],
};
