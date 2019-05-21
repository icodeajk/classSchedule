var config = require('../config/dev.env.js')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.NODE_ENV)
var devWebpackConfig = require("./webpack.dev.conf");
var webpack = require('webpack');
var path = require('path')
var WebpackDevServer = require('webpack-dev-server');
var proxyMiddleware = require('http-proxy-middleware')

var port = devWebpackConfig.devServer.port || 8080;

var compiler = webpack(devWebpackConfig);

var server = new WebpackDevServer(compiler);

server.use('/api', proxyMiddleware({target: 'http://192.168.1.43:8080', changeOrigin: true}));
// server.use('/api', proxyMiddleware({target: 'http://162.16.6.194:8080', changeOrigin: true}));


module.exports = server.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
});
