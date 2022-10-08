const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const morgan = require("morgan");
const app = express();


// Settings
app.set("port", process.env.PORT || 3536);
app.set("views", path.join(__dirname, "views"));
app.engine('.hbs', exphbs.create({extname: '.hbs', defaultLayout: 'main', layoutsDir:__dirname + '/views/layouts/'}).engine);
app.set('view engine', 'hbs');


app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use(require("./routes/index"));
app.use(require("./routes/account"));
app.use(require("./routes/request"));
app.use(require("./routes/manage"));


app.use(express.static(path.join(__dirname, "/public")));

//404
app.all('*', (req, res) => {
    res.status(404).render('404');
})

module.exports = app;
