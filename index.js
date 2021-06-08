import { Client } from "discord.js";
import { byClanTag } from "./clashAPI.js";
import messageDecorder from "./messageDecoder.js";
import Player from "./mongoose.js";
import strikeCalc from "./strikeCalc.js";

const client = new Client();

client.once("ready", () => {
  console.log("Ready!");
});

client.on("message", (message) => {
  message.content = message.content.toUpperCase();
  if (!message.content.startsWith(process.env.prefix) || message.author.bot) return;

  if (
    !message.member.roles.cache.some(
      (role) =>
        role.name === "⚡️Leadership⚡️" ||
        role.name === "🐺CoT Wildling War General🐺" ||
        role.name === "⚔️CoT War General⚔️" ||
        role.name === "😎SC War General😎" ||
        role.name === "🌼Dandelion War General🌼" ||
        role.name === "🛠Black id War General🛠" ||
        role.name === "🌊 Noah's Ark War General🌊" ||
        role.name === "💥AlphaMax War General💥"
    )
  ) {
    message.channel.send("You do not have the permission to use this command!");
    return;
  }

  var leftOverMessage = message.content.substr(1);

  if (leftOverMessage.startsWith("HELP")) {
    message.channel.send(
      "```:{CLAN_NAME} -> show clan strike information.\n:all -> show all clan strike information.\n:show {@USERs} -> show strike information for a user.\n:add {#PLAYER_TAGS} {strike Number} -> add strikes for a Player.\n:link {@USER} {#PLAYER_TAG} -> link a new user with their clan ID.\n:delete {@USER} -> delete all links of a player.\n:delete {#PLAYER_TAGS} -> delete provided player TAGs.\n```"
    );
    message.channel.send(
      "```Strike Number: \n\n 1 -> Left the clan (0.5 strike)\n 2 -> Failed to respond (0.5 strike)\n 3 -> Wrong attack (0.5 strike)\n 4 -> Missed war attack (1 strike)\n 5 -> Missed CWL Attack (1 strike)\n 6 -> Failed CG points(1 strike)\n 7 -> Heros down in war (1 strike)\n 8 -> Failed war plan (1 strike)\n 9 -> War no show (2 strikes)\n10 -> Changed war plan (3 strikes)\n11 -> Toxic (4 strikes)\n12 -> Camping (4 strikes)\n```"
    );
  } else if (leftOverMessage.startsWith("LINK")) {
    var playerTAGs = leftOverMessage.split(" ").filter((arg) => arg.startsWith("#"));
    var users = message.mentions.users;
    if (users.size != 1) {
      return message.channel.send("Please enter only one user.");
    }
    if (playerTAGs.length < 1) {
      return message.channel.send("Please enter correct Player TAG.");
    }

    var userID = users.toJSON()[0].id;
    for (var TAG of playerTAGs) {
      Player.create({ playerID: userID, playerTAG: TAG }, (err, player) => {
        if (err) {
          return message.channel.send("Error creating link for " + TAG);
        }
        return message.channel.send("Link created for " + player.playerTAG);
      });
    }
  } else if (leftOverMessage.startsWith("DELETE")) {
    var playerTAGs = leftOverMessage.split(" ").filter((arg) => arg.startsWith("#"));
    var users = message.mentions.users;

    if (users.size != 1 && playerTAGs.length < 1) {
      return message.channel.send("Please enter either an user or player TAGs");
    }

    if (users.size == 1) {
      var userID = users.toJSON()[0].id;
      Player.deleteMany({ playerID: userID }, (err) => {
        if (err) {
          return message.channel.send("Error deleting the player Tags");
        }
        return message.channel.send("Player deleted!");
      });
    } else {
      Player.deleteMany({ playerTAG: playerTAGs }, (err) => {
        if (err) {
          return message.channel.send("Error deleting the player Tags");
        }
        return message.channel.send("Player deleted!");
      });
    }
  } else if (leftOverMessage.startsWith("ADD")) {
    var strike = leftOverMessage.split(" ").filter((arg) => parseFloat(arg))[0];
    if (!strike || strike < 1 || strike > 12) {
      return message.channel.send("Invalid strike information! Refer strike help for more information.");
    }

    var { strikes, strikeCount } = strikeCalc(strike);
    var usersTAG = leftOverMessage.split(" ").filter((arg) => arg.startsWith("#"));
    if (usersTAG.size < 1) {
      return message.channel.send("Please enter atleaset one user with player TAG.");
    }
    usersTAG.map((userTAG) => {
      Player.findOne({ playerTAG: userTAG }, (err, player) => {
        if (err) {
          message.channel.send("Error: ", err);
        }
        if (!player) {
          message.channel.send("Error: Player not found!");
        } else {
          player.strikeCount = player.strikeCount + parseFloat(strikeCount);
          player.strikes = player.strikes + strikes;
          player.save();
          if (player.strikeCount >= 4) {
            message.channel.send(
              `<@${player.playerID}> You've accumulated 4 Strikes in the CoTSS. Go to <#780881554238865538>, open up a ticket and we will discuss you situation. You have 12hrs to open up a ticket for discussion. Failure to comply will result in a kick from Clan and ban from any other Clan in the Family for a week or until you come to discuss the scenario. After one week with no reply, kick from the Server. <@&671577259962007573>`
            );
          } else {
            message.channel.send(
              "<@" +
                player.playerID +
                ">" +
                " has been issued a new strike. If you wish to appeal, create a War Conflict or Appeals Ticket in <#780881554238865538>."
            );
            var msg = `${player.playerTAG} has ${player.strikeCount} strikes.`;
          }
          message.channel.send("```" + msg + "\n\nReasons for strikes:\n" + player.strikes + "```");
        }
      });
    });
  } else if (leftOverMessage.startsWith("SHOW")) {
    var users = message.mentions.users;
    if (users.size < 1) {
      return message.channel.send("Please enter atleaset one user.");
    }

    users.map((user) => {
      Player.find({ playerID: user.id }, (err, players) => {
        if (err) {
          message.channel.send("Error: ", err);
        }
        if (players.length == 0) {
          message.channel.send("Error: Player not found!");
        } else {
          for (var player of players) {
            if (player.strikeCount === 0) {
              message.channel.send("```" + player.playerTAG + " has no strike```");
            } else {
              var msg = `${player.playerTAG} has ${player.strikeCount} strikes.`;
              message.channel.send("```" + msg + "\n\nReasons for strikes:\n" + player.strikes + "```");
            }
          }
        }
      });
    });
  } else if (leftOverMessage.startsWith("RESET")) {
    if (message.author.id !== "644005027052126208") {
      return message.channel.send("Only family leader has the permission to use this command!");
    }

    const filter = (m) => m.content.includes("CONFIRM RESET") && m.author.id === "644005027052126208";
    const collector = message.channel.createMessageCollector(filter, {
      time: 25000,
    });
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

client.login(process.env.clientKey);
