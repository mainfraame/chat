const path = require('path');

const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    cache: {
      compression: 'gzip',
      type: 'filesystem'
    },
    devServer: {
      allowedHosts: 'all',
      client: {
        overlay: false
      },
      devMiddleware: {
        writeToDisk: true
      },
      historyApiFallback: true,
      hot: true,
      port: 3033,
      static: {
        watch: true
      }
    },
    devtool: isDev ? 'eval-source-map' : 'source-map',
    entry: [
      path.resolve(__dirname, './src/index.tsx'),
      ...(isDev
        ? [
            require.resolve('react'),
            require.resolve('react-dom'),
            require.resolve('react-refresh/runtime')
          ]
        : [])
    ],
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.html$/,
          use: ['html-loader']
        },
        {
          exclude: /node_modules/,
          test: /\.[cjt]sx?$/,
          use: [
            {
              loader: 'swc-loader',
              options: {
                jsc: {
                  parser: {
                    decorators: true,
                    dynamicImport: true,
                    syntax: 'typescript',
                    tsx: true
                  },
                  transform: {
                    react: {
                      development: isDev,
                      refresh: isDev,
                      runtime: 'automatic'
                    }
                  }
                },
                module: {
                  type: 'es6'
                }
              }
            }
          ]
        },
        {
          generator: {
            filename: 'static/images/[name][ext]'
          },
          test: /\.(png|jpe?g|gif|svg|ico)$/i,
          type: 'asset/resource'
        },
        {
          test: /\.css$/,
          use: [
            ...(isDev ? ['style-loader'] : [MiniCssExtractPlugin.loader]),
            'css-loader'
          ]
        }
      ]
    },
    optimization: isDev
      ? {
          runtimeChunk: 'single'
        }
      : {
          minimize: true,
          nodeEnv: 'production',
          runtimeChunk: {
            name: 'runtime'
          },
          splitChunks: {
            chunks: 'all',
            name: 'shared'
          }
        },
    output: {
      chunkFilename: 'static/js/[name].chunk.[contenthash:8].js',
      clean: true,
      filename: 'static/js/[name].[contenthash:8].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    plugins: [
      new HtmlWebpackPlugin({
        cache: isDev,
        chunks: 'all',
        chunksSortMode: 'auto',
        filename: 'index.html',
        inject: true,
        minify: isDev
          ? false
          : {
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
              removeScriptTypeAttributes: true,
              removeStyleLinkTypeAttributes: true,
              useShortDoctype: true
            },
        template: path.resolve(__dirname, './src/index.html')
      }),
      ...(isDev
        ? [new ReactRefreshWebpackPlugin({ overlay: false })]
        : [
            new MiniCssExtractPlugin({
              chunkFilename: 'static/css/[id].[chunkhash].css',
              filename: 'static/css/[name].[fullhash].css'
            }),
            new CompressionPlugin(),
            new webpack.DefinePlugin({
              'process.env': JSON.stringify({
                NODE_ENV: 'production'
              })
            })
          ])
    ],
    resolve: {
      extensions: [
        '.cjs',
        '.js',
        '.jsx',
        '.json',
        '.css',
        '.mjs',
        '.ts',
        '.tsx'
      ],
      modules: [
        path.resolve(__dirname, '../../node_modules'),
        path.resolve(__dirname, './node_modules')
      ]
    },
    target: isDev ? 'web' : 'browserslist'
  };
};
