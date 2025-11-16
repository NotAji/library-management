import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id).select("-password");
            if (!user) {
                return res.status(401).json({ message: "User no longer exists" });
            }

            req.user = user;

            return next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }
    }

    return res.status(401).json({ message: "No token provided" });
};

export const adminOnly = async (req, res) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
}