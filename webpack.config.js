const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist/',
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                include: path.join(__dirname),
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.js$/,
                include: path.join(__dirname),
                exclude: /(node_modules)|(dist)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.(jpg|jpeg|png|gif|svg)$/,
                use: {
                    loader: "url-loader",
                    options: {
                        name: "[path][name].[hash].[ext]",
                        publicPath: "./dist",
                        limit: 8192
                    }
                }
            }
        ]
    }
};
