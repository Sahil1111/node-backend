const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const { DuplicateKeyError } = require('../../lib/errors')
const { Schema } = mongoose

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    password_reset_expires: {
      type: Schema.Types.Date
    },
    password_reset_token: {
      type: String
    },
    token: {
      type: String
    },
    reset_password: {
      type: String
    }
  },
  { timestamps: true }
)

UserSchema.pre('save', async function(next) {
  const user = this
  console.log('Data point 1', user)
  if (!user.isModified('password')) {
    return next()
  }
  user.password = await bcrypt.hash(user.password, 10)
  next()
})

UserSchema.post('save', function postSave(error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    console.log('What was the error ?', error)
    next(new DuplicateKeyError('email;email has already been taken.'))
  } else {
    next(error)
  }
})

UserSchema.methods = {
  passwordMatches(rawPassword) {
    return bcrypt.compare(rawPassword, this.password)
  },

  updateProfile({ name }) {
    this.name = name
    console.log('The data for updation', name)
    return this.save()
  },
  updateToken({ token }) {
    this.token = token
    console.log('The data for token updation', token)
    return this.save()
  },
  updateResetPassword({ reset_password }) {
    this.reset_password = reset_password
    console.log('The data for reset_password updation', reset_password)
    return this.save()
  },
  updateResetPasswordToken({ password_reset_token }) {
    this.password_reset_token = password_reset_token
    console.log(
      'The data for password_reset_token updation',
      password_reset_token
    )
    return this.save()
  }
}

UserSchema.statics = {
  getById(id) {
    return this.findById(id).exec()
  },

  findByToken(token) {
    return this.findOne(token).exec()
  },

  findByEmail(email) {
    return this.findOne({ email }).exec()
  },

  list({ skip = 0, limit = 20 } = {}) {
    return this.find({}, { id: 1, name: 1, email: 1 })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec()
  }
}

module.exports = mongoose.model('User', UserSchema)
