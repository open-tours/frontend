module.exports = {
  devServer: {
    proxy: {
      "^/(api|media)/": {
        target: "http://127.0.0.1:8000/",
        changeOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // GraphQL Loader
    config.module
      .rule("graphql")
      .test(/\.(graphql|gql)$/)
      .use("graphql-tag/loader")
      .loader("graphql-tag/loader")
      .end();
  }
};
