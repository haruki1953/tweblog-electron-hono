// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { httpPort } from '@/configs'
import path from 'node:path'

// 虽然本目录下是ts，但编译后是js，应该写.js
export const pathPreloadJs = path.join(__dirname, './preload.js')

// electron专用前端所在位置
// export const pathIndexHtml = path.join(__dirname, '../../dist-vue/index.html')
// export const urlIndexHtml = `http://127.0.0.1:${httpPort}/desktop/`
export const urlIndexHtml = 'http://localhost:5173/desktop/'
