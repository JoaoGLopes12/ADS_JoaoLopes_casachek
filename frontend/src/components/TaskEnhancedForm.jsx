
import React, { useState } from 'react'

export default function TaskEnhancedForm({ onSubmit }){
  const [form,setForm] = useState({ title:'', email:'', datetime:'', notify:true })
  function submit(e){
    e.preventDefault()
    onSubmit(form)
    setForm({ title:'', email:'', datetime:'', notify:true })
  }
  return (
    <form className="card" onSubmit={submit}>
      <h2>Nova tarefa</h2>
      <input placeholder="Título" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
      <div className="row">
        <input type="email" placeholder="Seu e-mail" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} required />
        <input type="datetime-local" value={form.datetime} onChange={e=>setForm({...form, datetime:e.target.value})} required />
      </div>
      <label className="row" style={{alignItems:'center', gap:8}}>
        <input type="checkbox" checked={form.notify} onChange={e=>setForm({...form, notify:e.target.checked})} />
        <span>Enviar e-mail no horário</span>
      </label>
      <div className="row">
        <button type="submit">Adicionar tarefa</button>
      </div>
    </form>
  )
}
