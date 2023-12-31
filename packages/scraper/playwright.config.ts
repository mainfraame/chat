import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  reporter: 'html',
  retries: process.env.CI ? 2 : 0,
  testDir: './src',
  use: {
    headless: false,
    trace: 'on-first-retry'
  },
  workers: process.env.CI ? 1 : undefined
});
