module.exports = {
  plugins: [
    require('autoprefixer')({
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'Chrome >= 90',
        'Firefox >= 88',
        'Safari >= 14',
        'Edge >= 90',
        'iOS >= 14',
        'Android >= 10'
      ]
    }),
    require('postcss-combine-duplicated-selectors')(),
    require('postcss-combine-media-query')(),
    require('postcss-sort-media-queries')({
      sort: 'mobile-first'
    })
  ]
}