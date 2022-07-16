const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  createUser,
  login,
  loginRequest,
  logoutRequest,
  updateCurrentUserNotes,
  deleteUserById,
} = require("../controllers/UsersControllers");

router.get("/", getAllUsers);
router.get("/home", loginRequest);
router.get("/logout", logoutRequest);

router.post("/", createUser);
router.post("/login", login);

router.post("/home/notes", updateCurrentUserNotes);

router.post("/delete", deleteUserById);

// router.delete("/:id", deleteUserById);

// router.patch("/:id", updateUserById);

// router.get("/:id", GetUserById);

// router.post("/email/", GetUserByEmail);

module.exports = router;
