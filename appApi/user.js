const Router = require('koa-router')

const mongoose = require('mongoose')

let router = new Router()

router.get('/', async(ctx) => {
  ctx.body = '用户操作首页'
})

router.post('/register', async(ctx) => {
  const User = mongoose.model('User')
  let data = ctx.request.body
  let addUser = {
    userName: data.userName,
    password: data.password,
    lastLoginAt: Date.now()
  }
  let newUser = new User(addUser)
  await newUser.save().then(async () => {
    await User.find({
      userName: newUser.userName
    }).exec().then(result => {
      ctx.body = {
        code: 200,
        data: {
          userName: result.userName
        },
        message: '注册成功'
      }
    })
  }).catch(error => {
    ctx.body = {
      code: 500,
      message: error
    }
  })
})

router.post('/login', async(ctx) => {
  let loginUser = ctx.request.body
  let userName = loginUser.userName
  let password = loginUser.password
  // 引入User的model
  const User = mongoose.model('User')
  await User.findOne({
    userName: userName
  }).exec().then(async (result) => {
    if (result) {
      if (password === result.password) {
        ctx.body = {
          code: 200,
          data: {
            loginUser: loginUser.userName
          },
          message: '登录成功'
        }
      } else {
        ctx.body = {
          code: 502,
          message: '密码错误'
        }
      }
    } else {
      ctx.body = {
        code: 501,
        message: '用户不存在'
      }
    }
  }).catch(error => {
    console.log(error)
    ctx.body = {
      code: 500,
      message: error
    }
  })
})

module.exports = router