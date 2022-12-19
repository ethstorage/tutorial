module.exports = {
  configureWebpack: {
    output: {
      filename: `[name].js`,
      chunkFilename: `[name].js`
    },
  },
  css: {
    extract: {
      filename: '[name].css',
      chunkFilename: '[name].css',
    },
  },
  chainWebpack: config => {
    config.module
      .rule("images")
      .use("url-loader")
      .tap(options => {
        options.name = `[name].[ext]`;
        options.fallback = {
          loader: "file-loader",
          options: {
            name: `[name].[ext]`
          }
        };
        return options;
      });
  },
  productionSourceMap: false,
  publicPath: '/'
};
