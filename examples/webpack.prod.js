const webpack = require("webpack");
const merge = require("webpack-merge");
const base = require("./webpack.config.js");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = merge(base, {
  mode: "production",
  devtool: "none",
  output: {
    filename: "[name].[hash].js",
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: "static",
      openAnalyzer: false,
      reportFilename: "report/report.html",
    }),
  ],
});
