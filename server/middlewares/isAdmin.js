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

export default isAdmin;
