const { resolve } = require('path');

const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const ignores = [
  /^bufferutil$/,
  /^electron$/,
  /^electron\/index\.js/,
  /^pg-native$/,
  /^utf-8-validate$/
];

module.exports = {
  cache: {
    compression: 'gzip',
    type: 'filesystem'
  },
  devtool: 'source-map',
  entry: './src/scrape.ts',
  module: {
    rules: [
      {
        test: /\.node$/,
        use: [
          {
            loader: 'node-loader'
          }
        ]
      },
      {
        test: /\.(js.map)$/,
        use: [
          {
            loader: 'null-loader'
          }
        ]
      },
      {
        test: /\.(d.ts)$/,
        use: [
          {
            loader: 'null-loader'
          }
        ]
      },
      {
        test: /\.(css|ttf|png|svg|html)$/,
        type: 'asset/source'
      },
      {
        exclude: /node_modules\/(?!(path-to-regexp))/,
        test: /^.*\.(cjs|js|mjs|ts)$/,
        use: [
          {
            loader: 'swc-loader',
            options: {
              jsc: {
                keepClassNames: true,
                parser: {
                  decorators: true,
                  syntax: 'typescript'
                },
                target: 'es2020',
                transform: {
                  decoratorMetadata: true,
                  legacyDecorator: true
                }
              },
              module: {
                strict: true,
                type: 'es6'
              },
              sourceMaps: 'inline'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          mangle: false
        }
      })
    ],
    nodeEnv: false
  },
  output: {
    clean: true,
    filename: 'main.js',
    libraryTarget: 'commonjs2',
    path: resolve(__dirname, './dist')
  },
  plugins: [
    ...ignores.map(
      resourceRegExp =>
        new webpack.IgnorePlugin({
          contextRegExp: /./,
          resourceRegExp
        })
    )
  ],
  resolve: {
    extensions: ['.cjs', '.js', '.json', '.jsx', '.mjs', '.ts']
  },
  target: 'node'
};
