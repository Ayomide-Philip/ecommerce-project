import { model, models, Schema } from "mongoose";

const userSchema = new Schema({
    name:{
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }
});

const User = models.User || model("User", userSchema);
export default User;
