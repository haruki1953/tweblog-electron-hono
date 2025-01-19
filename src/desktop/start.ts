// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage, screen } from 'electron'
import { urlIndexHtml, pathPreloadJs, pathFaviconPng, desktopConfig, enableDevTools } from './config'
import { generateTokenAdmin } from '@/services'
import { httpPort } from '@/configs'
import { type ServerType } from '@hono/node-server/.'

let mainTray: Tray | null = null
// 注意，窗口被关闭时并不会是null，而应该通过 mainWindow.isDestroyed() 判断
let mainWindow: BrowserWindow | null = null

let isQuitting = false
const quitApp = () => {
  if (isQuitting) {
    return
  }
  isQuitting = true
  app.quit()
}

// 将在 src/index.ts 中调用
export const startElectron = (server: ServerType) => {
  app.whenReady().then(() => {
    // 绑定icp通信
    handleIcpMain()
    // 创建托盘
    createTray()
    // 创建窗口
    createWindow()
    // 部分 API 在 ready 事件触发后才能使用。
    app.on('activate', () => {
      // 在 macOS 系统内, 如果没有已开启的应用窗口
      // 点击托盘图标时通常会重新创建一个新窗口
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
    // 在应用退出前关闭 Hono 服务器
    app.on('before-quit', () => {
      server.close(() => {
        console.log('Hono server closed')
      })
    })
  }).catch((error) => { console.log(error) })
}

const handleIcpMain = () => {
  ipcMain.handle('generateTokenAdmin', async () => await generateTokenAdmin('desktop'))
  ipcMain.handle('httpPortIcp', async () => httpPort)
}

const createTray = () => {
  const icon = nativeImage.createFromPath(pathFaviconPng)
  mainTray = new Tray(icon)
  const contextMenu = Menu.buildFromTemplate([
    {
      label: '退出',
      click: quitApp
    }
  ])

  mainTray.setContextMenu(contextMenu)
  mainTray.setToolTip(desktopConfig.trayToolTip)
  mainTray.setTitle(desktopConfig.trayTitle)

  // 点击托盘图标显示窗口
  mainTray.on('click', () => {
    if (isQuitting) {
      return
    }
    if (mainWindow == null) {
      return
    }
    const isVisible = mainWindow.isVisible()
    const isMinimized = mainWindow.isMinimized()

    if (!isVisible && !isMinimized) {
      // 已隐藏
      mainWindow.show()
    } else if (isMinimized) {
      // 最小化
      mainWindow.restore()
    } else {
      // 显示
    }
  })
}

const createWindow = () => {
  // 根据屏幕大小控制窗口大小
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize
  const windowInfo = (() => {
    if (screenWidth < desktopConfig.width || screenHeight < desktopConfig.height) {
      return {
        width: desktopConfig.screenLtWidthCalc(screenWidth),
        height: desktopConfig.screenLtHeightCalc(screenHeight),
        shouldMaximize: true
      }
    }
    return {
      width: desktopConfig.width,
      height: desktopConfig.height,
      shouldMaximize: false
    }
  })()
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: windowInfo.width,
    height: windowInfo.height,
    minWidth: desktopConfig.minWidth,
    minHeight: desktopConfig.minHeight,
    show: false, // 初始隐藏窗口
    icon: pathFaviconPng,
    webPreferences: {
      preload: pathPreloadJs
    }
  })
  if (windowInfo.shouldMaximize) {
    mainWindow.maximize()
  }
  // // 完成加载时显示窗口
  // mainWindow.once('ready-to-show', () => {
  //   mainWindow?.show()
  // })
  // 感觉延时1秒更好
  setTimeout(() => {
    mainWindow?.show()
  }, 1000)

  // 移除默认的菜单栏
  mainWindow.setMenu(null)

  // 加载 index.html
  mainWindow.loadURL(urlIndexHtml).catch((error) => { console.log(error) })

  // 打开开发工具
  if (enableDevTools) {
    mainWindow.webContents.openDevTools()
  }

  // 窗口关闭时隐藏窗口
  mainWindow.on('close', (event) => {
    if (isQuitting) {
      // 这个是必要的，不然无法退出
      return
    }
    event.preventDefault()
    mainWindow?.hide()
    return true
  })
}
