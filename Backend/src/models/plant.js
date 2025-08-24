const mongoose = require("mongoose");

const plantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
     createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  profile: {
    type: String,
    default:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX7HRicGdWDIgAs9L2WZqSw-rpPd7VWrD0pvS0gQmc0hzoi9zJJA0ZEXH7aExSmGP1ZCU&usqp=CAU",
  },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    categories:  {
        type: [String],
        trim: true,
        required:true
      },
    
    available: {
      type: Boolean,
      default: true,
      required:true
    },
  },
  { timestamps: true }
);
plantSchema.index({ name: "text", categories: "text" });
module.exports = mongoose.model("Plant", plantSchema);
