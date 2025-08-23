import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import viteEslint from 'vite-plugin-eslint';

const envDir = path.resolve(process.cwd(), './env')

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
  },
  envDir,
  envPrefix: 'MFE_',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.scss', '.css'],
    alias: {
      '@': path.resolve(__dirname, 'src'), // 源文件根目录
      '@tests': path.resolve(__dirname, 'tests'), // 测试文件根目录
      '@config': path.resolve(__dirname, 'config') // 配置文件根目录
    }
  },
  server: {
    open: true, // 自动打开浏览器
    port: 3006, // 服务端口
    proxy: {
      '/api': '', // api代理路径
      '/mock': '' // mock代理路径
    }
  },
  plugins: [
    react(),
    viteEslint({
      failOnError: false
    })
  ]
});
