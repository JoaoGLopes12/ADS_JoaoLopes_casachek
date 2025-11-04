import React from 'react'
export default function ConfirmDialog({ open, title, lines=[], confirmText='Confirmar', onConfirm, onCancel }){
  if(!open) return null
  return (<div className="modal-backdrop"><div className="modal-card">
    <h3>{title}</h3>{lines.map((l,i)=>(<p key={i}>{l}</p>))}
    <div className="modal-actions"><button className="btn btn-cancel" onClick={onCancel}>Cancelar</button>
    <button className="btn btn-primary" onClick={onConfirm}>{confirmText}</button></div>
  </div></div>)
}