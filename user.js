const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        username: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        email: {type: String, required: true},
        experiencelvl: {type: String, required: false}
    },
    {collection: 'UserInfo'}
)

mongoose.model("UserInfo", UserSchema)