const mongoose = require('mongoose');
const { Schema } = mongoose;
const User = require('./User');

const invisiblePeopleSchema = new Schema({
  name: String,
  about: String,
  donations: [String],
  help: String,
  location: String,
  contact: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
});

const InvisiblePeople = mongoose.model('InvisiblePeople', invisiblePeopleSchema);

module.exports = InvisiblePeople;
