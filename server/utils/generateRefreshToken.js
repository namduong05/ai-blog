import jwt from "jsonwebtoken";
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: "7d" });
};

export default generateRefreshToken;
