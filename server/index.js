const express = require("express");
require("dotenv").config();
const cron = require("node-cron");
const headers = require("./headers");
const PORT = process.env.PORT || 3078;

const app = express();

const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const pg = require("pg");
pg.types.setTypeParser(1082, function (stringValue) {
  return new Date(stringValue).toISOString().split("T")[0]; //1082 for date type
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

app.get("/api", async (req, res) => {
  const startdate = typeof req.query.startdate !== "undefined" ? req.query.startdate : "now()::date - '1 week'::interval";
  const enddate = typeof req.query.enddate !== "undefined" ? req.query.enddate : "now()::date";

  console.log(startdate, enddate);

  const query = `
  SELECT 
    *
  FROM daily_general_detailed
  WHERE date between ${startdate} and ${enddate}
  order by date asc;
  `;

  const result = await pool.query(query);

  data = [];
  if (result.rows.length > 0) {
    data = result.rows;
  }
  return res.json(data);
});

app.get("/api/comparison", async (req, res) => {
  const interval_past = typeof req.query.interval_past !== "undefined" ? req.query.interval_past : "1 week";
  const interval_future = typeof req.query.interval_future !== "undefined" ? req.query.interval_future : "1 week";
  const startdate = typeof req.query.startdate !== "undefined" ? req.query.startdate : `now()::date - '${interval_past}'::interval`;
  const enddate = typeof req.query.enddate !== "undefined" ? req.query.enddate : `now()::date + '${interval_future}'::interval`;
  const query1 = `
  SELECT 
    *,
    to_char(date, 'DD/MM') new_date
  FROM daily_general_detailed
  WHERE date between ${startdate} and ${enddate}
  order by date asc;
  `;

  const query2 = `
  SELECT 
    *,
    to_char(date, 'DD/MM') new_date
  FROM daily_general_detailed
  WHERE date between ${startdate} - '1 year'::interval and ${enddate} - '1 year'::interval 
  order by date asc;
  `;

  const res1 = await pool.query(query1);
  const res2 = await pool.query(query2);

  let data = [];
  res1.rows.forEach((row) => {
    let newObj = {};
    for (let key in row) {
      if (key == "new_date") newObj["date"] = row[key];
      else newObj["y2021_" + key] = row[key];
    }
    data.push(newObj);
  });

  res2.rows.forEach((row) => {
    var y2020obj = data.filter((obj) => {
      return obj.date === row["new_date"];
    });
    let newObj = y2020obj.length === 1 ? y2020obj[0] : {};
    for (let key in row) {
      if (key == "new_date") newObj["date"] = row[key];
      else newObj["y2020_" + key] = row[key];
    }
    if (y2020obj.length !== 1) data.push(newObj);
  });
  return res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

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

  const query = `INSERT INTO daily_general (date, pcr_positive, pcr_positive_today, pcr_tests_today, deaths, deaths_today, ag_tests_today, ag_positive_today, 
    hospitalized, hospitalized_change, vaccinated1stdose, vaccinated1stdose_today, vaccinated2nddose, vaccinated2nddose_today) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) ON CONFLICT ON CONSTRAINT date_unique DO NOTHING;`;
  const variables = [dbDate, pcrP, pcrPT, pcrTT, deaths, deathsT, agTT, agPT, hosp, hospT, vaccine1, vaccine1T, vaccine2, vaccine2T];
  const result = await pool.query(query, variables);
  console.log(result);
};

const hosp_conf_header = {
  version: "1.0.0",
  queries: [
    {
      Query: {
        Commands: [
          {
            SemanticQueryDataShapeCommand: {
              Query: {
                Version: 2,
                From: [
                  { Name: "c", Entity: "COVID-19 Nemocnice Hist", Type: 0 },
                  { Name: "w", Entity: "Web - Pozitivne nalezy", Type: 0 },
                ],
                Select: [
                  {
                    Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "POSTELE_COVID_PL" } }, Function: 0 },
                    Name: "Sum(COVID-19 Nemocnice Hist.POSTELE_COVID_PL)",
                  },
                  { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Timestamp" }, Name: "COVID-19 Nemocnice Hist.Timestamp" },
                  {
                    Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "ZAR_COVID" } }, Function: 0 },
                    Name: "CountNonNull(COVID-19 Nemocnice Hist.ZAR_COVID)",
                  },
                  {
                    Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "COVID_JIS" } }, Function: 0 },
                    Name: "Sum(COVID-19 Nemocnice Hist.COVID_JIS)",
                  },
                  {
                    Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "COVID_OAIM" } }, Function: 0 },
                    Name: "Sum(COVID-19 Nemocnice Hist.COVID_OAIM)",
                  },
                ],
                Where: [
                  {
                    Condition: {
                      Between: {
                        Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Timestamp" } },
                        LowerBound: {
                          DateSpan: {
                            Expression: {
                              DateAdd: {
                                Expression: {
                                  DateAdd: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, Amount: 1, TimeUnit: 0 },
                                },
                                Amount: -1000,
                                TimeUnit: 0,
                              },
                            },
                            TimeUnit: 0,
                          },
                        },
                        UpperBound: { DateSpan: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, TimeUnit: 0 } },
                      },
                    },
                  },
                  {
                    Condition: {
                      Not: {
                        Expression: {
                          Comparison: {
                            ComparisonKind: 0,
                            Left: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Dátum" } },
                            Right: { Literal: { Value: "null" } },
                          },
                        },
                      },
                    },
                  },
                ],
              },
              Binding: {
                Primary: { Groupings: [{ Projections: [0, 1, 2, 3, 4] }] },
                DataReduction: { DataVolume: 4, Primary: { BinnedLineSample: {} } },
                Version: 1,
              },
              ExecutionMetricsKind: 1,
            },
          },
        ],
      },
      CacheKey:
        '{"Commands":[{"SemanticQueryDataShapeCommand":{"Query":{"Version":2,"From":[{"Name":"c","Entity":"COVID-19 Nemocnice Hist","Type":0},{"Name":"w","Entity":"Web - Pozitivne nalezy","Type":0}],"Select":[{"Aggregation":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"POSTELE_COVID_PL"}},"Function":0},"Name":"Sum(COVID-19 Nemocnice Hist.POSTELE_COVID_PL)"},{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"Timestamp"},"Name":"COVID-19 Nemocnice Hist.Timestamp"},{"Aggregation":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"ZAR_COVID"}},"Function":0},"Name":"CountNonNull(COVID-19 Nemocnice Hist.ZAR_COVID)"},{"Aggregation":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"COVID_JIS"}},"Function":0},"Name":"Sum(COVID-19 Nemocnice Hist.COVID_JIS)"},{"Aggregation":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"COVID_OAIM"}},"Function":0},"Name":"Sum(COVID-19 Nemocnice Hist.COVID_OAIM)"}],"Where":[{"Condition":{"Between":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"Timestamp"}},"LowerBound":{"DateSpan":{"Expression":{"DateAdd":{"Expression":{"DateAdd":{"Expression":{"DateAdd":{"Expression":{"Now":{}},"Amount":-1,"TimeUnit":0}},"Amount":1,"TimeUnit":0}},"Amount":-1000,"TimeUnit":0}},"TimeUnit":0}},"UpperBound":{"DateSpan":{"Expression":{"DateAdd":{"Expression":{"Now":{}},"Amount":-1,"TimeUnit":0}},"TimeUnit":0}}}}},{"Condition":{"Not":{"Expression":{"Comparison":{"ComparisonKind":0,"Left":{"Column":{"Expression":{"SourceRef":{"Source":"w"}},"Property":"Dátum"}},"Right":{"Literal":{"Value":"null"}}}}}}}]},"Binding":{"Primary":{"Groupings":[{"Projections":[0,1,2,3,4]}]},"DataReduction":{"DataVolume":4,"Primary":{"BinnedLineSample":{}}},"Version":1},"ExecutionMetricsKind":1}}]}',
      QueryId: "",
      ApplicationContext: {
        DatasetId: "53e73f79-7034-4c9e-a7cf-4f70b21408df",
        Sources: [{ ReportId: "10e05850-c2c3-4c6d-80b6-edc64c431d84", VisualId: "571207c26eda1504dc08" }],
      },
    },
  ],
  cancelQueries: [],
  modelId: 3494954,
};
const hosp_sus_header = {
  version: "1.0.0",
  queries: [
    {
      Query: {
        Commands: [
          {
            SemanticQueryDataShapeCommand: {
              Query: {
                Version: 2,
                From: [
                  { Name: "c", Entity: "COVID-19 Nemocnice Hist", Type: 0 },
                  { Name: "w", Entity: "Web - Pozitivne nalezy", Type: 0 },
                ],
                Select: [
                  { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Timestamp" }, Name: "COVID-19 Nemocnice Hist.Timestamp" },
                  {
                    Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "ZAR_COVID_HYPOT" } }, Function: 0 },
                    Name: "Sum(COVID-19 Nemocnice Hist.ZAR_COVID_HYPOT)",
                  },
                ],
                Where: [
                  {
                    Condition: {
                      Comparison: {
                        ComparisonKind: 1,
                        Left: {
                          Aggregation: {
                            Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Infektológia–obsadené lôžka pacientom s COVID" } },
                            Function: 0,
                          },
                        },
                        Right: { Literal: { Value: "0D" } },
                      },
                    },
                    Target: [{ Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Timestamp" } }],
                  },
                  {
                    Condition: {
                      Between: {
                        Expression: { Column: { Expression: { SourceRef: { Source: "c" } }, Property: "Timestamp" } },
                        LowerBound: {
                          DateSpan: {
                            Expression: {
                              DateAdd: {
                                Expression: {
                                  DateAdd: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, Amount: 1, TimeUnit: 0 },
                                },
                                Amount: -1000,
                                TimeUnit: 0,
                              },
                            },
                            TimeUnit: 0,
                          },
                        },
                        UpperBound: { DateSpan: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, TimeUnit: 0 } },
                      },
                    },
                  },
                  {
                    Condition: {
                      Not: {
                        Expression: {
                          Comparison: {
                            ComparisonKind: 0,
                            Left: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Dátum" } },
                            Right: { Literal: { Value: "null" } },
                          },
                        },
                      },
                    },
                  },
                ],
              },
              Binding: { Primary: { Groupings: [{ Projections: [0, 1] }] }, DataReduction: { DataVolume: 4, Primary: { BinnedLineSample: {} } }, Version: 1 },
              ExecutionMetricsKind: 1,
            },
          },
        ],
      },
      CacheKey:
        '{"Commands":[{"SemanticQueryDataShapeCommand":{"Query":{"Version":2,"From":[{"Name":"c","Entity":"COVID-19 Nemocnice Hist","Type":0},{"Name":"w","Entity":"Web - Pozitivne nalezy","Type":0}],"Select":[{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"Timestamp"},"Name":"COVID-19 Nemocnice Hist.Timestamp"},{"Aggregation":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"ZAR_COVID_HYPOT"}},"Function":0},"Name":"Sum(COVID-19 Nemocnice Hist.ZAR_COVID_HYPOT)"}],"Where":[{"Condition":{"Comparison":{"ComparisonKind":1,"Left":{"Aggregation":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"Infektológia–obsadené lôžka pacientom s COVID"}},"Function":0}},"Right":{"Literal":{"Value":"0D"}}}},"Target":[{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"Timestamp"}}]},{"Condition":{"Between":{"Expression":{"Column":{"Expression":{"SourceRef":{"Source":"c"}},"Property":"Timestamp"}},"LowerBound":{"DateSpan":{"Expression":{"DateAdd":{"Expression":{"DateAdd":{"Expression":{"DateAdd":{"Expression":{"Now":{}},"Amount":-1,"TimeUnit":0}},"Amount":1,"TimeUnit":0}},"Amount":-1000,"TimeUnit":0}},"TimeUnit":0}},"UpperBound":{"DateSpan":{"Expression":{"DateAdd":{"Expression":{"Now":{}},"Amount":-1,"TimeUnit":0}},"TimeUnit":0}}}}},{"Condition":{"Not":{"Expression":{"Comparison":{"ComparisonKind":0,"Left":{"Column":{"Expression":{"SourceRef":{"Source":"w"}},"Property":"Dátum"}},"Right":{"Literal":{"Value":"null"}}}}}}}]},"Binding":{"Primary":{"Groupings":[{"Projections":[0,1]}]},"DataReduction":{"DataVolume":4,"Primary":{"BinnedLineSample":{}}},"Version":1},"ExecutionMetricsKind":1}}]}',
      QueryId: "",
      ApplicationContext: {
        DatasetId: "53e73f79-7034-4c9e-a7cf-4f70b21408df",
        Sources: [{ ReportId: "10e05850-c2c3-4c6d-80b6-edc64c431d84", VisualId: "76dec20746e12e9a88d8" }],
      },
    },
  ],
  cancelQueries: [],
  modelId: 3494954,
};

