const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");
const mongooseDelete = require("mongoose-delete");
const slugUpdate = require("mongoose-slug-updater");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const Schema = mongoose.Schema;

const AuthenSchema = new Schema(
  {
    code: {
      type: Number,
      require: true,
      minlength: 6,
      maxlength: 15,
      unique: true,
    },
    username: { type: String, require: true, minlength: 6, maxlength: 50 },
    email: {
      type: String,
      require: true,
      minlength: 6,
      maxlength: 50,
      unique: true,
    },
    password: { type: String },
    replacePassword: { type: String },
    admin: { type: Boolean, default: false },
    role: { type: String, require: true },
    slug: { type: String, slug: "code", unique: true },
  },
  {
    timestamps: true,
  }
);

//Add plugins
// AuthenSchema.plugin(AutoIncrement);
mongoose.plugin(slug);
mongoose.plugin(slugUpdate);
AuthenSchema.plugin(mongooseDelete, {
  deletedAt: true,
  overrideMethods: "all",
});

module.exports = mongoose.model("Authen", AuthenSchema);
