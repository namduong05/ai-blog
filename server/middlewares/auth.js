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

const isAdmin = (req, res, next) => {
  try {
    const role = req.user.role;

    if (role === 2) {
      return res
        .status(403)
        .json({ code: 403, status: false, message: "Permission denined" });
    }
    if (role === 1) {
      next();
    }
  } catch (error) {
    next(error);
  }
};

export { isAuth, isAdmin };