const getHospitalizations = async () => {
  let lastValue = null;
  const hosp_data = {};
  const hosp_conf_lastValue = { upv: null, oaim: null, jis: null, conf: null };
  const hosp_conf_mapping = { 0: "date", 1: "upv", 2: "conf", 3: "jis", 4: "oaim" };

  var res = await axios.post("https://wabi-west-europe-api.analysis.windows.net/public/reports/querydata?synchronous=true", hosp_sus_header);
  res.data.results[0].result.data.dsr.DS[0].PH[0].DM0.forEach((item) => {
    const datum = new Date(item.C[0]).toISOString().split("T")[0];
    const value = item.C.length > 1 ? item.C[1] : lastValue;
    lastValue = value;
    hosp_data[datum] = {};
    hosp_data[datum]["sus"] = value;
  });

  res = await axios.post("https://wabi-west-europe-api.analysis.windows.net/public/reports/querydata?synchronous=true", hosp_conf_header);
  res.data.results[0].result.data.dsr.DS[0].PH[0].DM0.forEach((item) => {
    const hosp_conf_value = { upv: null, oaim: null, jis: null, conf: null };
    var date = null;
    if (item.hasOwnProperty("C")) {
      var base2 = item.hasOwnProperty("R") ? item.R.toString(2).padStart(5, "0") : "00000";
      var index = 0;
      base2
        .split("")
        .reverse()
        .forEach((c, i) => {
          if (i === 0) {
            index++;
            date = new Date(item.C[0]).toISOString().split("T")[0];
            return;
          }
          if (c == "0") {
            hosp_conf_value[hosp_conf_mapping[i]] = item.C[index];
            hosp_conf_lastValue[hosp_conf_mapping[i]] = hosp_conf_value[hosp_conf_mapping[i]];
            index++;
          } else {
            hosp_conf_value[hosp_conf_mapping[i]] = hosp_conf_lastValue[hosp_conf_mapping[i]];
          }
        });
    }

    if (hosp_data.hasOwnProperty(date)) hosp_data[date] = { ...hosp_data[date], ...hosp_conf_value };
    else hosp_data[date] = { sus: null, ...hosp_conf_value };
  });

  const query = `INSERT INTO hospitalizations (date, sus, conf, upv, jis, oaim) VALUES ${Object.entries(hosp_data)
    .map(function ([key, value], i) {
      return `('${key}', ${value["sus"]}, ${value["conf"]}, ${value["upv"]}, ${value["jis"]}, ${value["oaim"]})`;
    })
    .join(",")} ON CONFLICT ON CONSTRAINT hosp_date_unique DO NOTHING;`;
  console.log(query);
  const result = await pool.query(query);
  console.log(result);
};

