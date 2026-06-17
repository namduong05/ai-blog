import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: 401,
      status: false,
      message: "Unauthorized",
    });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    return res.status(401).json({
      code: 401,
      status: false,
      message: "Invalid token",
    });
  }
};

export default isAuth;
