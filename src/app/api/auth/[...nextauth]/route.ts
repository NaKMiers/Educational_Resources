import { connectDatabase } from '@/config/database'
import UserModel, { IUser } from '@/models/UserModel'
import bcrypt from 'bcrypt'
import NextAuth from 'next-auth'

// Providers
import CredentialsProvider from 'next-auth/providers/credentials'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

// Models: User
import '@/models/UserModel'

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET!,
  jwt: {
    secret: process.env.NEXTAUTH_SECRET!,
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    // GOOGLE
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // GITHUB
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),

    // CREDENTIALS
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        usernameOrEmail: { label: 'Username or Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        await connectDatabase()
        console.log('- Cedentials -', credentials)

        // check if credentials is empty
        if (!credentials?.usernameOrEmail || !credentials?.password) {
          return null
        }

        // get data from credentials
        const { usernameOrEmail, password } = credentials

        // find user from database
        const user: any = await UserModel.findOne({
          $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
        }).lean()

        // check user exists or not in database
        if (!user) {
          throw new Error('Tài khoản hoặc mật khẩu không đúng')
        }

        // check if user is not local
        if (user.authType !== 'local') {
          throw new Error('Tài khoản này được xác thực bởi ' + user.authType)
        }

        // check password
        const isValidPassword = await bcrypt.compare(password, user.password)
        if (!isValidPassword) {
          // push error to call back
          throw new Error('Tài khoản hoặc mật khẩu không đúng')
        }

        // // exclude password from user who have just logined
        const { password: _, avatar: image, ...otherDetails } = user

        // return to session callback
        return { ...otherDetails, image, name: user.firstName + ' ' + user.lastName }
      },
    }),

    // ...add providers here
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      console.log('- JWT -')
      // console.log('jwt-xxxx', token)
      // console.log('jwt-trigger', trigger)
      // console.log('jwt-ss', session)

      if (trigger === 'update' && token.email) {
        console.log('- Update Token -')
        const userDB: IUser | null = await UserModel.findOne({ email: token.email }).lean()
        if (userDB) {
          const { password: _, ...otherDetails } = userDB

          return { ...token, ...otherDetails }
        }
      }

      if (user) {
        const userDB: IUser | null = await UserModel.findOne({ email: user.email }).lean()
        if (userDB) {
          const { password: _, ...otherDetails } = userDB

          token = { ...token, ...otherDetails }
        }
      }

      return token
    },

    async session({ session, token }) {
      console.log('- Session -')
      // console.log('session-xxxx', session)
      // console.log('session-token', token)

      session.user = token

      return session
    },

    async signIn({ user, lesson, profile }: any) {
      console.log('- Sign In -')

      try {
        // connect to database
        await connectDatabase()

        if (lesson && lesson.provider != 'credentials') {
          if (!user || !profile) {
            return false
          }

          // get data for authentication
          const email = user.email
          const avatar = user.image
          let firstName: string = ''
          let lastName: string = ''

          if (lesson.provider === 'google') {
            firstName = profile.given_name
            lastName = profile.family_name
          } else if (lesson.provider === 'github') {
            firstName = profile.name
            lastName = ''
          }

          // get user from database to check exist
          const existingUser: any = await UserModel.findOneAndUpdate(
            { email },
            { $set: { avatar } },
            { new: true }
          ).lean()

          // check whether user exists
          if (existingUser) {
            return true
          }

          // create new user with google infomation (auto verified email)
          const newUser = new UserModel({
            email,
            avatar,
            firstName,
            lastName,
            authType: lesson.provider,
            verifiedEmail: true,
          })

          await newUser.save()
        }

        return true
      } catch (err: any) {
        console.log(err)
        return false
      }
    },
  },
})

export { handler as GET, handler as POST }
