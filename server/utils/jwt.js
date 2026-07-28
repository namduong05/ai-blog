import jwt from "jsonwebtoken";
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: "7d" });
};

export { generateAccessToken, generateRefreshToken };
