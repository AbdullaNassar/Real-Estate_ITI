import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
            email: {
            type: String,
            required: [true, "Email is required"],
            match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
        },
            subject: {
            type: String,
            required: [true, "Subject is required"],
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            minlength: 10,
        },
    },
    { timestamps: true }
);

const contactModel = mongoose.model("Contact", contactSchema);
export default contactModel;