const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin =
//   require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

const threadLoader = require("thread-loader");

threadLoader.warmup(
  {
    // 可传入上述 thread-loader 参数
    workers: 2,
    workerParallelJobs: 50,
  },
  [
    // 子进程中需要预加载的 node 模块
    "babel-loader",
    "style-loader",
    "css-loader",
    "postcss-loader",
    "sass-loader",
  ]
);

module.exports = {
  entry: "./src/app.tsx",
  mode: "development",
  devtool: false,
  devServer: {
    hot: true,
    open: true,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.js|jsx|ts|tsx$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              workers: 2,
              workerParallelJobs: 50,
            },
          },
          {
            loader: "babel-loader",
            options: {
              presets: [
                "@babel/preset-env",
                "@babel/preset-typescript",
                [
                  "@babel/preset-react",
                  {
                    runtime: "automatic", // 配置后可自动导入 react
                  },
                ],
              ],
            },
          },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css|sass|scss$/,
        use: [
          // 根据运行环境判断使用那个 loader
          process.env.NODE_ENV === "production"
            ? MiniCssExtractPlugin.loader
            : "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                // 添加 autoprefixer 插件
                plugins: [require("autoprefixer")],
              },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.webp/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    new ESLintPlugin({ extensions: [".js", ".ts", ".jsx", ".tsx"] }),
    new MiniCssExtractPlugin(),
    new HTMLWebpackPlugin({
      templateContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Webpack App</title>
              </head>
              <body>
            <div id="app" />
          </body>
        </html>
      `,
    }),
    // 性能优化分析
    // new BundleAnalyzerPlugin(),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  // 持久化缓存
  // cache: {
  //   type: "filesystem",
  //   buildDependencies: {
  //     config: [path.join(__dirname, "webpack.config.js")], // 依赖的配置文件，配置文件变更缓存失效，重新完整构建
  //   },
  // },
};
