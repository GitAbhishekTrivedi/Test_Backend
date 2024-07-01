"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const auth_1 = require("./routes/auth");
const protected_1 = require("./middlewares/protected");
const search_1 = require("./routes/search");
const spam_1 = require("./routes/spam");
const app = (0, express_1.default)();
const PORT = 8080;
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use("/auth", auth_1.authRouter);
app.use("/spam", protected_1.protect, spam_1.spamRouter);
app.use("/search", protected_1.protect, search_1.searchRouter);
app.use((err, req, res, next) => {
    console.error(err.stack); // Log error stack for debugging
    res.status(500).send('Something broke!'); // Send generic error message to client
});
app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
//# sourceMappingURL=app.js.map