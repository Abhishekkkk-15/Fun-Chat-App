import express from 'express'
import  { config } from 'dotenv'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
import {connectDB} from './lib/db.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import {server,app } from './lib/socket.js'
config()

const port = process.env.PORT
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ limit: "10mb", extended: true }))
app.use(cookieParser())
app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))

app.use('/api/auth',authRoutes)
app.use('/api/messages',messageRoutes)

server.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
    connectDB()
})