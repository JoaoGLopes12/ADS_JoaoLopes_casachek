import React from 'react'
export default function TransactionTable({ rows=[], onEdit, onDelete }){
  return (<div className="card"><h2>Movimentos</h2><table>
    <thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Data</th><th></th></tr></thead>
    <tbody>{rows.map(r=>(<tr key={r.id}><td>{r.description}</td><td>{r.category}</td><td className="muted">{r.type==='income'?'Receita':'Despesa'}</td><td>R$ {Number(r.amount).toFixed(2)}</td><td className="muted">{r.date}</td><td style={{textAlign:'right'}}><button onClick={()=>onEdit(r)} style={{background:'#818cf8', borderColor:'#818cf8', marginRight:'.35rem'}}>Editar</button><button onClick={()=>onDelete(r.id)} className="btn-danger" style={{padding:'.4rem .65rem'}}>Excluir</button></td></tr>))}</tbody>
  </table></div>)
}