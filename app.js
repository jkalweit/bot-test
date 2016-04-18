var restify = require('restify');
var builder = require('botbuilder');

var fs = require('fs');

var config = JSON.parse(fs.readFileSync('../config.json'));



// Create bot and add dialogs
var bot = new builder.BotConnectorBot({ 
	appId: config.bot.appId, 
    	appSecret: config.bot.primaryAppSecret });

bot.add('/', function (session) {
	if (!session.userData.name) {
		session.beginDialog('/profile');
	} else {
		session.send('Hello %s!', session.userData.name);
	}
});
bot.add('/profile', [
		function (session) {
			builder.Prompts.text(session, 'Hi! What is your name?');
		},
		function (session, results) {
			session.userData.name = results.response;
			session.endDialog();
		}
		]);




// Setup Restify Server
var server = restify.createServer();
server.post('/bot/api/messages', bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3978, '0.0.0.0', function () {
	console.log('%s listening to %s', server.name, server.url); 
});
