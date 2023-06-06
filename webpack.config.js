const path = require('path');
const webpack = require('webpack');
const cssnano = require('cssnano');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const AntdScssThemePlugin = require('@nodeworks/antd-scss-theme-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const publicPath = '/';

const isWebpackDevServer = process['argv'].some((arg) => arg.indexOf('webpack-dev-server') !== -1);

const { NODE_ENV = 'local', PORT = 5001, APP_ENV } = process.env;
const APP = APP_ENV || '';

const DOMAIN_VERSION = 'vezubr';
const pageTitle = 'Vezubr';
const favicon = path.resolve(__dirname, './favicons/vezubr.png');

const isProductionMode = NODE_ENV === 'production' || NODE_ENV === 'stage' || NODE_ENV === 'cls';

const outputPath = path.resolve('./build');

const _PLUGINS = [
  ...(!isWebpackDevServer ? [new CleanWebpackPlugin()] : []),

  new webpack.WatchIgnorePlugin([path.resolve(__dirname, './node_modules')]),

  new MiniCssExtractPlugin({
    filename: 'css/[name]-[hash].css',
    chunkFilename: '[id].css',
  }),

  new AntdScssThemePlugin(path.resolve(__dirname, './packages/common/styles/_theme.scss')),

  new webpack.DefinePlugin({
    IS_DEV: JSON.stringify(!isProductionMode),
    DOMAIN_VERSION: JSON.stringify(DOMAIN_VERSION),
    APP_VERSION: JSON.stringify(require('./package.json').version),
  }),

  new HTMLWebpackPlugin({
    title: pageTitle,
    template: path.resolve(__dirname, './static/index.html'),
    inject: true,
    appVersion: Math.random(),
    publicPath,
    ts: Date.now(),
    app: APP
  }),

  new FaviconsWebpackPlugin(favicon),

  new CopyWebpackPlugin([
    ...(!isProductionMode
      ? [
          {
            from: `./env/${NODE_ENV == 'dev-prod' ? 'production' : NODE_ENV}.js`,
            to: 'config.js',
          },
        ]
      : []),
  ]),
];

const urlLoader = {
  loader: 'url-loader',
  options: {
    limit: 8192,
    fallback: {
      loader: 'file-loader',
      options: {
        name: '[name]-[hash].[ext]',
      },
    },
  },
};

module.exports = {
  mode: isProductionMode ? 'production' : 'development',
  devtool: isProductionMode ? false : 'inline-source-map',
  entry: {
    main: [`./packages/main/main.jsx`, `./packages/main/run.styles.js`],
  },
  output: {
    path: outputPath,
    filename: (chunkData) => `js/[name]-${Date.now()}.js`,
    publicPath,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss', '.less', '.css'],
    modules: [
      'node_modules',
    ],
  },
  resolveLoader: {
    modules: [
      'node_modules',
    ],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules\/(?!@vezubr).*/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            configFile: path.resolve(__dirname, './.babelrc')
          }
        },
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: (loader) => [
                cssnano({
                  preset: 'default',
                  autoprefixer: {
                    add: true,
                  },
                }),
              ],
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },

          AntdScssThemePlugin.themify({
            loader: 'less-loader',
            options: {
              modifyVars: {
                // FIXME text-color don`t work with AntdScssThemePlugin
                'text-color': '#333',
              },
              sourceMap: true,
              javascriptEnabled: true,
            },
          }),
        ],
      },

      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: (loader) => [
                cssnano({
                  preset: 'default',
                  autoprefixer: {
                    add: true,
                  },
                }),
              ],
            },
          },

          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },

          AntdScssThemePlugin.themify({
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }),
        ],
      },

      {
        test: /\.(nompng|mp3|wav|ogg|ogv|webm|pdf|mp4|woff|woff2|eot|ttf|otf|csv)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
            },
          },
        ],
      },

      {
        test: /\.svg$/,
        issuer: {
          test: /\.jsx?$/,
        },
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              configFile: path.resolve(__dirname, './.babelrc')
            }
          },
          {
            loader: '@svgr/webpack',
            options: { babel: false },
          },
          urlLoader,
        ],
      },

      {
        test: /\.svg$/,
        issuer: {
          test: /\.(css|sass|scss|less)$/,
        },
        use: [urlLoader],
      },

      {
        test: /\.(png|jpg|gif)$/,
        use: [urlLoader],
      },
    ],
  },
  plugins: _PLUGINS,
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    port: PORT,
    progress: true,
    inline: true,
    historyApiFallback: true,
    host: '0.0.0.0',
    public: isWebpackDevServer ? `vezubr.local:${PORT}` : '',
    /*allowedHosts: [
			'client.vezubr.com',
			//'*.vezubr.com',
		]*/
  },
};
