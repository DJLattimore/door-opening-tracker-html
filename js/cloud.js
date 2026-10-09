const Cloud=(()=>{
  const URL='https://wzwvwjxrhaqnpzyltbuo.supabase.co';
  const KEY='sb_publishable_D9ucdRmT698CFm7Ev4UZmg_tpUMX61p';
  const SESSION_KEY='ord_door_ops_supabase_session_v1';
  let session=null,lastUpdated='',saveTimer=null,getData=null,applyData=null,pollTimer=null;
  const el=id=>document.getElementById(id);
  function status(text,type=''){const node=el('syncStatus');if(!node)return;node.textContent=text;node.className=`sync-status ${type}`}
  function sessionFromStorage(){try{return JSON.parse(localStorage.getItem(SESSION_KEY)||'null')}catch{return null}}
  function saveSession(value){session=value;if(value)localStorage.setItem(SESSION_KEY,JSON.stringify(value));else localStorage.removeItem(SESSION_KEY)}
  async function request(path,{method='GET',body,authenticated=true,headers={}}={}){
    const token=authenticated?session?.access_token:KEY;
    const response=await fetch(`${URL}${path}`,{method,headers:{apikey:KEY,Authorization:`Bearer ${token||KEY}`,'Content-Type':'application/json',...headers},body:body===undefined?undefined:JSON.stringify(body)});
    const text=await response.text();let data=null;try{data=text?JSON.parse(text):null}catch{data=text}
    if(!response.ok){const message=data?.msg||data?.message||data?.error_description||data?.hint||`Request failed (${response.status})`;const error=new Error(message);error.status=response.status;error.details=data;throw error}
    return data;
  }
  async function refresh(){if(!session?.refresh_token)return false;try{const next=await request('/auth/v1/token?grant_type=refresh_token',{method:'POST',authenticated:false,body:{refresh_token:session.refresh_token}});saveSession(next);return true}catch{saveSession(null);return false}}
  async function ensureSession(){session=sessionFromStorage();if(!session)return false;const expires=(session.expires_at||0)*1000;if(expires>Date.now()+60e3)return true;return refresh()}
  async function signIn(email,password){const data=await request('/auth/v1/token?grant_type=password',{method:'POST',authenticated:false,body:{email,password}});saveSession(data);return data}
  async function signUp(email,password){const redirect=encodeURIComponent(`${location.origin}${location.pathname}`);return request(`/auth/v1/signup?redirect_to=${redirect}`,{method:'POST',authenticated:false,body:{email,password}})}
  function showLogin(message=''){el('authGate')?.classList.add('show');if(el('loginError'))el('loginError').textContent=message;status('Sign in required','error')}
  function hideLogin(){el('authGate')?.classList.remove('show');if(el('loginError'))el('loginError').textContent=''}
  async function load(){if(!session)return null;status('Syncing…');const rows=await request('/rest/v1/app_state?id=eq.shared&select=data,updated_at');if(!rows?.length){status('Ready');return null}lastUpdated=rows[0].updated_at||'';status('Saved','saved');return rows[0].data}
  async function save(payload){if(!session)return;status('Saving…');const updatedAt=new Date().toISOString();const rows=await request('/rest/v1/app_state?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:[{id:'shared',data:payload,updated_at:updatedAt}]});lastUpdated=rows?.[0]?.updated_at||updatedAt;status('Saved','saved')}
  function queueSave(getter=getData){if(!session||!getter)return;clearTimeout(saveTimer);saveTimer=setTimeout(async()=>{try{await save(getter())}catch(error){console.error(error);status('Sync failed','error');if(error.status===401)showLogin('Your session expired. Please sign in again.')}},700)}
  async function pull(force=false){if(!session)return;try{status('Syncing…');const rows=await request('/rest/v1/app_state?id=eq.shared&select=data,updated_at');if(!rows?.length){await save(getData());return}const remoteTime=rows[0].updated_at||'';if(force||!lastUpdated||remoteTime>lastUpdated){lastUpdated=remoteTime;applyData(rows[0].data)}status('Saved','saved')}catch(error){console.error(error);status('Sync failed','error')}}
  async function init(options){
    getData=options.getData;applyData=options.applyData;
    const setMode=mode=>{const login=mode==='login';el('loginForm').hidden=!login;el('signupForm').hidden=login;el('loginModeBtn').classList.toggle('active',login);el('signupModeBtn').classList.toggle('active',!login);el('loginError').textContent='';el('signupError').textContent='';el('signupSuccess').textContent=''};
    el('loginModeBtn').onclick=()=>setMode('login');el('signupModeBtn').onclick=()=>setMode('signup');
    el('loginForm').addEventListener('submit',async event=>{event.preventDefault();const button=event.submitter;button.disabled=true;el('loginError').textContent='';try{await signIn(el('loginEmail').value.trim().toLowerCase(),el('loginPassword').value);location.reload()}catch(error){el('loginError').textContent=error.message;button.disabled=false}});
    el('signupForm').addEventListener('submit',async event=>{event.preventDefault();const email=el('signupEmail').value.trim().toLowerCase(),password=el('signupPassword').value,confirm=el('signupConfirm').value,button=event.submitter;el('signupError').textContent='';el('signupSuccess').textContent='';if(!/^[^@\s]+@aa\.com$/.test(email)){el('signupError').textContent='Use a valid @aa.com email address.';return}if(password!==confirm){el('signupError').textContent='The passwords do not match.';return}button.disabled=true;try{const data=await signUp(email,password);if(data?.access_token){saveSession(data);location.reload();return}el('signupSuccess').textContent='Account created. Check your @aa.com inbox and select the confirmation link, then return here to sign in.';el('signupPassword').value='';el('signupConfirm').value=''}catch(error){el('signupError').textContent=error.message}finally{button.disabled=false}});
    el('signOutBtn').onclick=()=>{saveSession(null);location.reload()};el('syncBtn').onclick=()=>pull(true);
    if(!await ensureSession()){showLogin();return false}hideLogin();status('Syncing…');pollTimer=setInterval(()=>{if(!document.querySelector('.modal.show'))pull(false)},30000);return true
  }
  function stop(){clearInterval(pollTimer);clearTimeout(saveTimer)}
  return{init,load,save,queueSave,pull,isAuthenticated:()=>Boolean(session),showLogin,setStatus:status,stop};
})();
