
import React, { useEffect, useState } from 'react'
import { listTasks, createTask, updateTask, deleteTask, sendTaskEmailTo } from '../api/index.js'

function TodoItem({ item, onToggle, onDelete, onEdit, onSendEmail }){
  const [editMode, setEditMode] = useState(false)
  const [draft, setDraft] = useState({ title:item.title, datetime:item.datetime })

  const onSave = async () => {
    await onEdit(item.id, draft)
    setEditMode(false)
  }

  return (
    <div className="card" style={{display:'flex', gap:'.75rem', alignItems:'center'}}>
      <input type="checkbox" checked={!!item.completed} onChange={()=>onToggle(item.id, !item.completed)} />
      {!editMode ? (
        <div style={{flex:1}}>
          <div style={{fontWeight:600}}>{item.title}</div>
          <div className="muted" style={{fontSize:'.9rem'}}>{item.datetime}</div>
        </div>
      ) : (
        <div style={{flex:1, display:'flex', gap:'.5rem'}}>
          <input value={draft.title} onChange={e=>setDraft({...draft, title:e.target.value})} placeholder="Título" />
          <input type="datetime-local" value={draft.datetime.replace(' ','T')} onChange={e=>setDraft({...draft, datetime:e.target.value})} />
        </div>
      )}
      {!editMode ? (
        <>
          <button className="btn" onClick={()=>setEditMode(true)}>Editar</button>
          <button className="btn" onClick={()=>onSendEmail(item)}>Enviar por e-mail</button>
          <button className="btn btn-red" onClick={()=>onDelete(item.id)}>Excluir</button>
        </>
      ) : (
        <>
          <button className="btn btn-purple" onClick={onSave}>Salvar</button>
          <button className="btn btn-red" onClick={()=>{ setEditMode(false); setDraft({ title:item.title, datetime:item.datetime }) }}>Cancelar</button>
        </>
      )}
    </div>
  )
}

export default function TasksPage(){
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({ title:'', datetime:'' })
  const [emailDialog, setEmailDialog] = useState({ open:false, id:null, email:'' })

  async function refresh(){ setRows(await listTasks()) }
  useEffect(()=>{ refresh() }, [])

  async function addTask(e){
    e.preventDefault()
    if(!form.title || !form.datetime) return
    await createTask({ title: form.title, email: 'placeholder@local', datetime: form.datetime })
    setForm({ title:'', datetime:'' })
    await refresh()
  }
  async function toggle(id, completed){ await updateTask(id, { completed: completed?1:0 }); await refresh() }
  async function remove(id){ await deleteTask(id); await refresh() }
  async function edit(id, patch){ await updateTask(id, patch); await refresh() }

  function openEmailDialog(item){
    setEmailDialog({ open:true, id:item.id, email:item.email || '' })
  }
  async function confirmEmailSend(){
    try{
      await sendTaskEmailTo(emailDialog.id, emailDialog.email)
      alert('E-mail enviado (verifique configurações SMTP).')
    }catch(e){
      alert('Falha no envio: '+e.message)
    }finally{
      setEmailDialog({ open:false, id:null, email:'' })
    }
  }

  return (
    <div>
      <form className="card" onSubmit={addTask}>
        <h2>Nova tarefa</h2>
        <div style={{display:'flex', gap:'.75rem', flexWrap:'wrap'}}>
          <input placeholder="Tarefa" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} required />
          <input type="datetime-local" value={form.datetime} onChange={e=>setForm({...form, datetime:e.target.value})} required />
          <button className="btn btn-purple" type="submit">Adicionar</button>
          <button className="btn btn-red" type="button" onClick={()=>setForm({ title:'', datetime:'' })}>Cancelar</button>
        </div>
      </form>

      <div className="space" />

      <div style={{display:'grid', gap:'.5rem'}}>
        {rows.map(item => (
          <TodoItem
            key={item.id}
            item={item}
            onToggle={toggle}
            onDelete={remove}
            onEdit={edit}
            onSendEmail={openEmailDialog}
          />
        ))}
        {!rows.length && (<div className="card muted">Sem tarefas ainda. Adicione a primeira acima.</div>)}
      </div>

      {emailDialog.open && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Enviar tarefa por e-mail</h3>
            <input type="email" placeholder="e-mail do destinatário" value={emailDialog.email} onChange={e=>setEmailDialog({...emailDialog, email:e.target.value})} required />
            <div className="row">
              <button className="btn btn-purple" onClick={confirmEmailSend}>Enviar</button>
              <button className="btn btn-red" onClick={()=>setEmailDialog({ open:false, id:null, email:'' })}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
