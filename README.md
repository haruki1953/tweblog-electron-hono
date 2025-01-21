# Tweblog

- 网站 https://tweblog.com
- 文档 https://github.com/haruki1953/Tweblog
- 后端 https://github.com/haruki1953/tweet-blog-hono
- 前端1（管理） https://github.com/haruki1953/tweet-blog-vue3
- 前端2（公开） https://github.com/haruki1953/tweet-blog-public-vue3
- 桌面版后端 https://github.com/haruki1953/tweblog-electron-hono
- 桌面版前端 https://github.com/haruki1953/tweblog-electron-vue3

本仓库是从tweet-blog-hono修改而来的

在开发环境中，web界面是由前端的开发服务器提供的，所以首先要运行前端 tweblog-electron-vue3
```
  ➜  Local:   http://localhost:5173/desktop/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

之后应该修改 `src\desktop\config.ts`
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

# 代码修改后都需要编译再启动，而且如果有 新增/删除 文件，最好在编译前手动删除dist，因为下面的命令并不会首先清空dist，而只是将编译后的文件覆盖原文件
yarn build && yarn start

# package.json
# "main": "dist/index.js",
```

```
open http://localhost:3000
```

在生产环境运行时，一共有三个前端要被本后端托管，存放在 static 文件夹下
```sh
# 要注意顺序，因为有 emptyOutDir
# tweet-blog-public-vue3
pnpm build --outDir ../tweblog-electron-hono/static --emptyOutDir

# tweet-blog-vue3
pnpm build --outDir ../tweblog-electron-hono/static/admin --emptyOutDir

# tweblog-electron-vue3
pnpm build --outDir ../tweblog-electron-hono/static/desktop --emptyOutDir
```


### 250121 可能必须要将 ORM 从 Prisma 换为 Drizzle
自己现在遇到的最大的问题是，Prisma 对 CLI 依赖严重，需要通过 CLI 进行迁移，不能在js代码中控制迁移。

在用 docker 打包 web 应用时，还算比较容易。自己是通过在 entrypoint.sh 中 执行 `pnpm prisma migrate deploy` 然后再 `node dist/index.js`，以此实现在容器启动时运行迁移，在第一次运行时会创建数据库，应用更新后也能保证数据库正确。（不过好像也并不是最佳实践）

在 electron 开发时用 CLI 来初始化数据库是没问题的，但打包时好像就不能像上面一样做，而且自己也还对 electron 打包原理一无所知，现在完全无从下手了😭

Prisma 还有比较不好的一个问题就是有点大，看了一下容器内的情况，prisma占用了80M
```
/app/node_modules/.pnpm # du -h -d 1 | sort -hr
133.1M  .
32.7M   ./@prisma+engines@5.18.0
26.0M   ./prisma@5.18.0
24.2M   ./@prisma+client@5.18.0_prisma@5.18.0
```

看来必须要考虑换为 Drizzle 了，它好像是支持在js代码中控制迁移的，这是最佳实践吗？