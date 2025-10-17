module.exports = {
  defaults: {
    standard: 'WCAG2AA',
    timeout: 30000,
    wait: 2000,
    chromeLaunchConfig: {
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
  },
  urls: [
    'http://localhost:4000/',
    'http://localhost:4000/about.html',
    'http://localhost:4000/projects.html'
  ]
}