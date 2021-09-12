const PcrPositiveOkresy = (date) => {
  var customDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 1, 0, 0, 0, 0));
  return {
    version: "1.0.0",
    queries: [
      {
        Query: {
          Commands: [
            {
              SemanticQueryDataShapeCommand: {
                Query: {
                  Version: 2,
                  From: [{ Name: "w", Entity: "Web - Pozitivne nalezy", Type: 0 }],
                  Select: [
                    { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Nazov_okresu" }, Name: "Web - Pozitivne nalezy.Nazov_okresu" },
                    {
                      Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Count" } }, Function: 0 },
                      Name: "Sum(Web - Pozitivne nalezy.Count)",
                    },
                  ],
                  Where: [
                    {
                      Condition: {
                        Comparison: {
                          ComparisonKind: 2,
                          Left: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Dátum" } },
                          Right: { Literal: { Value: `datetime'${customDate.toISOString().split(".000Z")[0]}'` } },
                        },
                      },
                    },
                    {
                      Condition: {
                        Between: {
                          Expression: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Dátum" } },
                          LowerBound: {
                            DateSpan: {
                              Expression: {
                                DateAdd: {
                                  Expression: {
                                    DateAdd: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, Amount: 1, TimeUnit: 0 },
                                  },
                                  Amount: -3,
                                  TimeUnit: 3,
                                },
                              },
                              TimeUnit: 0,
                            },
                          },
                          UpperBound: { DateSpan: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, TimeUnit: 0 } },
                        },
                      },
                    },
                  ],
                  OrderBy: [
                    {
                      Direction: 2,
                      Expression: { Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Count" } }, Function: 0 } },
                    },
                  ],
                },
                Binding: {
                  Primary: { Groupings: [{ Projections: [0, 1] }] },
                  DataReduction: { DataVolume: 4, Primary: { Top: {} } },
                  Aggregates: [{ Select: 1, Aggregations: [{ Max: {} }] }],
                  Version: 1,
                },
                ExecutionMetricsKind: 1,
              },
            },
          ],
        },
        QueryId: "",
        ApplicationContext: {
          DatasetId: "53e73f79-7034-4c9e-a7cf-4f70b21408df",
          Sources: [{ ReportId: "bd4d0ccb-041e-4d1d-aa0a-f450f1422db3", VisualId: "6896c4212e0b03b148e4" }],
        },
      },
    ],
    cancelQueries: [],
    modelId: 3494954,
  };
};

const PcrPositiveSample = {
  version: "1.0.0",
  queries: [
    {
      Query: {
        Commands: [
          {
            SemanticQueryDataShapeCommand: {
              Query: {
                Version: 2,
                From: [{ Name: "w", Entity: "Web - Pozitivne nalezy", Type: 0 }],
                Select: [
                  { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Nazov_okresu" }, Name: "Web - Pozitivne nalezy.Nazov_okresu" },
                  {
                    Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Count" } }, Function: 0 },
                    Name: "Sum(Web - Pozitivne nalezy.Count)",
                  },
                ],
                Where: [
                  {
                    Condition: {
                      Comparison: {
                        ComparisonKind: 2,
                        Left: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Dátum" } },
                        Right: { Literal: { Value: "datetime'2021-09-11T00:00:00'" } },
                      },
                    },
                  },
                  {
                    Condition: {
                      Between: {
                        Expression: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Dátum" } },
                        LowerBound: {
                          DateSpan: {
                            Expression: {
                              DateAdd: {
                                Expression: {
                                  DateAdd: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, Amount: 1, TimeUnit: 0 },
                                },
                                Amount: -3,
                                TimeUnit: 3,
                              },
                            },
                            TimeUnit: 0,
                          },
                        },
                        UpperBound: { DateSpan: { Expression: { DateAdd: { Expression: { Now: {} }, Amount: -1, TimeUnit: 0 } }, TimeUnit: 0 } },
                      },
                    },
                  },
                ],
                OrderBy: [
                  {
                    Direction: 2,
                    Expression: { Aggregation: { Expression: { Column: { Expression: { SourceRef: { Source: "w" } }, Property: "Count" } }, Function: 0 } },
                  },
                ],
              },
              Binding: {
                Primary: { Groupings: [{ Projections: [0, 1] }] },
                DataReduction: { DataVolume: 4, Primary: { Top: {} } },
                Aggregates: [{ Select: 1, Aggregations: [{ Max: {} }] }],
                Version: 1,
              },
              ExecutionMetricsKind: 1,
            },
          },
        ],
      },
      QueryId: "",
      ApplicationContext: {
        DatasetId: "53e73f79-7034-4c9e-a7cf-4f70b21408df",
        Sources: [{ ReportId: "bd4d0ccb-041e-4d1d-aa0a-f450f1422db3", VisualId: "6896c4212e0b03b148e4" }],
      },
    },
  ],
  cancelQueries: [],
  modelId: 3494954,
};

module.exports = {
  PcrPositiveOkresy,
  PcrPositiveSample,
};
