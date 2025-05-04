const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/[name][ext]'
        }
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: './'
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
    // Copy images from src/public to dist/assets
    {
      apply: (compiler) => {
        compiler.hooks.emit.tapAsync('CopyPublicImages', (compilation, callback) => {
          const fs = require('fs');
          const path = require('path');
          const srcDir = path.resolve(__dirname, 'src/public');
          const distDir = path.resolve(__dirname, 'dist/assets');
          
          // Create assets directory if it doesn't exist
          if (!fs.existsSync(distDir)) {
            fs.mkdirSync(distDir, { recursive: true });
          }
          
          if (fs.existsSync(srcDir)) {
            fs.readdirSync(srcDir).forEach(file => {
              if (/\.(png|jpe?g|gif|svg)$/i.test(file)) {
                fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
              }
            });
          }
          callback();
        });
      }
    }
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    port: 3000,
    hot: true,
  },
};
