const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

//schema creation

const userSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email : {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false,
    }

})

//hasing the password to the backend
userSchema.pre('save', async function (next) {
   if(this.isModified("password")){
    this.password =  await bcrypt.hash(this.password, 10)
   }
   next()
})
// creating model
module.exports = mongoose.model("User", userSchema);