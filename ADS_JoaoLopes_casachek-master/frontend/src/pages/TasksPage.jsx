import React, { useEffect, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { listTasks, createTask } from '../api/index.js'
export default function TasksPage(){
  const [rows,setRows]=useState([])
  const [form,setForm]=useState({ title:'', email:'', datetime:'' })
  const [confirmOpen,setConfirmOpen]=useState(false)
  async function refresh(){ setRows(await listTasks()) }
  useEffect(()=>{ refresh() }, [])
  async function onConfirm(){ await createTask(form); setConfirmOpen(false); setForm({ title:'', email:'', datetime:'' }); await refresh() }
  return (<div>
    <form className="card" onSubmit={(e)=>{ e.preventDefault(); setConfirmOpen(true) }}>
      <h2>Nova tarefa</h2>
      <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
      <div className="row">
        <input type="email" placeholder="Seu e-mail" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="datetime-local" value={form.datetime} onChange={e=>setForm({...form, datetime:e.target.value})} required />
        <button type="submit">Adicionar tarefa</button>
      </div>
    </form>
    <div className="space" />
    <div className="card"><h2>Tarefas agendadas</h2>
      <table><thead><tr><th>Título</th><th>E-mail</th><th>Quando</th></tr></thead><tbody>
        {rows.map(r=>(<tr key={r.id}><td>{r.title}</td><td>{r.email}</td><td className="muted">{r.datetime}</td></tr>))}
      </tbody></table>
    </div>
    <ConfirmDialog open={confirmOpen} title="Confirmar tarefa" lines={[`Título: ${form.title}`,`E-mail: ${form.email}`,`Quando: ${form.datetime}`]} confirmText="Salvar e agendar" onConfirm={onConfirm} onCancel={()=>setConfirmOpen(false)} />
  </div>)
}