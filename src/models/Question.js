const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const slugUpdate = require('mongoose-slug-updater');
// const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const QuestionSchema = new Schema(
    {
        // _id: { type: Number },
        number: { type: Number },
        nameExcercise: { type: String },
        content: { type: String },
        title: { type: String },
        answer: { type: String },
        slug: { type: String, slug: 'title', unique: true },
    },
    {
        // _id: false,
        timestamps: true,
    },
);

//Add plugins
// QuestionSchema.plugin(AutoIncrement)
mongoose.plugin(slug);
mongoose.plugin(slugUpdate);
QuestionSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Question', QuestionSchema);
