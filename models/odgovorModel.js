var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  'text': { type: String, default:"test" },
  'askedBy': {
    type: Schema.Types.ObjectId,
    ref: 'user'
  },
  'postedOn': {
    type: Schema.Types.ObjectId,
    ref: 'question'
  },
  'avtorVprasanja' :{ type: Boolean, default: false },
  'najOdgovor' :{ type: Boolean, default: false },
  'lahkoZbriseOdgovor' :{ type: Boolean, default: false },
  'AvtorLahkoIzbere' :{ type: Boolean, default: false },
  

  'datum': { type: Date, default: Date.now }
});

module.exports = mongoose.model('odgovor', commentSchema);
