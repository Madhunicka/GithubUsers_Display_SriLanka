
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    avatar_url: String,
    html_url: String,
    repoCount: Number,
   
});

module.exports = mongoose.model('User', userSchema);
// export default User;