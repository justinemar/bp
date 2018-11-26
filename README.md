# bida-social
Gamers hub social network
* STAGING: https://justinemar-bp.glitch.me/
* MASTER: https://bida-social.herokuapp.com/#/

## Setup

You need to use at least node 6 to run this project.
This project requires secrets for the following services :
* Cloudinary
* mLab
* JWT


### Cloudinary
Head over to [Cloudinary](https://cloudinary.com) and create an account.

Go to your dashboard and get the following details
![Cloudinary dashboard showing secrets](https://res.cloudinary.com/dhwgznjct/image/upload/v1526889465/clouddetails_osjqoo.jpg)

Go to the project folder and create a `.env` file and paste your api secrets in with the following keys
```
CLOUD_NAME=dhwgznjct
CLOUD_API_KEY=614517856694992
CLOUD_API_SECRET=<Omitted/>
```

You are all set!

### mLab

Head over to [mLab](https://mlab.com/) and create an account.

Create a new deployment and select Sandbox 

Select the newly created deployment, you will be prompt to create a new database user so do that.

Copy your MongoDB URI `mongodb://<dbuser>:<dbpassword>@ds121999.mlab.com:21999/deploymentName`

Go to the project folder and inside the `.env` create new key named DB_URL and make your MongoDB URI as the value.
```
DB_URL=mongodb://fakeuser:fakepassword@ds121999.mlab.com:21999/deploymentName
CLOUD_NAME=dhwgznjct
CLOUD_API_KEY=614517856694992
CLOUD_API_SECRET=<Omitted/>
```

You are all set!


### JWT

Enter a new key inside the `.env` file with the following name and make the value anything you want.
```
KEY1=BOWCOWCARABAOWOW
```

Our value (secret) along with header and payload will be use to calculate our signature using default HMACSHA256 algorithm.
[Introduction to JWT](https://jwt.io/introduction/)

You are all set!


## Running

* Run `npm install`
* Run `npm run nodemon`
* Run `npm run dev`


## Contributing

All forms of contribution is welcome.

Always work on `bp-staging` branch.


## Notice

This project is for learning purposes only and not use for commercially.
Images uploaded to the website is not intented for copyright infringement.
