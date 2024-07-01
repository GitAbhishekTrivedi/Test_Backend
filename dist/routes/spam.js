"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.spamRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("../db"));
exports.spamRouter = express_1.default.Router();
exports.spamRouter.post("/mark_spam", async (req, res) => {
    let phone = req.body.phone_number;
    let isSpam = req.body.is_spam === "true" ? true : false;
    if (!phone) {
        return res.status(400).send("phone number");
    }
    const spam = await db_1.default.spamReport.findFirst({
        where: {
            phoneNumber: phone,
            userId: req.user.id,
        },
    });
    await db_1.default.spamReport.upsert({
        where: {
            id: spam?.id || "-1",
        },
        create: {
            phoneNumber: phone,
            userId: req.user.id,
            spam: isSpam,
        },
        update: {
            spam: isSpam,
        },
    });
    res.status(200).json({ message: "marked as spam" });
});
//# sourceMappingURL=spam.js.map