import { User } from "../models/User.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
     return res.status(401).json({
        message: "Authentication missing or invalid.",
        loggedOut: true,
      });
    }

    const token = authHeader.replace("Bearer ", "").trim();
    const user = await User.findOne({ accessToken: token });

    if (!user) {
      return res.status(401).json({
        message: "Authentication missing or invalid.",
        loggedOut: true,
      });
    }
    req.user = user;
    return next();
  } catch (err) {
    return res.status(500).json({ 
        message: "Internal server error", 
        error: err.message });
  }
};