const getPcrOkresy = (date) => {
  var date = date || new Date();
  axios
    .post("https://wabi-west-europe-api.analysis.windows.net/public/reports/querydata?synchronous=true", headers.PcrPositiveOkresy(date))
    .then((res) => {
      var PcrData = [];
      var customDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0, 0, 0));
      var customDateString = customDate.toISOString().split("T")[0];
      res.data.results[0].result.data.dsr.DS[0].PH[0].DM0.forEach((item) => {
        const positiveCount = item.C.length > 1 ? item.C[1] : 0;
        PcrData.push([customDateString, item.C[0], positiveCount]);
      });
      return PcrData;
    })
    .then((data) => {
      const query = `INSERT INTO pcr_okresy (date, okres, positive) VALUES ${data
        .map(function (item, i) {
          return `('${item[0]}', ${item[1]}, ${item[2]})`;
        })
        .join(",")} ON CONFLICT ON CONSTRAINT pcr_okresy_date_okres DO NOTHING;`;
      console.log(query);
      const result = await pool.query(query);
      console.log(result);
    });
};

getPcrOkresy();

cron.schedule("*/30 10-12 * * *", () => {
  console.log("UPDATED");
  try {
    getKoronaGovData();
    getHospitalizations();
  } catch (error) {
    console.log(error);
  }
});
