import React, { useState } from 'react'
import ConfirmDialog from './ConfirmDialog.jsx'
const today = () => new Date().toISOString().slice(0,10)
const CATEGORIES=['Renda','Moradia','Alimentação','Vestuário','Hobbys','Filhos','Estudos','Saúde','Transporte','Lazer','Contas','Impostos','Pets','Viagem','Doações','Outros']
export default function TransactionForm({ onAdd }){
  const [confirm,setConfirm]=useState(false)
  const [form,setForm]=useState({ description:'', category:'', type:'expense', amount:'', date:today() })
  function upd(k,v){ setForm(p=>({ ...p, [k]:v })) }
  async function submit(e){ e.preventDefault(); setConfirm({ ...form, amount:Number(form.amount) }) }
  return (<form className="card" onSubmit={submit}>
    <h2>Lançar movimento</h2>
    <div className="grid">
      <input placeholder="Descrição" value={form.description} onChange={e=>upd('description', e.target.value)} required />
      <select value={form.category} onChange={e=>upd('category', e.target.value)} required>
        <option value="">Selecione a categoria</option>
        {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
      </select>
      <div className="row">
        <select value={form.type} onChange={e=>upd('type', e.target.value)}><option value="expense">Despesa</option><option value="income">Receita</option></select>
        <input type="number" step="0.01" placeholder="Valor" value={form.amount} onChange={e=>upd('amount', e.target.value)} required />
        <input type="date" value={form.date} onChange={e=>upd('date', e.target.value)} required />
        <button type="submit">Adicionar</button>
      </div>
    </div>
    {confirm && (<ConfirmDialog open={!!confirm} title="Confirmar lançamento" lines={[`Descrição: ${confirm.description}`,`Categoria: ${confirm.category}`,`Tipo: ${confirm.type==='income'?'Receita':'Despesa'}`,`Valor: R$ ${Number(confirm.amount).toFixed(2)}`,`Data: ${confirm.date}`]} confirmText="Salvar" onConfirm={async()=>{ await onAdd(confirm); setConfirm(false); setForm({ description:'', category:'', type:'expense', amount:'', date:today() }) }} onCancel={()=>setConfirm(false)} />)}
  </form>)
}