require("dotenv").config();
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const cheerio = require("cheerio");
const axios = require("axios");

async function fetchHTML(url) {
  const { data } = await axios.get(url);
  return cheerio.load(data);
}

const getNumberFromComment = ($, comment) => {
  try {
    return parseInt(
      $("*")
        .contents()
        .filter(function () {
          return this.nodeType === 8 && this.nodeValue.includes(comment);
        })[0]
        .nextSibling.nodeValue.replace(/\s/g, "")
    );
  } catch (error) {
    return null;
  }
};

const getNumberFromHeader = ($, identifier) => {
  try {
    return parseInt(
      $("#" + identifier + " div > *.govuk-heading-l")
        .text()
        .replace(/\s/g, "")
    );
  } catch (error) {
    return null;
  }
};

const getNumberFromParagraph = ($, identifier) => {
  try {
    return parseInt(
      $("#" + identifier + " div > p")
        .text()
        .replace(/\s/g, "")
        .match(/-?\d+/)
    );
  } catch (error) {
    return null;
  }
};

const getDateFromBlock = ($, identifier) => {
  try {
    return $("#" + identifier + " div > p")
      .text()
      .split(/ (.*)/)[1]
      .replace(/\./g, "")
      .split(" ")
      .reverse()
      .join("-");
  } catch (error) {
    return null;
  }
};

const blockIDs = {
  pcrTests: "block_5fb76a90e6197",
  pcrPositive: "block_5fb76a90e6199",
  agTests: "block_5fb764f549941",
  agPositive: "block_5fb764f549943",
  hospitalized: "block_5e9f604b47a87",
  hospitalizedConfirmed: "block_5e9f60f747a89",
  deaths: "block_60378d5bc4f89",
  median7day: "block_5ea6e64364d13",
  vaccinatedFirstDose: "block_6007f1bbea5a1",
  vaccinatedSecondDose: "block_6023af801250b",
  date: "block_5e9f629147a8d",
};

const getKoronaGovData = async () => {
  const $ = await fetchHTML("https://korona.gov.sk/koronavirus-na-slovensku-v-cislach/");
  lastUpdate = getDateFromBlock($, blockIDs.date);
  dbDate = new Date(lastUpdate).toISOString().split("T")[0];
  pcrP = getNumberFromComment($, "koronastats-positives ");
  pcrPT = getNumberFromComment($, "koronastats-positives-delta ");
  pcrT = getNumberFromComment($, "koronastats-lab-tests ");
  pcrTT = getNumberFromComment($, "koronastats-lab-tests-delta ");
  deaths = getNumberFromComment($, "koronastats-deceased ");
  // deathsT = getNumberFromComment($, "koronastats-deceased-delta ");
  deathsT = getNumberFromHeader($, blockIDs.deaths);
  agTT = getNumberFromComment($, "koronastats-ag-tests-delta ");
  agPT = getNumberFromComment($, "koronastats-ag-positives-delta ");
  hosp = getNumberFromComment($, "koronastats-hospitalized ");
  hospT = getNumberFromComment($, "koronastats-hospitalized-delta ");
  vaccine1 = getNumberFromComment($, "koronastats-slovakia_vaccination_dose1_total ");
  vaccine1T = getNumberFromComment($, "koronastats-slovakia_vaccination_dose1_delta ");
  vaccine2 = getNumberFromComment($, "koronastats-slovakia_vaccination_dose2_total ");
  vaccine2T = getNumberFromComment($, "koronastats-slovakia_vaccination_dose2_delta ");

  // const query = `INSERT INTO daily_general (date, pcr_positive, pcr_positive_today, pcr_tests_today, deaths, deaths_today, ag_tests_today, ag_positive_today, 
  //   hospitalized, hospitalized_change, vaccinated1stdose, vaccinated1stdose_today, vaccinated2nddose, vaccinated2nddose_today) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT ON CONSTRAINT date_unique DO NOTHING;`;
  
    const query = `INSERT INTO daily_general (date, pcr_positive, pcr_positive_today, pcr_tests_today, deaths, deaths_today, ag_tests_today, ag_positive_today, 
      hospitalized, hospitalized_change, vaccinated1stdose, vaccinated1stdose_today, vaccinated2nddose, vaccinated2nddose_today) VALUES ('${dbDate}', ${pcrP}, ${pcrPT}, ${pcrTT}, ${deaths}, ${deathsT}, ${agTT}, ${agPT}, ${hosp}, ${hospT}, ${vaccine1}, ${vaccine1T}, ${vaccine2}, ${vaccine2T}) ON CONFLICT ON CONSTRAINT date_unique DO UPDATE SET 
      date = excluded.date,pcr_positive = excluded.pcr_positive,pcr_positive_today = excluded.pcr_positive_today,pcr_tests_today = excluded.pcr_tests_today,deaths = excluded.deaths,deaths_today = excluded.deaths_today,ag_tests_today = excluded.ag_tests_today,ag_positive_today = excluded.ag_positive_today,hospitalized = excluded.hospitalized,hospitalized_change = excluded.hospitalized_change,vaccinated1stdose = excluded.vaccinated1stdose,vaccinated1stdose_today = excluded.vaccinated1stdose_today,vaccinated2nddose = excluded.vaccinated2nddose,vaccinated2nddose_today = excluded.vaccinated2nddose_today
      ;`;


  console.log(query);
  // console.log(variables);
  const result = await pool.query(query);
  console.log(result);
};

getKoronaGovData();
