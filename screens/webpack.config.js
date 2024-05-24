const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  resolve: {
    fallback: {
      crypto: false
    }
  },
  externals: [
    nodeExternals()
  ]
};
