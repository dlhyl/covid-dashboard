import styled from "styled-components";
import { Card } from "antd";
import { ResponsiveContainer, LineChart, Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts";

const numberFormatter = (item) => numeral(item).format("0");
const dateFormatter = (item) => moment(item).format("DD MMM");
const xAxisFormatter = (item) => {
  if (moment(item).isValid()) {
    return dateFormatter(item);
  } else {
    return item;
  }
};
function getValue(obj, attr) {
  if (obj == null) return null;
  return obj[attr];
}

const renderColorfulLegendText = (value, entry) => {
  const { color, payload } = entry;
  console.log(entry);
  return <span style={{ color, fontWeight: payload.strokeWidth * 150 }}>{value}</span>;
};

export default function GraphCard(props) {
  return (
    <StyledCard title={props.title} bordered={false} className="widget-card">
      <ResponsiveContainer height={350} width="100%">
        <LineChart data={props.data}>
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
          <XAxis dataKey="date" tick={{ fill: "#fff" }} tickMargin={10} axisLine={false} tickLine={false} tickFormatter={xAxisFormatter} />
          <YAxis tick={{ fill: "#fff" }} tickMargin={5} axisLine={false} tickLine={false} tickFormatter={numberFormatter} />
          <Tooltip labelStyle={{ fontSize: 16, color: "#8884d8", fontWeight: "bold" }} labelFormatter={dateFormatter} formatter={numberFormatter} />
          <Legend verticalAlign="bottom" align="center" wrapperStyle={{ position: "relative" }} formatter={renderColorfulLegendText} />
          {props.lines.map((line) => (
            <Line isAnimationActive={false} type="monotone" dataKey={line.dataKey} name={line.title} stroke={line.color} strokeWidth={line.width} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </StyledCard>
  );
}
