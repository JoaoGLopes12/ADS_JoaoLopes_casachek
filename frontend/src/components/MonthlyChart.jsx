import React, { useMemo } from 'react'
import { Chart } from 'react-google-charts'
export default function MonthlyChart({ byMonth=[] }){
  const data=useMemo(()=>{ const header=['Mês','Receitas','Despesas']; const rows=byMonth.map(r=>[r.ym, Number(r.incomes), Number(r.expenses)]); return [header, ...rows] },[byMonth])
  // Colors: Receitas = blue, Despesas = red
  const options={
    legend:{position:'bottom'},
    backgroundColor:'transparent',
    chartArea:{width:'90%', height:'70%'},
    colors: ['#1d4ed8', '#dc2626']
  }
  return (<div className="card"><h2>Evolução mensal</h2><Chart chartType="LineChart" data={data} options={options} width="100%" height="300px" /></div>)
}