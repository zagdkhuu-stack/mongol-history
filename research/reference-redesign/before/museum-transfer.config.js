import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'.',testMatch:'museum-transfer.spec.js',testIgnore:'**/research/**',timeout:120000,expect:{timeout:10000},workers:1,reporter:'list',use:{baseURL:'http://127.0.0.1:5173/mongol-history/',headless:true,launchOptions:{channel:'msedge'},viewport:{width:1440,height:900}}});
