

const tmi = require("tmi.js");
const fortnite = require("fortnite-api");
const tmiConfig = {
    options: {
        debug: true
    },
    connection: {
        reconnect:  true
    },
    identity: {
        username: "juk_bot",
        password: "TWITCHTOKEN"
    },
    channels: [
        "JU_GURTHA"
    ]
};

let fortniteAPI = new fortnite([
    "EMAIL",
    "PASS",
    "CLITOKEN",
    "FTTOKEN"
],{
    debug : true
});



function isSubscriber(user){
    return user.subscriber;
}

function isStreamer(user){
    return user.badges.broadcaster == '1';
}

let client = new tmi.client(tmiConfig);

client.connect();

client.on("chat", (channel, user, message) => {
    if (message.includes("!fstats")){
        let args = message.split(" ");
        let pseudo = args[1];
        let plateforme = args[2];
        
        if (isSubscriber(user) || isStreamer(user)){
            fortniteAPI.login().then(() => {
                if (fortniteAPI.checkPlayer(pseudo, plateforme)){
                    fortniteAPI.getStatsBR(pseudo, plateforme, "alltime")
                    .then (stats => {
                        client.say(channel, user['display-name'] + " - Ratio: "+ stats.lifetimeStats['k/d'] + " // Wins: " + stats.lifetimeStats.wins + " // Kills: " + stats.lifetimeStats.kills);
                    })
                    .catch(err => {
                        console.log(err);
                        client.say(channel, user['display-name'] + " - Ce joueur n'existe pas");
                    })
                }
            }) 
        } else {
            client.say(channel, "Désolé, tu n'as pas accès à cette commande");
        }
    } 
});


