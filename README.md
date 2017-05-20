# messenger-bot-sails

boilerplate for facebook messenger bots on [sails js](http://sailsjs.com/)

# What it offer

Upon deploying you will have an empty website with a deactivated API and a ready to implement Messenger chat bot :rocket:

The app is configured to be ready to deployed on [RedHat openShift](https://openshift.redhat.com/), but you can tweak it and deployed on the [hosting provider of your choice](http://sailsjs.com/documentation/concepts/deployment)

# How to :

Fork & Clone this repository  and run npm install

```sh
git clone https://github.com/Freeways/messenger-bot-sails
cd messenger-bot-sails
npm install
```

Create your page and bot on [developers.facebook.com](https://developers.facebook.com/docs/messenger-platform/guides/quick-start)

Edit your [config/parameters.js](config/parameters.js) with the values you've generated from facebook

Start implementing your bot logic at [api/controllers/BotController.js](api/controllers/BotController.js)

# Sending messages

First you would like to take a look at [Facebook Send API](https://developers.facebook.com/docs/messenger-platform/send-api-reference).

To respond within the [api/controllers/BotController.js](api/controllers/BotController.js) you can use function sendAPI.send(yourResponse, aCallback) where your response is a valid message (see the link above) and aCallback is function to be executed after sending.

Alternatively, a better practice would be to add methods to the [api/utils/sendAPI.js](api/utils/sendAPI.js)

# Activating the API

First keep on mind that the API does not come with an authentication system so it is open to public (unsecure).

To activate the API on the file [config/blueprints.js](config/blueprints.js) please change the values of actions, rest and shortcuts to true.