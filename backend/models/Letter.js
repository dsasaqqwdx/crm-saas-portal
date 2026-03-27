const mongoose = require("mongoose");

const LetterSchema = new mongoose.Schema(
  {
employeeId: {
type: String,
required: true,
    },
employeeName: {
type:     String,
    required: true,
    },
employeeEmail: {
type:     String,
required: true,
    },
letterType: {
type:     String,
      enum:     ["offer", "experience", "salary", "relieving"],
required: true,
    },
htmlContent: {
    type:     String,
required: true,
    },
notes: {
type:    String,
      default: "",
    },
status: {
type:    String,
enum:    ["draft", "sent"],
      default: "draft",
    },
sentAt: {
type:    Date,
default: null,
    },
createdBy: {
type: mongoose.Schema.Types.ObjectId,
ref:  "Admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Letter", LetterSchema);