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
        additionalData: '@import "@/global.less";' // 使用别名导入全局变量文件
      }
    }
  },
  envDir, // 指向根目录
  envPrefix: ['VITE_', 'MFE_'], // 支持 VITE_ 和 MFE_ 前缀
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
      // '/api':
      // {
      //   target: 'http://localhost:3000', // api代理路径
      //   changeOrigin: true,
      //   rewrite: path => path.replace(/^\/api/, '')
      // }
    }
  },
  plugins: [
    react(),
    viteEslint({
      failOnError: false
    })
  ]
});
