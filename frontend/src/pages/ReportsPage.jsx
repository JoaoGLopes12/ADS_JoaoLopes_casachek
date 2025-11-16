import React, { useEffect, useMemo, useRef, useState } from 'react'
import { listTransactions } from '../api/index.js'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const today = () => new Date().toISOString().slice(0,10)
const monthStart = () => { const d = new Date(); d.setDate(1); return d.toISOString().slice(0,10) }

export default function ReportsPage(){
  // === Funções extras para XML e PDF de tarefas ===

  const [range, setRange] = useState({ start: monthStart(), end: today() })
  const [rows, setRows] = useState([])
  const tableRef = useRef(null)

  async function refresh(){
    const data = await listTransactions(range.start, range.end)
    setRows(data)
  }
  useEffect(()=>{ refresh() }, [])

  const totals = useMemo(()=>{
    const inc = rows.filter(r=>r.type==='income').reduce((s,r)=>s+Number(r.amount||0),0)
    const exp = rows.filter(r=>r.type==='expense').reduce((s,r)=>s+Number(r.amount||0),0)
    return { income: inc, expense: exp, balance: inc-exp }
  }, [rows])

  function onChange(k, v){ setRange(prev => ({ ...prev, [k]: v })) }
  async function onFilter(e){ e.preventDefault(); await refresh() }

  function downloadExcel(){
    const data = rows.map(r => ({
      Descrição: r.description,
      Categoria: r.category,
      Tipo: r.type === 'income' ? 'Receita' : 'Despesa',
      Valor: Number(r.amount||0),
      Data: r.date
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Relatório')

    const summary = [['Receitas', totals.income], ['Despesas', totals.expense], ['Saldo', totals.balance]]
    const ws2 = XLSX.utils.aoa_to_sheet([['Resumo'], ...summary])
    XLSX.utils.book_append_sheet(wb, ws2, 'Resumo')
    XLSX.writeFile(wb, `relatorio-financeiro_${range.start}_a_${range.end}.xlsx`)
  }

  async function downloadPDF(){
    const input = tableRef.current
    if (!input) return
    const canvas = await html2canvas(input, { scale: 2 })
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p','mm','a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgProps = { width: pageWidth-20 }
    const ratio = canvas.height / canvas.width
    const imgHeight = imgProps.width * ratio
    pdf.setFontSize(14)
    pdf.text(`Relatório Financeiro (${range.start} a ${range.end})`, 10, 12)
    pdf.addImage(imgData, 'PNG', 10, 18, imgProps.width, Math.min(imgHeight, pageHeight-28))
    pdf.save(`relatorio-financeiro_${range.start}_a_${range.end}.pdf`)
  }

  function escapeXml(s=''){
    return s.replace(/[<>&'"]/g, c => ({'<':'&lt;','>':'&gt;','&':'&amp;','\'':'&apos;','\"':'&quot;'}[c]))
  }

  async function downloadTasksPDF(){
    // Fetch tasks and render a simple PDF list
    try{
      const tasks = await (await fetch('/api/tasks')).json()
      const pdf = new jsPDF()
      pdf.setFontSize(16)
      pdf.text(`Tarefas Agendadas (${new Date().toLocaleDateString()})`, 10, 12)
      pdf.setFontSize(11)
      let y = 20
      if(!tasks.length){
        pdf.text('Sem tarefas cadastradas.', 10, y)
      } else {
        tasks.forEach((t,i)=>{
          const line = `${i+1}. ${t.title} — ${t.datetime} — ${t.email}`
          const split = pdf.splitTextToSize(line, 185)
          split.forEach(seg => { if (y>280){ pdf.addPage(); y=20 } ; pdf.text(seg, 10, y); y += 6 })
        })
      }
      pdf.save('tarefas-agendadas.pdf')
    }catch(e){
      alert('Falha ao gerar PDF de tarefas: '+e.message)
    }
  }


  function downloadCSV(){
    const header = ['descricao','categoria','tipo','valor','data']
    const lines = rows.map(r => [r.description, r.category, r.type, Number(r.amount).toFixed(2), r.date])
    const csv = [header, ...lines].map(cols => cols.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type:'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `relatorio-financeiro_${range.start}_a_${range.end}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div>
      <form className="card" onSubmit={onFilter}>
        <h2>Relatórios</h2>
        <div className="row">
          <input type="date" value={range.start} onChange={e=>onChange('start', e.target.value)} required />
          <input type="date" value={range.end} onChange={e=>onChange('end', e.target.value)} required />
          <button type="submit" className="btn btn-purple">Filtrar</button>
          <button type="button" className="btn" onClick={()=>{ setRange({ start: monthStart(), end: today() }); }}>Mês atual</button>
          <div style={{flex:1}} />
          <button type="button" className="btn btn-edit" onClick={downloadPDF}>Baixar PDF</button>
          <button type="button" className="btn btn-edit" onClick={downloadCSV}>Baixar CSV</button>
          <button type="button" className="btn btn-email" onClick={downloadTasksPDF}>PDF de Tarefas</button>
          <button type="button" className="btn btn-purple" onClick={downloadExcel}>Baixar Excel</button>
        </div>
      </form>

      <div className="space" />
      <div className="card" ref={tableRef}>
        <h2>Gastos e Lucros</h2>
        <div className="row" style={{marginBottom:'.6rem'}}>
          <div className="card" style={{flex:1}}><div className="muted">Receitas</div><div style={{fontWeight:700}}>R$ {totals.income.toFixed(2)}</div></div>
          <div className="card" style={{flex:1}}><div className="muted">Despesas</div><div style={{fontWeight:700}}>R$ {totals.expense.toFixed(2)}</div></div>
          <div className="card" style={{flex:1}}><div className="muted">Saldo</div><div style={{fontWeight:700}}>R$ {totals.balance.toFixed(2)}</div></div>
        </div>
        <table>
          <thead><tr><th>Descrição</th><th>Categoria</th><th>Tipo</th><th>Valor</th><th>Data</th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.description}</td>
                <td>{r.category}</td>
                <td className="muted">{r.type === 'income' ? 'Receita' : 'Despesa'}</td>
                <td>R$ {Number(r.amount).toFixed(2)}</td>
                <td className="muted">{r.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
