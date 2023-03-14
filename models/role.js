const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
	role_name: { type: String, required: true, unique: true },
	role_description: { type: String },
});

module.exports = mongoose.model('Role', roleSchema);
