import React, { useMemo } from 'react'
export default function SummaryCards({ totals=[] }){
  const income=useMemo(()=>Number((totals.find(t=>t.type==='income')?.total)||0),[totals])
  const expense=useMemo(()=>Number((totals.find(t=>t.type==='expense')?.total)||0),[totals])
  const balance=income-expense
  return (<div className="row" style={{marginBottom:'.75rem'}}>
    <div className="card" style={{flex:1}}><div className="muted">Receitas</div><div style={{fontWeight:700,fontSize:'1.2rem'}}>R$ {income.toFixed(2)}</div></div>
    <div className="card" style={{flex:1}}><div className="muted">Despesas</div><div style={{fontWeight:700,fontSize:'1.2rem'}}>R$ {expense.toFixed(2)}</div></div>
    <div className="card" style={{flex:1}}><div className="muted">Saldo</div><div style={{fontWeight:700,fontSize:'1.2rem'}}>R$ {balance.toFixed(2)}</div></div>
  </div>)
}