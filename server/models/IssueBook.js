const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment-timezone');

const options = { timeZone: 'Asia/Kolkata', hour12: true };

const IssueSchema = new Schema({
  book: {
    type: Schema.Types.ObjectId,
    ref: 'Book',
    required: true,
  },
  student: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    classRollNo: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    session: {
      type: String,
      required: true,
    },
  },
  issuedDate: {
    type: String,
    default: function() {
      return moment().tz('Asia/Kolkata').format('YYYY-MM-DD hh:mm:ss A');
    }
  },
  returnDate: {
    type: String,
    required: true,
    default: function() {
      return moment().tz('Asia/Kolkata').add(25, 'days').format('YYYY-MM-DD hh:mm:ss A');
    }
  },
});

module.exports = mongoose.model('Issue', IssueSchema);
