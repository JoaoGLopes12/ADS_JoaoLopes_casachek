import React, { useEffect, useState } from 'react'
import TopNav from '../components/TopNav.jsx'
import TransactionForm from '../components/TransactionForm.jsx'
import TransactionTable from '../components/TransactionTable.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import SummaryCards from '../components/SummaryCards.jsx'
import GraphsPage from './GraphsPage.jsx'
import TasksPage from './TasksPage.jsx'
import { listTransactions, createTransaction, deleteTransaction, getSummary, updateTransaction } from '../api/index.js'
export default function App(){
  const [tab,setTab]=useState('finance')
  const [confirm,setConfirm]=useState({ open:false, title:'', lines:[], onConfirm:null })
  const [editing,setEditing]=useState(null)
  const [rows,setRows]=useState([])
  const [summary,setSummary]=useState({ totals:[], byMonth:[], expenseByCategory:[] })
  async function refresh(){ const [r,s]=await Promise.all([listTransactions(), getSummary()]); setRows(r); setSummary(s) }
  useEffect(()=>{ refresh() }, [])
  async function onAdd(payload){ await createTransaction(payload); await refresh() }
  function onEdit(row){ setEditing({ ...row }) }
  async function onSaveEdit(){
    if(!editing) return
    setConfirm({ open:true, title:'Confirmar edição', lines:[`Descrição: ${editing.description}`,`Categoria: ${editing.category}`,`Tipo: ${editing.type==='income'?'Receita':'Despesa'}`,`Valor: R$ ${Number(editing.amount).toFixed(2)}`,`Data: ${editing.date}`], onConfirm: async()=>{ await updateTransaction(editing.id,{ description:editing.description, category:editing.category, type:editing.type, amount:Number(editing.amount), date:editing.date }); setEditing(null); setConfirm({open:false}); await refresh() } })
  }
  async function onDelete(id){ setConfirm({ open:true, title:'Confirmar exclusão', lines:['Tem certeza que deseja excluir este movimento?'], onConfirm: async()=>{ await deleteTransaction(id); setConfirm({open:false}); await refresh() } }) }
  return (<div>
    <TopNav current={tab} onSelect={setTab} />
    <div className="container">
      {tab==='finance' && (<><SummaryCards totals={summary.totals} /><TransactionForm onAdd={onAdd} /><div className="space" /><TransactionTable rows={rows} onEdit={onEdit} onDelete={onDelete} /></>)}
      {tab==='graphs' && (<GraphsPage byMonth={summary.byMonth} expenseByCategory={summary.expenseByCategory} />)}
      {tab==='tasks' && (<TasksPage />)}
    </div>
    {editing && (<div className="modal-backdrop"><div className="modal-card"><h3>Editar movimento</h3><div className="row" style={{marginBottom:'.5rem'}}>
      <input placeholder="Descrição" value={editing.description} onChange={e=>setEditing({...editing, description:e.target.value})} required />
      <select value={editing.type} onChange={e=>setEditing({...editing, type:e.target.value})}><option value="expense">Despesa</option><option value="income">Receita</option></select>
      <input type="number" step="0.01" placeholder="Valor" value={editing.amount} onChange={e=>setEditing({...editing, amount:e.target.value})} required />
      <input type="date" value={editing.date} onChange={e=>setEditing({...editing, date:e.target.value})} required />
      <button onClick={onSaveEdit} className="btn btn-primary">Salvar</button>
      <button onClick={()=>setEditing(null)} className="btn">Cancelar</button>
    </div></div></div>)}
    <ConfirmDialog open={confirm.open} title={confirm.title} lines={confirm.lines} onConfirm={confirm.onConfirm} onCancel={()=>setConfirm({ open:false })} />
  </div>)
}