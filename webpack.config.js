const webpack = require("webpack");
const path = require("path");
const Dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");

const { NODE_ENV, OPTIMIZED_BUILD } = process.env;
const webpackDotEnvPath = `./config/.env.${NODE_ENV}`;
const webpackEnvVars = Dotenv.config({ path: webpackDotEnvPath }).parsed;
const localEnvironment = NODE_ENV === "local";
const isOptimized = OPTIMIZED_BUILD === "true" || NODE_ENV === "production";
const webpackWatch = localEnvironment && !isOptimized;
const webpackMode = isOptimized ? "production" : "development";
const webpackDevtool = isOptimized ? "hidden-source-map" : "cheap-eval-source-map";

const config = {
  mode: webpackMode,
  watch: webpackWatch,
  watchOptions: {
    ignored: /node_modules/,
  },
  entry: path.resolve(__dirname, "src"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: `[name].[${webpackMode === "production" ? "contenthash" : "hash"}].js`,
    chunkFilename: `[name].[${webpackMode === "production" ? "contenthash" : "hash"}].js`,
    publicPath: "/",
  },
  target: "web",
  devtool: webpackDevtool,
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css", ".json", "woff", "woff2", "ttf"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        resourceQuery: /format|responsive/,
        use: [
          {
            loader: "responsive-loader",
            options: {
              outputPath: "images",
              adapter: require("responsive-loader/sharp"),
              esModule: true,
            },
          },
        ],
      },
      {
        test: /\.(jpe?g|png|webp|gif|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                enabled: false,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: `[name].[${webpackMode === "production" ? "contenthash" : "hash"}].[ext]`,
              outputPath: "fonts",
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({ patterns: [{ from: "public" }] }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
    new webpack.DefinePlugin({
      "process.env": JSON.stringify({ NODE_ENV, ...webpackEnvVars }),
      "process.env.NODE_ENV": JSON.stringify(NODE_ENV),
    }),
    new CleanWebpackPlugin(),
    new ESLintPlugin({
      emitWarning: true,
      emitError: true,
      failOnError: true,
      extensions: ["ts", "tsx", "js", "jsx"],
      context: "./src",
      lintDirtyModulesOnly: true,
    }),
  ],
  optimization: {
    nodeEnv: false,
  },
  devServer: {
    hot: true,
    compress: true,
    contentBase: path.resolve(__dirname, "public"),
    historyApiFallback: true,
    stats: "minimal",
  },
};

if (localEnvironment) {
  config.plugins.push(new ForkTsCheckerWebpackPlugin());
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

if (isOptimized) {
  config.performance = {
    maxAssetSize: 1000000,
    maxEntrypointSize: 1000000,
    hints: "warning",
  };
  config.optimization = {
    ...config.optimization,
    usedExports: true,
    runtimeChunk: "single",
    moduleIds: "hashed",
    splitChunks: {
      chunks: "all",
    },
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          compress: {
            drop_console: true,
            pure_funcs: ["console.info", "console.debug", "console.warn"],
          },
          output: {
            beautify: false,
            comments: false,
          },
        },
      }),
    ],
  };
}

module.exports = config;
