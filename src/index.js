const express = require('express')
require('./db/mongoose')
const userRouter = require('./router/user')
const TaskRouter = require('./router/task')



const app = express()
const port = process.env.PORT
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(TaskRouter)
app.use(userRouter)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})