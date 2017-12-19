const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const webpack = require('webpack');
const path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
var CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');


const config = {
  context: path.resolve(__dirname, 'src'),
  entry: {
    fetchPolyfill: 'whatwg-fetch',
    app: './app.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  externals: {
    "Popper": {
        root: "Popper"
    },
    "jQuery": {
      root: "$"
    }
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'style-loader', // inject CSS to page
          }, 
          {
            loader: 'css-loader', // translates CSS into CommonJS modules
          }, 
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'postcss-loader', // Run post css actions
            options: {
              plugins: function () { // post css plugins, can be exported to postcss.config.js
                return [
                  require('precss'),
                  require('autoprefixer')
                ];
              }
            }
          },
          {
            loader: 'sass-loader' // compiles SASS to CSS
          }
        ]
      },
      {
        test: /\.(jpg|png|gif)$/,
        use: ['url-loader']
      },
      {
        test: /\.woff$/,
        use: 'url-loader?mimetype=application/font-woff'
      },
      {
        test: /\.woff2$/,
        use: 'url-loader?mimetype=application/font-woff2'
      },
      {
        test: /\.[ot]tf$/,
        use: 'url-loader?mimetype=application/octet-stream'
      },
      {
        test: /\.eot$/,
        use: 'url-loader?mimetype=application/vnd.ms-fontobject'
      },
      {
        test: /\.svg$/,
        use: 'url-loader?mimetype=image/svg+xml'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      }
    ]
  },
  devtool: 'cheap-module-inline-source-map',
  devServer: { 
    host: '0.0.0.0',
    //inline: false,
    port: 4000,   //Tell dev-server which port to run
    open: true,   // to open the local server in browser
    contentBase: path.resolve(__dirname,'dist') //serve from 'dist' folder
  },
  plugins: [
    new CleanWebpackPlugin(['dist']), //cleans the dist folder
    new ExtractTextPlugin("css/styles.css"),
    new HtmlWebpackPlugin({
      title: "Cloudinary Live Streaming",
      description: "Try out the Cloudinary Live Streaming demo! - A simple API enables you to stream adaptively from any device with a variety of transformations and effects.",
      template: 'index.ejs',
      image: "http://res.cloudinary.com/demo-live/image/upload/v1511717849/live-video-streaming.jpg"
    }),
    new HtmlWebpackPlugin({  // Also generate a test.html
      filename: 'viewer.html',
      template: 'viewer.ejs',
      title: "Cloudinary Live Streaming",
      description: "Join my live video broadcast now",
      image: "http://res.cloudinary.com/demo-live/image/upload/v1511717849/live-video-streaming.jpg"
    }),
    //new BundleAnalyzerPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    })
  ]
};

if(process.env.NODE_ENV === 'development'){
  config.plugins.push(new DashboardPlugin());
}

module.exports = config;