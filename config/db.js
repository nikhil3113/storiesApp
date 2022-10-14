const mongoose = require('mongoose')

const connectDB = async() =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useNewURLParser: true,
            useUnifiedTopology: true
        })

        console.log(`MongoDb connected: ${conn.connection.host}`)
    }
    catch(err){
        console.log(err)
        process.exit(1)
    }
}

module.exports= connectDB