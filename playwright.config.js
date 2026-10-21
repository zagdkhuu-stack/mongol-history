import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'.',testMatch:'museum-transfer.spec.js',testIgnore:'**/research/**',timeout:120000,use:{baseURL:process.env.PLAYWRIGHT_BASE_URL||'http://127.0.0.1:5173/mongol-history/',viewport:{width:1440,height:900},launchOptions:{channel:process.platform==='win32'?'msedge':undefined},headless:true},workers:1,reporter:'list'});

