const express = require("express")
const app = express()

const path = require("path")
const bodyParser = require("body-parser")
const helmet = require("helmet")

const auth = require("./src/middleware/auth")

app.use(helmet())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static(path.join(__dirname, '/src/statics')))

app.set("views", "./src/views")
app.set("view engine", "ejs")


const User = require("./src/model/user")
const Time =require("./src/model/time")

app.post("/api/login", async (req, res) => {
	try {
        if(!req.body || !req.body.username || !req.body.password) throw "Wrong body!";
        const user = await User.findByCredentials(req.body.username, req.body.password);
        if(!user) throw "User not found!"
        const token = await user.generateToken()
        return res.json({ success:true, token, user })
    } catch (err) {
        console.log(err)
        return res.json({ success:false, err })
    }
})

app.post("/api/profile/password", auth, async (req, res) => {
	try {
	    if(!req.body || !req.body.oldPassword) throw "Wrong body!";
        const user = await User.findByCredentials(req.user.username, req.body.oldPassword);
        if(!user) throw "User not found!"
        user.password = req.body.password
    	await user.save()
        return res.json({ success:true, user })
    } catch (err) {
        console.log(err)
        return res.json({ success:false, err })
    }
})

app.post("/api/profile", auth, async (req, res) => {
	try {
        return res.json({ success:true, user: req.user })
    } catch (err) {
        console.log(err)
        return res.json({ success:false, err })
    }
})

app.post("/api/profile/logout", auth, async (req, res) => {
    try {
        await req.logout()
        return res.json({ success: true })
    } catch (err) {
        console.log(err)
        return res.json({ success: false, err })
    }
})


app.get("/api/time", async (req, res) => {
    try {
        const times = await Time.find()
        const time = await Time.findOne(times[0]._id)
        time.countViewer = time.countViewer + 1;
        await time.save()
        return res.json({ success: true, times: times[0] })
    } catch (err) {
        console.log(err)
        return res.json({ success: false, err })
    }

})

app.post("/api/time", auth, async (req, res) => {
    try {
        if(!req.body || !req.body.bomdod || !req.body.peshin || !req.body.asr || !req.body.shom || !req.body.xufton) throw "Wrong body"
        const times = await Time.findOne({ owner: req.user._id })
        times.bomdod = req.body.bomdod
        times.peshin = req.body.peshin
        times.asr = req.body.asr
        times.shom = req.body.shom
        times.xufton = req.body.xufton
        await times.save()
        return res.json({ success: true, times })
    } catch (err) {
        console.log(err)
        return res.json({ success: false, err })
    }

})

module.exports = app