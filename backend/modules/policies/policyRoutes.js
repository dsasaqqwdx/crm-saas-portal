
const express = require("express");
const router = express.Router();
const upload = require("./upload");
const auth = require("../../middleware/authMiddleware");
const { uploadPolicy, getPolicies, deletePolicy } = require("./policyController");
router.post("/upload", auth, (req, res) => {
upload.single("file")(req, res, function (err) {
   if (err) {
console.log("MULTER ERROR:", err);
 return res.status(400).json({ message: err.message });
}
console.log("REQ.USER:", req.user);console.log("REQ.FILE:", req.file);
    console.log("REQ.BODY:", req.body);
uploadPolicy(req, res);
});
});
router.get("/", getPolicies);
  router.delete("/:id", deletePolicy);
module.exports = router;