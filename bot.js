// @Author @DanBullockCS

var Discord = require('discord.io');
var logger = require('winston');
var auth = require('./auth.json');
var fs = require('fs');

// Configure logger settings
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
var bot = new Discord.Client({
    token: auth.token,
    autorun: true
});

// Prints information in the console.
bot.on('ready', function (evt) {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', function (user, userID, channelID, message, evt) {
    // Bot command substring
    if (message.substring(0, 1) == '*') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // *ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'nice job'
                });
                break;
            // *help
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: `<@!${userID}> Hey man, if there's a problem or you just wanna yell at me about it just msg: !Dan#2141`
                });
                break;
        }
    }

    // Check if the user posted a BAD word against our cool bad words list
    // badwords.txt sourced from: https://github.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/blob/master/en
    try {
        var data = fs.readFileSync('badwords.txt', 'utf8');
        var text = data.split("\n");
        var check = false;

        // Ignore words 3 letters and less.
        if (message.length >= 3) {
            // Check if msg contains bad word
            for (let i = 0; i < text.length; i++) {
                check = text[i].indexOf(message) !== -1;
                if (check == true)
                    break;
            }
        }

        // Send a random Christian Me Me
        if (check) {
            let rando = Math.floor(Math.random() * 4);
            let imglink;
            switch (rando) {
                case 0:
                    imglink = 'https://cdn.discordapp.com/attachments/495980842087219210/503691102449172490/44330693_1478066859003874_3505010720209108992_n.png'
                    break;
                case 1:
                    imglink = 'https://cdn.discordapp.com/attachments/495980842087219210/503691174876413953/FB_IMG_1538262509263.png'
                    break;
                case 2:
                    imglink = 'https://cdn.discordapp.com/attachments/495980842087219210/717101699172401193/unknown.png'
                    break;
                case 3:
                    imglink = 'https://cdn.discordapp.com/attachments/228936388068900874/513039855383609364/1Nb5XLpLh3-2.png'
                    break;
            }

            bot.sendMessage({
                to: channelID,
                message: `Yo <@!${userID}>, did you just say '${message}' in this perfect Christian server? ${imglink}`
            });
        }
    } catch (e) {
        console.log('Error, could not read badwords.txt:', e.stack);
    }

});