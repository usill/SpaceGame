const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanPlugin = require('clean-webpack-plugin');

const distPath = path.resolve(__dirname, './dist/');
const srcPath = path.resolve(__dirname, './src/');

module.exports = (env, argv) => {
  const mode = argv.mode;
  let isDev = mode === 'development';
  return result = {
    entry: "./src/index.js",
    output: {
      filename: "index.js",
      path: distPath,
      publicPath: "/",
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            "css-loader",            
          ]
        },
        {
          test: /\.(png|jp(e*)g|svg|gif")$/,
          use: [
            {
              loader: "file-loader",
              options: {
                name: "images/[name].[ext]",
              },
            },
          ],
        },
        {
          test: /\.mp3/,
          use: {
            loader: "file-loader",
            options: {
              name: "music/[name].[ext]"
            }
          }
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin( {
        template: path.resolve(srcPath, "index.html"),
        minify: isDev ? false : {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          collapseBooleanAttributes: true,
          removeScriptTypeAttributes: true,
        }
      } ),
      new MiniCssExtractPlugin(),
      new CleanPlugin.CleanWebpackPlugin(),
    ]
  }
  
}