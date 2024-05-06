const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const slugUpdate = require('mongoose-slug-updater');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const CourseSchema = new Schema(
    {
        // _id: { type: mongoose.Schema.Types.ObjectId },
        _id: { type: Number },
        name: { type: String },
        description: { type: String },
        image: { type: String },
        videoId: { type: String },
        slug: { type: String, slug: 'name', unique: true },
    },
    {
        _id: false,
        timestamps: true,
    },
);

//Add plugins
CourseSchema.plugin(AutoIncrement);
mongoose.plugin(slug);
mongoose.plugin(slugUpdate);
CourseSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: 'all',
});

module.exports = mongoose.model('Course', CourseSchema);
