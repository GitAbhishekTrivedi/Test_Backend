"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const protect = (req, res, next) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        res.status(401);
        res.json({ message: 'not authorized' });
        return;
    }
    const [, token] = bearer.split(' ');
    if (!token) {
        res.status(401);
        res.json({ message: 'not valid token' });
        return;
    }
    try {
        const user = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        let { data } = user;
        req.user = data;
        next();
    }
    catch (e) {
        console.error(e);
        res.status(401);
        res.json({ message: 'not valid token' });
        return;
    }
};
exports.protect = protect;
//# sourceMappingURL=protected.js.map