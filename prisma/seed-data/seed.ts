import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.kanaGroupType.upsert({
    where: {
      id: "",
    },
    update: {},
    create: {
      name: "Hiragana (Gojuuon)",
      groups: {
        create: [
          {
            name: "A",
            kanas: {
              create: [
                {
                  kana: "あ",
                  roumaji: "A",
                },
                {
                  kana: "い",
                  roumaji: "i",
                },
                {
                  kana: "う",
                  roumaji: "u",
                },
                {
                  kana: "え",
                  roumaji: "e",
                },
                {
                  kana: "お",
                  roumaji: "o",
                },
              ],
            },
          },
          {
            name: "K",
            kanas: {
              create: [
                {
                  kana: "か",
                  roumaji: "ka",
                },
                {
                  kana: "き",
                  roumaji: "ki",
                },
                {
                  kana: "く",
                  roumaji: "ku",
                },
                {
                  kana: "け",
                  roumaji: "ke",
                },
                {
                  kana: "こ",
                  roumaji: "ko",
                },
              ],
            },
          },
          {
            name: "S",
            kanas: {
              create: [
                {
                  kana: "さ",
                  roumaji: "sa",
                },
                {
                  kana: "し",
                  roumaji: "shi",
                },
                {
                  kana: "す",
                  roumaji: "su",
                },
                {
                  kana: "せ",
                  roumaji: "se",
                },
                {
                  kana: "そ",
                  roumaji: "so",
                },
              ],
            },
          },
          {
            name: "T",
            kanas: {
              create: [
                {
                  kana: "た",
                  roumaji: "ta",
                },
                {
                  kana: "ち",
                  roumaji: "chi",
                },
                {
                  kana: "つ",
                  roumaji: "tsu",
                },
                {
                  kana: "て",
                  roumaji: "te",
                },
                {
                  kana: "と",
                  roumaji: "to",
                },
              ],
            },
          },
          {
            name: "N",
            kanas: {
              create: [
                {
                  kana: "な",
                  roumaji: "na",
                },
                {
                  kana: "に",
                  roumaji: "ni",
                },
                {
                  kana: "ぬ",
                  roumaji: "nu",
                },
                {
                  kana: "ね",
                  roumaji: "ne",
                },
                {
                  kana: "の",
                  roumaji: "no",
                },
              ],
            },
          },
          {
            name: "H",
            kanas: {
              create: [
                {
                  kana: "は",
                  roumaji: "ha",
                },
                {
                  kana: "ひ",
                  roumaji: "hi",
                },
                {
                  kana: "ふ",
                  roumaji: "hu",
                },
                {
                  kana: "へ",
                  roumaji: "he",
                },
                {
                  kana: "ほ",
                  roumaji: "ho",
                },
              ],
            },
          },
          {
            name: "M",
            kanas: {
              create: [
                {
                  kana: "ま",
                  roumaji: "ma",
                },
                {
                  kana: "み",
                  roumaji: "mi",
                },
                {
                  kana: "む",
                  roumaji: "mu",
                },
                {
                  kana: "め",
                  roumaji: "me",
                },
                {
                  kana: "も",
                  roumaji: "mo",
                },
              ],
            },
          },
          {
            name: "Y",
            kanas: {
              create: [
                {
                  kana: "や",
                  roumaji: "ya",
                },
                {
                  kana: "ゆ",
                  roumaji: "yu",
                },
                {
                  kana: "よ",
                  roumaji: "yo",
                },
              ],
            },
          },
          {
            name: "R",
            kanas: {
              create: [
                {
                  kana: "ら",
                  roumaji: "ra",
                },
                {
                  kana: "り",
                  roumaji: "ri",
                },
                {
                  kana: "る",
                  roumaji: "ru",
                },
                {
                  kana: "れ",
                  roumaji: "re",
                },
                {
                  kana: "ろ",
                  roumaji: "ro",
                },
              ],
            },
          },
          {
            name: "W",
            kanas: {
              create: [
                {
                  kana: "わ",
                  roumaji: "wa",
                },
                {
                  kana: "を",
                  roumaji: "wo",
                },
              ],
            },
          },
          {
            name: "N",
            kanas: {
              create: [
                {
                  kana: "ん",
                  roumaji: "n",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.kanaGroupType.upsert({
    where: {
      id: "",
    },
    update: {},
    create: {
      name: "Hiragana (dakuon)",
      groups: {
        create: [
          {
            name: "G",
            kanas: {
              create: [
                {
                  kana: "が",
                  roumaji: "ga",
                },
                {
                  kana: "ぎ",
                  roumaji: "gi",
                },
                {
                  kana: "ぐ",
                  roumaji: "gu",
                },
                {
                  kana: "げ",
                  roumaji: "ge",
                },
                {
                  kana: "ご",
                  roumaji: "go",
                },
              ],
            },
          },
          {
            name: "Z",
            kanas: {
              create: [
                {
                  kana: "ざ",
                  roumaji: "za",
                },
                {
                  kana: "じ",
                  roumaji: "ji",
                },
                {
                  kana: "ず",
                  roumaji: "zu",
                },
                {
                  kana: "ぜ",
                  roumaji: "ze",
                },
                {
                  kana: "ぞ",
                  roumaji: "zo",
                },
              ],
            },
          },
          {
            name: "D",
            kanas: {
              create: [
                {
                  kana: "だ",
                  roumaji: "da",
                },
                {
                  kana: "ぢ",
                  roumaji: "ji",
                },
                {
                  kana: "づ",
                  roumaji: "zu",
                },
                {
                  kana: "で",
                  roumaji: "de",
                },
                {
                  kana: "ど",
                  roumaji: "do",
                },
              ],
            },
          },
          {
            name: "B",
            kanas: {
              create: [
                {
                  kana: "ば",
                  roumaji: "ba",
                },
                {
                  kana: "び",
                  roumaji: "bi",
                },
                {
                  kana: "ぶ",
                  roumaji: "bu",
                },
                {
                  kana: "べ",
                  roumaji: "be",
                },
                {
                  kana: "ぼ",
                  roumaji: "bo",
                },
              ],
            },
          },
          {
            name: "P",
            kanas: {
              create: [
                {
                  kana: "ぱ",
                  roumaji: "pa",
                },
                {
                  kana: "ぴ",
                  roumaji: "pi",
                },
                {
                  kana: "ぷ",
                  roumaji: "pu",
                },
                {
                  kana: "ぺ",
                  roumaji: "pe",
                },
                {
                  kana: "ぽ",
                  roumaji: "po",
                },
              ],
            },
          },
        ],
      },
    },
  });

  await prisma.kanaGroupType.upsert({
    where: {
      id: "",
    },
    update: {},
    create: {
      name: "Hiragana (youon)",
      groups: {
        create: [
          {
            name: "K",
            kanas: {
              create: [
                {
                  kana: "きゃ",
                  roumaji: "kya",
                },
                {
                  kana: "きゅ",
                  roumaji: "kyu",
                },
                {
                  kana: "きょ",
                  roumaji: "kyo",
                },
              ],
            },
          },
          {
            name: "S",
            kanas: {
              create: [
                {
                  kana: "しゃ",
                  roumaji: "sha",
                },
                {
                  kana: "しゅ",
                  roumaji: "shu",
                },
                {
                  kana: "しょ",
                  roumaji: "sho",
                },
              ],
            },
          },
          {
            name: "C",
            kanas: {
              create: [
                {
                  kana: "ちゃ",
                  roumaji: "cha",
                },
                {
                  kana: "ちゅ",
                  roumaji: "chu",
                },
                {
                  kana: "ちょ",
                  roumaji: "cho",
                },
              ],
            },
          },
          {
            name: "H",
            kanas: {
              create: [
                {
                  kana: "にゃ",
                  roumaji: "nya",
                },
                {
                  kana: "にゅ",
                  roumaji: "nyu",
                },
                {
                  kana: "にょ",
                  roumaji: "nyo",
                },
              ],
            },
          },
          {
            name: "H",
            kanas: {
              create: [
                {
                  kana: "ひゃ",
                  roumaji: "hya",
                },
                {
                  kana: "ひゅ",
                  roumaji: "hyu",
                },
                {
                  kana: "ひょ",
                  roumaji: "hyo",
                },
              ],
            },
          },
          {
            name: "M",
            kanas: {
              create: [
                {
                  kana: "みゃ",
                  roumaji: "mya",
                },
                {
                  kana: "みゅ",
                  roumaji: "myu",
                },
                {
                  kana: "みょ",
                  roumaji: "myo",
                },
              ],
            },
          },
          {
            name: "R",
            kanas: {
              create: [
                {
                  kana: "りゃ",
                  roumaji: "rya",
                },
                {
                  kana: "りゅ",
                  roumaji: "ryu",
                },
                {
                  kana: "りょ",
                  roumaji: "ryo",
                },
              ],
            },
          },
          {
            name: "G",
            kanas: {
              create: [
                {
                  kana: "ぎゃ",
                  roumaji: "gya",
                },
                {
                  kana: "ぎゅ",
                  roumaji: "gyu",
                },
                {
                  kana: "ぎょ",
                  roumaji: "gyo",
                },
              ],
            },
          },
          {
            name: "J",
            kanas: {
              create: [
                {
                  kana: "じゃ",
                  roumaji: "ja",
                },
                {
                  kana: "じゅ",
                  roumaji: "ju",
                },
                {
                  kana: "じょ",
                  roumaji: "jo",
                },
              ],
            },
          },
          {
            name: "B",
            kanas: {
              create: [
                {
                  kana: "びゃ",
                  roumaji: "bya",
                },
                {
                  kana: "びゅ",
                  roumaji: "byu",
                },
                {
                  kana: "びょ",
                  roumaji: "byo",
                },
              ],
            },
          },
          {
            name: "P",
            kanas: {
              create: [
                {
                  kana: "ぴゃ",
                  roumaji: "pya",
                },
                {
                  kana: "ぴゅ",
                  roumaji: "pyu",
                },
                {
                  kana: "ぴょ",
                  roumaji: "pyo",
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Successfully seeded the database");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
