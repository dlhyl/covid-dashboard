const axios = require("axios");
const headers = require("./headers");

axios
  .post("https://wabi-west-europe-api.analysis.windows.net/public/reports/querydata?synchronous=true", headers.PcrPositiveOkresy())
  .then((res) => {
    var PcrData = [];
    var date = new Date();
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
