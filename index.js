const koa = require('koa')
const app = new koa()

// 引入mongo
const { connect, initSchemas } = require('./database/init.js')
const mongoose = require('mongoose')

const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')

const cors = require('koa2-cors')

app.use(bodyParser())
app.use(cors())

// 装载子路由
const router = new Router

// 用户相关接口
let user = require('./appApi/user.js')

// 挂载用户接口
router.use('/api/user', user.routes())

// 加载相关中间件
app.use(router.routes())
app.use(router.allowedMethods())

;(async () => {
  await connect()
  initSchemas()
})()

app.use(async (ctx) => {
  ctx.body = '<h1>Hello Jerry</h1>'
})

app.listen(3033, () => {
  console.log('[server] is starting at port 3033')
})
