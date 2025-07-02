import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 30000,
  reporter: [['list'], ['allure-playwright']],
  use: {
    baseURL: 'http://127.0.0.1:8000',
    headless: false,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  outputDir: 'test-results',
  projects: [
    // {
    //   name: 'chromium',
    //   use: { browserName: 'chromium' },
    // },
    // {
    //   name: 'firefox',
    //   use: { browserName: 'firefox' },
    // },
    // {
    //   name: 'webkit',
    //   use: { browserName: 'webkit' },
    // },
    {
      name: 'chrome-headed', // better name, avoids ()
      use: {
        browserName: 'chromium',
        channel: 'chrome',     // uses installed Google Chrome
        headless: false,       // headed mode
      },
    },
  ],
});
