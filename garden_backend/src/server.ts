import express, { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import connectDB from "./config/db";

dotenv.config();
const app = express();
app.use(express.json());

connectDB(); // Connect to MongoDB

// In-memory storage for demo (replace with a database in production)
const users: { email: string; password: string }[] = [];

// Middleware for JWT Authentication
const authenticateJWT = (req: Request, res: Response, next: NextFunction): void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, user) => {
        if (err) {
            res.status(403).json({ message: "Forbidden" });
            return;
        }
        (req as any).user = user;
        next();
    });
};

// Registration Endpoint
app.post("/register", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (users.find((user) => user.email === email)) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    res.status(201).json({ message: "User registered successfully" });
});

// Login Endpoint
app.post("/login", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
    const user = users.find((user) => user.email === email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ message: "Invalid credentials" });
        return;
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    res.json({ token });
});

// Public Endpoint
app.get("/", (req: Request, res: Response): void => {
    res.send("Welcome to the public API!");
});

// Protected Endpoint
app.get("/protected", authenticateJWT, (req: Request, res: Response): void => {
    res.json({ message: `Hello, ${(req as any).user.email}` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
