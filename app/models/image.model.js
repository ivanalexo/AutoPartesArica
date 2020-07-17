const SimpleSchema = require('simpl-schema');

const Image = new SimpleSchema({
    mime: String,
    src: String
});

module.exports = Image;
