const { resolve } = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const ignores = [
  /^@aws-sdk\/signature-v4-crt$/,
  /^@fastify\/view/,
  /^@mikro-orm\/core/,
  /^@nestjs\/microservices/,
  /^@nestjs\/mongoose/,
  /^@nestjs\/platform-express/,
  /^@nestjs\/sequelize/,
  /^@nestjs\/typeorm/,
  /^aws-crt$/,
  /^cache-manager/,
  /^class-transformer\/storage/
];

module.exports = {
  cache: {
    compression: 'gzip',
    type: 'filesystem'
  },
  devtool: 'source-map',
  entry: './src/main.ts',
  experiments: {
    topLevelAwait: true
  },
  externals: {
    '@prisma/client': '@prisma/client',
    'onnxruntime-node': 'onnxruntime-node',
    sharp: 'sharp'
  },
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
        test: /\.css$/,
        type: 'asset/source'
      },
      {
        exclude: /node_modules\/(?!(path-to-regexp))/,
        test: /\.(cjs|js|mjs|ts)$/,
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
                target: 'es2022',
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
    ),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(__dirname, 'src/env'),
          to: resolve(__dirname, 'dist/env')
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.cjs', '.js', '.json', '.jsx', '.mjs', '.ts', '.tsx']
  },
  target: 'node'
};
