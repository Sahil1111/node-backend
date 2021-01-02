const User = require('./model')
const { generateToken } = require('../../lib/helpers')
const { UnauthorizedError } = require('../../lib/errors')
const {
  loginSchema,
  userSchema,
  forgotSchema,
  uploadFile
} = require('./schema')
const sendEmailToUser = require('../../config/email').sendEmailToUser

module.exports = {
  async list(ctx) {
    const { skip, limit } = ctx.query

    const users = await User.list({ skip, limit })

    ctx.body = users
  },
  /**
   * Registers a new user and logs him in by returnin a token
   */
  async register(ctx) {
    const { body } = ctx.request
    var token = generateToken(body)
    body.token = token
    console.log('Data point 2', body)
    let user = await userSchema.validate(body, {
      abortEarly: false,
      context: { validatePassword: true }
    })

    user = await new User(user).save()

    ctx.status = 201
    ctx.set('Location', `${ctx.URL}/${user.id}`)
    ctx.body = { status: 200, token: token, user_details: user }
  },
  /**
   * Update user email, name using id
   * then return the updated data
   */
  async update(ctx) {
    const { body } = ctx.request
    let { user = {} } = body
    const opts = {
      abortEarly: false,
      context: { validatePassword: true }
    }
    user = await ctx.app.schemas.user.validate(user, opts)
    const userId = ctx.state.user.id
    const existingUser = await User.getById(userId)
    await existingUser.updateProfile(user)
    ctx.status = 200
    ctx.body = {
      status: 200,
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email
    }
  },
  /**
   * Update user email, name using id
   * then return the updated data
   */
  async upload(ctx) {
    console.log('This the part', ctx.request)
    const { key, url } = await uploadFile({
      fileName: ctx.request.files.filename.name,
      filePath: ctx.request.files.filename.path,
      fileType: ctx.request.files.filename.type
    })
    ctx.body = { status: 200, message: 'File uploaded successfully', key, url }
  },
  /**
   * Logs in a user by checking if the given email and password matches,
   * then return a token if email and password match
   */
  async login(ctx) {
    const { body } = ctx.request

    const { email, password } = await loginSchema.validate(body, {
      abortEarly: false
    })

    const user = await User.findByEmail(email)
    var token = generateToken(body)

    if (!user || !(await user.passwordMatches(password))) {
      throw new UnauthorizedError('Email or password is invalid')
    } else {
      user.token = token
      await user.updateToken(user)
    }

    user.password = 'ENCRYPTED'

    ctx.body = { status: 200, token: token, user_details: user }
  },
  /**
   * For sending user an email for resetting a password
   */
  async forgot_password(ctx) {
    const { body } = ctx.request
    console.log('There are things missing', body)
    const { email } = await forgotSchema.validate(body, {
      abortEarly: false
    })

    const user = await User.findByEmail(email)
    var token = generateToken(body)

    if (!user) {
      throw new UnauthorizedError('Email is invalid')
    } else {
      user.password_reset_token = token
      user.reset_password = 1
      var data = {
        head: 'Admin',
        name: user.name,
        recovery_token: token,
        link: 'http://18.218.142.32:5000/recover-password?token=' + token
      }
      await user.updateResetPassword(user)
      await user.updateResetPasswordToken(user)
      var mail = await sendEmailToUser(
        'FORGOT_PASSWORD',
        data,
        user.email,
        'support@YourCompany.com',
        'Forgot Password Request Acknowledgement',
        ''
      )
      console.log('What the hell with the email', mail)
    }

    ctx.body = {
      status: 200,
      message: 'An email with the resent link has been sent to the user'
    }
  },
  /**
   * For resetting users password using the unique token
   */
  async reset_password(ctx) {
    const { body } = ctx.request
    console.log('There are things missing', body)
    const { email } = await forgotSchema.validate(body, {
      abortEarly: false
    })

    const user = await User.findByEmail(email)
    var token = generateToken(body)

    if (!user) {
      throw new UnauthorizedError('Email is invalid')
    } else {
      user.token = token
      var data = {
        name: user.name,
        recovery_token: token,
        link: 'http://18.218.142.32:5000/recover-password?token=' + token
      }
      await user.updateToken(user)
      var mail = await sendEmailToUser(
        'FORGOT_PASSWORD',
        data,
        user.email,
        'support@YourCompany.com',
        'Forgot Password Request Acknowledgement',
        ''
      )
      console.log('What the hell with the email', mail)
    }

    ctx.body = {
      status: 200,
      message: 'An email with the resent link has been sent to the user'
    }
  }
}
