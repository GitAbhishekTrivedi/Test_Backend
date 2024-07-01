import express from "express";
import prisma from "../db";

export const searchRouter = express.Router();

searchRouter.get("/", async (req, res, next) => {
  try {
    let search_term = req.query.search_term;
    let start = +req.query.start || 0;
    let limit = +req.query.limit || 10;
    
    if (!search_term) {
        return res.status(400).send("search term required");
    }

    // We have to use joins here as raw SQL as there is not direct way in Prisma to make that work
    const result = await prisma.all_users.findMany({
        where: {
            OR: [
                {
                    name: {
                        contains: search_term,
                        mode: 'insensitive',
                    },
                },
                {
                    phone_number: {
                        contains: search_term,
                        mode: 'insensitive',
                    },
                },
            ],
            
        },
        orderBy: [
          {
            name: 'asc',
          },
          {
            phone_number: 'asc',
          },
        ],
        skip: start,
        take: limit,
    });

   let filteredUser =  result.filter(user => user.phone_number == req.query.search_term && user.type == 'user' && user.email)

   if(filteredUser.length > 0){
    const user = filteredUser[0];
    return res.status(200).json({ ...user, spamLikelihood: calculateSpamLikelihood(user.spam_count, user.non_spam_count)});
   }

    const resultsWithSpamLikelihood = result.map(user => ({
      ...user,
      spamLikelihood: calculateSpamLikelihood(user.spam_count, user.non_spam_count),
  }));
    
    res.status(200).json({ resultsWithSpamLikelihood });
}catch(err){
  next(err);
}
});


const calculateSpamLikelihood = (spamCount: number, nonSpamCount: number) => {

  let reportedSpamCount = spamCount || 0;
  let reportedNonSpamCount = nonSpamCount || 0;

  let totalReports = reportedSpamCount + reportedNonSpamCount;


  if(totalReports > 5){
    let spamPercentage = (reportedSpamCount / totalReports) * 100;
    return spamPercentage;  
  }

  return 0;



}

const isAContact = async (userA, userB) => {

  // find userA is a contact of userB
  const data =  await prisma.contact.findFirst({
    where: {
      phone_number: userA.phone_number,
      userId: userB.original_id
    },
  });

  if(data){
    return true;
  }
  else{
    return false;
  }

}


searchRouter.get("/:id", async (req, res, next) => {
    let id = req.params.id;
    let type = req.query.type;
    let currentUser = req.user;
    
    if (!id) {
        return res.status(400).send("id required");
    }

    const user = await prisma.all_users.findFirst({
        where: {
            original_id: id,
            type: type,
        },
    });

    if(!user){
      return res.status(404).send('user not found');
    }


    const is_contact = await isAContact(currentUser, user)
    let spamLikelihood = calculateSpamLikelihood(user.spam_count, user.non_spam_count);

    let user_email = user?.email ? user.email : null;

    const userWithSpamLikelihood = {
      email: is_contact ? user_email : null,
      name: user.name,
      phone_number: user.phone_number,
      spamLikelihood,
    }


    // if(type == 'contact'){
    //     let spamLikelihood = calculateSpamLikelihood(user.spam_count, user.non_spam_count);
    //     return res.status(200).json({ ...user, spamLikelihood });
    // }

    res.status(200).json(userWithSpamLikelihood);


})