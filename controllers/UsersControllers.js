const UserModel = require("../models/UserMode");
const SessionModel = require("../models/SessionModel");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    // sort by created at with decending order meaning newest one at the top
    const users = await UserModel.find({}).sort({ createdAt: -1 });
    res.json({ request: "getAllUsers", results: users });
  } catch (error) {
    res.json({ request: "getAllUsers", error: error.message });
  }
};

const createUser = async (req, res) => {
  const { username, email, password, test } = req.body;

  let emptyFields = [];
  !username && emptyFields.push("username");
  !email && emptyFields.push("email");
  !password && emptyFields.push("password");
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: " Please, Fill in all the forms ", emptyFields });
  }

  try {
    const checkUser = await UserModel.findOne({ email });
    if (checkUser) {
      return res.status(400).json({
        request: "Create User",
        results: "Email Address Already Used",
        email,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });
    return res.status(200).json({ request: "Create User", results: newUser });
  } catch (error) {
    return res
      .status(400)
      .json({ request: "Create User", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ request: "login request", result: "No User found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        request: "login request",
        result: "Invalid email or password",
      });
    }

    var clientVersionUser = Object.assign({}, user._doc);
    delete clientVersionUser.password;
    req.session.isAuth = true;
    req.session.user = clientVersionUser;
    return res.status(200).json({
      request: "login request",
      results: "LOGGED IN",
      user: clientVersionUser,
      //  session: req.session,
    });
    // res.redirect("/dashboard");
  } catch (error) {
    return res
      .status(400)
      .json({ request: "login request", error: error.message });
  }
};

const loginRequest = async (req, res) => {
  const session = await SessionModel.findById({ _id: req.sessionID });

  if (session) {
    return res.send(session);
  } else {
    return res.send({ error: "error fetching session from db" });
  }
};

const logoutRequest = (req, res) => {
  req.session.isAuth = false;
  req.session.user = null;
  res.session = null;
  req.session.destroy();
  res.status(200).json({ status: "ok" });
};

const updateCurrentUserNotes = async (req, res) => {
  try {
    //get current User somehow prob with id
    const { id, notes } = req.body;
    const results = await UserModel.findOneAndUpdate({ _id: id }, { notes });

    var clientVersionUser = Object.assign(
      {},
      { ...results._doc, password: "" }
    );
    delete clientVersionUser.password;

    req.session.user.notes = notes;
    return res.status(200).json({
      request: "Update Current User Notes",
      results: clientVersionUser,
    });
  } catch (error) {
    return res
      .status(400)
      .json({ request: "Update Current User Notes", results: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.body;

    const results = await UserModel.findByIdAndDelete({ _id: id });

    return res.status(200).json({ request: "delete user by id", results });
  } catch (error) {
    return res
      .status(400)
      .json({ request: "delete user by id", error: error.message });
  }
};

// const getCurrentUserNotes = async (req, res) => {
//   try {
//     const { email } = req.body;
//     const results = await UserModel.findOne({ email });
//     const notes = results.notes;
//     return res
//       .status(200)
//       .json({ request: "Get Current User Notes", results: notes });
//   } catch (error) {
//     return res
//       .status(400)
//       .json({ request: "Get Current User Notes", results: error.message });
//   }
// };

module.exports = {
  getAllUsers,
  createUser,
  login,
  loginRequest,
  logoutRequest,
  updateCurrentUserNotes,
  deleteUserById,
};
