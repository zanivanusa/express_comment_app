var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var vprasanjeSchema = new Schema({
  'naslov': String,
  'vsebina': String,
  'oznake': String,
  'askedBy' : {
	type: Schema.Types.ObjectId,
	ref: 'user'
	},
  'odgovori': [{
    type: Schema.Types.ObjectId,
    ref: 'odgovor'
  }],
  'enakPosted' : { type: Boolean, default: false },
  'datum': { type: Date, default: Date.now }
});

module.exports = mongoose.model('vprasanje', vprasanjeSchema);
