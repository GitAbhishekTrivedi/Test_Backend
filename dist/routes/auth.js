"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/signin', async (req, res) => {
    let phone = req.body.phone_number;
    let password = req.body.password;
    if (!phone || !password) {
        return res.status(400).send('phone number and password required');
    }
    const user = await db_1.default.user.findUnique({
        where: {
            phone_number: phone
        }
    });
    if (!user) {
        return res.status(404).send('user not found');
    }
    const validPassword = await bcrypt_1.default.compare(password, user.password);
    if (!validPassword) {
        return res.send('invalid password');
    }
    const token = jsonwebtoken_1.default.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 60),
        data: user
    }, process.env.JWT_SECRET);
    res.status(200).json({ token: token });
});
exports.authRouter.post('/register', async (req, res) => {
    let name = req.body.name;
    let phone_number = req.body.phone_number;
    let password = req.body.password;
    let email = req.body.email;
    //hash password
    // use bcrypt to hash password
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    if (!name || !phone_number || !password) {
        return;
    }
    await db_1.default.user.create({
        data: {
            name: name,
            phone_number: phone_number,
            password: hashedPassword,
            email: email || ''
        }
    });
    res.status(200).send('registration successful');
});
//# sourceMappingURL=auth.js.map