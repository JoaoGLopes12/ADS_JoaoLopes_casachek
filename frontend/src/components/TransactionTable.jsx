import React from 'react'
export default function TransactionTable({ rows=[], onEdit, onDelete }){
  return (<div className="card"><h2>Movimentos</h2><table>
    <thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Data</th><th></th></tr></thead>
    <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.description}</td><td>{r.category}</td><td className="muted">{r.type==='income'?'Receita':'Despesa'}</td><td>R$ {Number(r.amount).toFixed(2)}</td><td className="muted">{r.date}</td><td style={{textAlign:'right', display:'flex', gap:'.4rem', justifyContent:'flex-end'}}><button onClick={()=>onEdit(r)} className="btn btn-edit" style={{padding:'.5rem .8rem', fontSize:'.9rem'}}>Editar</button><button onClick={()=>onDelete(r.id)} className="btn btn-red" style={{padding:'.5rem .8rem', fontSize:'.9rem'}}>Excluir</button></td></tr>))}</tbody>
  </table></div>)
}