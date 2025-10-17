module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  workers: 1,
  use: {
    baseURL: 'http://localhost:4000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...require('@playwright/test').devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...require('@playwright/test').devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...require('@playwright/test').devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...require('@playwright/test').devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...require('@playwright/test').devices['iPhone 12'] }
    }
  ]
}