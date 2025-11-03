const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const dotenv = require("dotenv");
dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    const exists = await Admin.findOne({ username: "admin" });
    if (exists) {
      console.log("Admin already exists");
      process.exit();
    }
    const admin = new Admin({ username: "admin", password: "gym123" });
    await admin.save();
    console.log("Admin created successfully!");
    process.exit();
  })
  .catch(err => console.log(err));
