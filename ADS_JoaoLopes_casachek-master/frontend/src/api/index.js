export async function listTransactions(){ const r=await fetch('/api/transactions'); return r.json() }
export async function createTransaction(payload){ const r=await fetch('/api/transactions',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); if(!r.ok) throw new Error((await r.json()).error||'Falha ao criar'); return r.json() }
export async function updateTransaction(id,payload){ const r=await fetch(`/api/transactions/${id}`,{ method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); return r.json() }
export async function deleteTransaction(id){ const r=await fetch(`/api/transactions/${id}`,{ method:'DELETE' }); return r.json() }
export async function getSummary(){ const r=await fetch('/api/summary'); return r.json() }
export async function listTasks(){ const r=await fetch('/api/tasks'); return r.json() }
export async function createTask(payload){ const r=await fetch('/api/tasks',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(payload) }); if(!r.ok) throw new Error((await r.json()).error||'Falha ao criar tarefa'); return r.json() }