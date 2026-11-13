// Daily aggregate snapshots preserve gate totals without retaining flight records.
function gateSnapshot(flights){
  const gates=new Map();
  for(const source of flights||[]){
    const flight=calculate(source),gate=String(flight.gate||'').trim().toUpperCase()||'Unassigned';
    if(!gates.has(gate))gates.set(gate,{total:0,measured:0,misses:0});
    const counts=gates.get(gate);counts.total++;
    if(flight.metricMet!==null)counts.measured++;
    if(flight.lateOpening)counts.misses++;
  }
  return Object.fromEntries(gates);
}
function syncGateHistory(){
  let changed=false;
  if(!state.gateHistory||typeof state.gateHistory!=='object'){state.gateHistory={};changed=true}
  for(const [date,day] of Object.entries(state.days||{})){
    const snapshot=gateSnapshot(day.flights);
    if(JSON.stringify(state.gateHistory[date])!==JSON.stringify(snapshot)){state.gateHistory[date]=snapshot;changed=true}
  }
  return changed;
}
function gatePerformanceRows(){
  const totals=new Map(),today=iso(new Date());
  for(const [date,gates] of Object.entries(state.gateHistory||{})){
    if(date>today)continue;
    for(const [gate,counts] of Object.entries(gates)){
      if(!totals.has(gate))totals.set(gate,{gate,total:0,measured:0,misses:0,missedDays:0});
      const row=totals.get(gate);
      row.total+=counts.total;row.measured+=counts.measured;row.misses+=counts.misses;
      if(counts.misses>0)row.missedDays++;
    }
  }
  return [...totals.values()].sort((a,b)=>b.misses-a.misses||b.missedDays-a.missedDays||a.gate.localeCompare(b.gate,undefined,{numeric:true}));
}
function renderGatePerformance(){
  const rows=gatePerformanceRows(),dates=Object.keys(state.gateHistory||{}).filter(d=>d<=iso(new Date())).sort();
  const repeated=rows.filter(r=>r.misses>=2&&r.gate!=='Unassigned').length;
  $('gatePerformance').innerHTML=`<div class="section-heading"><div><span class="eyebrow">DOOR INTELLIGENCE</span><h2>Gate Performance</h2><p>Misses by arrival gate, ranked by total misses.</p></div></div><div class="grid metrics"><div class="metric"><span>Total misses</span><strong>${rows.reduce((n,r)=>n+r.misses,0)}</strong></div><div class="metric"><span>Gates with 2+ misses</span><strong>${repeated}</strong></div><div class="metric"><span>Measured flights</span><strong>${rows.reduce((n,r)=>n+r.measured,0)}</strong></div><div class="metric"><span>Report days counted</span><strong>${dates.length}</strong></div></div><div class="card"><p class="hint">${dates.length?'Coverage: '+esc(pretty(dates[0]))+' through '+esc(pretty(dates[dates.length-1]))+'. ':''}Totals cover reports available when this feature is first opened and subsequent uploads, not previously deleted reports. Automatic 14-day cleanup keeps these counts. Manually deleting a report also removes its counts. Re-uploading a date replaces that date’s counts instead of adding duplicates. Unknown aircraft/times are excluded from the miss-rate denominator.</p>${rows.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Gate</th><th>Misses to date</th><th>Days with misses</th><th>Total flights</th><th>Measured flights</th><th>Miss rate</th></tr></thead><tbody>${rows.map(r=>`<tr><td><b>${esc(r.gate)}</b></td><td><span class="pill ${r.misses>=2?'no':r.misses?'warn':'good'}">${r.misses}</span></td><td>${r.missedDays}</td><td>${r.total}</td><td>${r.measured}</td><td>${r.measured?(r.misses/r.measured*100).toFixed(1)+'%':'N/A'}</td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">Upload a report to start tracking gate performance.</div>'}</div>`;
}
function doorMissCount(employee){const n=Number(employee.doorMissCount);return Number.isInteger(n)&&n>=1&&n<=10?n:0}
function doorMissSummaryMarkup(){
  const tracked=employees.filter(e=>doorMissCount(e)>0),repeat=tracked.filter(e=>doorMissCount(e)>=2);
  return `<div class="card"><div class="card-head"><div><h2>Door Miss Tracker</h2><p>Manual profile counts, separate from flight report totals.</p></div><button class="btn light" onclick="switchArea('employees','doorMisses')">Review employees</button></div><div class="pills"><span class="pill">${tracked.length} employees with recorded misses</span><span class="pill ${repeat.length?'no':'good'}">${repeat.length} employees with 2+ misses</span></div></div>`;
}
function renderDoorMisses(){
  const repeatsOnly=$('doorRepeatFilter')?.value!=='all';
  const all=employees.filter(e=>doorMissCount(e)>0),list=all.filter(e=>!repeatsOnly||doorMissCount(e)>=2).sort((a,b)=>doorMissCount(b)-doorMissCount(a)||empName(a).localeCompare(empName(b)));
  $('doorMisses').innerHTML=`<div class="section-heading"><div><span class="eyebrow">EMPLOYEE MANAGEMENT</span><h2>Door Miss Tracker</h2><p>${all.filter(e=>doorMissCount(e)>=2).length} employees with 2+ manually recorded door misses.</p></div></div><div class="card"><div class="filters"><select id="doorRepeatFilter" aria-label="Filter recorded door misses"><option value="repeat" ${repeatsOnly?'selected':''}>Repeat issues (2+)</option><option value="all" ${!repeatsOnly?'selected':''}>All recorded counts (1–10)</option></select></div><p class="hint">Counts are selected in each employee profile, like the ECR counter. They are not automatically calculated from flight assignments. Blank means no count recorded, not a confirmed zero. A miss means longer than 02:30 NB or 03:30 for 777/787 WB.</p>${list.length?`<div class="table-wrap"><table class="table"><thead><tr><th>Employee</th><th>ID</th><th>CSM</th><th>Recorded misses</th><th></th></tr></thead><tbody>${list.map(e=>`<tr><td>${esc(empName(e))}</td><td>${esc(e.id)}</td><td>${esc(e.csm||'—')}</td><td><span class="pill ${doorMissCount(e)>=2?'no':'info'}">${doorMissCount(e)}</span></td><td><button type="button" class="btn light" onclick="editEmployee('${esc(e.id)}')">View / Edit</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty">No employees match this filter.</div>'}</div>`;
  $('doorRepeatFilter').onchange=renderDoorMisses;
}
function importArrival(row){
  const fields=[['Actual arrival',['Actual Arrival Time','Actual Arrival','Actual Arr. Time','Actual Arr.','ATA','Arr. Actual']],['ETA / Actual',['ETA/Actual','ETA/Actual Time','ETA / Actual','ETA/Actual Arrival']],['Arrival',['Arrival Time','Arr. Time','Arr Time','Arrival']],['Estimated arrival',['Estimated Arrival Time','Estimated Arrival','ETA']],['Scheduled arrival',['Sch Arr. Time','Sch Arr Time','Sch. Arr.','Sch Arr.','Scheduled Arrival Time','Scheduled Arrival','STA']]];
  const headerNorm=value=>norm(value).replace(/[^a-z0-9]/g,'');
  for(const [kind,aliases] of fields){
    for(const alias of aliases){
      const key=Object.keys(row).find(k=>headerNorm(k)===headerNorm(alias));
      if(key&&String(row[key]??'').trim())return{arrivalTime:String(row[key]).trim(),arrivalSource:kind};
    }
  }
  return{arrivalTime:'',arrivalSource:''};
}
function arrivalMarkup(flight){return flight.arrivalTime?`${esc(flight.arrivalTime)}<div class="hint">${esc(flight.arrivalSource||'Arrival')}</div>`:'—'}
