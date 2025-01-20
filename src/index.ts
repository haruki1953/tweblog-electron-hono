import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

import { httpPort, httpPortInit } from './configs'
import { apiRouter, staticRouter } from './routers'
import { handleGlobalError, handleResData } from './helpers'
import { startInitService } from './services'
import { startElectron } from './desktop'

const app = new Hono()

app.use(cors())

app.route('/api', apiRouter)
app.route('/', staticRouter)

app.notFound((c) => {
  c.status(404)
  return c.json(handleResData(1, '404 Not Found'))
})

// global error handler
app.onError(handleGlobalError)

// 等待初始化端口再进行之后的启动操作
;(async () => {
  // 端口初始化
  await httpPortInit()
  // 服务初始化
  startInitService()
  // 启动hono服务器
  const server = serve({
    fetch: app.fetch,
    port: httpPort
  })
  // 启动electron桌面
  startElectron(server)
})().catch((error) => { console.log(error) })
