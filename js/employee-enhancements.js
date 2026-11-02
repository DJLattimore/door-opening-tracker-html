// One-time, simultaneous team reassignment; profile markers travel with cloud data.
const CSM_TEAM_UPDATE='ord-csm-2026-10-27';
const CSM_TEAM_TRANSFERS={'Alyse Clayton':'Andres Fagundez','Andres Fagundez':'Josh Juhl','Josh Juhl':'Prince Oswal'};
function migrateEmployeeEnhancements(){
  let changed=false;
  employees=employees.map(employee=>{
    if(employee.csmTeamUpdate===CSM_TEAM_UPDATE)return employee;
    const original=fullCsmName(employee.csm);
    changed=true;
    return {...employee,csm:CSM_TEAM_TRANSFERS[original]||original,csmTeamUpdate:CSM_TEAM_UPDATE};
  });
  return changed;
}
const UNIFORM_FIELDS={type:'uniformType',workArea:'uniformWorkArea',verbalIssued:'uniformVerbalIssued',verbalDate:'uniformVerbalDate',documentedIssued:'uniformDocumentedIssued',documentedDate:'uniformDocumentedDate',ecrNumber:'uniformEcrNumber',ecrDateIssued:'uniformEcrDate',followUpDate:'uniformFollowUpDate',status:'uniformStatus',notes:'uniformNotes'};
function updateProbationVisibility(){
  const enabled=$('employeeNewHire').value==='Yes';
  $('probationExpiryField').hidden=!enabled;
  $('employeeProbationExpiry').disabled=!enabled;
}
function fillEmployeeEnhancements(employee){
  $('employeeNewHire').value=employee.newHire==='Yes'?'Yes':'No';
  $('employeeProbationExpiry').value=employee.probationExpiry||'';
  $('employeeNewHire').onchange=updateProbationVisibility;
  updateProbationVisibility();
  for(const [key,id] of Object.entries(UNIFORM_FIELDS))$(id).value=employee.uniformConversation?.[key]||'';
}
function readEmployeeEnhancements(existing={}){
  const uniformConversation={...existing.uniformConversation};
  for(const [key,id] of Object.entries(UNIFORM_FIELDS))uniformConversation[key]=$(id).value.trim();
  return {newHire:$('employeeNewHire').value,probationExpiry:$('employeeNewHire').value==='Yes'?$('employeeProbationExpiry').value:(existing.probationExpiry||''),uniformConversation,csmTeamUpdate:CSM_TEAM_UPDATE};
}
