const express = require('express');

const userRouter = require('./routes/user');
const mongoose = require('mongoose')


const app = express();

//mongodb connection 
mongoose.set("strictQuery", false);
mongoose.connect("mongodb+srv://vinayreddy:dbvinay@cluster0.dg39qrk.mongodb.net/test",{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() =>{
    console.log('db is connected!')
})
.catch((ex) =>{
    console.log('db connection failed: ', ex)
})


app.use(express.json())


//Routes config

app.use('/api/user',userRouter)




app.listen(8000, () => {
    console.log('port is listening on 8000')
})