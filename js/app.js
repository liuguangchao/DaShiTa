/* ===== 路由（仅首页 SPA 模式使用） ===== */
function navTo(id){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  const t=document.getElementById(id);
  if(t){t.classList.add('active');window.scrollTo(0,0)}
}

/* ===== 模式选择 ===== */
let selectedMode = 'mole';
function selectMode(mode){
  selectedMode = mode;
  document.querySelectorAll('.mode-card').forEach(c=>{
    c.style.outline = c.dataset.mode === mode ? '3px solid #FF6B35' : 'none';
  });
}
function startFromHome(){
  startGame(selectedMode);
}

function startGame(mode){
  if(mode==='mole')window.location.href='mole-game.html';
  else if(mode==='figure')window.location.href='figure-game.html';
}

/* ===== Tab ===== */
function switchTab(el){
  el.parentElement.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}

/* ===== Toast（轻量提示，不弹窗） ===== */
let toastTimer=null;
function showToast(msg){
  let el=document.querySelector('.toast-fly');
  if(!el){
    el=document.createElement('div');
    el.className='toast-fly';
    el.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,.75);color:#fff;padding:14px 28px;border-radius:14px;font-size:15px;z-index:9999;pointer-events:none;transition:opacity .3s';
    document.body.appendChild(el);
  }
  el.textContent=msg;
  el.style.opacity='1';
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>{el.style.opacity='0'},1200);
}

/* ===== 消息设置保存 ===== */
function saveMsgSettings(){showToast('设置已保存')}

/* ===== 武器选择 ===== */
function selectWeapon(el){
  el.parentElement.querySelectorAll('.weapon-item').forEach(w=>w.classList.remove('active'));
  el.classList.add('active');
}

/* ===== 打地鼠 ===== */
let moleScore=8650;
function hitMole(el){
  moleScore+=100;
  const ms=document.getElementById('moleScore');
  const mss=document.getElementById('moleStarScore');
  if(ms) ms.textContent=moleScore;
  if(mss) mss.textContent=moleScore;

  el.style.transform='scale(0.7)';
  setTimeout(()=>{el.style.transform='scale(1)'},120);

  spawnSpark(el,'+100','#FF4444');
}

/* ===== 虚拟人物 ===== */
let figureScore=12850;
function hitFigure(el){
  figureScore+=150;
  const fs=document.getElementById('figureScore');
  if(fs) fs.textContent=figureScore;

  el.style.transform='scale(0.9) rotate(5deg)';
  setTimeout(()=>{el.style.transform='scale(1) rotate(0deg)'},150);

  spawnSpark(el,'+150','#FF4444');
}

/* ===== 飘字 ===== */
function spawnSpark(parent,text,color){
  const s=document.createElement('div');
  s.className='hit-spark';
  s.textContent=text;
  s.style.color=color;
  const r=parent.getBoundingClientRect();
  const pr=parent.parentElement.getBoundingClientRect();
  s.style.left=(r.left-pr.left+r.width/2-15)+'px';
  s.style.top=(r.top-pr.top-10)+'px';
  parent.parentElement.appendChild(s);
  setTimeout(()=>s.remove(),800);
}

/* ===== 商城购买 ===== */
let coinBalance = 1280;
function buyItem(name, price){
  if(price === 0){
    showToast(`恭喜获得：${name}`);
    return;
  }
  if(coinBalance >= price){
    coinBalance -= price;
    const cb=document.getElementById('coinBalance');
    if(cb) cb.textContent = coinBalance;
    showToast(`购买成功！消耗 ${price} 打屎币，获得 ${name}`);
  } else {
    showToast(`打屎币不足！需要 ${price}，当前 ${coinBalance}`);
  }
}

/* ===== 初始化 ===== */
window.addEventListener('DOMContentLoaded', ()=>{ 
  const moleCard = document.querySelector('[data-mode="mole"]');
  if(moleCard) selectMode('mole'); 
});
