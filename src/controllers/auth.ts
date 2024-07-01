import { jwt } from "jsonwebtoken";
import prisma from "../db";
import bcrypt from "bcrypt";

export const signin = async (req, res) => {
  try {
    let phone = req.body.phone_number;
    let password = req.body.password;

    if (!phone || !password) {
      return res.status(400).send("phone number and password required");
    }

    const user = await prisma.user.findUnique({
      where: {
        phone_number: phone,
      },
    });

    if (!user) {
      return res.status(404).send("user not found");
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.send("invalid password");
    }

    const token = jwt.sign(
      {
        exp: Math.floor(Date.now() / 1000) + 60 * 60,
        data: user,
      },
      process.env.JWT_SECRET
    );

    res.status(200).json({ token: token });
  } catch (err) {
    console.error(err);
    res.status(500).send("internal server error");
  }
};

export const register = async (req, res) => {

  try{  
  let name = req.body.name;
  let phone_number = req.body.phone_number;
  let password = req.body.password;
  let email = req.body.email;

  //hash password
  // use bcrypt to hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  if (!name || !phone_number || !password) {
    return;
  }

  await prisma.user.create({
    data: {
      name: name,
      phone_number: phone_number,
      password: hashedPassword,
      email: email || "",
    },
  });

  res.status(200).send("registration successful");
}catch(err){
    console.error(err);
    res.status(500).send("internal server error");
}
};
