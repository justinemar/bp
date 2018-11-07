const webpack = require('webpack');
const path = require('path');

const srcPath = path.join(__dirname, '../..', 'public');


module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(`${__dirname}/public`),
        filename: 'bundle.js',
    },
    devServer: {
        contentBase: './public',
    },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader'],
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
          {
            test: /\.(jpg|png|gif|svg|pdf|ico)$/,
            include: [srcPath],
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name]-[hash:8].[ext]',
                    },
                },
            ],
          },
        ],
      },
      resolve: {
        extensions: ['*', '.js', '.jsx'],
      },
};
