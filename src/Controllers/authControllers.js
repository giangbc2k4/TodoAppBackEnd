import bcrypt from "bcrypt";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
export const signUp = async (req, res) => {
  try {
    const { displayName, email, password } = req.body;

    if (!displayName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Thiếu displayName, email hoặc password" });
    }

    const duplicate = await User.findOne({ email });
    if (duplicate) {
      return res.status(400).json({ message: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      displayName,
      email,
      hashedPassword,
    });

    return res.status(201).json({ message: "Tạo user thành công" });
  } catch (error) {
    console.log("Lỗi signup");
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

export const logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Thiếu email hoặc password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email hoặc mật khẩu sai" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordCorrect) {
      return res.status(400).json({ message: "Email hoặc mật khẩu sai" });
    }

    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      message: "Đăng nhập thành công",
      token: accessToken,
      displayName: user.displayName,
      email: user.email,
    });
} catch (error) {
  console.log("Lỗi login:", error);
  return res.status(500).json({
    message: "Lỗi server",
    error: error.message
  });
}

export const logOut = async (req, res) => {
  try {
  } catch (error) {}
};
