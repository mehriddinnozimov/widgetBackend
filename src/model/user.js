const mongoose =  require("mongoose")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }]
},{
    timestamps: true
})

userSchema.methods.toJSON = function(){
    let user = this.toObject();
    delete user.password;
    delete user.tokens
    return user;
}

userSchema.methods.generateToken = async function() {
    let token = await jwt.sign({_id: this._id.toString()}, process.env.JWT_SECRET);
    this.tokens = this.tokens.concat({token})
    await this.save();
    return token;
}

userSchema.statics.findByCredentials = async (username, password) => {
    const user = await User.findOne({username: username});
    if(!user) throw "Something wrong!"
    let isM = await bcrypt.compare(password, user.password);
    if(!isM) throw "Something wrong!"
    return user;
}

userSchema.pre("save", async function(next) {
    if(this.isModified("password")) this.password = await bcrypt.hash(this.password, 8);
    next()
})

const User = new mongoose.model("User", userSchema)

module.exports = User