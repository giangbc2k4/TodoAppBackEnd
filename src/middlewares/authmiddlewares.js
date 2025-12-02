import jwt from "jsonwebtoken";

import User from "../models/User.js";
import dotenv from "dotenv";
export const protectedRoute = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "khong tim thay token" });
    }
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, decodedUser) => {
        if (err) {
          console.log("err");
          return res.status(400).json({ message: "token k dung" });
        }
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword"
        );

        if (!user) {
          return res.status(401).json({ message: "user khong ton tai" });
        }

        req.user = user;
        next();
      }
    );
  } catch (error) {
    console.log("loi");
    return res.status(500).json({ message: "loi he thong" });
  }
};
