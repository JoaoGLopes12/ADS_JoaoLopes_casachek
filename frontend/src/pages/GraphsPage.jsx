import React, { useMemo, useState } from 'react'
import { Chart } from 'react-google-charts'
import MonthlyChart from '../components/MonthlyChart.jsx'
export default function GraphsPage({ byMonth=[], expenseByCategory=[] }){
  const [selected,setSelected]=useState(['line','bar','pie'])
  function toggle(k){ setSelected(p=>p.includes(k)?p.filter(x=>x!==k):[...p,k]) }
  const barData=useMemo(()=>{ const header=['Mês','Despesas','Receitas']; const rows=byMonth.map(m=>[m.ym, Number(m.expenses), Number(m.incomes)]); return [header, ...rows] },[byMonth])
  const pieData=useMemo(()=>{ const header=['Categoria','Valor']; const rows=expenseByCategory.map(c=>[c.category, Number(c.amount)]); return [header, ...rows] },[expenseByCategory])
  return (<div>
    <div className="card" style={{marginBottom:'.75rem'}}><h2>Gráficos</h2>
      <div style={{display:'flex', gap:'.6rem', flexWrap:'wrap'}}>
        <label><input type="checkbox" checked={selected.includes('line')} onChange={()=>toggle('line')} /> Linha (Mensal)</label>
        <label><input type="checkbox" checked={selected.includes('bar')} onChange={()=>toggle('bar')} /> Barras (Mensal)</label>
        <label><input type="checkbox" checked={selected.includes('pie')} onChange={()=>toggle('pie')} /> Pizza (Despesas por Categoria)</label>
      </div>
    </div>
    {selected.includes('line') && <MonthlyChart byMonth={byMonth} />}
    {selected.includes('bar') && (<div className="card" style={{marginTop:'1rem'}}><Chart chartType="Bar" data={barData} width="100%" height="300px" options={{ legend:{position:'top'} }} /></div>)}
    {selected.includes('pie') && (<div className="card" style={{marginTop:'1rem'}}><Chart chartType="PieChart" data={pieData} width="100%" height="300px" options={{ legend:{position:'right'} }} /></div>)}
  </div>)
}