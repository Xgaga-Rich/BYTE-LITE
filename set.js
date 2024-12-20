 
const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;


///////////////////


module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUNtb0IrRVpTcHNTRHJTWVdDSXArNkxxMWtva1oxcXNXUlRlT1dPWlMzMD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ1hIaGtnZ0tCdkdYMkhHaDZ6MG5EMU10YlZCK3JXeWxQcnp2MTJ2R25Rcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlR1cybXBBZGNvZ1YyTDNYVXI2NEF3aW03TGdlbE5NT1pwWVBsVUlvMG1ZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjTloyOEhpOVdsalFZbG10R2dnQ1lUZVg2VUc5TGorOWtVSTc1UDV5WlhZPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkVGR0F5S0VKUXpOejdEYnNyY3FMaThLMTZ2ekhvOHZZUGlkc0lEdjAxMnc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InB1SWxRQ3ZxTXlPMDZFRUJtU3lXZ0xhdlpuanBEU0NudStoNHZqMkRUbnM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0JzcmUvUDhpbnBBbCt3Z2djQVpydlBwUDRIaGJaeVhPZVJZb0hwaTJFOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVStndnp6TkFKUktGeE1GbE8rOUgraStjcnRQTWh2d3pGWWtDN3hJdDRsTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVWMVYvMXZaampPM0J3OGx1NWUwOE12REtneElpc3ZKQ1k4MFFrbjBmWU5GSmdKaWxzN29iZzlhTkVlOUpDbXl1VE5ibVJPU21Odk9IbG9oOElZeER3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjI4LCJhZHZTZWNyZXRLZXkiOiJEUmJ2dzZUdHoxclB3R3BoajRDQUF6K2VvU3VYZTJsNk5HckhuenNIMzhzPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJnOURhTHFSNlNUSzBubk9DclJYQXVBIiwicGhvbmVJZCI6Ijg5YzczMTk5LWQ5MjEtNGFhZC04MTE3LTVmMmM1NDg4MTQ0NCIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJhMlk3MFlseDl1OE40TDVsYy9uV1htTHZYdjA9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicHRKbG41UXdpb0dzMmNlWU0xN0EzSUZtZFpZPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IjQ4SjhTNkdDIiwibWUiOnsiaWQiOiIyNTQ3NTYxNTYyMTY6MzFAcy53aGF0c2FwcC5uZXQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ05TWGdxRUdFUEwvbHJzR0dBNGdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IkNrNk5ocVlLRUhRd01MOFFKZi9IQ1pJNEtDQjhkWDQ4YmNCeCtFdDBxVkk9IiwiYWNjb3VudFNpZ25hdHVyZSI6IjJrelpuTkZabUd2d2xQbk44cEJYYkFSYmpRajk3U0g2YVVrN3RrVWhlVE1uaDU5dC9wQndMdlYrNVhZQ0VBU3U5OFgvSTdlc1NoQVJ6bHhBY2RpdENnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJNTUVGdWpjeTYveTFrdExwc1RrU3ppMTFDL2lnc2lvbmJJZUJWeFZkUkNURmhKaVNjaFBWaHlobVAxOVhsTEhmQytVMnBJeHdaNDJxaEdaL1VWNmtBZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDc1NjE1NjIxNjozMUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRcE9qWWFtQ2hCME1EQy9FQ1gveHdtU09DZ2dmSFYrUEczQWNmaExkS2xTIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzM0NzIxNTM1LCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQU5odyJ9',

////////////////////////////////



    PREFIXE: process.env.PREFIX || ".",



///////////////////////////
    A_REACT : process.env.AUTO_REACTION || 'on',
    CHATBOT: process.env.CHAT_BOT || "off",
    OWNER_NAME: process.env.OWNER_NAME || "TALKDROVE",
    NUMERO_OWNER : process.env.OWNER_NUMBER || "923072380380",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'non',
    BOT : process.env.BOT_NAME || 'BYTE-MD',
    OPENAI_API_KEY : process.env.OPENAI_API_KEY || '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',
    URL : process.env.BOT_MENU_LINKS || 'https://raw.githubusercontent.com/HyHamza/HyHamza/main/Images/BYTE-MD-LITE.jpeg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'no',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_API_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '3' ,
    ETAT : process.env.PRESENCE || '',
    //GPT : process.env.OPENAI_API_KEY || '',
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ADM : process.env.ANTI_DELETE_MESSAGE || 'yes',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9" : "postgres://db_7xp9_user:6hwmTN7rGPNsjlBEHyX49CXwrG7cDeYi@dpg-cj7ldu5jeehc73b2p7g0-a.oregon-postgres.render.com/db_7xp9",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`Update ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
