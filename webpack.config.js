var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');


module.exports = {
    context: path.resolve(__dirname, './client/src'),
    entry: { app: './app.js' },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, '/client/dist/')
    },
    devtool: "source-map",
    devServer: {
        contentBase: path.resolve(__dirname, '/client/dist/'),
        watchOptions: { poll: true },
        compress: true,
        port: 8080
    },
    plugins: [
        new HtmlWebpackPlugin({ template: __dirname + '/client/src/index.html' }),
        new ExtractTextPlugin("styles.css")
        // new I18nPlugin(languageConfig, optionsObj)
    ],
    resolve: {
        alias: {
            App: path.resolve(__dirname, './client/src'),
            Map: path.resolve(__dirname, './client/src/components/map'),
            Sidebar: path.resolve(__dirname, './client/src/components/sidebar'),
            Data: path.resolve(__dirname, './client/src/data/'),
            Utilities: path.resolve(__dirname, './client/src/utilities/'),
            Stylesheets: path.resolve(__dirname, './client/src/stylesheets/')
        }
        // modules: [path.resolve(__dirname, "./src"), "node_modules"]},
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.js$/, // include .js files
                enforce: "pre", // preload the jshint loader
                exclude: [/node_modules/, /selectCtrl/], // exclude any and all files in the node_modules folder
                use: [{
                    loader: "jshint-loader",
                    options: { emitErrors: false, failOnHint: false, esversion: 6 }
                }]
            },
            {
                test: /\.js$/,
                exclude: [/node_modules/, /selectCtrl/],
                use: [{ loader: 'babel-loader', options: { presets: ['es2015'] } }],
            },
            // {
            //     test: /\.(woff2?|ttf|eot|jpe?g|png|gif|svg)$/,
            //     use: [{loader: 'file-loader?name=img/[name].[ext]'}] 
            // }                                           
        ]
    }
};




