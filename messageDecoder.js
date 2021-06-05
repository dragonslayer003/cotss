var CLAN_TAGS = {
  COT: "#Q889GPL",
  COT_W: "#2YJVQUCYJ",
  SC: "#8GUJCPV",
  BLK: "#8YJVUGR2",
  NA: "#8VPQCR2R",
  DAND: "#PQL8JY8L",
  COT_A: "#2Y2QC082R",
};

function messageDecorder(message) {
  var tag = "",
    whichFunction = 0;

  switch (message) {
    case "COT":
    case "CLASH OF THRONES":
      tag = CLAN_TAGS.COT;
      whichFunction = 1;
      break;

    case "COTW":
    case "COT W":
    case "COT_W":
    case "COT WILDLINGS":
    case "WILDLINGS":
      tag = CLAN_TAGS.COT_W;
      whichFunction = 1;
      break;

    case "SC":
    case "SPRING":
    case "SPRING CENTENNI":
      whichFunction = 1;
      tag = CLAN_TAGS.SC;
      break;

    case "BLK":
    case "BLACK":
    case "BLACK ID":
      whichFunction = 1;
      tag = CLAN_TAGS.BLK;
      break;

    case "NA":
    case "NOAH":
    case "NOAHS ARC":
      whichFunction = 1;
      tag = CLAN_TAGS.NA;
      break;

    case "DAND":
    case "DANDELION":
      whichFunction = 1;
      tag = CLAN_TAGS.DAND;
      break;

    case "COTA":
    case "COT_A":
    case "ASSASINS":
    case "COT ASSASSINS":
      whichFunction = 1;
      tag = CLAN_TAGS.COT_A;
      break;

    case "ALL":
      whichFunction = 2;
      tag = CLAN_TAGS;
      break;

    default:
      tag = "Invalid command! Refer /strike help for information";
      break;
  }

  return { tag, whichFunction };
}

export default messageDecorder;
