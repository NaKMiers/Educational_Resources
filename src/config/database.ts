import mongoose from 'mongoose'

let cachedConnection: any = null

export async function connectDatabase() {
  if (cachedConnection) {
    //
    console.log('Returning cached database connection') //
    return cachedConnection
  } //

  try {
    await mongoose.connect(process.env.MONGODB!)
    const connection = mongoose.connection

    connection.on('connected', () => {
      console.log('MongoDB connected successfully')
    })

    connection.on('error', error => {
      console.log('MongoDB connection error. Please make sure MongoDB is running. ' + error)
    })

    cachedConnection = connection //
    return connection
  } catch (error) {
    console.log('Something goes wrong!')
    console.log(error)
    throw new Error('Unable to connect to database')
  }
}
