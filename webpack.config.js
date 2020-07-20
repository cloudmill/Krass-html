// webpack.config.js

module.exports = {
  mode: 'production',
  cache: true,
  output: {
    filename: "scripts.min.js",
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
