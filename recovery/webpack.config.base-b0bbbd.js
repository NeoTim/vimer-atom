'use strict';
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const { getCssLoader, getIsomorphicToolsPlugin } = require('./util/webpack.helper');

const stylish = require('@ali/stylish');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules|b_components/,
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.(jpe?g|png|gif|ico|svg)$/i,
        loaders: [
          'file?name=[path][name]_[hash:5].[ext]',
        ],
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?(\?-hdf3wh)?$/,
        loader: 'file',
      },
      {
        test: /\.(woff|woff2)(\?-hdf3wh)?$/,
        loader: 'url?prefix=font/&limit=5000',
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?(\?-hdf3wh)?$/,
        loader: 'url?limit=10000&mimetype=application/octet-stream',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?(\?-hdf3wh)?$/,
        loader: 'url?limit=10000&mimetype=image/svg+xml',
      },
      {
        test: /\.njk|\.html$/,
        loader: 'html?interpolate&attrs=img:src link:href img:data-src',
      },
      {
        test: /\.css$/,
        loader: getCssLoader(null, false),
      },
      // // TODO: 这么多种 css 处理工具，以后交给脚手架生成吧
      // Stylus
      // https://www.npmjs.com/package/stylus-loader
      // npm install stylus-loader stylus --save-dev
      {
        test: /\.styl$/,
        loader: getCssLoader('stylus', false),
      },
      // // SASS
      // // https://www.npmjs.com/package/sass-loader
      // // npm install sass-loader node-sass --save-dev
      // {
      //   test: /\.s[ac]ss$/,
      //   loader: getCssLoader('sass', false),
      // },
      // {
      //   test: /\.less$/,
      //   loader: getCssLoader('less', false),
      // },
    ],
  },
  postcss: () => {
    return [ autoprefixer ];
  },
  stylus: {
    use: [ stylish() ],
  },
  resolve: {
    extensions: [ '', '.js', '.jsx' ],
    modulesDirectories: [ 'node_modules', 'app/b_components' ],
    packageMains: [ 'webpack', 'browser', 'web', 'browserify', [ 'jam', 'main' ], 'main' ],
  },
  plugins: [
    new webpack.ResolverPlugin(
      new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin('.bower.json', [ 'main' ])
    ),
    new ExtractTextPlugin('stylesheets/[name].[contenthash:5].css'),
    getIsomorphicToolsPlugin(),
  ],
};
