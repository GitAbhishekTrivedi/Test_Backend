import express from "express";
import prisma from "../db";

export const spamRouter = express.Router();

spamRouter.post("/mark_spam", async (req, res) => {
  try {
  let phone = req.body.phone_number;
  let isSpam = req.body.is_spam === "true" ? true : false

  if (!phone) {
    return res.status(400).send("phone number");
  }

  const spam = await prisma.spamReport.findFirst({
    where: {
      phoneNumber: phone,
      userId: req.user.id,
    },
  });


    await prisma.spamReport.upsert({
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
  }
  catch (err) {
    console.error(err);
    res.status(500).send("internal server error");
  }
});
