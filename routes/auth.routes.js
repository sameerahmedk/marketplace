const express = require("express");
const router = express.Router();
const createError = require("http-errors");
const User = require("../models/user");
const { authSchema, loginSchema } = require("../helpers/validationSchema");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../helpers/jwtHelper");

router.post("/register", async (req, res, next) => {
  //res.send("Register route")
  try {
    const result = await authSchema.validateAsync(req.body);
    const doesExist = await User.findOne({
      email: result.email,
    });
    if (doesExist)
      throw createError.Conflict(`${result.email} is already registered`);

    const user = new User(result);
    const savedUser = await user.save();
    const accessToken = await signAccessToken(savedUser.id);
    const refreshToken = await signRefreshToken(savedUser.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  //res.send("Login route")
  try {
    const result = await loginSchema.validateAsync(req.body);
    const user = await User.findOne({
      email: result.email,
    });
    if (!user) throw createError.NotFound("User not registered");

    const isMatchPassword = await user.isValidPassword(result.password);
    //const isMatchEmail = await user.isValidEmail(result.email)
    if (!isMatchPassword)
      throw createError.Unauthorized("Username/Password not valid.");

    const accessToken = await signAccessToken(user.id);
    const refreshToken = await signRefreshToken(user.id);

    res.send({ accessToken, refreshToken });

    res.send(result);
  } catch (error) {
    if (error.isJoi === true)
      return next(createError.BadRequest("Invalid Username/Password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createError.BadRequest();
    const userId = await verifyRefreshToken(refreshToken);

    const accessToken = await signAccessToken(userId);
    const refToken = await signRefreshToken(userId);
    res.send({
      accessToken: accessToken,
      refreshToken: refToken,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
