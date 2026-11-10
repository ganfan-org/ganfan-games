const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const variable = require('./webpack-utils/variable');
const resolveConfig = require('./webpack-utils/resolve');
const plugins = require('./webpack-utils/plugins');
const { SRC_PATH, DIST_PATH, IS_DEV, IS_PRO, getCDNPath } = variable;
// Source maps are resource heavy and can cause out of memory issue for large source files.
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const lessModuleRegex = /\.module\.less$/;
const postcssFlexbugsFixes = require('postcss-flexbugs-fixes');
const postcssPresetEnv = require('postcss-preset-env');

const config = {
  entry: {
    index: path.join(SRC_PATH, 'index.tsx'),
  },
  output: {
    path: DIST_PATH,
    filename: IS_DEV
      ? 'js/[name].bundle.js'
      : 'js/[name].[contenthash:8].bundle.js',
    publicPath: getCDNPath(),
    globalObject: 'this',
    chunkFilename: IS_DEV
      ? 'js/[name].chunk.js'
      : 'js/[name].[contenthash:8].chunk.js',
    assetModuleFilename: 'assets/[hash][ext][query]',
    clean: true,
  },
  //loader的执行顺序默认从右到左，多个loader用[],字符串只用一个loader，也可以是对象的格式
  module: {
    rules: [
      {
        test: /\.(tsx?|jsx?)$/,
        include: [SRC_PATH],
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: require('os').cpus().length * 2,
              parallel: true,
            },
          },
          {
            loader: 'babel-loader', // 这是一个webpack优化点，使用缓存
            options: {
              cacheDirectory: true,
            },
          },
        ],
        exclude: [/node_modules/, /public/, /(.|_)min\.js$/],
      },
      {
        test: /\.css$|\.less$/i,
        include: [SRC_PATH],
        exclude: [
          /node_modules/, // 取消匹配node_modules里面的文件
          lessModuleRegex,
        ],
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: !IS_PRO,
            },
          },
          {
            // 为 package.json 中 browserslist 声明的目标浏览器添加厂商前缀
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: [
                  postcssFlexbugsFixes,
                  postcssPresetEnv({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                ],
              },
              sourceMap: IS_PRO ? shouldUseSourceMap : IS_DEV,
            },
          },
          'less-loader',
          {
            loader: 'style-resources-loader',
            options: {
              patterns: path.resolve(SRC_PATH, 'assets', 'css', 'core.scss'),
            },
          },
        ],
      },
      {
        // antd 按需加载后，其组件样式位于 node_modules，需要单独的处理规则
        test: /\.css$/i,
        include: [/node_modules[\\/]antd/],
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false,
              sourceMap: !IS_PRO,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif|jpeg|webp|svg)$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[hash][ext][query]',
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/fonts/[hash][ext][query]',
        },
      },
    ],
  },
  resolve: resolveConfig,
  plugins: plugins.getPlugins(),
};

module.exports = config;
