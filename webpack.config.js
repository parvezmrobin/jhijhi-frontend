const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const outputDirectory = 'public';

module.exports = {
  entry: ['babel-polyfill', './src/client/index.js'],
  output: {
    path: path.join(__dirname, outputDirectory),
    filename: '[name].bundle.js',
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(scss|sass)$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg|jpg)$/,
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
      '/api': 'http://localhost:8080',
      '/manifest.json': 'http://localhost:8080',
      '/favicon.png': 'http://localhost:8080',
    },
  },
  plugins: [
    new CleanWebpackPlugin([outputDirectory]),
    new HtmlWebpackPlugin({
      template: './statics/template.html',
      favicon: './statics/favicon.ico',
    }),
  ],
};
