const webpack = require("webpack");
const path = require("path");



module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname + '/public'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './public'
    },
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: ['babel-loader']
          },
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
          },
          {
            test: /\.(jpg|png|gif|svg|pdf|ico)$/,
            use: [
                {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name]-[hash:8].[ext]'
                    },
                },
            ]
          }
        ]
      },
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
    plugins: [
      new webpack.DefinePlugin({
        'process.env': {
          'NODE_ENV': '"production"'
        }
      })
    ]
}
