require("dotenv").config();
const express = require("express");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const PageNotFound = require("./helper/NotFound");
const bodyParser = require("body-parser");
const path = require("path");
const User = require("./models/user");
const mongoose = require("mongoose");
const mongo_DB_URI = process.env.MONGO_DB_URI;

const app = express();
// Use the PORT environment variable, fallback to 3000 if not set
const PORT = process.env.PORT || 3000; 

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById("65aaa79a8945687d161ef472")
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(PageNotFound);

mongoose
  .connect(mongo_DB_URI)
  .then((result) => {
    app.listen(PORT, '0.0.0.0', () => {  // Bind to 0.0.0.0 so it's accessible externally
      console.log("Database connected");
      User.findOne().then((user) => {
        if (!user) {
          const user = new User({
            name: "David",
            email: "david@gmail.com",
            cart: {
              items: [],
            },
          });
          user.save();
        } else {
          console.log("User Already Exists");
        }
      });
      console.log(`App is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

// mongoConnect(() => {
//   app.listen(PORT, () => {
//     console.log("App is running on the port http://localhost:3000");
//   });
// });
