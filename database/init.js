const mongoose = require('mongoose')
const db = 'mongodb://localhost:27017/blog'

const glob = require('glob')
const { resolve } = require('path')

exports.initSchemas = () => {
  glob.sync(resolve(__dirname, './schema', '**/*.js')).forEach(require)
}

mongoose.Promise = global.Promise

exports.connect = () => {
  // 连接数据库
  mongoose.set('useCreateIndex', true)
  mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
  
  let maxConnectTimes = 0

  return new Promise((resolve, reject) => {
    // 监听断开连接
    mongoose.connection.on('disconnected', () => {
      console.log('*****数据库连接断开******')
      if (maxConnectTimes < 3) {
        // 重连3次
        maxConnectTimes++
        mongoose.set('useCreateIndex', true)
        mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
      } else {
        reject()
        throw new Error('数据库错误, 请修复')
      }
    })

    // 数据库出现错误
    mongoose.connection.on('error', err => {
      console.log('******数据库出现错误******')
      if (maxConnectTimes < 3) {
        maxConnectTimes++
        mongoose.set('useCreateIndex', true)
        mongoose.connect(db, {useNewUrlParser:true, useUnifiedTopology: true})
      } else {
        reject()
        throw new Error('数据库出现错误, 请修复')
      }
    })

    // 数据库打开连接
    mongoose.connection.once('open', () => {
      console.log('MongoDB Connect Successful')
      resolve()
    })
  })
}