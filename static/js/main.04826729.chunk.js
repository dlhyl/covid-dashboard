(this.webpackJsonpcovid=this.webpackJsonpcovid||[]).push([[0],{264:function(t,e,a){},265:function(t,e,a){},469:function(t,e,a){"use strict";a.r(e);var i,o=a(0),n=a(33),c=a.n(n),s=(a(264),a(27)),r=a(214),d=(a(265),a(266),a(479)),j=a(91),l=a(39),b=a(473),f=a(474),h=a(478),m=a(249),y=a(250),k=a(107),x=a(104),p=a(252),O=a(216),g=a(157),v=a.n(g),_=a(215),u=a.n(_),A=a(3),W=function(t){return u()(t).format("0")},w=function(t){return v()(t).format("DD MMM")},K=function(t){return v()(t).isValid()?w(t):t},L=Object(O.a)(d.a)(i||(i=Object(r.a)(["\n  box-shadow: 0px 2px 4px rgba(141, 149, 166, 0.1);\n  border-radius: 10px;\n  background: rgb(255 255 255 / 18%);\n  padding: 10px 0px;\n  .ant-card-head-title {\n    color: #fff;\n    font-weight: 600;\n    font-size: calc(9px + 1.5vmin);\n  }\n  .ant-card-head {\n    border: none;\n  }\n  .ant-card-body {\n    padding-top: 12px;\n  }\n"])));var S=function(t,e){var a=e.color,i=e.payload;return Object(A.jsx)("span",{style:{color:a,fontWeight:150*i.strokeWidth},children:t})};var D=function(){var t=Object(o.useState)({}),e=Object(s.a)(t,2),a=e[0],i=e[1],n=Object(o.useState)({}),c=Object(s.a)(n,2),r=c[0],d=c[1];return Object(o.useEffect)((function(){fetch("https://covid.lubomirdlhy.tech/api/",{method:"GET",headers:{"Content-Type":"application/json"}}).then((function(t){return t.json()})).then((function(t){i(t)})),fetch('https://covid.lubomirdlhy.tech/api/comparison?interval_past="2 weeks"&interval_future="4 weeks"',{method:"GET",headers:{"Content-Type":"application/json"}}).then((function(t){return t.json()})).then((function(t){var e={};t.forEach((function(t){Object.keys(t).filter((function(t){return["deaths_today","vaccinated1stdose_today","vaccinated2nddose_today"].some((function(e){return t.includes(e)}))})).forEach((function(a){e.hasOwnProperty(a)?e[a]+=t[a]:e[a]=t[a],t[a+"_sum"]=e[a]}))})),d(t)}))}),[]),Object(A.jsx)("div",{className:"App",children:a&&Object(A.jsxs)("div",{style:{width:"100%",height:"100%",marginTop:"1rem",marginBottom:"1rem"},className:"container",children:[Object(A.jsxs)(j.a,{gutter:[16,16],children:[Object(A.jsx)(l.a,{children:Object(A.jsx)(L,{title:"Positive Daily",bordered:!1,className:"widget-card",children:Object(A.jsx)(b.a,{height:350,width:"100%",children:Object(A.jsxs)(f.a,{data:a,children:[Object(A.jsx)(h.a,{stroke:"#ccc",strokeDasharray:"5 5",vertical:!1}),Object(A.jsx)(m.a,{dataKey:"date",tick:{fill:"#fff"},tickMargin:10,axisLine:!1,tickLine:!1,tickFormatter:K}),Object(A.jsx)(y.a,{tick:{fill:"#fff"},tickMargin:5,axisLine:!1,tickLine:!1,tickFormatter:W}),Object(A.jsx)(k.a,{labelStyle:{fontSize:16,color:"#8884d8",fontWeight:"bold"},labelFormatter:w,formatter:W}),Object(A.jsx)(x.a,{verticalAlign:"bottom",align:"center",wrapperStyle:{position:"relative"},formatter:S}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"pcr_ag_positive",name:"PCR + Ag",stroke:"#9d4edd",strokeWidth:5}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"pcr_positive_today",name:"PCR",stroke:"#90e0ef",strokeWidth:1,strokeDasharray:"5 3"}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"ag_positive_today",name:"Ag",stroke:"#e5383b",strokeWidth:1,strokeDasharray:"5 3"})]})})})}),Object(A.jsx)(l.a,{children:Object(A.jsx)(L,{title:"Tests Daily",bordered:!1,className:"widget-card",children:Object(A.jsx)(b.a,{height:350,width:"100%",children:Object(A.jsxs)(f.a,{data:a,children:[Object(A.jsx)(h.a,{stroke:"#ccc",strokeDasharray:"5 5",vertical:!1}),Object(A.jsx)(m.a,{dataKey:"date",tick:{fill:"#fff"},tickMargin:10,axisLine:!1,tickLine:!1,tickFormatter:K}),Object(A.jsx)(y.a,{tick:{fill:"#fff"},tickMargin:5,axisLine:!1,tickLine:!1,tickFormatter:W}),Object(A.jsx)(k.a,{labelStyle:{fontSize:16,color:"#8884d8",fontWeight:"bold"},labelFormatter:w,formatter:W}),Object(A.jsx)(x.a,{verticalAlign:"bottom",align:"center",wrapperStyle:{position:"relative"},formatter:S}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"pcr_ag_tests",name:"PCR+Ag",stroke:"#9d4edd",strokeWidth:5}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"pcr_tests_today",name:"PCR",stroke:"#90e0ef",strokeWidth:1,strokeDasharray:"5 3"}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"ag_tests_today",name:"Ag",stroke:"#e5383b",strokeWidth:1,strokeDasharray:"5 3"})]})})})})]}),Object(A.jsxs)(j.a,{gutter:[16,16],children:[Object(A.jsx)(l.a,{children:Object(A.jsx)(L,{title:"PCR+Ag 2020 - 2021 Comparison",bordered:!1,className:"widget-card",children:Object(A.jsx)(b.a,{height:350,width:"100%",children:Object(A.jsxs)(f.a,{data:r,children:[Object(A.jsx)(h.a,{stroke:"#ccc",strokeDasharray:"5 5",vertical:!1}),Object(A.jsx)(m.a,{dataKey:"date",tick:{fill:"#fff"},tickMargin:10,axisLine:!1,tickLine:!1}),Object(A.jsx)(y.a,{tick:{fill:"#fff"},tickMargin:5,axisLine:!1,tickLine:!1,tickFormatter:W}),Object(A.jsx)(k.a,{labelStyle:{fontSize:16,color:"#8884d8",fontWeight:"bold"},formatter:W}),Object(A.jsx)(x.a,{verticalAlign:"bottom",align:"center",wrapperStyle:{position:"relative"}}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_pcr_ag_positive_avg_7d",name:"2021 7d AVG",stroke:"#fec89a",strokeWidth:4}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_pcr_ag_positive",name:"2021",stroke:"#fec89a",strokeWidth:1}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_pcr_ag_positive_avg_7d",name:"2020 7d AVG",stroke:"#feadfb",strokeWidth:4}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_pcr_ag_positive",name:"2020",stroke:"#feadfb",strokeWidth:1})]})})})}),Object(A.jsx)(l.a,{children:Object(A.jsx)(L,{title:"Hospitalizations 2020 - 2021 Comparison",bordered:!1,className:"widget-card",children:Object(A.jsx)(b.a,{height:350,width:"100%",children:Object(A.jsxs)(f.a,{data:r,children:[Object(A.jsx)(h.a,{stroke:"#ccc",strokeDasharray:"5 5",vertical:!1}),Object(A.jsx)(m.a,{dataKey:"date",tick:{fill:"#fff"},tickMargin:10,axisLine:!1,tickLine:!1}),Object(A.jsx)(y.a,{tick:{fill:"#fff"},tickMargin:5,axisLine:!1,tickLine:!1,tickFormatter:W}),Object(A.jsx)(k.a,{labelStyle:{fontSize:16,color:"#8884d8",fontWeight:"bold"},formatter:W}),Object(A.jsx)(x.a,{verticalAlign:"bottom",align:"center",wrapperStyle:{position:"relative"}}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_hosp",name:"2021 sus + conf",stroke:"#9381ff",strokeWidth:4}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_hosp_conf",name:"2021 conf",stroke:"#b8b8ff",strokeWidth:1,dot:!1}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_hosp",name:"2020 sus + conf",stroke:"#8b5e34",strokeWidth:4}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_hosp_conf",name:"2020 conf",stroke:"#bc8a5f",strokeWidth:1,dot:!1})]})})})})]}),Object(A.jsxs)(j.a,{gutter:[16,16],children:[Object(A.jsx)(l.a,{children:Object(A.jsx)(L,{title:"Deaths 2020 - 2021 Comparison",bordered:!1,className:"widget-card",children:Object(A.jsx)(b.a,{height:350,width:"100%",children:Object(A.jsxs)(f.a,{data:r,children:[Object(A.jsx)(h.a,{stroke:"#ccc",strokeDasharray:"5 5",vertical:!1}),Object(A.jsx)(m.a,{dataKey:"date",tick:{fill:"#fff"},tickMargin:10,axisLine:!1,tickLine:!1}),Object(A.jsx)(y.a,{tick:{fill:"#fff"},tickMargin:5,axisLine:!1,tickLine:!1,tickFormatter:W}),Object(A.jsx)(k.a,{labelStyle:{fontSize:16,color:"#8884d8",fontWeight:"bold"},formatter:W}),Object(A.jsx)(x.a,{verticalAlign:"bottom",align:"center",wrapperStyle:{position:"relative"}}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_deaths_today_sum",name:"2021",stroke:"#fec89a",strokeWidth:5,dot:!1}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_deaths_today_sum",name:"2020",stroke:"#feadfb",strokeWidth:5,dot:!1})]})})})}),Object(A.jsx)(l.a,{children:Object(A.jsx)(L,{title:"Vaccinations 2020 - 2021 Comparison",bordered:!1,className:"widget-card",children:Object(A.jsx)(b.a,{height:350,width:"100%",children:Object(A.jsxs)(f.a,{data:r,margin:{},children:[Object(A.jsx)(h.a,{stroke:"#ccc",strokeDasharray:"5 5",vertical:!1}),Object(A.jsx)(m.a,{dataKey:"date",tick:{fill:"#fff"},tickMargin:10,axisLine:!1,tickLine:!1}),Object(A.jsx)(y.a,{tick:{fill:"#fff"},tickMargin:5,axisLine:!1,tickLine:!1,tickFormatter:W}),Object(A.jsx)(k.a,{labelStyle:{fontSize:16,color:"#8884d8",fontWeight:"bold"},formatter:W}),Object(A.jsx)(x.a,{verticalAlign:"bottom",align:"center",wrapperStyle:{position:"relative"}}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_vaccinated1stdose_today_sum",name:"2021 1st dose",stroke:"#9381ff",strokeWidth:5,dot:!1}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_vaccinated1stdose_today_sum",name:"2020 1st dose",stroke:"#8b5e34",strokeWidth:5,dot:!1}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2021_vaccinated2nddose_today_sum",name:"2021 2nd dose",stroke:"#fec89a",strokeWidth:5,dot:!1}),Object(A.jsx)(p.a,{isAnimationActive:!1,type:"monotone",dataKey:"y2020_vaccinated2nddose_today_sum",name:"2020 2nd dose",stroke:"#feadfb",strokeWidth:5,dot:!1})]})})})})]})]})})},M=function(t){t&&t instanceof Function&&a.e(3).then(a.bind(null,482)).then((function(e){var a=e.getCLS,i=e.getFID,o=e.getFCP,n=e.getLCP,c=e.getTTFB;a(t),i(t),o(t),n(t),c(t)}))};c.a.render(Object(A.jsx)(D,{}),document.getElementById("root")),M()}},[[469,1,2]]]);
//# sourceMappingURL=main.04826729.chunk.js.map