const cron = require("node-cron");
const axios = require("axios");
const pg = require("pg");
const Pool = require("pg").Pool;

pg.types.setTypeParser(1082, function (stringValue) {
  return new Date(stringValue).toISOString().split("T")[0]; //1082 for date type
});
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "covid",
  password: "D0t1GrPSQL",
  port: 5432,
});

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

cron.schedule("*/30 10-12 * * *", () => {
  console.log("UPDATED");
  getHospitalizations();
});
