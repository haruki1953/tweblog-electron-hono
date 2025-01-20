# Tweblog

- 网站 https://tweblog.com
- 文档 https://github.com/haruki1953/Tweblog
- 后端 https://github.com/haruki1953/tweet-blog-hono
- 前端1（管理） https://github.com/haruki1953/tweet-blog-vue3
- 前端2（公开） https://github.com/haruki1953/tweet-blog-public-vue3
- 桌面版后端 https://github.com/haruki1953/tweblog-electron-hono
- 桌面版前端 https://github.com/haruki1953/tweblog-electron-vue3

本仓库是从tweet-blog-hono修改而来的

在开发环境中，web界面是由前端的开发服务器提供的，所以首先要运行前端tweblog-electron-vue3
```
  ➜  Local:   http://localhost:5173/desktop/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

之后应该修改 src\desktop\config.ts
```
export const urlIndexHtml = 'http://localhost:5173/desktop/'
```


```sh
# 安装项目依赖
yarn install

# 生成Prisma Client
yarn prisma generate

# 将Prisma schema推送到数据库，创建数据库
yarn prisma db push

# 编译
yarn build

# 启动
yarn start

# yarn build && yarn start
```

```
open http://localhost:3000
```