// Modules to control application life and create native browser window
import { app, BrowserWindow, ipcMain } from 'electron'
import { urlIndexHtml, pathPreloadJs } from './config'
import { generateTokenAdmin } from '@/services'
import { httpPort } from '@/configs'

// 将在 src/index.ts 中调用
export const startElectron = () => {
  app.whenReady().then(() => {
    handleIcpMain()
    createWindow()
    // 部分 API 在 ready 事件触发后才能使用。
    app.on('activate', () => {
      // 在 macOS 系统内, 如果没有已开启的应用窗口
      // 点击托盘图标时通常会重新创建一个新窗口
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
      }
    })
  }).catch((error) => { console.log(error) })
}

const handleIcpMain = () => {
  ipcMain.handle('generateTokenAdmin', async () => await generateTokenAdmin('electron'))
  ipcMain.handle('httpPortIcp', async () => httpPort)
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 600,
    show: false, // 初始隐藏窗口
    webPreferences: {
      preload: pathPreloadJs
    }
  })

  // 加载 index.html
  // mainWindow.loadFile(pathIndexHtml).catch((error) => { console.log(error) })
  mainWindow.loadURL(urlIndexHtml).catch((error) => { console.log(error) })
  // // 打开开发工具
  // mainWindow.webContents.openDevTools()

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })

  return mainWindow
}

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对应用程序和它们的菜单栏来说应该时刻保持激活状态，直到用户使用 Cmd + Q 明确退出
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
