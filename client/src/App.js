import "./css/main.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import Widget from "./components/Widget";
import "chart.js";

function getValue(obj, attr) {
  if (obj == null) return null;
  return obj[attr];
}

function App() {
  const [items, setItems] = useState({});
  const [graphs, setGraphs] = useState({});

  useEffect(() => {
    fetch("https://covid.lubomirdlhy.tech/api/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        const data = {
          pcrAgAvg: { thisW: res[0].PCR_AG_AVERAGE, lastW: getValue(res[1], "PCR_AG_AVERAGE"), info: "pcr+ag 7d priemer", graph: "PcrAgP", size: 3 },
          hosp: { thisW: res[0].HOSPITALIZED, lastW: getValue(res[1], "HOSPITALIZED"), info: "hospitalizacie", graph: "hosp", size: 3 },
          incidence: {
            thisW: res[0].incidence14d.pcr + "/" + res[0].incidence14d.ag,
            lastW: getValue(getValue(res[1], "incidence14d"), "pcr") + "/" + getValue(getValue(res[1], "incidence14d"), "ag"),
            info: "pcr/ag 14d incidencia",
            size: 3,
          },
          deaths: { thisW: res[0].DEATHS_AVERAGE, lastW: getValue(res[1], "DEATHS_AVERAGE"), info: "umrtia 7d priemer", graph: "deaths", size: 3 },
          vacc1: {
            thisW: getValue(getValue(getValue(res[0], "VACC"), 1), "SUM") + " / " + getValue(getValue(getValue(res[0], "VACC"), 1), "AVG"),
            lastW: getValue(getValue(getValue(res[1], "VACC"), 1), "SUM") + " / " + getValue(getValue(getValue(res[1], "VACC"), 1), "AVG"),
            info: "suma/priemer 7d vakcinacia 1. davka",
            size: 5,
            graph: "vacc1",
          },
          vacc2: {
            thisW: getValue(getValue(getValue(res[0], "VACC"), 2), "SUM") + " / " + getValue(getValue(getValue(res[0], "VACC"), 2), "AVG"),
            lastW: getValue(getValue(getValue(res[1], "VACC"), 2), "SUM") + " / " + getValue(getValue(getValue(res[1], "VACC"), 2), "AVG"),
            info: "suma/priemer 7d vakcinacia 2. davka",
            size: 5,
            graph: "vacc2",
          },
          rawData: res[0].rawData,
          dates: res[0].dates,
        };

        const PcrAgP = res[0].rawData.pcrP.map((item, index) => [res[0].dates[index], item + res[0].rawData.agP[index]]);
        const PcrP = res[0].rawData.pcrP.map((item, index) => [res[0].dates[index], item]);
        const AgP = res[0].rawData.agP.map((item, index) => [res[0].dates[index], item]);
        const hosp = res[0].rawData.hosp.map((item, index) => [res[0].dates[index], item]);
        const deaths = res[0].rawData.deaths.map((item, index) => [res[0].dates[index], item]);
        const vacc1 = res[0].rawData.vacc1.map((item, index) => [res[0].dates[index], item]);
        const vacc2 = res[0].rawData.vacc2.map((item, index) => [res[0].dates[index], item]);

        setItems(data);
        setGraphs({
          PcrAgP: [
            { name: "PCR+Ag", data: PcrAgP, dataset: { borderWidth: 5 } },
            { name: "PCR", data: PcrP },
            { name: "Ag", data: AgP },
          ],
          hosp: hosp,
          deaths: deaths,
          vacc1,
          vacc2,
        });
      });
  }, []);

  const rows = [];

  if (Object.keys(items).length) {
    let columns = [];
    [items.pcrAgAvg, items.hosp, items.deaths, items.vacc1, items.vacc2].forEach((item, index) => {
      if (index && index % 3 === 0) {
        rows.push(<Row className="justify-content-between">{columns}</Row>);
        columns = [];
      }
      columns.push(
        <Widget
          key={index}
          valueThisWeek={item.thisW}
          valueLastWeek={item.lastW}
          desc={item.info}
          size={item.size}
          lineChartData={item.hasOwnProperty("graph") ? graphs[item.graph] : null}
        ></Widget>
      );
    });
    if (columns.length) {
      rows.push(<Row className="justify-content-between">{columns}</Row>);
    }
  }

  return (
    <div className="App">
      <Container>{rows}</Container>
    </div>
  );
}

export default App;
