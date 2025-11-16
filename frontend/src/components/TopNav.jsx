import React from 'react'
export default function TopNav({ current, onSelect }){
  const tabs=[{key:'finance',label:'Financeiro'},{key:'graphs',label:'Gráficos'},{key:'tasks',label:'Tarefas'},{key:'reports',label:'Relatórios'}]
  return (<div className="topnav"><div className="brand">Casa Check</div>
    {tabs.map(t=>(<button key={t.key} className={`tab ${current===t.key?'active':''}`} onClick={()=>onSelect(t.key)}>{t.label}</button>))}
  </div>)
}