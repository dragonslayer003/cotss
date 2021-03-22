import { Client } from "discord.js";
import { byClanTag } from "./clashAPI.js";
import config from "./config.js";
import messageDecorder from "./messageDecoder.js";
import Player from "./mongoose.js";
import strikeCalc from "./strikeCalc.js";

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  message.content = message.content.toUpperCase();
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  if (!message.member.roles.cache.some((role) => role.name === "⚡️Leadership⚡️")) {
    message.channel.send("You do not have the permission to use this command!");
    return;
  }

  var leftOverMessage = message.content.substr(8);

  if (leftOverMessage.startsWith("HELP")) {
    message.channel.send("**/strike CLAN_NAME** to show clan strike information.");
    message.channel.send("**/strike ALL** to show all clan strike information.");
    message.channel.send("**/strike show @USER** to show strike information for a user.");
    message.channel.send("**/strike add @USER {strike Number}** to add strikes for a user.");
    message.channel.send("**/strike link @USER #Player_TAG** to link a new user with their clan ID.");
    message.channel.send(
      "``` 1 -> Left the clan (0.5 strike)\n 2 -> Failed to respond (0.5 strike)\n 3 -> Wrong attack (0.5 strike)\n 4 -> Missed war attack (1 strike)\n 5 -> Missed CWL Attack (1 strike)\n 6 -> Failed CG points(1 strike)\n 7 -> Heros down in war (1 strike)\n 8 -> Failed war plan (1 strike)\n 9 -> War no show (2 strikes)\n10 -> Changed war plan (3 strikes)\n11 -> Toxic (4 strikes)\n12 -> Camping (4 strikes)\n```"
    );
  } else if (leftOverMessage.startsWith("LINK")) {
    var playerTAG = leftOverMessage.split(" ").filter((arg) => arg.startsWith("#"));
    var users = message.mentions.users;
    if (users.size != 1) {
      return message.channel.send("Please enter only one user.");
    }
    if (playerTAG.length != 1) {
      return message.channel.send("Please enter correct Player TAG.");
    }
    users.forEach((user) => {
      Player.create({ playerID: user.id, playerTAG: playerTAG[0] }, (err) => {
        if (err) {
          return message.channel.send("Error creating link: ", err);
        }
        return message.channel.send("Link created!");
      });
    });
  } else if (leftOverMessage.startsWith("ADD")) {
    var strike = leftOverMessage.split(" ").filter((arg) => parseFloat(arg))[0];
    if (!strike || strike < 1 || strike > 12) {
      return message.channel.send("Invalid strike information! Refer strike help for more information.");
    }

    var { strikes, strikeCount } = strikeCalc(strike);
    var users = message.mentions.users;
    if (users.size < 1) {
      return message.channel.send("Please enter atleaset one user.");
    }
    users.map((user) => {
      Player.findOne({ playerID: user.id }, (err, player) => {
        if (err) {
          message.channel.send("Error: ", err);
        }
        if (!player) {
          message.channel.send("Error: Player not found!");
        } else {
          player.strikeCount = player.strikeCount + parseFloat(strikeCount);
          player.strikes = player.strikes + strikes;
          player.save();

          message.channel.send(
            "<@" +
              user +
              ">" +
              " has been issued a new strike. If you wish to appeal, create a War Conflict or Appeals Ticket in <#780881554238865538>."
          );
          var msg = `${user.username} has ${player.strikeCount} strikes.`;
          message.channel.send("```" + msg + "\nReasons for strikes:\n" + player.strikes + "```");
          message.channel.send();
          if (player.strikeCount >= 4) {
            message.channel.send(`${user} has more than 4 strikes.`);
          }
        }
      });
    });
  } else if (leftOverMessage.startsWith("SHOW")) {
    var users = message.mentions.users;
    if (users.size < 1) {
      return message.channel.send("Please enter atleaset one user.");
    }

    users.map((user) => {
      Player.findOne({ playerID: user.id }, (err, player) => {
        if (err) {
          message.channel.send("Error: ", err);
        }
        if (!player) {
          message.channel.send("Error: Player not found!");
        } else {
          if (player.strikeCount === 0) {
            message.channel.send("Player has no strike");
          } else {
            var msg = `${user.username} has ${player.strikeCount} strikes.`;
            message.channel.send("```" + msg + "\nReasons for strikes:\n" + player.strikes + "```");
          }
        }
      });
    });
  } else if (leftOverMessage.startsWith("RESET")) {
    if (message.author.id !== "644005027052126208") {
      return message.channel.send("Only family leader has the permission to use this command!");
    }

    const filter = (m) => m.content.includes("CONFIRM RESET") && m.author.id === "644005027052126208";
    const collector = message.channel.createMessageCollector(filter, { time: 15000 });
    message.channel.send("Are you sure? Reply with **CONFIRM RESET**");
    var result = false;
    collector.on("collect", () => {
      Player.updateMany({}, { strikes: "", strikeCount: 0 }, (err) => {
        if (err) {
          return message.channel.send("Error: ", err);
        }
        result = true;
        collector.stop();
      });
    });

    collector.on("end", () => {
      if (result == true) {
        message.channel.send("All player strikes reset for new season!");
      } else message.channel.send("Reset Timeout! Try again!");
    });
  } else {
    var { tag, whichFunction } = messageDecorder(leftOverMessage);
    if (whichFunction === 0) {
      return message.channel.send(tag);
    } else if (whichFunction === 1) {
      byClanTag(tag, (text) => {
        return message.channel.send(text);
      });
    } else if (whichFunction === 2) {
      Object.values(tag).forEach((clan) => {
        byClanTag(clan, (text) => {
          return message.channel.send(text);
        });
      });
    }
  }
});

client.login(config.clientKey);
