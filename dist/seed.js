"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./db"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
dotenv_1.default.config();
const generateRandomPhoneNumber = () => {
    let number = Math.floor(Math.random() * 10000000000);
    return number.toString();
};
const generateRandomName = () => {
    let name = Math.random().toString(36).substring(7);
    return name;
};
const generateRandomEmail = () => {
    let email = Math.random().toString(36).substring(7) + "@gmail.com";
    return email;
};
const seed = async () => {
    // create 100 registered users
    for (let i = 0; i < 100; i++) {
        let phone_number = generateRandomPhoneNumber();
        let name = generateRandomName();
        let email = generateRandomEmail();
        let password = "password";
        let hashedPassword = await bcrypt_1.default.hash(password, 10);
        await db_1.default.user.create({
            data: {
                name: name,
                phone_number: phone_number,
                email: email,
                password: hashedPassword,
            },
        });
    }
    console.log("seeded 100 users");
    const registered_users = await db_1.default.user.findMany();
    // create 200 random contacts
    for (let i = 0; i < 100; i++) {
        let userA = registered_users[Math.floor(Math.random() * 100)];
        let userB = registered_users[Math.floor(Math.random() * 100)];
        await db_1.default.contact.create({
            data: {
                phone_number: userA.phone_number,
                userId: userB.id,
                name: generateRandomName(),
            },
        });
    }
    const contacts = registered_users.flatMap((user, index) => {
        const users = Array.from({ length: 5 }, (_, index) => ({
            name: `User${index + 1}`,
            phone_number: generateRandomPhoneNumber(),
            userId: user.id,
        }));
        return users;
    });
    await db_1.default.contact.createMany({
        data: contacts,
    });
    console.log("seeded 200 contacts");
    // create 100 spam reports
    let spam_reports = [];
    for (let i = 0; i < 10; i++) {
        let user = registered_users[Math.floor(Math.random() * 100)];
        for (let j = 0; j < 20; j++) {
            let userB = registered_users[Math.floor(Math.random() * 100)];
            spam_reports.push({
                phoneNumber: userB.phone_number,
                userId: user.id,
                spam: Math.random() > 0.5 ? true : false,
            });
        }
        await db_1.default.spamReport.createMany({
            data: spam_reports,
        });
    }
    console.log("Done..");
};
seed();
//# sourceMappingURL=seed.js.map