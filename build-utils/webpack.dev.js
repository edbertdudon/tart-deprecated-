const Dotenv = require('dotenv-webpack');
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  plugins: [
    new Dotenv({
      path: './.env.development',
    }),
		new webpack.HotModuleReplacementPlugin()
  ],
	devServer: {
    contentBase: './dist',
    hot: true,
    port: 3000,
  }
};
