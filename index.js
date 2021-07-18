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
      "```:{CLAN_NAME} -> show clan strike information.\n:all -> show all clan strike information.\n:show {@USERs}/{#PLAYER_TAG(s)} -> show strike information for a user.\n:add {#PLAYER_TAG(s)} {strike Number} -> add strikes for a Player.\n:remove {#PLAYER_TAG(s)} {strike Number} -> remove a strike for the Player.\n:link {@USER} {#PLAYER_TAG} -> link a new user with their clan ID.\n:delete {@USER} -> delete all links of a player.\n:delete {#PLAYER_TAG(s)} -> delete provided player TAGs.\n```"
    );
    message.channel.send(
      "```Strike Number: \n\n 1 -> Left the clan without approval. (0.5 strike)\n 2 -> Failed to respond to leadership. (0.5 strike)\n 3 -> Attacked wrong base in war. (0.5 strike)\n 4 -> Missed a war attack without reason. (1 strike)\n 5 -> Missed atatck in CWL without reason. (1 strike)\n 6 -> Failed to meet Clan Games points. (1 strike)\n 7 -> Opting in for war while hero(s) down. (1 strike)\n 8 -> Did not follow the war plan. (1 strike)\n 9 -> Did not use either of the attacks in the war. (2 strikes)\n10 -> Changed the war plan made by war general. (3 strikes)\n11 -> Toxic towards other players. (4 strikes)\n12 -> Camping accounts and/or going AFK. (4 strikes)\n13 -> Failed to swap War Base when advised by Leadership of FWA. (1 strike)\n14 -> Failed to attack your FWA Mirror without properly alerting Leadership. (1 strike)\n```"
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
    if (!strike || strike < 1 || strike > 14) {
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
              `<@${player.playerID}> You've accumulated ${player.strikeCount} strikes in the CoTSS. Go to <#780881554238865538>, open up a ticket and we will discuss your situation. You have 12hrs to open up a ticket for discussion. Failure to comply will result in a kick from Clan and ban from any other Clan in the Family for a week. After one week with no reply, kick from the Server. <@&671577259962007573>`
            );
          } else {
            message.channel.send(
              "<@" +
                player.playerID +
                ">" +
                " You've been issued a new strike in the CoTSS. If you wish to appeal and discuss, create an Appeal Ticket in <#780881554238865538>."
            );
          }
          var msg = `${player.playerTAG} has ${player.strikeCount} strikes. \n\nReason for current strike: ${strikes}`;
          message.channel.send("```" + msg + "\nAll of player strikes:\n\n" + player.strikes + "```");
        }
      });
    });
  } else if (leftOverMessage.startsWith("REMOVE")) {
    var strike = leftOverMessage.split(" ").filter((arg) => parseFloat(arg))[0];
    if (!strike || strike < 1 || strike > 14) {
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
          if (!player.strikes.includes(strikes)) {
            message.channel.send("Invalid operation! Player does not have that strike!");
            return;
          }
          player.strikeCount = player.strikeCount - parseFloat(strikeCount);
          player.strikes = player.strikes.replace(strikes, "");
          player.save();
          if (player.strikeCount >= 4) {
            message.channel.send(
              `<@${player.playerID}> You've accumulated ${player.strikeCount} strikes in the CoTSS. Go to <#780881554238865538>, open up a ticket and we will discuss your situation. You have 12hrs to open up a ticket for discussion. Failure to comply will result in a kick from Clan and ban from any other Clan in the Family for a week. After one week with no reply, kick from the Server. <@&671577259962007573>`
            );
          } else {
            message.channel.send(
              "<@" +
                player.playerID +
                ">" +
                " You've been issued a new strike in the CoTSS. If you wish to appeal and discuss, create an Appeal Ticket in <#780881554238865538>."
            );
          }
          var msg = `${player.playerTAG} has ${player.strikeCount} strikes. \n\nReason for current strike: ${strikes}`;
          message.channel.send("```" + msg + "\nAll of player strikes:\n\n" + player.strikes + "```");
        }
      });
    });
  } else if (leftOverMessage.startsWith("SHOW")) {
    var users = message.mentions.users;
    var usersTAGs = leftOverMessage.split(" ").filter((arg) => arg.startsWith("#"));

    if (users.size < 1 && usersTAGs.size < 1) {
      return message.channel.send("Please enter atleaset one user.");
    }

    users.size > 0 && users.map((user) => {
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

    usersTAGs.size > 0 && usersTAGs.map((userTAG) => {
      Player.find({ playerTAG: userTAG }, (err, players) => {
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
