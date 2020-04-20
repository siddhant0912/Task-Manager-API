const mongoose = require('mongoose');

//url = process.env.MONGODB_URL.toString()
console.log(process.env.MONGO_URL)

mongoose.connect(process.env.MONGO_URL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
}).then((res) => {
    //console.log('Error')

}).catch(e => console.log(e.message))