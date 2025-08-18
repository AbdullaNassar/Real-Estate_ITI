import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category Name Required"],
      unique: [true, "{VALUE} Category Is Already Created"],
      trim: true,
    },
    arName: {
      type: String,
      required: [true, "Category Arabic Name Required"],
      unique: [true, "{VALUE} Category Is Already Created"],
      trim: true,
    },
  },
  { timestamps: true }
);

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
