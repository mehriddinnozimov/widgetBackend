const mongoose = require("mongoose")

const url = process.env.MONGO_URL


module.exports = () => {
    mongoose.connect(url, {
        useNewUrlParser: true, 
        useUnifiedTopology: true,
        dbName: "NamazWidgetDB"}, (err) => {
        err ? console.log(err) : console.log("connect DB.")
    });
}