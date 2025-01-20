import portfinder from 'portfinder'

// get backend port from env
let httpPort = Number(process.env.TWEET_BLOG_HONO_PORT)
// default port
if (Number.isNaN(httpPort)) {
  httpPort = 3000
}
export { httpPort }

// 服务器运行前执行并await这个，确保端口未占用
export const httpPortInit = async () => {
  // 将开始搜索 httpPort 并扫描直到最大端口号
  httpPort = await portfinder.getPortPromise({
    port: httpPort
  })
}

export const postConfig = {
  postMaxImages: 4,
  postNumInPage: 20,
  imageNumInPage: 20
} as const
