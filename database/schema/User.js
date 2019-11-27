const mongoose = require('mongoose')

const Schema = mongoose.Schema

let ObejectId = Schema.Types.ObjectId

// 创建用户Schema
const userSchema = new Schema({
  userId: { type: ObejectId },
  userName: { unique: true, type: String },
  password: { type: String },
  createAt: { type: Date, default: Date.now() },
  lastLoginAt: { type: Date, default: Date.now() }
}, {
  collection: 'user'
})

// 发布模型
mongoose.model('User', userSchema)