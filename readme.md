### To run locally 

``` npm install ```
``` npm run build ```
``` npx prisma migrate dev --name hello```
``` npm run seed ```
### Do not forget to create a view named all_users in pgadmin, prisma/views/public/all_users.sql file

The down side of prisma is that right now it does not support views or joins fully. I would rather use raw sql for complex queries.

Then
``` npm run start:dev ```



### Update env
DATABASE_URL=""
JWT_SECRET="secret"


## Postman 
Find this file in the root folder and use it as is , all you have to do is add token for api calls - 
Import in postman
```with_url_dev.postman_collection```

You can use 
```with_variables_spam_identifier.postman_collection.json``` if you want to switch between environments (local, dev). 

Along with that you will have to import the environment json (find in the root folder)- 
```Dev.postman_environment```

Then simply - start hitting the apis depending on the environment. 




