// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { httpPort } from '@/configs'
import path from 'node:path'

// 虽然本目录下是ts，但编译后是js，应该写.js
export const pathPreloadJs = path.join(__dirname, './preload.js')

// electron专用前端所在位置，开发时用的是vite提供的
// export const urlIndexHtml = `http://127.0.0.1:${httpPort}/desktop/`
export const urlIndexHtml = 'http://localhost:5173/desktop/'

// 托盘图标不支持svg，用png
export const pathFaviconSvg = path.join(__dirname, '../../assets/favicon.svg')
export const pathFaviconPng = path.join(__dirname, '../../assets/favicon.png')

export const desktopConfig = {
  width: 1280,
  height: 720,
  // 屏幕小于宽或高时，宽高的算法，val是屏幕宽或高的值
  screenLtWidthCalc: (val: number) => { return val - 100 },
  screenLtHeightCalc: (val: number) => { return val - 100 },
  minWidth: 500,
  minHeight: 400,
  trayTitle: 'Tweblog',
  trayToolTip: 'Tweblog'
} as const

// 是否打开开发工具
// export const enableDevTools = true
export const enableDevTools = false
