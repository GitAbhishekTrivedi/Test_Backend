import prisma from "../db";


export const calculateSpamLikelihood = (spamCount: number, nonSpamCount: number) => {

    let reportedSpamCount = spamCount || 0;
    let reportedNonSpamCount = nonSpamCount || 0;
  
    let totalReports = reportedSpamCount + reportedNonSpamCount;
  
  
    if(totalReports > 5){
      let spamPercentage = (reportedSpamCount / totalReports) * 100;
      return spamPercentage;  
    }
  
    return 0;
  
  }

export const isAContact = async (userA, userB) => {
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
