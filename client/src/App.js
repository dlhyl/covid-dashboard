import "./css/main.css";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { ResponsiveContainer, LineChart, Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";
import styled from "styled-components";
import moment from "moment";
import numeral from "numeral";
const numberFormatter = (item) => numeral(item).format("0");
const dateFormatter = (item) => moment(item).format("DD MMM");
const colors = ["#7DB3FF", "#49457B", "#FF7C78"];
const xAxisFormatter = (item) => {
  if (moment(item).isValid()) {
    return dateFormatter(item);
  } else {
    return item;
  }
};

const StyledCard = styled(Card)`
  box-shadow: 0px 2px 4px rgba(141, 149, 166, 0.1);
  border-radius: 10px;
  background: rgb(255 255 255 / 18%);
  padding: 10px 0px;
  .ant-card-head-title {
    color: #fff;
    font-weight: 600;
    font-size: calc(9px + 1.5vmin);
  }
  .ant-card-head {
    border: none;
  }
  .ant-card-body {
    padding-top: 12px;
  }
`;

function getValue(obj, attr) {
  if (obj == null) return null;
  return obj[attr];
}

const formatXAxis = (tickItem) => {
  console.log(tickItem);
  // return tickItem;
  return new Date(tickItem).toISOString().split("T")[0];
};

function App() {
  const [items, setItems] = useState({});
  const [comparisonData, setComparisonData] = useState({});

  useEffect(() => {
    fetch(encodeURI("https://covid.lubomirdlhy.tech/api/"), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setItems(res);
      });

    fetch(encodeURI(`https://covid.lubomirdlhy.tech/api/comparison?interval_past="2 weeks"&interval_future="4 weeks"`), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        setComparisonData(res);
      });
  }, []);

  const rows = [];

  // if (Object.keys(items).length) {
  //   let columns = [];
  //   [items.pcrAgAvg, items.hosp, items.deaths, items.vacc1, items.vacc2].forEach((item, index) => {
  //     if (index && index % 3 === 0) {
  //       rows.push(<Row className="justify-content-between">{columns}</Row>);
  //       columns = [];
  //     }
  //     columns.push(
  //       <Widget
  //         key={index}
  //         valueThisWeek={item.thisW}
  //         valueLastWeek={item.lastW}
  //         desc={item.info}
  //         size={item.size}
  //         lineChartData={item.hasOwnProperty("graph") ? graphs[item.graph] : null}
  //       ></Widget>
  //     );
  //   });
  //   if (columns.length) {
  //     rows.push(<Row className="justify-content-between">{columns}</Row>);
  //   }
  // }

  return (
    <div className="App">
      {/* <Container>{rows}</Container> */}

      {items && (
        <div style={{ width: "100%", height: "100%", marginTop: "1rem", marginBottom: "1rem" }} className="container">
          <Row style={{ justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
            <Col span={11}>
              <StyledCard title={"PCR Ag"} bordered={false} className="widget-card">
                <ResponsiveContainer height={350} width="100%">
                  <LineChart data={items} margin={{}}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#fff" }} tickMargin={10} axisLine={false} tickLine={false} tickFormatter={xAxisFormatter} />
                    <YAxis tick={{ fill: "#fff" }} tickMargin={5} axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
                    <Tooltip labelStyle={{ fontSize: 16, color: "#8884d8", fontWeight: "bold" }} labelFormatter={dateFormatter} formatter={numberFormatter} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ position: "relative" }} />
                    <Line isAnimationActive={false} type="monotone" dataKey="pcr_ag_positive" name="PCR + Ag" stroke="#fec89a" strokeWidth={4} />
                    <Line isAnimationActive={false} type="monotone" dataKey="pcr_positive_today" name="PCR" stroke="#feadfb" strokeWidth={2} />
                    <Line isAnimationActive={false} type="monotone" dataKey="ag_positive_today" name="Ag" stroke="#e8a598" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </StyledCard>
            </Col>
            <Col span={11}>
              <StyledCard title={"Vaccination"} bordered={false} className="widget-card">
                <ResponsiveContainer height={350} width="100%">
                  <LineChart data={items} margin={{}}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#fff" }} tickMargin={10} axisLine={false} tickLine={false} tickFormatter={xAxisFormatter} />
                    <YAxis tick={{ fill: "#fff" }} tickMargin={5} axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
                    <Tooltip labelStyle={{ fontSize: 16, color: "#8884d8", fontWeight: "bold" }} labelFormatter={dateFormatter} formatter={numberFormatter} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ position: "relative" }} />
                    <Line isAnimationActive={false} type="monotone" dataKey="vaccinated1stdose_today" name="1st dose" stroke="#fec89a" strokeWidth={4} />
                    <Line isAnimationActive={false} type="monotone" dataKey="vaccinated2nddose_today" name="2nd dose" stroke="#feadfb" strokeWidth={4} />
                  </LineChart>
                </ResponsiveContainer>
              </StyledCard>
            </Col>
          </Row>
          <Row style={{ justifyContent: "space-between", marginTop: "1rem", marginBottom: "1rem" }}>
            <Col span={11}>
              <StyledCard title={"PCR+Ag 2020 - 2021 Comparison"} bordered={false} className="widget-card">
                <ResponsiveContainer height={350} width="100%">
                  <LineChart data={comparisonData} margin={{}}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#fff" }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#fff" }} tickMargin={5} axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
                    <Tooltip labelStyle={{ fontSize: 16, color: "#8884d8", fontWeight: "bold" }} formatter={numberFormatter} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ position: "relative" }} />
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="y2021_pcr_ag_positive_avg_7d"
                      name="2021 7d AVG"
                      stroke="#fec89a"
                      strokeWidth={4}
                    />
                    <Line isAnimationActive={false} type="monotone" dataKey="y2021_pcr_ag_positive" name="2021" stroke="#fec89a" strokeWidth={1} />
                    <Line
                      isAnimationActive={false}
                      type="monotone"
                      dataKey="y2020_pcr_ag_positive_avg_7d"
                      name="2020 7d AVG"
                      stroke="#feadfb"
                      strokeWidth={4}
                    />
                    <Line isAnimationActive={false} type="monotone" dataKey="y2020_pcr_ag_positive" name="2020" stroke="#feadfb" strokeWidth={1} />
                  </LineChart>
                </ResponsiveContainer>
              </StyledCard>
            </Col>
            <Col span={11}>
              <StyledCard title={"Hospitalizations 2020 - 2021 Comparison"} bordered={false} className="widget-card">
                <ResponsiveContainer height={350} width="100%">
                  <LineChart data={comparisonData} margin={{}}>
                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                    <XAxis dataKey="date" tick={{ fill: "#fff" }} tickMargin={10} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#fff" }} tickMargin={5} axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
                    <Tooltip labelStyle={{ fontSize: 16, color: "#8884d8", fontWeight: "bold" }} formatter={numberFormatter} />
                    <Legend verticalAlign="bottom" align="center" wrapperStyle={{ position: "relative" }} />
                    <Line isAnimationActive={false} type="monotone" dataKey="y2021_hosp" name="2021 sus + conf" stroke="#9381ff" strokeWidth={4} />
                    <Line isAnimationActive={false} type="monotone" dataKey="y2021_hosp_conf" name="2021 conf" stroke="#b8b8ff" strokeWidth={1} dot={false} />

                    <Line isAnimationActive={false} type="monotone" dataKey="y2020_hosp" name="2020 sus + conf" stroke="#8b5e34" strokeWidth={4} />
                    <Line isAnimationActive={false} type="monotone" dataKey="y2020_hosp_conf" name="2020 conf" stroke="#bc8a5f" strokeWidth={1} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </StyledCard>
            </Col>
          </Row>
        </div>
      )}
      <div style={{ height: "20px" }} />
    </div>
  );
}

export default App;
