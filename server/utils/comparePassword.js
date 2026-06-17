import bcrypt from "bcryptjs";
const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export default comparePassword;
