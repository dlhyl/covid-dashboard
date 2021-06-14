import React from "react";
import "../css/main.css";
import { Col } from "react-bootstrap";
import { LineChart } from "react-chartkick";

function Widget(props) {
  return (
    <Col md={props.size} className="widget my-sm-5">
      <div className="textContainer">
        <div className="widget-number">
          {props.hasOwnProperty("valueThisWeek") && props.valueThisWeek !== null ? props.valueThisWeek : "NA"} (
          {props.hasOwnProperty("valueLastWeek") && props.valueLastWeek !== null ? props.valueLastWeek : "NA"})
        </div>
        <p className="widget-info">{props.hasOwnProperty("desc") && props.desc !== null ? props.desc : ""}</p>
      </div>
      {props.hasOwnProperty("lineChartData") && props.lineChartData !== null && (
        <div className="graphContainer">
          <LineChart
            colors={["#fec89a", "#f8edeb", "#e8a598"]}
            data={props.lineChartData}
            height={180}
            min={null}
            legend={false}
            library={{
              labels: {
                fontColor: "white",
              },
              scales: {
                yAxes: [
                  {
                    ticks: { fontColor: "#ccc" },
                    scaleLabel: { fontColor: "#ccc" },
                  },
                ],
                xAxes: [
                  {
                    ticks: { fontColor: "#ccc" },
                  },
                ],
              },
              layout: {
                padding: {
                  left: 0,
                  right: 8,
                  top: 0,
                  bottom: 0,
                },
              },
            }}
          ></LineChart>
        </div>
      )}
    </Col>
  );
}
export default Widget;
