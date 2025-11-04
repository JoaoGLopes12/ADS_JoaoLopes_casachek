
import React from 'react'

export default function TaskItem({ task, onToggleDone, onToggleNotify, onDelete }){
  return (
    <div className="task-row">
      <label className="checkbox">
        <input type="checkbox" checked={!!task.done} onChange={()=>onToggleDone(task)} />
        <span className={task.done ? 'muted line' : ''}>{task.title}</span>
      </label>
      <div className="grow" />
      <div className="muted small">{new Date(task.datetime).toLocaleString()}</div>
      <label className="notify">
        <input type="checkbox" checked={!!task.notify} onChange={()=>onToggleNotify(task)} />
        <span>email</span>
      </label>
      <button className="link danger" onClick={()=>onDelete(task)}>Excluir</button>
    </div>
  )
}
