
// const express = require("express");
// const router = express.Router();
// const upload = require("./upload");
// const auth = require("../../middleware/authMiddleware");
// const { uploadPolicy, getPolicies, deletePolicy } = require("./policyController");
// router.post("/upload", auth, (req, res) => {
// upload.single("file")(req, res, function (err) {
//    if (err) {
// console.log("MULTER ERROR:", err);
//  return res.status(400).json({ message: err.message });
// }
// console.log("REQ.USER:", req.user);console.log("REQ.FILE:", req.file);
//     console.log("REQ.BODY:", req.body);
// uploadPolicy(req, res);
// });
// });
// router.get("/", getPolicies);
//   router.delete("/:id", deletePolicy);
// module.exports = router;
const express = require("express");
const router = express.Router();
const upload = require("./upload");
const auth = require("../../middleware/authMiddleware");
const { uploadPolicy, getPolicies, deletePolicy } = require("./policyController");

const path = require("path");
const fs = require("fs");

// Upload
router.post("/upload", auth, (req, res) => {
  upload.single("file")(req, res, function (err) {
    if (err) {
      console.log("MULTER ERROR:", err);
      return res.status(400).json({ message: err.message });
    }

    console.log("REQ.USER:", req.user);
    console.log("REQ.FILE:", req.file);
    console.log("REQ.BODY:", req.body);

    uploadPolicy(req, res);
  });
});

// Get all policies
router.get("/", getPolicies);

// Delete
router.delete("/:id", deletePolicy);

// ✅ ADD THIS ROUTE
router.get("/view/:filename", (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../uploads/policies",
      req.params.filename
    );

    if (!fs.existsSync(filePath)) {
      return res.status(404).send("File not found");
    }

    res.sendFile(filePath);
  } catch (err) {
    console.error("VIEW FILE ERROR:", err);
    res.status(500).send("Error loading file");
  }
});

module.exports = router;