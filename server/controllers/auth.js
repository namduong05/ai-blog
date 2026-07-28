import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import generateCode from "../utils/generateCode.js";
import sendEmail from "../utils/sendEmail.js";

const signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.validated.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "User already exists" });
    }

    //Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res
      .status(201)
      .json({ code: 201, status: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.validated.body;

    // Find user by email
    const user = await User.findOne({ email }).select(
      "-verificationCode -forgotPasswordCode",
    );
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid credentials" });
    }

    // Check if password is correct
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid credentials" });
    }

    user.password = null;

    // Generate access token
    const accessToken = generateAccessToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    // Generate refresh token
    const refreshToken = generateRefreshToken({
      id: user._id,
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true, // Ngăn chặn JavaScript ở Frontend đọc cookie này (Chống XSS)
      secure: process.env.NODE_ENV === "production", // Chỉ gửi qua HTTPS khi lên production
      sameSite: "lax", // Bảo vệ chống tấn công CSRF cơ bản
      maxAge: 7 * 24 * 60 * 60 * 1000, // Thời gian sống của cookie (VD: 7 ngày)
    });

    return res.json({
      code: 200,
      status: true,
      message: "Signin successful",
      data: { accessToken, user },
    });
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  // Lấy refreshToken từ cookie ra nhờ middleware cookie-parser
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return res.status(403).json({ message: "Không tìm thấy Refresh Token" });

  // Xác thực refreshToken xem có hợp lệ/hết hạn chưa
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "User not exists" });
    }

    const newAccessToken = generateAccessToken({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.clearCookie("refreshToken");
    return res.status(403).json({ message: "Refresh Token không hợp lệ" });
  }
};

const verifyCode = async (req, res, next) => {
  try {
    const { email } = req.validated.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid email" });
    }

    // Check user as verified
    if (user.isVerified) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Email already verified" });
    }

    // Generate verification code
    const verificationCode = generateCode(6);
    user.verificationCode = verificationCode;
    await user.save();

    // Send verification code via email
    await sendEmail({
      emailTo: user.email,
      subject: "Email Verification Code",
      code: verificationCode,
      content: "verify your account",
    });

    res.json({
      code: 200,
      status: true,
      message: "Email verification code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res, next) => {
  try {
    const { email, code } = req.validated.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid email" });
    }

    // Check if verification code is correct
    if (user.verificationCode !== code) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid verification code",
      });
    }

    // Update user as verified
    user.isVerified = true;
    user.verificationCode = null;
    await user.save();

    res.json({
      code: 200,
      status: true,
      message: "User verified successfully",
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.validated.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid email" });
    }

    // Generate reset code
    const forgotPasswordCode = generateCode(6);
    user.forgotPasswordCode = forgotPasswordCode;
    await user.save();

    // Send reset code via email
    await sendEmail({
      emailTo: user.email,
      subject: "Password Reset Code",
      code: forgotPasswordCode,
      content: "reset your password",
    });

    res.json({
      code: 200,
      status: true,
      message: "Password reset code sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.validated.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid email" });
    }

    // Check if forgot password code is correct
    if (user.forgotPasswordCode !== code) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Invalid password reset code",
      });
    }

    // Update user's password
    user.password = await hashPassword(newPassword);
    user.forgotPasswordCode = null;
    await user.save();

    res.json({
      code: 200,
      status: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.validated.body;
    const id = req.user.id;

    // Find user by id
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid user" });
    }

    // Check if current password is correct
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "New password cannot be the same as the current password",
      });
    }

    // Update user's password
    user.password = await hashPassword(newPassword);
    await user.save();

    res.json({
      code: 200,
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { name: newName, email: newEmail, profilePic } = req.validated.body;
    const id = req.user.id;

    // Find user by id
    const user = await User.findById(id).select(
      "-password -verificationCode -forgotPasswordCode",
    );
    if (!user) {
      return res
        .status(400)
        .json({ code: 400, status: false, message: "Invalid user" });
    }

    // Update user's name and email
    if (
      newName === user.name &&
      newEmail === user.email &&
      profilePic === user.profilePic
    ) {
      return res.json({
        code: 204,
        status: true,
        message: "No changes made to the profile",
      });
    }

    // Check if email is being updated and if it already exists
    const isEmailExists = await User.findOne({ email: newEmail });
    if (isEmailExists && isEmailExists._id.toString() !== id) {
      return res.status(400).json({
        code: 400,
        status: false,
        message: "Email already exists",
      });
    }
    user.name = newName;
    user.profilePic = profilePic;

    if (newEmail !== user.email) {
      user.email = newEmail;
      user.isVerified = false;
    }

    await user.save();
    res.json({
      code: 200,
      status: true,
      message: "Profile updated successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export {
  signup,
  signin,
  refresh,
  verifyCode,
  verifyUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateProfile,
};
