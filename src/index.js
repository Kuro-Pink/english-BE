const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const handlebars = require("express-handlebars");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
const port = 4000;

const route = require("./routes"); //k cần phải /index.js vì file cứ có tên index.js thì nó tự nạp vào
const db = require("./config/db");

const SortMiddleware = require("./app/middlewares/SortMiddleware");

mongoose.set("strictQuery", true);

//Connect to db
db.connect();

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

//Custom Middlewares
app.use(SortMiddleware);

// Routes init
route(app);

//HTTP logger
app.use(morgan("combined"));

//MethodOverride
app.use(methodOverride("_method"));

//Template engine
app.engine(
  ".hbs",
  handlebars.engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      sortable: (field, sort) => {
        const sortType = field === sort.column ? sort.type : "default";

        const icons = {
          default: "fa-solid fa-sort",
          asc: "fa-solid fa-arrow-up-short-wide",
          desc: "fa-solid fa-arrow-up-wide-short",
        };

        const types = {
          default: "desc",
          asc: "desc",
          desc: "asc",
        };

        const icon = icons[sortType];
        const type = types[sortType];

        return `<a href="?_sort&column=${field}&type=${type}">
                            <i class="${icon}"></i>
                        </a>`;
      },
    },
  })
);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "resources", "views"));

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
