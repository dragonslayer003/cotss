var CLAN_TAGS = {
  COT: "#Q889GPL",
  COT_W: "#2YJVQUCYJ",
  SC: "#8GUJCPV",
  BLK: "#8YJVUGR2",
  NA: "#8VPQCR2R",
  DAND: "#PQL8JY8L",
  COT_A: "#2Y2QC082R",
  AM: "#YGLC2R9R",
  F20: "#8CV0GPPR",
  TH: "#2RRCJCL0",
  MW: "#8VQP9VQ9",
  FUN: "#2Q9RLRCG",
  CWL_FUN: "#28Y2LU2LL",
  GIL: "#YUGU9Y0C",
  KMA: "#8GR80JJL",
  KIL: "#8ULGV2QQ",
  WWW: "#YJPRG0YG",
  K33: "#QJR9C8J0",
};

function messageDecoder(message) {
  var tag = "",
    whichFunction = 0;

  switch (message) {
    case "COT":
    case "CLASH OF THRONES":
      tag = CLAN_TAGS.COT;
      whichFunction = 1;
      break;

    case "COTW":
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
    case "COT A":
    case "ASSASINS":
    case "COT ASSASSINS":
      whichFunction = 1;
      tag = CLAN_TAGS.COT_A;
      break;

    case "AM":
    case "ALPHA":
    case "ALPHA MAX":
      whichFunction = 1;
      tag = CLAN_TAGS.AM;
      break;

    case "420":
    case "FOUR TWENTY":
      whichFunction = 1;
      tag = CLAN_TAGS.F20;
      break;

    case "TH":
    case "THE HORDE":
      tag = CLAN_TAGS.TH;
      whichFunction = 1;
      break;

    case "MW":
    case "MORNING WOODS":
      tag = CLAN_TAGS.MW;
      whichFunction = 1;
      break;

    case "FUN":
    case "FUNNIES":
      tag = CLAN_TAGS.FUN;
      whichFunction = 1;
      break;

    case "CWL FUNNIES":
    case "CWL FUN":
      tag = CLAN_TAGS.CWL_FUN;
      whichFunction = 1;
      break;
	  
    case "GIL":
    case "GILMAZ":
      tag = CLAN_TAGS.GIL;
      whichFunction = 1;
      break;

    case "KMA":
    case "KMA Elite":
      tag = CLAN_TAGS.KMA;
      whichFunction = 1;
      break;

    case "KIL":
    case "KILLER INC":
      tag = CLAN_TAGS.KIL;
      whichFunction = 1;
      break;

    case "WWW":
    case "WWWARRIORS":
      tag = CLAN_TAGS.WWW;
      whichFunction = 1;
      break;

    case "K33":
    case "K33P_CALM2k16":
      tag = CLAN_TAGS.K33;
      whichFunction = 1;
      break;

    case "ALL":
      whichFunction = 2;
      tag = CLAN_TAGS;
      break;

    default:
      tag = "Invalid command! Refer :help for information";
      break;
  }

  return { tag, whichFunction };
}

export default messageDecoder;
