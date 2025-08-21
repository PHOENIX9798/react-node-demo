import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  css: {
    // 预处理器配置项
    preprocessorOptions: {
      less: {
        math: 'always',
        globalVars: {
          //配置全局变量
          blue: '#1CC0FF'
        },
        additionalData: '@import "./src/global.less";  ' // 或者自动将全局变量文件引入每个less文件中
      }
    }
  }
});

