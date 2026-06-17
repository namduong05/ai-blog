import jwt from "jsonwebtoken";
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, {
    expiresIn: "15m",
  });
};

export default generateAccessToken;
