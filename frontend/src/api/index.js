export async function listTransactions(start, end){
  let url = '/api/transactions'
  if (start || end){
    const q = new URLSearchParams()
    if (start) q.set('start', start)
    if (end)   q.set('end', end)
    url += `?${q.toString()}`
  }
  const r = await fetch(url)
  return r.json()
}
export async function createTransaction(payload){ const r=await fetch('/api/transactions',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); if(!r.ok) throw new Error((await r.json()).error||'Falha ao criar'); return r.json() }
export async function updateTransaction(id,payload){ const r=await fetch(`/api/transactions/${id}`,{ method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); return r.json() }
export async function deleteTransaction(id){ const r=await fetch(`/api/transactions/${id}`,{ method:'DELETE' }); return r.json() }
export async function getSummary(){ const r=await fetch('/api/summary'); return r.json() }
export async function listTasks(){ const r=await fetch('/api/tasks'); return r.json() }
export async function createTask(payload){ const r=await fetch('/api/tasks',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); if(!r.ok) throw new Error((await r.json()).error||'Falha ao criar tarefa'); return r.json() }

export async function updateTask(id, patch){
  const r = await fetch('/api/tasks/'+id, { method:'PATCH', headers:{'Content-Type':'application/json'}, body: JSON.stringify(patch) })
  if (!r.ok) throw new Error((await r.json()).error||'Falha ao atualizar tarefa')
  return r.json()
}
export async function deleteTask(id){
  const r = await fetch('/api/tasks/'+id, { method:'DELETE' })
  if (!r.ok) throw new Error((await r.json()).error||'Falha ao excluir tarefa')
  return r.json()
}
