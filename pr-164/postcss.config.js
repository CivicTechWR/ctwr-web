module.exports = {
  plugins: [
    require("postcss-import"),
    require("autoprefixer"),
    require("postcss-sort-media-queries"),
    require("postcss-combine-media-query"),
    require("postcss-combine-duplicated-selectors"),
  ],
};
