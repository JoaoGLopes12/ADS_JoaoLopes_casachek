import React, { useEffect, useMemo, useState } from 'react'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import TaskItem from '../components/TaskItem.jsx'
import TaskEnhancedForm from '../components/TaskEnhancedForm.jsx'
import { listTasks, createTask, updateTask, deleteTask } from '../api/index.js'

export default function TasksPage(){
  const [rows,setRows]=useState([])
  const [confirm,setConfirm]=useState({ open:false, form:null })
  const [filter,setFilter]=useState('all') // all|active|done
  async function refresh(){ setRows(await listTasks()) }
  useEffect(()=>{ refresh() }, [])

  async function onAdd(form){
    setConfirm({ open:true, form })
  }
  async function onConfirm(){
    const form = confirm.form
    await createTask(form)
    setConfirm({ open:false, form:null })
    await refresh()
  }
  function onCancel(){ setConfirm({ open:false, form:null }) }

  async function toggleDone(task){
    await updateTask(task.id, { done: task.done ? 0 : 1 })
    await refresh()
  }
  async function toggleNotify(task){
    await updateTask(task.id, { notify: task.notify ? 0 : 1 })
    await refresh()
  }
  async function remove(task){
    await deleteTask(task.id)
    await refresh()
  }

  const filtered = useMemo(()=>{
    if (filter==='active') return rows.filter(r=>!r.done)
    if (filter==='done') return rows.filter(r=>!!r.done)
    return rows
  }, [rows, filter])

  return (
    <div>
      <TaskEnhancedForm onSubmit={onAdd} />
      <div className="space" />
      <div className="card">
        <div className="row" style={{alignItems:'center'}}>
          <h2 style={{margin:0}}>Tarefas</h2>
          <div className="grow" />
          <select value={filter} onChange={e=>setFilter(e.target.value)}>
            <option value="all">Todas</option>
            <option value="active">Abertas</option>
            <option value="done">Concluídas</option>
          </select>
        </div>
        <div className="list">
          {filtered.map(t=> (
            <TaskItem key={t.id} task={t} onToggleDone={toggleDone} onToggleNotify={toggleNotify} onDelete={remove} />
          ))}
          {filtered.length===0 && <div className="muted">Nenhuma tarefa</div>}
        </div>
      </div>
      <ConfirmDialog open={confirm.open} title="Confirmar tarefa" labelConfirm="Criar" onConfirm={onConfirm} onCancel={onCancel} />
    </div>
  )
}
