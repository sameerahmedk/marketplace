const mongoose = require('mongoose');

const userRoleSchema = new mongoose.Schema({
	user_id: {
		type: String,
		ref: 'User.user_id',
	},
	role_name: { type: String, ref: 'Role.role_name' },
});

module.exports = mongoose.model('User_Role', userRoleSchema);
