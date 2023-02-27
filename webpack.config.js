const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/app.tsx",
  mode: "development",
  devtool: "source-map", // 提供 sourcemap
  devServer: {
    hot: true,
    open: true,
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    library: {
      name: "_", // 模块名称
      type: "umd", // 编译的模块化方案
    },
  },
  module: {
    rules: [
      {
        test: /\.js|jsx|ts|tsx$/,
        use: {
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
            <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          </head>
          <body>
            <div id="app" />
          </body>
        </html>
      `,
    }),
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
