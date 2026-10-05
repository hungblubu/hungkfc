(function(){
"use strict";

/* ============================================================
   TIỆM GÀ RÁN CỦA MÀY - Game engine
   ============================================================ */

/* ---------- ICONS ---------- */
var ICON = {
  original:'🍗', spicy:'🌶️', honey:'🍯', garlic:'🧄', lemongrass:'🌿',
  cheese:'🧀', blackpepper:'⚫', snowcheese:'❄️', korean:'🇰🇷', bbq:'🔥',
  chicken:'🐔', batter:'🥣', oil:'🫗', box:'📦',
  fries:'🍟', salad:'🥗', mayo:'🥫', cheese_s:'🧀', kimchi:'🥬',
  pickle:'🥒', corn:'🌽', coleslaw:'🥬', egg:'🥚', radish:'🍥',
  onionring:'🧅', nachos:'🌮', chickenrice:'🍚', shrimp:'🦐'
};

/* ---------- DATA ---------- */
var ITEMS = {};
function X(id,o){ ITEMS[id] = Object.assign({id:id},o); }

X('original',   {n:'Gà giòn truyền thống', s:'Truyền thống', type:'flavor', c:'#E8A54B', cost:8000, sell:45000, unlock:0});
X('spicy',      {n:'Gà cay Hàn Quốc',     s:'Cay Hàn',      type:'flavor', c:'#D62828', cost:8500, sell:48000, unlock:200000});
X('honey',      {n:'Gà sốt mật ong',      s:'Mật ong',      type:'flavor', c:'#F0A21C', cost:8500, sell:48000, unlock:250000});
X('garlic',     {n:'Gà bơ tỏi',           s:'Bơ tỏi',       type:'flavor', c:'#EAD07A', cost:8500, sell:50000, unlock:300000});
X('lemongrass', {n:'Gà sả ớt',            s:'Sả ớt',        type:'flavor', c:'#9BBF3E', cost:8500, sell:49000, unlock:320000});
X('cheese',     {n:'Gà phô mai bơ tỏi',   s:'Phô mai bơ',   type:'flavor', c:'#F2C14E', cost:9000, sell:52000, unlock:350000});
X('blackpepper',{n:'Gà tiêu đen',         s:'Tiêu đen',     type:'flavor', c:'#5A4A3A', cost:9000, sell:52000, unlock:400000});
X('snowcheese', {n:'Gà phô mai tuyết',    s:'Phô mai tuyết',type:'flavor', c:'#E8E0C8', cost:9500, sell:55000, unlock:450000});
X('korean',     {n:'Gà sốt Hàn Quốc',     s:'Sốt Hàn',      type:'flavor', c:'#B01818', cost:9500, sell:55000, unlock:500000});
X('bbq',        {n:'Gà sốt BBQ',          s:'BBQ',          type:'flavor', c:'#7A3818', cost:9000, sell:52000, unlock:480000});

X('chicken',{n:'Miếng gà',   s:'Gà',   type:'meat',    cost:5000, life:3});
X('batter', {n:'Bột chiên',  s:'Bột',  type:'batter',  cost:1500, life:5});
X('oil',    {n:'Dầu ăn',     s:'Dầu',  type:'oil',     cost:2500, life:0});
X('box',    {n:'Hộp giấy',   s:'Hộp',  type:'box',     cost:1000, life:0});

X('fries',    {n:'Khoai tây chiên', type:'side', cost:4000, sell:12000, life:1, unlock:0});
X('salad',    {n:'Salad trộn',      type:'side', cost:3000, sell:10000, life:1, unlock:0});
X('mayo',     {n:'Sốt mayo',        type:'side', cost:2000, sell:8000,  life:5, unlock:80000});
X('cheese_s', {n:'Phô mai lát',     type:'side', cost:3500, sell:11000, life:5, unlock:100000});
X('kimchi',   {n:'Kim chi',         type:'side', cost:2500, sell:9000,  life:5, unlock:120000});
X('pickle',   {n:'Dưa chua',        type:'side', cost:2000, sell:8000,  life:4, unlock:100000});
X('corn',     {n:'Bắp ngọt',        type:'side', cost:2500, sell:9000,  life:3, unlock:130000});
X('coleslaw', {n:'Bắp cải trộn',    type:'side', cost:2500, sell:9000,  life:3, unlock:140000});
X('egg',      {n:'Trứng luộc',      type:'side', cost:2500, sell:9000,  life:5, unlock:140000});
X('radish',   {n:'Củ cải muối',     type:'side', cost:2000, sell:8000,  life:5, unlock:160000});
X('onionring',{n:'Hành tây chiên',  type:'side', cost:4000, sell:12000, life:2, unlock:180000});
X('nachos',   {n:'Nachos',          type:'side', cost:4500, sell:13000, life:2, unlock:220000});
X('chickenrice',{n:'Cơm gà',        type:'side', cost:3500, sell:11000, life:2, unlock:260000});
X('shrimp',   {n:'Tôm chiên',       type:'side', cost:5000, sell:14000, life:2, unlock:300000});

var ALL = Object.keys(ITEMS);
var FLAVORS = ALL.filter(function(i){return ITEMS[i].type==='flavor';});
var SIDES   = ALL.filter(function(i){return ITEMS[i].type==='side';});
var BASE    = ['chicken','batter','oil','box'];

var UPGS = [
  {id:'sign',   n:'Biển hiệu neon',      d:'Thêm 20% khách ghé quán', cost:300000, traf:0.20},
  {id:'fan',    n:'Quạt trần',           d:'Khách chịu chờ lâu hơn 25%', cost:350000},
  {id:'wifi',   n:'Wifi miễn phí',       d:'Khách chịu chờ lâu hơn 12%', cost:250000},
  {id:'menu',   n:'Menu in màu',         d:'Giá cao hơn 20% khách mới chê đắt', cost:400000},
  {id:'fire',   n:'Bếp lửa lớn',         d:'Gà chín nhanh hơn, vùng xanh rộng hơn', cost:400000},
  {id:'tiktok', n:'Quay clip TikTok',    d:'Thêm 25% khách ghé quán', cost:500000, traf:0.25},
  {id:'seat4',  n:'Kê thêm bàn',         d:'Phục vụ cùng lúc 4 khách', cost:600000},
  {id:'fryer2', n:'Nồi chiên thứ hai',   d:'Chiên 2 miếng gà cùng lúc', cost:700000},
  {id:'fryer3', n:'Nồi chiên thứ ba',    d:'Chiên 3 miếng cùng lúc', cost:1000000, need:'fryer2'},
  {id:'app',    n:'Lên app giao hàng',   d:'Nhận đơn online, app thu phí 20%', cost:500000},
  {id:'tipjar', n:'Hũ tip heo đất',      d:'Tiền tip nhiều hơn 50%', cost:120000, acc:1},
  {id:'speaker',n:'Loa kẹo kéo',         d:'Thêm 12% khách ghé quán', cost:250000, traf:0.12, acc:1},
  {id:'gmap',   n:'Ghim lên Google Maps',d:'Thêm 15% khách, cả đơn app', cost:350000, traf:0.15, acc:1},
  {id:'led',    n:'Bảng LED chạy chữ',   d:'Buổi tối thêm 25% khách', cost:400000, acc:1},
  {id:'kol',    n:'Mời KOL review',      d:'Thêm 30% khách ghé quán', cost:1200000, traf:0.30, acc:1}
];

var STAFF = [
  {id:'cashier', n:'Chị Mận', role:'Thu ngân',      d:'Khách không ăn quỵt được, đưa nhầm tiền là chị phát hiện liền.', wage:50000, from:3, ic:'👩‍💼'},
  {id:'fryer',   n:'Bé Ba',   role:'Phụ chiên gà',  d:'Tự chiên gà và vớt đúng lúc vào rổ. Bạn chỉ cần chạm rổ lấy gà.',  wage:60000, from:3, ic:'👦'},
  {id:'waiter',  n:'Bé Mít',  role:'Chạy bàn',      d:'Bưng nước mời khách đang chờ, khách kiên nhẫn hơn.',              wage:60000, from:5, ic:'🧒'},
  {id:'prep',    n:'Anh Hấu', role:'Nêm vị',        d:'Bạn vừa lấy hộp là anh chọn vị gà cho khách đang gọi.',           wage:80000, from:7, ic:'👨‍🍳'},
  {id:'topping', n:'Bé Ổi',   role:'Bỏ món kèm',    d:'Hộp vừa có vị là Ổi gắp đủ món kèm. Bạn chỉ thêm sốt cay.',        wage:90000, from:9, ic:'👧'}
];

var LEVELS = [0,150,450,900,1500,2300,3300,4500,6000,8000];
var RANKS  = [[1,'Xe đẩy vỉa hè'],[3,'Quán cóc'],[5,'Tiệm nhỏ'],[7,'Tiệm nổi tiếng'],[9,'Vua gà rán']];

var CUST = [
  {pre:'',    me:'em', o:['Cho em','Làm giúp em','Anh ơi cho em'],    e:[' nha!',' ạ!',' nhé!'],        g:'f', w:3, ic:'👧'},
  {pre:'',    me:'bạn',o:['Cho mình','Làm giúp mình'],                 e:[' nha!',' nhé!'],              g:'m', w:3, ic:'🧑'},
  {pre:'Anh ',me:'anh',o:['Cho anh','Em ơi cho anh'],                  e:[' nha em!',' nhé!'],           g:'m', w:2.5, ic:'👨'},
  {pre:'Chị ',me:'chị',o:['Cho chị','Em ơi cho chị','Làm giúp chị'],   e:[' nha em!',' nhé!'],           g:'f', w:2.5, ic:'👩'},
  {pre:'Chú ',me:'chú',o:['Cho chú','Cháu ơi cho chú'],                e:[' nha cháu!',' nhé!'],         g:'m', w:1.5, old:1, ic:'👨‍🦳'},
  {pre:'Bà ', me:'bà', o:['Cho bà','Cháu ơi, cho bà'],                 e:[' nghen cháu!',' nha con!'],   g:'f', w:1, old:1, ic:'👵'},
  {pre:'Ông ',me:'ông',o:['Cho ông','Cháu ơi cho ông'],                e:[' nha cháu!',' nghe cháu!'],   g:'m', w:1, old:1, ic:'👴'},
  {pre:'Cô ', me:'cô', o:['Cho cô','Cháu ơi cho cô','Em ơi cho cô'],   e:[' nha!',' nhé cháu!'],         g:'f', w:1.5, ic:'👩‍🦰'}
];
var NAMES_F = ['An','Anh','Ánh','Bích','Châu','Chi','Dung','Giang','Hà','Hân','Hằng','Hạnh','Hiền','Hoa','Hương','Huyền','Lan','Linh','Ly','Mai','My','Nga','Ngân','Ngọc','Nhi','Nhung','Phương','Quyên','Thảo','Thư','Trâm','Trang','Uyên','Vy','Xuân','Yến','Kim','Mơ','Sen','Thắm'];
var NAMES_M = ['Bảo','Bình','Cường','Duy','Đạt','Đức','Hải','Hiếu','Hòa','Hùng','Huy','Khang','Khoa','Kiệt','Lâm','Long','Lộc','Minh','Nam','Nghĩa','Nhân','Phát','Phong','Phúc','Quân','Quang','Sơn','Tài','Tâm','Thành','Trung','Tuấn','Việt','Vinh','Vũ'];
var SURNAME = ['Nguyễn','Trần','Lê','Phạm','Hoàng','Huỳnh','Phan','Võ','Đặng','Bùi','Đỗ','Hồ','Ngô','Dương','Lý','Vũ','Đinh','Trương','Lâm','Mai'];

var EVENTS = {
  rain:{n:'Trời mưa', d:'Mưa lạnh ai cũng thèm gà rán nóng, khách đông hơn 35%', mul:1.35},
  hot:{n:'Nắng nóng', d:'Khách ít hơn 20%', mul:0.8},
  weekend:{n:'Cuối tuần', d:'Khách đông hơn 25%', mul:1.25},
  challenge:{n:'Trend thử thách cấp 7', d:'Nhiều khách gọi sốt cấp 7, tip gấp đôi', mul:1.15},
  students:{n:'Học sinh tan học', d:'Giữa ngày một nhóm học sinh ghé cùng lúc', mul:1},
  cold:{n:'Gió mùa về', d:'Khách đông hơn 30%', mul:1.3},
  payday:{n:'Ngày lãnh lương', d:'Dân văn phòng vừa lãnh lương, tip gấp đôi', mul:1.1},
  festival:{n:'Lễ hội ẩm thực', d:'Phố mở lễ hội, khách đông hơn 45%', mul:1.45}
};

var GOALS = [
  {id:'serve',   t:function(n){return 'Bán '+n+' phần gà';},        n:function(l){return 5+l*2;}},
  {id:'five',    t:function(n){return n+' khách chấm 5 sao';},       n:function(l){return 2+Math.ceil(l/2);}},
  {id:'perfect', t:function(n){return n+' miếng gà chiên vừa lửa';}, n:function(l){return 4+l;}},
  {id:'spicy',   t:function(n){return 'Bán '+n+' phần sốt cấp 5+';}, n:function(l){return 1+Math.floor(l/3);}},
  {id:'money',   t:function(n){return 'Kiếm '+n+'k tiền bán';},      n:function(l){return 80+l*30;}}
];

var RVTX = {
  5:[['Nước sốt {fl} đậm vler','Gà giòn rụm','Sợi gà mềm thấm vị','{sd} tươi roi rói','Ăn một lần là ghiền','Hộp đầy đặn','Mùi thơm bay cả hẻm'],
     ['sẽ com bách','ra món nhanh phết nhề','giá hợp lý','quán sạch sẽ','rủ hội bạn tới liền','10-9 điểm']],
  4:[['Ăn oke phết','Gà bơ phệc','{fl} khá phết','Vị oke','Sốt ổn lòi lìa'],
     ['nhưng chờ hơi lâu','nhưng {sd} hơi ít','lần sau thử cấp cao hơn','sẽ ghé lại']],
  3:[['Bình thường','Tạm được','Sốt hơi nhạt','Không như kỳ vọng'],
     ['không có gì đặc biệt','chắc không quay lại','ăn một lần biết thôi']],
  2:[['Gà còn sống, hơi tái','Gà cháy khét','Hộp nhỏ xíu','{sd} thiếu'],['hơi thất vọng','lần sau chú ý nha','tiếc ghê']],
  1:[['Chờ mãi không tới lượt','Đợi lâu quá','Làm sai món','Giá chát'],['bỏ về luôn','đi quán khác','không quay lại','buồn ghê']]
};

/* ============================================================
   STATE
   ============================================================ */
var SAVE_KEY = 'gaRan1';
var G = {startMoney:2000000, daySec:210, gap:10, rent:40000, util:15000, utilPer:6000, fee:20};
var state = null;
var ui = {
  mode:'splash', tab:'kho', plan:{}, run:false, paused:false,
  slots:[], pots:[], basket:0, t:0, focus:null, combo:0, tray:null,
  spawnT:0, onT:0, helpT:0, late:false, spawnId:0
};
var loopTimer = null;

/* ============================================================
   UTILS
   ============================================================ */
function $(id){return document.getElementById(id);}
function H(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function v(n){return (Math.round(n/100)/10).toLocaleString('vi-VN',{maximumFractionDigits:1})+'k';}
function M(a){return a[Math.floor(Math.random()*a.length)];}
function O(p){return Math.random()<p;}
function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
function stars(n){n=Math.round(n);return '★'.repeat(n)+'☆'.repeat(5-n);}

/* ============================================================
   SAVE / LOAD
   ============================================================ */
function newStock(){
  var s={}; ALL.forEach(function(id){ s[id]=[]; }); return s;
}
function newCur(){
  return {ing:0,equip:0,sales:0,tips:0,fee:0,onl:0,apps:0,served:0,lost:0,stars:[],
          spoil:0,wrong:0,bonus:0,goals:0,xp:0,ingBy:{},buys:[],oth:[]};
}
function newState(){
  var s = {
    v:1, money:G.startMoney, day:1, xp:0, served:0,
    shopName:'Tiệm Gà Rán Của Hưn',
    stock:newStock(), unlocked:{}, sell:{}, upg:{}, staff:{},
    reviews:[], history:[], goals:[], goalsDay:0,
    hint:true, sound:true, vol:1, fx:'auto', lastBackup:0, best:0,
    tot:{rev:0,cost:0,served:0}, cur:newCur(),
    ev:null, evDay:1, news:5, terms:0, onboarded:false, tutDone:false,
    pid:'', theme:'auto', debts:[]
  };
  ALL.forEach(function(id){
    s.unlocked[id] = !ITEMS[id].unlock;
    if (ITEMS[id].sell) s.sell[id] = ITEMS[id].sell;
  });
  return s;
}
function save(){
  try{ localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }catch(e){}
}
function load(){
  try{
    var raw = localStorage.getItem(SAVE_KEY);
    if(!raw) return false;
    var d = JSON.parse(raw);
    if(!d || d.v!==1 || typeof d.money!=='number' || !d.stock) return false;
    var f = newState();
    Object.keys(f).forEach(function(k){ if(k in d) f[k]=d[k]; });
    f.stock = Object.assign(newStock(), d.stock||{});
    f.unlocked = Object.assign(f.unlocked, d.unlocked||{});
    f.sell = Object.assign(f.sell, d.sell||{});
    f.cur = Object.assign(newCur(), d.cur||{});
    state = f;
    return true;
  }catch(e){ return false; }
}

/* ============================================================
   AUDIO
   ============================================================ */
var AC = null;
function ac(){
  if(!AC){ try{ AC = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return null; } }
  if(AC.state==='suspended'){ var p=AC.resume(); p&&p.catch&&p.catch(function(){}); }
  return AC;
}
function beep(freq,dur,type,vol,delay){
  var c=ac(); if(!c||!state.sound) return;
  var o=c.createOscillator(), g=c.createGain(), t=c.currentTime+(delay||0);
  o.type=type||'sine'; o.frequency.value=freq;
  g.gain.setValueAtTime(0,t);
  g.gain.linearRampToValueAtTime(vol||0.08,t+0.01);
  g.gain.exponentialRampToValueAtTime(0.001,t+dur);
  o.connect(g).connect(c.destination);
  o.start(t); o.stop(t+dur+0.05);
}
function noise(dur,vol,freq){
  var c=ac(); if(!c||!state.sound) return;
  var n=Math.floor(c.sampleRate*dur), buf=c.createBuffer(1,n,c.sampleRate), ch=buf.getChannelData(0);
  for(var i=0;i<n;i++) ch[i]=(Math.random()*2-1)*(1-i/n);
  var src=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
  src.buffer=buf; f.type='bandpass'; f.frequency.value=freq||1000; g.gain.value=vol||0.1;
  src.connect(f).connect(g).connect(c.destination); src.start();
}
function sfx(n){
  try{
    if(n==='bell'){ beep(1318,0.45,'sine',0.09); beep(1760,0.55,'sine',0.07,0.12); }
    else if(n==='coin'){ beep(988,0.08,'square',0.05); beep(1318,0.25,'square',0.05,0.08); }
    else if(n==='bad'){ beep(196,0.28,'sawtooth',0.07); beep(147,0.3,'sawtooth',0.06,0.1); }
    else if(n==='tap') beep(700,0.05,'triangle',0.06);
    else if(n==='pour') noise(0.3,0.12,700);
    else if(n==='sizzle') noise(0.6,0.07,2600);
    else if(n==='star') [1046,1318,1568].forEach(function(f,i){ beep(f,0.25,'sine',0.06,i*0.08); });
    else if(n==='day') [523,659,784,1046].forEach(function(f,i){ beep(f,0.3,'triangle',0.06,i*0.1); });
    else if(n==='pop'){ beep(880,0.06,'sine',0.07); beep(1320,0.09,'sine',0.05,0.05); }
    else if(n==='whoosh') noise(0.22,0.05,1600);
    else if(n==='swish') noise(0.18,0.06,1200);
    else if(n==='plop'){ beep(520,0.06,'sine',0.07); beep(300,0.12,'sine',0.06,0.05); }
    else if(n==='fire'){ noise(0.45,0.1,900); beep(98,0.35,'sawtooth',0.035); }
    else if(n==='nope') beep(233,0.09,'square',0.035);
    else if(n==='combo') [784,988,1175,1568].forEach(function(f,i){ beep(f,0.18,'triangle',0.06,i*0.07); });
    else if(n==='cash') [1568,1976,2349].forEach(function(f,i){ beep(f,0.06,'square',0.025,i*0.05); });
    else if(n==='ding'){ beep(1568,0.12,'sine',0.08); beep(2093,0.3,'sine',0.07,0.1); }
  }catch(e){}
}

/* ============================================================
   MODAL / TOAST
   ============================================================ */
var toastT = null;
function toast(msg){
  var t=$('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toastT);
  toastT = setTimeout(function(){ t.classList.remove('on'); },2200);
}
function modal(html, btns){
  var card = $('card');
  if(!card) return;
  card.innerHTML = html + '<div class="btns'+(btns.length>3?' many':'')+'">' +
    btns.map(function(b,i){ return '<button data-i="'+i+'" class="'+(b[2]?'pri':'')+'">'+b[0]+'</button>'; }).join('') +
    '</div>';
  $('modal').hidden = false;
  card.querySelectorAll('.btns button').forEach(function(b){
    b.onclick = function(){
      var it = btns[+b.dataset.i];
      if(!it[3]) $('modal').hidden = true;
      it[1]();
    };
  });
  var pri = card.querySelector('.pri'); if(pri) pri.focus({preventScroll:true});
}
function closeModal(){ $('modal').hidden = true; }

/* ============================================================
   LEVEL HELPERS
   ============================================================ */
function level(){
  var x = state.xp||0, t=1;
  while(t<LEVELS.length && x>=LEVELS[t]) t++;
  return t;
}
function rankName(l){
  var r='Xe đẩy vỉa hè';
  RANKS.forEach(function(p){ if(l>=p[0]) r=p[1]; });
  return r;
}
function levelProgress(){
  var l=level(), x=state.xp||0, t0=LEVELS[l-1]||0, t1=LEVELS[l];
  if(t1==null) return {l:l,pct:100,txt:'Cấp cao nhất'};
  return {l:l, pct:clamp(Math.round((x-t0)/(t1-t0)*100),0,100), txt:(x-t0)+'/'+(t1-t0)+' XP'};
}
function addXP(n){
  state.xp = (state.xp||0)+n;
  state.cur.xp = (state.cur.xp||0)+n;
}
function unlockLevel(id){ return Math.max(1, Math.ceil((ITEMS[id].unlock||0)/80000)); }
function upgLevel(u){ return Math.max(1, Math.ceil(u.cost/80000)); }

/* ============================================================
   STOCK
   ============================================================ */
function stockQty(id){ return state.stock[id].reduce(function(s,e){return s+e.q;},0); }
function stockExpired(id){
  return state.stock[id].filter(function(e){return e.exp<=state.day;}).reduce(function(s,e){return s+e.q;},0);
}
function addStock(id,qty){
  var life = ITEMS[id].life;
  var exp = life ? state.day + life - 1 : 99999;
  var cur = state.stock[id].find(function(e){return e.exp===exp;});
  if(cur) cur.q += qty;
  else state.stock[id].push({q:qty,exp:exp});
  state.stock[id].sort(function(a,b){return a.exp-b.exp;});
}
function takeStock(id){
  var e = state.stock[id].find(function(x){return x.q>0;});
  if(!e) return false;
  e.q--;
  state.stock[id] = state.stock[id].filter(function(x){return x.q>0;});
  return true;
}
function spoiledItems(){
  var out=[];
  ALL.forEach(function(id){
    if(!ITEMS[id].life) return;
    var q=0;
    state.stock[id] = state.stock[id].filter(function(e){
      if(e.exp<=state.day){ q+=e.q; return false; }
      return true;
    });
    if(q) out.push({k:id,q:q,v:q*ITEMS[id].cost});
  });
  return out;
}
function priceOf(id){ return state.sell[id]||ITEMS[id].sell; }
function costOf(id){ return ITEMS[id].cost; }
function totalOfOrder(o){
  var t = priceOf(o.flavor);
  o.sides.forEach(function(s){ t += priceOf(s); });
  return t;
}
function hasUpg(id){ return !!state.upg[id]; }
function staffOn(id){ return !!state.staff[id]; }
function staffWageTotal(){
  var t=0;
  STAFF.forEach(function(s){ if(state.staff[s.id]) t += s.wage; });
  return t;
}
function trafficBonus(){
  var t=0;
  UPGS.forEach(function(u){ if(state.upg[u.id] && u.traf) t += u.traf; });
  return t;
}
function totalSlots(){ return state.upg.seat4 ? 4 : 3; }
function fryerCount(){ return state.upg.fryer3 ? 3 : state.upg.fryer2 ? 2 : 1; }
function ratingAvg(){
  var r = state.reviews.slice(0,30);
  if(!r.length) return 4;
  return r.reduce(function(s,x){return s+x.s;},0)/r.length;
}
function eventToday(){
  return (state.ev && state.evDay===state.day) ? state.ev : null;
}
function isAcc(id){
  var u = UPGS.find(function(x){return x.id===id;});
  return !!(u && u.acc);
}
function activeUpgCount(){
  return Object.keys(state.upg).filter(function(k){ return state.upg[k] && !isAcc(k); }).length;
}

/* ============================================================
   SPLASH
   ============================================================ */
function renderSplash(){
  ui.mode = 'splash';
  $('top').hidden = true;
  document.body.classList.remove('selling');
  var colors = ['#F6C9A0','#F4A77A','#F08A56','#EC6C3C','#E4502A','#D7261E','#B51A12','#7E0E06'];
  $('view').className = 'v-splash';
  $('view').innerHTML =
    '<section class="splash">' +
      '<div class="hero"><div style="font-size:96px;line-height:1;text-align:center;filter:drop-shadow(0 12px 18px rgba(0,0,0,.4));animation:bob 2.4s ease-in-out infinite">🍗</div></div>' +
      '<h1>'+H(state.shopName||'Tiệm Gà Rán Của Mày')+'</h1>' +
      '<p>Chiên gà giòn đúng lửa, thêm món kèm, bóp sốt cay. Mở tiệm nhỏ của riêng bạn.</p>' +
      '<div class="scale" aria-label="Thang sốt cay 0 đến 7">' +
        colors.map(function(c,i){return '<span style="background:'+c+'">'+i+'</span>';}).join('') +
      '</div>' +
      '<button class="big" id="goBtn">'+(state.day>1?('Vào bếp · ngày '+state.day):'Mở tiệm')+'</button>' +
      '<button class="ghost" id="howBtn">Cách chơi</button>' +
    '</section>';
  $('view').scrollTop = 0;
  $('goBtn').onclick = function(){
    ac(); sfx('bell');
    if(!state.onboarded){ onboarding(function(){ renderPrep(); }); }
    else renderPrep();
  };
  $('howBtn').onclick = function(){ onboarding(null, true); };
}

/* ============================================================
   ONBOARDING
   ============================================================ */
function onboarding(after, replay){
  if($('ob')) return;
  var pages = [
    '<div class="ill" style="align-items:center"><div style="font-size:80px;text-align:center">🍗</div><h2 style="text-align:center">Chào mừng tới tiệm!</h2></div><h2>Bạn khởi nghiệp với xe gà rán vỉa hè</h2><p>Chiên gà thật ngon, chiều khách, đúng sốt cay để thành Vua gà rán.</p>',
    '<div class="ill"><div class="row"><div class="rart">🐔</div><div class="rinfo"><b>Miếng gà</b><small>Để 3 ngày, hết hạn là bỏ</small></div></div><div class="row"><div class="rart">🥣</div><div class="rinfo"><b>Bột chiên</b><small>Để 5 ngày</small></div></div><div class="row"><div class="rart">📦</div><div class="rinfo"><b>Hộp giấy</b><small>Không hết hạn</small></div></div></div><h2>Sáng: nhập hàng</h2><p>Trong tab Kho, bấm + để nhập 5 phần mỗi lần rồi bấm Nấu &amp; nhập.</p>',
    '<div class="ill"><div style="display:flex;align-items:center;gap:10px"><div style="font-size:44px">🧑</div><p style="margin:0">Cho em 1 phần <b>gà cay Hàn</b> thêm <b>khoai tây</b>, <b>sốt cấp 2</b> nha!</p></div></div><h2>Đọc đơn của khách</h2><p>Chữ đỏ là thứ cần làm: vị gà, món kèm và cấp sốt. Vòng tròn quanh mặt khách là độ kiên nhẫn.</p>',
    '<div class="ill" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">' +
      [['📦','1. Lấy hộp'],['🍗','2. Chọn vị'],['🍳','3. Chiên gà'],['🍟','4. Món kèm'],['🌶️','5. Sốt cay'],['🔔','6. Giao món']]
      .map(function(x){return '<div style="background:#fbf6f4;border-radius:12px;padding:8px 4px;text-align:center"><div style="font-size:34px">'+x[0]+'</div><small style="font-size:11.5px;font-weight:700">'+x[1]+'</small></div>';}).join('') +
    '</div><h2>Nấu một phần</h2><p>Làm theo thứ tự trên. Lỡ tay làm sai thì bấm Bỏ hộp rồi làm lại.</p>',
    '<div class="ill"><div style="display:grid;grid-template-columns:50fr 28fr 22fr;height:34px;border-radius:12px;overflow:hidden;box-shadow:inset 0 0 0 2px rgba(0,0,0,.12)"><span style="background:#f4e4a8;display:grid;place-items:center;font-size:12px;font-weight:800;color:#7a5a12">Tái</span><span style="background:#5dbb63;display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff">Vàng</span><span style="background:#e3583f;display:grid;place-items:center;font-size:12px;font-weight:800;color:#fff">Cháy</span></div><p class="note" style="text-align:center">Chạm nồi để thả gà, chạm lần nữa khi kim vào vùng xanh</p></div><h2>Canh gà vừa lửa</h2><p>Gà tái hay cháy khách vẫn nhận nhưng chê và trừ sao. Gà vàng giòn thì khách khen và tip nhiều.</p>',
    '<div class="ill" style="text-align:center"><div style="font-size:60px">⭐</div></div><h2>Mỗi phần bán được +10 XP</h2><p>Đủ XP quán lên cấp và mở thêm vị gà, món kèm, nhân viên và trang bị.</p>'
  ];
  var ob = document.createElement('div');
  ob.id = 'ob';
  ob.setAttribute('role','dialog');
  ob.setAttribute('aria-modal','true');
  ob.innerHTML =
    '<button class="skip" id="obSkip" type="button">'+(replay?'Đóng':'Bỏ qua')+'</button>' +
    '<div class="obs" id="obs">' + pages.map(function(p,i){
      return '<section class="sl" aria-label="Trang '+(i+1)+' trên '+pages.length+'">'+p+'</section>';
    }).join('') + '</div>' +
    '<div class="dots" aria-hidden="true">' + pages.map(function(p,i){ return '<i'+(i?'':' class="on"')+'></i>'; }).join('') + '</div>' +
    '<button class="big nx" id="obNext" type="button">Tiếp</button>';
  document.body.appendChild(ob);
  var obs = $('obs'), dots = ob.querySelectorAll('.dots i'), next = $('obNext'), cur=0;
  function upd(){
    dots.forEach(function(d,i){ d.classList.toggle('on',i===cur); });
    next.textContent = cur<pages.length-1 ? 'Tiếp' : (replay?'Đóng':'Khai trương');
  }
  function go(i){
    cur = i; upd();
    var w = obs.clientWidth;
    if(obs.scrollTo) obs.scrollTo({left:i*w,behavior:'smooth'});
    else obs.scrollLeft = i*w;
  }
  obs.addEventListener('scroll',function(){
    var w = obs.clientWidth;
    if(w){ cur = clamp(Math.round(obs.scrollLeft/w),0,pages.length-1); upd(); }
  },{passive:true});
  function done(){
    if(replay){ ob.remove(); return; }
    state.onboarded = true; save();
    ob.remove();
    sfx('bell');
    if(after) after();
  }
  next.onclick = function(){ sfx('tap'); if(cur<pages.length-1) go(cur+1); else done(); };
  $('obSkip').onclick = function(){ if(!replay && cur<pages.length-1) go(pages.length-1); else done(); };
  upd();
  setTimeout(function(){ next.focus(); },50);
}

/* ============================================================
   TAB CONTENT
   ============================================================ */
var TABS = [
  ['kho','Kho','📦'],
  ['gia','Rổ Giá','💵'],
  ['nangcap','Nâng cấp','⬆️'],
  ['danhgia','Đánh giá','⭐'],
  ['so','Sổ sách','📒']
];
function renderTab(){
  var tb = $('tabbody');
  if(!tb) return;
  tb.dataset.tab = ui.tab;
  tb.innerHTML = ui.tab==='kho' ? tabKho()
    : ui.tab==='gia' ? tabGia()
    : ui.tab==='nangcap' ? tabNangcap()
    : ui.tab==='danhgia' ? tabDanhgia()
    : tabSo();
  document.querySelectorAll('.tab').forEach(function(t){
    var on = t.dataset.tab===ui.tab;
    t.classList.toggle('on',on);
    t.setAttribute('aria-selected',on);
  });
  updateDock();
}
function tabKho(){
  var html = renderGoalsHTML();
  html += '<p class="note">Bấm + để nhập 5 phần mỗi lần. Nhập vừa đủ bán trong ngày.</p>';
  [['Vị gà', FLAVORS], ['Nguyên liệu nấu', BASE], ['Món kèm', SIDES]].forEach(function(g){
    var vis = g[1].filter(function(id){ return state.unlocked[id]; });
    if(!vis.length) return;
    html += '<h3>'+g[0]+'</h3>';
    vis.forEach(function(id){
      var it = ITEMS[id];
      var have = stockQty(id);
      var exp = stockExpired(id);
      var plan = ui.plan[id]||0;
      html += '<div class="row">' +
        '<div class="rart">'+(ICON[id]||'🍽️')+'</div>' +
        '<div class="rinfo"><b>'+H(it.n)+'</b>' +
          '<small>'+v(costOf(id))+'/phần'+(it.life?' · để '+it.life+' ngày':' · không hết hạn')+'</small>' +
          '<small>Còn '+have+(exp&&it.life?' · <span class="exp">'+exp+' hết hạn tối nay</span>':'')+'</small></div>' +
        '<div class="qty">' +
          '<button data-plan="'+id+'" data-d="-1">−</button>' +
          '<input class="qin" type="number" inputmode="numeric" min="0" max="99" step="1" data-q="'+id+'" value="'+(plan||'')+'" placeholder="0">' +
          '<button class="p" data-plan="'+id+'" data-d="1">+</button>' +
        '</div></div>';
    });
  });
  html += '<h3>Nhân viên</h3>';
  var anyStaff = false;
  STAFF.forEach(function(s){
    if(!state.staff[s.id]) return;
    anyStaff = true;
    html += '<div class="row"><div class="rart">'+s.ic+'</div>' +
      '<div class="rinfo"><b>'+s.n+' · '+s.role+'</b><small>'+s.d+'</small>' +
      '<small>Lương '+v(s.wage)+' mỗi ngày</small></div>' +
      '<button class="sbtn" data-fire="'+s.id+'">Cho nghỉ</button></div>';
  });
  if(!anyStaff) html += '<p class="note">Chưa có nhân viên. Vào tab Nâng cấp để tuyển.</p>';
  return html;
}
function tabGia(){
  var html = '<p class="note">Giá bán cao thì lời nhiều hơn nhưng ít khách hơn. Món quá đắt bị khách chê và trừ sao.</p>';
  [['Vị gà', FLAVORS], ['Món kèm', SIDES]].forEach(function(g){
    var vis = g[1].filter(function(id){ return state.unlocked[id]; });
    if(!vis.length) return;
    html += '<h3>'+g[0]+'</h3>';
    vis.forEach(function(id){
      var it = ITEMS[id];
      var cur = priceOf(id);
      var warn = '';
      if(cur > it.sell*1.5) warn = ' · <span class="warn">quá đắt, khách bỏ đi</span>';
      else if(cur > it.sell*1.15) warn = ' · <span class="warn">hơi đắt</span>';
      else if(cur < it.sell*0.85) warn = ' · <span class="chip">giá rẻ</span>';
      html += '<div class="row"><div class="rinfo"><b>'+H(it.n)+'</b>' +
        '<small>Gợi ý '+v(it.sell)+' · vốn '+v(it.cost)+warn+'</small></div>' +
        '<div class="qty"><button data-price="'+id+'" data-d="-1000">−</button>' +
        '<span>'+v(cur)+'</span>' +
        '<button class="p" data-price="'+id+'" data-d="1000">+</button></div></div>';
    });
  });
  return html;
}
function tabNangcap(){
  var l = level();
  var p = levelProgress();
  var html = '<div class="lvline" style="background:#fff6d9;border-radius:12px;padding:8px 10px;margin-bottom:10px">' +
    '<b>Cấp '+l+' · '+rankName(l)+'</b>' +
    '<span class="xpbar"><i style="width:'+p.pct+'%"></i></span>' +
    '<small>'+p.txt+' · Mỗi phần gà bán được +10 XP, khách 5 sao thêm 8 XP.</small></div>';
  html += '<h3>Mở khóa món</h3><p class="note">Mở khóa vị gà và món kèm để khách gọi đa dạng hơn.</p>';
  var locked = ALL.filter(function(id){ return !state.unlocked[id]; })
    .sort(function(a,b){ return (ITEMS[a].unlock||0)-(ITEMS[b].unlock||0); });
  if(!locked.length) html += '<p class="note">Đã mở hết món.</p>';
  locked.forEach(function(id){
    var it = ITEMS[id];
    var need = unlockLevel(id);
    var canLv = l >= need;
    html += '<div class="row upg'+(canLv?'':' lock')+'">' +
      '<div class="rart">'+(ICON[id]||'🍽️')+'</div>' +
      '<div class="rinfo"><b>'+H(it.n)+'</b>' +
        '<small>'+(it.type==='flavor'?'Vị gà mới':'Món kèm')+' · bán gợi ý '+v(it.sell)+' · '+Qi(id).toLowerCase()+'</small>' +
        (canLv? '<small>Mở giá '+v(it.unlock||0)+'</small>' : '<small>Cần cấp '+need+'</small>') +
      '</div>' +
      (canLv
        ? '<button class="sbtn pri" data-unlock="'+id+'"'+(state.money<(it.unlock||0)?' disabled':'')+'>'+v(it.unlock||0)+'</button>'
        : '<span class="chip" style="background:#F3ECE8;color:var(--ink2)">Cấp '+need+'</span>') +
      '</div>';
  });
  html += '<h3>Nhân viên</h3><p class="note">Nhân viên nhận lương cuối mỗi ngày làm việc.</p>';
  STAFF.forEach(function(s){
    var has = state.staff[s.id];
    var canLv = l >= s.from;
    html += '<div class="row upg'+(canLv||has?'':' lock')+'">' +
      '<div class="rart">'+s.ic+'</div>' +
      '<div class="rinfo"><b>'+s.n+' · '+s.role+'</b><small>'+s.d+'</small>' +
      '<small>Lương '+v(s.wage)+' mỗi ngày</small></div>' +
      (has ? '<button class="sbtn" data-fire="'+s.id+'">Cho nghỉ</button>'
        : canLv ? '<button class="sbtn pri" data-hire="'+s.id+'">Tuyển</button>'
        : '<span class="chip" style="background:#F3ECE8;color:var(--ink2)">Cấp '+s.from+'</span>') +
      '</div>';
  });
  html += '<h3>Trang bị</h3><p class="note">Mỗi trang bị tốn thêm '+v(G.utilPer)+' điện nước mỗi ngày.</p>';
  UPGS.filter(function(u){return !u.acc;}).forEach(function(u){ html += upgRow(u); });
  html += '<h3>Phụ kiện</h3><p class="note">Mua một lần dùng mãi, không tốn điện nước.</p>';
  UPGS.filter(function(u){return u.acc;}).forEach(function(u){ html += upgRow(u); });
  return html;
}
function upgRow(u){
  var has = state.upg[u.id];
  var need = upgLevel(u);
  var canLv = level() >= need;
  var needBlock = u.need && !state.upg[u.need];
  var needName = u.need ? (UPGS.find(function(x){return x.id===u.need;})||{}).n : '';
  return '<div class="row upg'+(canLv||has?'':' lock')+'">' +
    '<div class="rinfo"><b>'+H(u.n)+'</b><small>'+H(u.d)+'</small>' +
    (!has&&canLv&&!needBlock? '<small>Giá '+v(u.cost)+'</small>':'') + '</div>' +
    (has ? '<span class="chip">Đã có</span>'
      : canLv ? (needBlock
        ? '<span class="chip" style="background:#F3ECE8;color:var(--ink2)">Cần '+H(needName)+'</span>'
        : '<button class="sbtn pri" data-upg="'+u.id+'"'+(state.money<u.cost?' disabled':'')+'>'+v(u.cost)+'</button>')
      : '<span class="chip" style="background:#F3ECE8;color:var(--ink2)">Cấp '+need+'</span>') +
    '</div>';
}
function Qi(id){
  var life = ITEMS[id].life;
  return life ? (life===1?'Dùng trong ngày':'Để được '+life+' ngày') : 'Không hết hạn';
}
function tabDanhgia(){
  var n = state.reviews.length, avg = ratingAvg();
  var html = '<div class="rvhead"><div class="num">'+(n?avg.toFixed(1).replace('.',','):'–')+'</div>' +
    '<div><div class="stars" style="color:var(--egg);font-size:18px">'+stars(avg)+'</div>' +
    '<small class="note">Tính trên 30 đánh giá gần nhất. Dưới 4 sao là quán vắng hẳn.</small></div></div>';
  if(!n) return html + '<p class="note" style="margin-top:12px">Chưa có đánh giá nào. Mở cửa bán phần gà đầu tiên nhé.</p>';
  state.reviews.slice(0,40).forEach(function(r){
    var ic = r.s>=4?'😀':r.s<=2?'😠':'😐';
    html += '<div class="rv"><div class="av">'+ic+'</div><div>' +
      '<b>'+H(r.n)+'</b><span class="st">'+'★'.repeat(r.s)+'</span>' +
      '<p>'+H(r.t)+'</p>' +
      '<small>Ngày '+r.d+(r.o?' · đơn app':'')+'</small>' +
      '</div></div>';
  });
  return html;
}
function tabSo(){
  var c = state.cur;
  var tot = state.tot.rev - state.tot.cost;
  var html = '<div class="sumc"><div><small>Tổng lãi từ khi mở quán</small><b class="'+(tot<0?'neg':'pos')+'">'+(tot<0?'−':'+')+v(Math.abs(tot))+'</b></div>' +
    '<div><small>Đã bán</small><b>'+state.served+' phần</b></div></div>';
  html += '<h3>Hôm nay · ngày '+state.day+'</h3><div class="ledger">';
  var ing = '';
  Object.keys(c.ingBy).forEach(function(k){ ing += '<div><span>Nhập '+H(ITEMS[k].n)+'</span><span>−'+v(c.ingBy[k])+'</span></div>'; });
  c.buys.forEach(function(b){ ing += '<div><span>'+H(b[0])+'</span><span>−'+v(b[1])+'</span></div>'; });
  html += ing || '<p class="note">Chưa chi khoản nào.</p>';
  html += '<div style="margin:8px 0 2px;font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#b0675a">Trừ lúc đóng cửa</div>';
  html += '<div><span>Mặt bằng</span><span>−'+v(G.rent)+'</span></div>';
  html += '<div><span>Điện nước</span><span>−'+v(G.util + activeUpgCount()*G.utilPer)+'</span></div>';
  STAFF.filter(function(s){ return state.staff[s.id]; }).forEach(function(s){
    html += '<div><span>Lương '+H(s.n)+'</span><span>−'+v(s.wage)+'</span></div>';
  });
  html += '</div>';
  if(state.history.length){
    html += '<h3>Các ngày trước</h3>';
    state.history.slice().reverse().slice(0,20).forEach(function(h,i){
      var l = h.rev - h.cost;
      html += '<details class="dayc"'+(i?'':' open')+'><summary><span>Ngày '+h.day+'</span>' +
        '<small>'+h.served+' phần · ★ '+(h.avg?h.avg.toFixed(1).replace('.',','):'–')+'</small>' +
        '<b class="'+(l<0?'neg':'pos')+'">'+(l<0?'−':'+')+v(Math.abs(l))+'</b></summary>' +
        '<div class="ledger">' +
        '<div><span>Tổng thu</span><span>+'+v(h.rev)+'</span></div>' +
        '<div><span>Tổng chi</span><span>−'+v(h.cost)+'</span></div>' +
        '<div class="tot"><span>Lãi</span><span>'+(l<0?'−':'+')+v(Math.abs(l))+'</span></div>' +
        '</div></details>';
    });
  }
  return html;
}

/* ============================================================
   GOALS
   ============================================================ */
function makeGoals(){
  var l = level(), avail = GOALS.slice(), picked = [];
  while(picked.length<3 && avail.length){
    picked.push(avail.splice(Math.floor(Math.random()*avail.length),1)[0]);
  }
  state.goals = picked.map(function(g){
    return {id:g.id, n:g.n(l), p:0, done:false, m:(15+l*5)*1000, xp:25+l*5};
  });
  state.goalsDay = state.day;
}
function goalText(g){
  var def = GOALS.find(function(x){return x.id===g.id;});
  return def ? def.t(g.n) : '';
}
function goalProgress(id, amt, absolute){
  (state.goals||[]).forEach(function(g){
    if(g.id!==id || g.done) return;
    g.p = absolute ? Math.max(g.p,amt) : g.p+amt;
    if(g.p >= g.n){
      g.done = true; g.p = g.n;
      state.money += g.m;
      state.cur.bonus += g.m;
      state.cur.goals = (state.cur.goals||0)+1;
      addXP(g.xp);
      sfx('combo');
      toast('Xong nhiệm vụ: '+goalText(g)+' · +'+v(g.m)+' · +'+g.xp+' XP');
      save();
    }
  });
}
function renderGoalsHTML(){
  if(!state.goals || !state.goals.length) return '';
  return '<div class="goals"><b class="gt">Nhiệm vụ hôm nay</b>' +
    state.goals.map(function(g){
      return '<div class="gl'+(g.done?' ok':'')+'"><span>'+H(goalText(g))+'</span>' +
        '<em>'+(g.done?'Xong':g.p+'/'+g.n)+'</em>' +
        '<small>Thưởng '+v(g.m)+' · +'+g.xp+' XP</small></div>';
    }).join('') + '</div>';
}

/* ============================================================
   PREP SCREEN
   ============================================================ */
function renderPrep(){
  ui.mode = 'prep';
  ui.run = false;
  document.body.classList.remove('selling');
  $('top').hidden = false;
  $('view').className = 'v-prep';
  if(state.goalsDay !== state.day){ makeGoals(); save(); }
  var p = levelProgress();
  var ev = eventToday();
  $('view').innerHTML =
    '<div class="pl">' +
      '<div class="sign">' +
        '<button class="mbtn" data-masc="1" type="button" aria-label="Nói chuyện với bé gà" style="padding:0;background:none">' +
          '<span style="display:block;font-size:56px;animation:bob 2.4s ease-in-out infinite">🐔</span>' +
        '</button>' +
        '<h1>'+H(state.shopName)+'</h1>' +
        '<div class="lvl"><b>Cấp '+p.l+' · '+rankName(p.l)+'</b>' +
          '<span class="xpbar" role="img" aria-label="Kinh nghiệm '+p.txt+'"><i style="width:'+p.pct+'%"></i></span>' +
          '<small>'+p.txt+'</small></div>' +
        '<div class="sbts">' +
          '<button class="ren" id="renBtn">Đổi tên quán</button>' +
          '<button class="ren" id="setBtn">⚙️ Cài đặt</button>' +
        '</div>' +
      '</div>' +
      (ev ? '<div class="evc"><span class="dot"></span><div><b>Hôm nay: '+EVENTS[ev.id].n+'</b><small>'+EVENTS[ev.id].d+'</small></div></div>' : '') +
    '</div>' +
    '<div class="pr">' +
      '<nav class="tabs" role="tablist">' + TABS.map(function(t){
        return '<button class="tab'+(ui.tab===t[0]?' on':'')+'" role="tab" aria-selected="'+(ui.tab===t[0])+'" data-tab="'+t[0]+'"><span>'+t[2]+'</span>'+t[1]+'</button>';
      }).join('') + '</nav>' +
      '<div class="tabbody" id="tabbody"></div>' +
    '</div>' +
    '<div class="dock">' +
      '<button class="big" id="mainBtn"></button>' +
      '<p class="dockNote" id="dockNote"></p>' +
    '</div>';
  renderTab();
  renderTopPrep();
  bindPrepEvents();
}
function renderTopPrep(){
  var t = ratingAvg();
  $('top').innerHTML =
    '<div class="l"><button class="ibtn" id="pauseBtn" aria-label="Cài đặt">⚙️</button>' +
      '<div><div class="day">Ngày '+state.day+'</div><div class="sub">Chuẩn bị</div></div></div>' +
    '<div class="money"><small>Két</small><span class="mv">'+v(state.money)+'</span></div>' +
    '<div class="r"><div class="stars">'+stars(t)+'</div>'+t.toFixed(1).replace('.',',')+' · '+state.reviews.length+' đánh giá</div>';
  $('pauseBtn').onclick = openSettings;
}
function bindPrepEvents(){
  var view = $('view');
  view.onclick = prepClick;
  view.oninput = prepInput;
}
function prepClick(e){
  if(ui.mode!=='prep') return;
  var b = e.target.closest('button');
  if(!b) return;
  if(b.dataset.masc){ chatMascot(); return; }
  if(b.dataset.tab){ ui.tab = b.dataset.tab; renderTab(); return; }
  if(b.dataset.plan){ addPlan(b.dataset.plan,+b.dataset.d); return; }
  if(b.dataset.price){ changePrice(b.dataset.price,+b.dataset.d); return; }
  if(b.id==='renBtn'){ renameShop(); return; }
  if(b.id==='setBtn'){ openSettings(); return; }
  if(b.dataset.unlock){ doUnlock(b.dataset.unlock); return; }
  if(b.dataset.hire){ doHire(b.dataset.hire); return; }
  if(b.dataset.fire){ doFire(b.dataset.fire); return; }
  if(b.dataset.upg){ doUpgrade(b.dataset.upg); return; }
  if(b.id==='mainBtn'){
    if(plannedTotal()>0){ doImport(); return; }
    startDay();
    return;
  }
}
function prepInput(e){
  if(ui.mode!=='prep') return;
  if(e.target.classList.contains('qin')) setPlan(e.target.dataset.q, e.target.value);
}
function plannedTotal(){
  var t=0;
  Object.keys(ui.plan).forEach(function(id){ t += (ui.plan[id]||0)*costOf(id); });
  return t;
}
function minNeeded(){
  var t=0;
  if(!FLAVORS.some(function(f){return stockQty(f)>0;}) && !FLAVORS.some(function(f){return ui.plan[f]>0;}))
    t += 5*costOf('original');
  if(!stockQty('chicken') && !ui.plan.chicken) t += 5*costOf('chicken');
  if(!stockQty('batter') && !ui.plan.batter) t += 5*costOf('batter');
  if(!stockQty('oil') && !ui.plan.oil) t += 5*costOf('oil');
  if(!stockQty('box') && !ui.plan.box) t += 5*costOf('box');
  return t;
}
function updateDock(){
  var btn = $('mainBtn'), note = $('dockNote');
  if(!btn) return;
  var total = plannedTotal();
  if(total>0){
    btn.textContent = 'Nấu & nhập · '+v(total);
    btn.disabled = total > state.money;
    note.textContent = total>state.money ? 'Đủ éo đâu, còn '+v(state.money) : 'Hàng nhập sẽ được thêm vào kho ngay';
  } else {
    var miss = [];
    if(!FLAVORS.some(function(f){return stockQty(f)>0;})) miss.push('vị gà');
    if(!stockQty('chicken')) miss.push('gà');
    if(!stockQty('batter')) miss.push('bột');
    if(!stockQty('oil')) miss.push('dầu');
    if(!stockQty('box')) miss.push('hộp');
    btn.textContent = 'Mở cửa ngày '+state.day;
    btn.disabled = miss.length>0;
    var wage = staffWageTotal();
    note.textContent = miss.length ? 'Cần có '+miss.join(', ')+' mới mở cửa được'
      : 'Mặt bằng '+v(G.rent)+', điện nước '+v(G.util + activeUpgCount()*G.utilPer)+(wage?', lương '+v(wage):'')+' mỗi ngày';
  }
}
function addPlan(id,d){
  var cur = ui.plan[id]||0;
  var next = clamp(cur+d,0,99);
  if(next===cur) return;
  if(next) ui.plan[id]=next; else delete ui.plan[id];
  var inp = document.querySelector('.qin[data-q="'+id+'"]');
  if(inp) inp.value = next||'';
  updateDock();
}
function setPlan(id,val){
  val = clamp(parseInt(val,10)||0,0,99);
  if(val) ui.plan[id]=val; else delete ui.plan[id];
  updateDock();
}
function changePrice(id,d){
  var cur = priceOf(id);
  var next = clamp(cur+d,1000,ITEMS[id].sell*3);
  if(next===cur) return;
  state.sell[id] = next;
  save(); renderTab();
}
function doImport(){
  var total = plannedTotal();
  if(total<=0) return;
  if(total > state.money){ toast('Không đủ tiền'); sfx('nope'); return; }
  Object.keys(ui.plan).forEach(function(id){
    var q = ui.plan[id];
    addStock(id,q);
    var cost = q*costOf(id);
    state.money -= cost;
    state.cur.ing += cost;
    state.cur.ingBy[id] = (state.cur.ingBy[id]||0) + cost;
  });
  ui.plan = {};
  save();
  sfx('pour');
  toast('Đã nấu và nhập hàng');
  renderTab(); renderTopPrep();
}
function doUnlock(id){
  var it = ITEMS[id];
  if(state.unlocked[id]) return;
  if(level() < unlockLevel(id)){ toast('Cần cấp '+unlockLevel(id)); return; }
  if(state.money < (it.unlock||0)){ toast('Két không đủ tiền'); sfx('nope'); return; }
  state.money -= (it.unlock||0);
  state.cur.equip += (it.unlock||0);
  state.cur.buys.push(['Mở '+it.n, it.unlock||0]);
  state.unlocked[id] = true;
  save(); sfx('star');
  toast('Đã mở '+it.n);
  renderTab(); renderTopPrep();
}
function doHire(id){
  var s = STAFF.find(function(x){return x.id===id;});
  if(!s || state.staff[id]) return;
  if(level() < s.from){ toast('Cần cấp '+s.from); return; }
  state.staff[id] = true;
  save(); sfx('star');
  toast(s.n+' vào làm rồi! Lương '+v(s.wage)+' mỗi ngày');
  renderTab();
}
function doFire(id){
  var s = STAFF.find(function(x){return x.id===id;});
  if(!s) return;
  modal('<div style="font-size:52px">'+s.ic+'</div><h2>Cho '+s.n+' nghỉ?</h2><p>Hôm nay không phải trả lương nữa. Muốn tuyển lại lúc nào cũng được.</p>',[
    ['Thôi', function(){}],
    ['Cho nghỉ', function(){ delete state.staff[id]; save(); renderTab(); },1]
  ]);
}
function doUpgrade(id){
  var u = UPGS.find(function(x){return x.id===id;});
  if(!u || state.upg[id]) return;
  if(level() < upgLevel(u)){ toast('Cần cấp '+upgLevel(u)); return; }
  if(u.need && !state.upg[u.need]) return;
  if(state.money < u.cost){ toast('Két không đủ tiền'); sfx('nope'); return; }
  state.money -= u.cost;
  state.cur.equip += u.cost;
  state.cur.buys.push([u.n, u.cost]);
  state.upg[id] = true;
  save(); sfx('star');
  toast('Đã mua '+u.n);
  renderTab(); renderTopPrep();
}
function chatMascot(){
  var lines = [
    'Chào chủ quán! Hôm nay bán đắt nha!',
    'Nhớ nhập đủ gà với hộp nha!',
    'Khách cấp 7 mê cay xé lưỡi đó!',
    'Khoai tây chiên nóng giòn ngon lắm!',
    'Khách sốt ruột thì mời ly trà đá nha!',
    'Quán sạch sẽ khách mới ghé đông!',
    'Trả lời đánh giá cho khách vui nè!',
    'Bé gà tin chủ quán làm được!',
    'Hết hàng giữa giờ thì bấm nút đỏ nha!'
  ];
  toast(M(lines));
  sfx('pop');
}

/* ============================================================
   SETTINGS
   ============================================================ */
function openSettings(){
  var vols = '<div class="vols">' +
    '<label class="vol"><span>Âm thanh</span><input type="range" min="0" max="100" step="5" value="'+(state.sound?100:0)+'" id="volSound" style="--p:'+(state.sound?100:0)+'%"><b>'+(state.sound?'100':'0')+'%</b></label>' +
    '</div>';
  modal('<h2>Cài đặt</h2><p>Phiên bản 2.1 · tiến trình lưu trong trình duyệt này.'+(state.lastBackup?(' Sao lưu gần nhất: ngày '+state.lastBackup+'.'):' Chưa sao lưu lần nào.')+'</p>' + vols,
  [
    ['Sao lưu tiến trình', function(){ doBackup(); },0,1],
    ['Khôi phục từ mã', function(){ doRestore(); },0,1],
    [(state.sound?'Âm thanh: Bật':'Âm thanh: Tắt'), function(){
      state.sound = !state.sound; save(); openSettings();
    },0,1],
    ['Cách chơi', function(){ closeModal(); onboarding(null,true); },0,1],
    ['Chơi lại từ đầu', function(){
      modal('<h2>Chơi lại từ đầu?</h2><p>Mất toàn bộ tiền, món đã mở, trang bị và đánh giá.</p>',[
        ['Huỷ', function(){}],
        ['Xoá và chơi lại', function(){
          state = newState();
          save();
          renderSplash();
        },1]
      ]);
    },0,1],
    ['Đóng', function(){},1]
  ]);
}
function renameShop(){
  modal('<h2>Đặt tên quán</h2><p>Tối đa 26 ký tự, hiện trên biển hiệu và màn hình chào.</p>' +
    '<input id="nameIn" maxlength="26" value="'+H(state.shopName)+'">',
  [
    ['Huỷ', function(){}],
    ['Lưu tên', function(){
      var el = $('nameIn');
      if(el){ state.shopName = el.value.replace(/\s+/g,' ').trim().slice(0,26) || 'Tiệm Gà Rán Của Mày'; save(); }
      if(ui.mode==='prep') renderPrep();
      else if(ui.mode==='sell') renderSell();
      else renderSplash();
      toast('Đã đổi tên quán');
    },1]
  ]);
  setTimeout(function(){ var el=$('nameIn'); if(el) el.focus(); },50);
}
function doBackup(){
  try{
    var code = 'GR1.' + btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    state.lastBackup = state.day; save();
    modal('<h2>Mã sao lưu</h2><p>Chép mã này cất vào Ghi chú hoặc gửi Zalo cho chính mình. Lỡ mất tiến trình thì dán lại vào Khôi phục.</p>' +
      '<textarea readonly style="width:100%;min-height:110px;font:12px ui-monospace,monospace;border-radius:10px;padding:10px;border:2px solid #E6DDD8">'+H(code)+'</textarea>' +
      '<p style="font-size:12px">Ngày '+state.day+' · két '+v(state.money)+' · '+code.length+' ký tự</p>',
    [
      ['Chép mã', function(){
        try{ navigator.clipboard.writeText(code).then(function(){toast('Đã chép mã sao lưu');}, function(){toast('Bấm giữ để chép');}); }
        catch(e){ toast('Bấm giữ để chép'); }
      },1,1],
      ['Xong', function(){}]
    ]);
  }catch(e){ toast('Không tạo được mã sao lưu'); }
}
function doRestore(){
  modal('<h2>Khôi phục tiến trình</h2><p>Dán mã sao lưu bắt đầu bằng GR1 vào ô dưới.</p>' +
    '<textarea id="codeIn" style="width:100%;min-height:110px;font:12px ui-monospace,monospace;border-radius:10px;padding:10px;border:2px solid #E6DDD8"></textarea>' +
    '<p id="codeErr" class="warn" style="font-size:12.5px;min-height:1em"></p>',
  [
    ['Khôi phục', function(){
      var err = $('codeErr');
      try{
        var raw = $('codeIn').value.trim();
        if(raw.indexOf('GR1.')!==0) throw new Error('bad');
        var d = JSON.parse(decodeURIComponent(escape(atob(raw.slice(4)))));
        if(!d || d.v!==1) throw new Error('bad');
        var f = newState();
        Object.keys(f).forEach(function(k){ if(k in d) f[k]=d[k]; });
        f.stock = Object.assign(newStock(), d.stock||{});
        f.unlocked = Object.assign(f.unlocked, d.unlocked||{});
        f.sell = Object.assign(f.sell, d.sell||{});
        f.cur = newCur();
        state = f;
        save();
        renderSplash();
        toast('Đã khôi phục tiến trình');
      }catch(e){ if(err) err.textContent = 'Mã không đúng hoặc bị thiếu ký tự.'; }
    },1,1],
    ['Huỷ', function(){}]
  ]);
  setTimeout(function(){ var el=$('codeIn'); if(el) el.focus(); },50);
}

/* ============================================================
   SELL SCREEN
   ============================================================ */
function renderSell(){
  ui.mode = 'sell';
  document.body.classList.add('selling');
  $('top').hidden = false;
  $('view').className = 'v-sell';
  var flavorsOn = FLAVORS.filter(function(f){ return state.unlocked[f]; });
  var sidesOn = SIDES.filter(function(s){ return state.unlocked[s]; });
  $('view').innerHTML =
    '<section class="sell">' +
      '<div class="street">' +
        '<div class="awn"></div><div class="lights"></div>' +
        '<div class="board"><b>'+H(state.shopName)+'</b><small>Cấp '+level()+' · '+rankName(level())+'</small></div>' +
        '<div class="lane" id="lane"></div>' +
      '</div>' +
      '<div class="bubble" id="bubble"></div>' +
      '<div class="kitchen" id="kitchen">' +
        '<div class="r1">' +
          '<button class="st stack" data-a="box" aria-label="Lấy hộp"><span class="ic">📦</span><span class="t">Lấy hộp</span><span class="n" id="n_box"></span>'+(staffOn('prep')?'<span class="helper" title="Anh Hấu">👨‍🍳</span>':'')+'</button>' +
          '<div class="broths">' + flavorsOn.map(function(f){
            return '<button class="st pot" data-a="flavor:'+f+'" aria-label="Chọn vị '+ITEMS[f].s+'"><span class="ic">'+(ICON[f]||'🍗')+'</span><span class="t">'+ITEMS[f].s+'</span><span class="n" id="n_'+f+'"></span></button>';
          }).join('') + '</div>' +
        '</div>' +
        '<div class="r2">' +
          '<div class="pots" id="fryers"></div>' +
          '<div class="mid">' +
            '<div class="work" id="work"></div>' +
            '<button class="serve" data-a="serve">🔔 Giao món'+(staffOn('cashier')?'<span class="helper" title="Chị Mận">👩‍💼</span>':'')+'</button>' +
          '</div>' +
          '<div class="side">' +
            '<button class="st chili" data-a="spice" id="chiliBtn" aria-label="Bóp sốt thêm một cấp"></button>' +
            '<button class="trash" data-a="trash"><span class="ic">🗑️</span>Bỏ hộp</button>' +
          '</div>' +
        '</div>' +
        '<div class="trays" id="trays">' + sidesOn.map(function(s){
          return '<button class="st tray" data-a="side:'+s+'" id="tr_'+s+'" aria-label="Thêm '+ITEMS[s].n+'"><span class="ic">'+(ICON[s]||'🍽️')+'</span><span class="t">'+(ITEMS[s].s||ITEMS[s].n).slice(0,6)+'</span><span class="n" id="n_'+s+'"></span></button>';
        }).join('') + '</div>' +
      '</div>' +
    '</section>';
  renderLane();
  renderFryers();
  renderBubble();
  renderWork();
  renderStockBadges();
  renderTopSell();
  bindSellEvents();
}
function renderTopSell(){
  var t = ratingAvg();
  var remain = Math.max(0, Math.floor(G.daySec-(ui.t||0)));
  var mm = Math.floor(remain/60), ss = remain%60;
  $('top').innerHTML =
    '<div class="l"><button class="ibtn" id="pauseBtn" aria-label="Tạm dừng">⏸️</button>' +
      '<div><div class="day">Ngày '+state.day+'</div><div class="sub" id="clock">'+String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0')+'</div></div></div>' +
    '<div class="money"><small>Két</small><span class="mv">'+v(state.money)+'</span></div>' +
    '<div class="r"><div class="stars">'+stars(t)+'</div>'+t.toFixed(1).replace('.',',')+' · '+state.reviews.length+' đánh giá</div>';
  $('pauseBtn').onclick = pauseGame;
}
function updateClock(){
  var el = $('clock');
  if(!el) return;
  var remain = Math.max(0, Math.floor(G.daySec-(ui.t||0)));
  var mm = Math.floor(remain/60), ss = remain%60;
  el.textContent = String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0');
}
function renderLane(){
  var lane = $('lane');
  if(!lane) return;
  lane.style.setProperty('--n', ui.slots.length);
  lane.innerHTML = ui.slots.map(function(c){
    if(!c) return '<div class="empty">Bàn trống</div>';
    var pat = clamp(c.pat/c.max,0,1);
    var col = pat>0.5?'#5DBB63':pat>0.25?'#F2B33D':'#E3583F';
    var r=24, circ=2*Math.PI*r;
    return '<button class="cust'+(c.id===ui.focus?' on':'')+'" data-fc="'+c.id+'" aria-label="'+H(c.name)+'">' +
      '<div class="ring"><svg class="pr" viewBox="0 0 54 54">' +
      '<circle cx="27" cy="27" r="'+r+'" fill="none" stroke="rgba(255,255,255,.15)" stroke-width="4"/>' +
      '<circle id="pr_'+c.id+'" cx="27" cy="27" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="4" stroke-linecap="round" stroke-dasharray="'+circ+'" stroke-dashoffset="'+(circ*(1-pat))+'"/>' +
      '</svg><div class="face">'+c.ic+'</div></div>' +
      (c.online?'<span class="tag">APP</span>':(c.tourist?'<span class="tag">Du khách</span>':'')) +
      '<span class="nm">'+H(c.name)+'</span>' +
      '</button>';
  }).join('');
}
function updateLaneBars(){
  ui.slots.forEach(function(c){
    if(!c) return;
    var el = $('pr_'+c.id);
    if(!el) return;
    var pat = clamp(c.pat/c.max,0,1);
    var r=24, circ=2*Math.PI*r;
    el.setAttribute('stroke-dashoffset', circ*(1-pat));
    el.setAttribute('stroke', pat>0.5?'#5DBB63':pat>0.25?'#F2B33D':'#E3583F');
  });
  var bar = $('patBar'), c = currentCust();
  if(c && bar){
    var p = clamp(c.pat/c.max,0,1);
    bar.style.width = (p*100)+'%';
    bar.style.background = p>0.5?'#5DBB63':p>0.25?'#F2B33D':'#E3583F';
  }
}
function currentCust(){ return ui.slots.find(function(c){return c && c.id===ui.focus;}) || null; }
function currentOrder(){ var c = currentCust(); return c ? c.order : null; }
function renderBubble(){
  var b = $('bubble');
  if(!b) return;
  var c = currentCust();
  if(!c){
    b.innerHTML = '<div class="idle"><span class="masc">🐔</span><span>'+(ui.slots.some(Boolean)?'Chạm vào một khách để xem món':'Đang chờ khách ghé quán…')+'</span></div>';
    return;
  }
  var o = c.order;
  var idx = ui.slots.indexOf(c);
  b.style.setProperty('--tip', 'calc('+(((idx+0.5)/ui.slots.length)*100)+'% - 8px)');
  var pat = clamp(c.pat/c.max,0,1);
  var sideStr = o.sides.length ? ' thêm '+o.sides.map(function(s){return '<b>'+ITEMS[s].n+'</b>';}).join(', ') : '';
  var spiceStr = o.spice ? 'sốt <b>cấp '+o.spice+'</b>' : '<b>không sốt cay</b>';
  b.innerHTML =
    '<div class="mb">'+(c.online?'🛵':(ICON[o.flavor]||'🍗'))+'</div>' +
    '<div class="say">'+H(c.say)+' 1 phần <b>'+ITEMS[o.flavor].n+'</b>'+sideStr+', '+spiceStr+H(c.end)+'</div>' +
    '<div class="pat"><div class="bar"><i id="patBar" style="width:'+(pat*100)+'%;background:'+(pat>0.5?'#5DBB63':pat>0.25?'#F2B33D':'#E3583F')+'"></i></div></div>';
}
function renderFryers(){
  var el = $('fryers');
  if(!el) return;
  var n = fryerCount();
  while(ui.pots.length < n) ui.pots.push({on:false,t:0,auto:false,z:''});
  ui.pots.length = n;
  var showBasket = staffOn('fryer') || ui.basket>0;
  var html = ui.pots.map(function(p,i){
    var g = p.on ? (p.t<0.5?'raw':p.t<=0.78?'ok':'soft') : 'idle';
    var label = p.on ? (g==='raw'?'Đang chiên':g==='ok'?'Vớt ngay!':'Sắp cháy!') : (p.auto?'Bé Ba chiên':'Thả gà');
    return '<button class="st npot'+(p.on?' cook':'')+' z-'+g+'" data-a="pot:'+i+'" aria-label="'+(p.on?'Vớt gà':'Thả gà')+'">' +
      '<span class="ic">'+(p.on?'🍳':'🍗')+'</span>' +
      (p.on?'<i class="bb" aria-hidden="true"><b></b><b></b><b></b></i>':'<b class="zz" aria-hidden="true">z</b>') +
      '<div class="gauge"><i id="ndl'+i+'" style="left:'+Math.min(p.t,1)*100+'%"></i></div>' +
      '<span class="t">'+label+'</span>' +
      (i===0?'<span class="n" id="n_chicken"></span>':'') +
      '</button>';
  }).join('');
  if(showBasket){
    html += '<button class="st basket" data-a="basket" aria-label="Lấy gà chín trong rổ">' +
      '<span class="ic">🧺</span><span class="t">Rổ gà chín</span>' +
      '<span class="n'+(ui.basket?'':' z')+'">'+ui.basket+'</span>' +
      (staffOn('fryer')?'<span class="helper" title="Bé Ba">👦</span>':'') +
      '</button>';
  }
  el.innerHTML = html;
}
function renderWork(){
  var w = $('work');
  if(!w) return;
  var t = ui.tray;
  if(!t){
    w.innerHTML = '<p class="ph">Có hộp méo đâu.<br>Chạm chồng hộp để lấy một cái hộp.</p>';
  } else {
    var sides = t.sides.map(function(s){ return '<span>'+(ICON[s]||'🍽️')+'</span>'; }).join('');
    var crispLabel = t.crisp==='ok'?'Vừa lửa':t.crisp==='raw'?'Tái':t.crisp==='soft'?'Cháy':'chưa chiên';
    var crispColor = t.crisp==='ok'?'#3E9B4F':t.crisp==='raw'?'#D98A12':t.crisp==='soft'?'#C7362B':'#8A6A66';
    w.innerHTML =
      '<div class="boxart">' +
        '<div class="box"></div>' +
        (t.sauce ? '<span class="sauce">🌶️ '+t.sauce+'</span>' : '') +
        (t.flavor ? '<span class="flav">'+ITEMS[t.flavor].s+'</span>' : '') +
        '<span class="chick">'+(t.crisp==='ok'?'🍗':t.crisp==='raw'?'🍖':t.crisp==='soft'?'🔥':(t.flavor?(ICON[t.flavor]||'🍗'):'🍗'))+'</span>' +
        (sides ? '<span class="sides">'+sides+'</span>' : '') +
        (t.crisp ? '<span class="crisp" style="background:'+crispColor+'">'+crispLabel+'</span>' : '') +
      '</div>' +
      '<div class="meta">' +
        (t.flavor ? ITEMS[t.flavor].s : '—') + ' · ' + crispLabel +
        (t.sides.length?' · '+t.sides.length+' món kèm':'') +
      '</div>';
  }
  var ch = $('chiliBtn');
  if(ch){
    ch.innerHTML = '<span class="ic">🌶️</span><span class="lv">'+(t?t.sauce:0)+'</span><span class="t">Sốt</span>';
  }
}
function renderStockBadges(){
  ALL.forEach(function(id){
    var el = $('n_'+id);
    if(!el) return;
    var q = stockQty(id);
    el.textContent = q;
    el.classList.toggle('z', !q);
  });
}

/* ---------- SELL EVENTS ---------- */
var sellBound = false;
function bindSellEvents(){
  if(sellBound) return;
  sellBound = true;
  var view = $('view');
  view.addEventListener('click', function(e){
    if(ui.mode!=='sell') return;
    var fc = e.target.closest('[data-fc]');
    if(fc){
      ui.focus = +fc.dataset.fc;
      sfx('tap');
      renderLane(); renderBubble();
      return;
    }
    var a = e.target.closest('[data-a]');
    if(!a) return;
    handleAction(a.dataset.a, a);
  });
}
function handleAction(act, el){
  if(!ui.run || ui.paused) return;
  if(act==='box'){ takeBox(); return; }
  if(act.indexOf('flavor:')===0){ pickFlavor(act.split(':')[1]); return; }
  if(act.indexOf('pot:')===0){ fryerAction(+act.split(':')[1]); return; }
  if(act==='basket'){ takeFromBasket(); return; }
  if(act.indexOf('side:')===0){ addSide(act.split(':')[1]); return; }
  if(act==='spice'){ addSpice(); return; }
  if(act==='trash'){ trashTray(); return; }
  if(act==='serve'){ serve(); return; }
}
function takeBox(){
  if(ui.tray){ sfx('nope'); return; }
  if(!takeStock('box')){ sfx('nope'); toast('Hết hộp!'); return; }
  ui.tray = {flavor:null, crisp:null, sides:[], sauce:0, cost:costOf('box')};
  sfx('tap');
  if(staffOn('prep')) autoPickFlavor();
  if(staffOn('topping')) autoAddSides();
  renderWork(); renderStockBadges();
  checkServeReady();
}
function pickFlavor(f){
  if(!ui.tray){ sfx('nope'); toast('Lấy hộp trước đã'); return; }
  if(ui.tray.flavor){ sfx('nope'); return; }
  if(ui.tray.crisp){ sfx('nope'); toast('Đã chiên rồi, không đổi vị được'); return; }
  if(!takeStock(f)){ sfx('nope'); toast('Hết '+ITEMS[f].s); return; }
  ui.tray.flavor = f;
  ui.tray.cost += costOf(f);
  sfx('pour');
  renderWork(); renderStockBadges();
  checkServeReady();
}
function autoPickFlavor(){
  var o = currentOrder();
  if(!o || !ui.tray || ui.tray.flavor) return;
  if(stockQty(o.flavor)<=0){ toast('Anh Hấu: Hết '+ITEMS[o.flavor].s); return; }
  takeStock(o.flavor);
  ui.tray.flavor = o.flavor;
  ui.tray.cost += costOf(o.flavor);
}
function autoAddSides(){
  var o = currentOrder();
  if(!o || !ui.tray || !ui.tray.flavor) return;
  o.sides.forEach(function(s){
    if(ui.tray.sides.indexOf(s)>=0 || ui.tray.sides.length>=4) return;
    if(stockQty(s)<=0){ toast('Bé Ổi: Hết '+ITEMS[s].n); return; }
    takeStock(s);
    ui.tray.sides.push(s);
    ui.tray.cost += costOf(s);
  });
}
function fryerAction(i){
  var p = ui.pots[i];
  if(!p) return;
  if(p.on){
    if(!ui.tray){ sfx('nope'); toast('Chưa có hộp'); return; }
    if(ui.tray.crisp){ sfx('nope'); return; }
    var crisp = p.t<0.5?'raw':p.t<=0.78?'ok':'soft';
    ui.tray.crisp = crisp;
    ui.tray.cost += costOf('chicken')+costOf('batter')+costOf('oil');
    p.on=false; p.t=0; p.auto=false; p.z='';
    sfx(crisp==='ok'?'coin':'bad');
    if(crisp!=='ok') toast(crisp==='raw'?'Gà còn tái, khách sẽ chê':'Gà cháy rồi!');
    renderFryers(); renderWork();
    checkServeReady();
    return;
  }
  if(!ui.tray){ sfx('nope'); toast('Lấy hộp trước đã'); return; }
  if(ui.tray.crisp){ sfx('nope'); return; }
  if(!takeStock('chicken')){ sfx('nope'); toast('Hết gà!'); return; }
  if(!takeStock('batter')){ sfx('nope'); toast('Hết bột!'); return; }
  if(!takeStock('oil')){ sfx('nope'); toast('Hết dầu!'); return; }
  p.on=true; p.t=0; p.auto=false; p.z='';
  sfx('sizzle');
  renderFryers(); renderStockBadges();
  checkServeReady();
}
function takeFromBasket(){
  if(!ui.tray || ui.tray.crisp){ sfx('nope'); return; }
  if(ui.basket<=0){ sfx('nope'); toast('Rổ chưa có gà'); return; }
  ui.basket--;
  ui.tray.crisp = 'ok';
  ui.tray.cost += costOf('chicken')+costOf('batter')+costOf('oil');
  sfx('coin');
  renderFryers(); renderWork();
  checkServeReady();
}
function addSide(s){
  if(!ui.tray){ sfx('nope'); toast('Lấy hộp trước'); return; }
  if(ui.tray.sides.indexOf(s)>=0){ sfx('nope'); return; }
  if(ui.tray.sides.length>=4){ sfx('nope'); toast('Hộp đầy món kèm rồi'); return; }
  if(!takeStock(s)){ sfx('nope'); toast('Hết '+ITEMS[s].n); return; }
  ui.tray.sides.push(s);
  ui.tray.cost += costOf(s);
  sfx('tap');
  renderWork(); renderStockBadges();
  checkServeReady();
}
function addSpice(){
  if(!ui.tray){ sfx('nope'); return; }
  if(ui.tray.sauce>=7){ sfx('nope'); toast('Cấp 7 là cay nhất rồi'); return; }
  ui.tray.sauce++;
  sfx('tap');
  renderWork(); checkServeReady();
}
function trashTray(){
  if(!ui.tray) return;
  state.cur.spoil += ui.tray.cost;
  ui.tray = null;
  sfx('bad');
  renderWork(); checkServeReady();
}
function checkServeReady(){
  var b = document.querySelector('.serve');
  if(!b) return;
  var o = currentOrder();
  b.classList.toggle('ready', !!(o && ui.tray && matchOrder(ui.tray,o)));
}
function matchOrder(t,o){
  if(t.flavor!==o.flavor) return false;
  if(t.crisp!=='ok') return false;
  if(t.sauce!==o.spice) return false;
  if(t.sides.length!==o.sides.length) return false;
  return o.sides.every(function(s){ return t.sides.indexOf(s)>=0; });
}
function serve(){
  if(!ui.tray){ sfx('nope'); toast('Chưa có gì để giao'); return; }
  var c = currentCust();
  if(!c){ sfx('nope'); toast('Không có khách'); return; }
  var o = c.order;
  if(!matchOrder(ui.tray,o)){
    c.wrong = (c.wrong||0)+1;
    c.pat = Math.max(1, c.pat - c.max*0.3);
    state.cur.wrong++;
    ui.combo = 0;
    sfx('bad');
    toast(c.name+': Sai món rồi!');
    trashTray();
    return;
  }
  var price = totalOfOrder(o);
  var fee = c.online ? Math.round(price*G.fee/100) : 0;
  var patRatio = clamp(c.pat/c.max,0,1);
  var tip = Math.round(patRatio * 4000) + (ui.tray.crisp==='ok'?2000:0);
  if(hasUpg('tipjar')) tip = Math.round(tip*1.5);
  if(c.tourist) tip *= 2;
  state.money += price + tip - fee;
  state.cur.sales += price;
  state.cur.tips += tip;
  state.cur.fee += fee;
  state.cur.onl += c.online ? price : 0;
  state.cur.apps += c.online ? 1 : 0;
  state.cur.served++;
  state.served++;
  sfx('coin');
  var base = 5;
  if(c.wrong) base -= c.wrong;
  if(ui.tray.crisp!=='ok') base -= 1;
  if(patRatio<0.5) base -= 1;
  if(patRatio<0.2) base -= 1;
  var expensive = o.sides.some(function(s){ return priceOf(s) > ITEMS[s].sell*1.5; }) ||
                  priceOf(o.flavor) > ITEMS[o.flavor].sell*1.5;
  if(expensive) base -= 1;
  var r = clamp(base,1,5);
  addReview(r,o,c);
  addXP(10 + (r>=5?8:r===4?4:0));
  goalProgress('serve',1);
  if(ui.tray.crisp==='ok') goalProgress('perfect',1);
  if(o.spice>=5) goalProgress('spicy',1);
  goalProgress('money', Math.round((price+tip)/1000), false);
  if(r>=5){ goalProgress('five',1); ui.combo = (ui.combo||0)+1; }
  else ui.combo = 0;
  if(ui.combo>=2) toast('Chuỗi 5★ x'+ui.combo+'!');
  var idx = ui.slots.indexOf(c);
  if(idx>=0) ui.slots[idx] = null;
  ui.tray = null;
  if(ui.focus===c.id) ui.focus = null;
  renderLane(); renderBubble(); renderWork(); renderStockBadges(); renderTopSell(); renderFryers();
  checkServeReady();
  sfx('star');
}
function addReview(r,o,c){
  var lvl = r>=5?5:r;
  var pool = RVTX[lvl] || RVTX[3];
  var txt = M(pool[0])
    .replace(/\{fl\}/g, ITEMS[o.flavor].s)
    .replace(/\{sd\}/g, ITEMS[o.sides[0]||'fries'].n)
    + ', ' + M(pool[1]);
  state.reviews.unshift({
    s:r, t:txt, n:c.name, d:state.day, o:!!c.online, f:c.ic
  });
  if(state.reviews.length>400) state.reviews.length = 400;
  state.cur.stars.push(r);
  save();
}

/* ============================================================
   GAME LOOP
   ============================================================ */
function startDay(){
  if(minNeeded() > state.money){ toast('Không đủ tiền nhập nguyên liệu tối thiểu'); return; }
  ui.run = true;
  ui.paused = false;
  ui.t = 0;
  ui.spawnT = 1.5;
  ui.onT = 15;
  ui.helpT = 1;
  ui.basket = 0;
  ui.tray = null;
  ui.combo = 0;
  ui.focus = null;
  ui.late = false;
  ui.pots = [];
  ui.slots = Array(totalSlots()).fill(null);
  rollEvent(state.day);
  renderSell();
  sfx('bell');
  clearInterval(loopTimer);
  loopTimer = setInterval(tick, 100);
  setTimeout(function(){ toast('Mở cửa!'); }, 200);
  save();
}
function rollEvent(day){
  var ev = null;
  if(day>1){
    if(day%7===6 || day%7===0) ev = {id:'weekend'};
    else if(day>2 && O(0.35)){
      var pool = ['rain','rain','hot','students','cold','payday','festival','challenge'];
      ev = {id:M(pool)};
    }
  }
  state.ev = ev;
  state.evDay = day;
}
function tick(){
  if(!ui.run || ui.paused) return;
  var dt = 0.1;
  ui.t += dt;
  updateClock();
  updateLaneBars();
  var rate = trafficRate();
  ui.spawnT -= dt;
  if(ui.spawnT<=0 && ui.t < G.daySec-10 && ui.slots.indexOf(null)>=0){
    spawnCustomer();
    ui.spawnT = (G.gap / rate) * (0.75+Math.random()*0.5);
  }
  if(hasUpg('app')){
    ui.onT -= dt;
    if(ui.onT<=0 && ui.t<G.daySec-15 && ui.slots.indexOf(null)>=0){
      spawnOnline();
      ui.onT = (25 / rate) * (0.7+Math.random()*0.6);
    }
  }
  var fryTime = 5.2 * (hasUpg('fire')?0.8:1);
  for(var i=0;i<ui.pots.length;i++){
    var p = ui.pots[i];
    if(p.on){
      p.t += dt / fryTime;
      if(p.t>=1){
        p.on=false; p.t=0; p.auto=false;
        state.cur.spoil += costOf('chicken');
        toast('Gà cháy rồi, phải bỏ');
        sfx('bad');
      }
      var el = $('ndl'+i);
      if(el) el.style.left = (p.t*100)+'%';
      var g = p.t<0.5?'raw':p.t<=0.78?'ok':'soft';
      if(g!==p.z){ p.z = g; renderFryers(); }
    }
  }
  if(staffOn('fryer')){
    ui.helpT = (ui.helpT||0) - dt;
    if(ui.helpT<=0){
      var active = ui.slots.filter(Boolean).length + (ui.tray?0:1);
      var occupied = ui.pots.filter(function(p){return p.on;}).length;
      var want = Math.min(fryerCount(), Math.max(0, active - ui.basket));
      if(occupied < want && stockQty('chicken')>0 && stockQty('batter')>0 && stockQty('oil')>0){
        var free = ui.pots.find(function(p){return !p.on;});
        if(free){
          takeStock('chicken'); takeStock('batter'); takeStock('oil');
          free.on=true; free.t=0; free.auto=true; free.z='';
          ui.helpT = 1.2;
          renderFryers(); renderStockBadges();
        }
      }
    }
    for(var j=0;j<ui.pots.length;j++){
      var pp = ui.pots[j];
      if(pp.on && pp.auto && pp.t>=0.64){
        pp.on=false; pp.t=0; pp.auto=false;
        ui.basket++;
        renderFryers();
      }
    }
  }
  var patienceMul = 1;
  if(hasUpg('fan')) patienceMul *= 1.25;
  if(hasUpg('wifi')) patienceMul *= 1.12;
  if(staffOn('waiter')) patienceMul *= 1.15;
  var lost = false;
  ui.slots.forEach(function(c,i){
    if(!c) return;
    c.pat -= dt / patienceMul;
    if(c.pat<=0){
      c.pat = 0;
      state.cur.lost++;
      ui.combo = 0;
      addTimeoutReview(c);
      ui.slots[i] = null;
      lost = true;
      sfx('bad');
    }
  });
  if(lost){
    renderLane();
    if(!currentCust()){
      var f = ui.slots.find(Boolean);
      ui.focus = f ? f.id : null;
      renderBubble();
    }
  }
  if(!ui.late && ui.t >= G.daySec - 15){
    ui.late = true;
    toast('Sắp đóng cửa, tranh thủ nha!');
  }
  if(ui.t >= G.daySec) endDay();
}
function trafficRate(){
  var base = 1;
  if(hasUpg('sign')) base += 0.2;
  if(hasUpg('tiktok')) base += 0.25;
  if(hasUpg('speaker')) base += 0.12;
  if(hasUpg('gmap')) base += 0.15;
  if(hasUpg('kol')) base += 0.3;
  var ev = eventToday();
  if(ev) base *= EVENTS[ev.id].mul;
  var avg = ratingAvg();
  if(avg<3) base *= 0.6;
  else if(avg<4) base *= 0.85;
  var l = level();
  base *= Math.min(1, 0.65 + l*0.1);
  return base;
}
function spawnCustomer(){
  var free = ui.slots.indexOf(null);
  if(free<0) return;
  var l = level();
  var maxSides = l>=7?2:1;
  var flavorsOn = FLAVORS.filter(function(f){ return state.unlocked[f]; });
  var sidesOn = SIDES.filter(function(s){ return state.unlocked[s]; });
  var flavor = M(flavorsOn);
  var nSides = Math.floor(Math.random()*(maxSides+1));
  var sides = [];
  var pool = sidesOn.slice();
  for(var i=0;i<nSides && pool.length;i++){
    var k = Math.floor(Math.random()*pool.length);
    sides.push(pool.splice(k,1)[0]);
  }
  var maxSpice = l>=3?7:3;
  var spice = Math.floor(Math.random()*(maxSpice+1));
  var ev = eventToday();
  if(ev && ev.id==='hot') spice = Math.min(spice, 3);
  if(ev && ev.id==='challenge' && O(0.4)) spice = 7;
  var cdef = M(CUST);
  var name = makeName(cdef);
  var maxPat = (66 + Math.min(l-1,8)*4) * (hasUpg('fan')?1.25:1);
  var c = {
    id: ++ui.spawnId,
    name: name, ic: cdef.ic,
    say: M(cdef.o), end: M(cdef.e),
    order: {flavor:flavor, sides:sides, spice:spice},
    pat: maxPat, max: maxPat, wrong: 0, online: false
  };
  ui.slots[free] = c;
  if(!ui.focus) ui.focus = c.id;
  sfx('bell');
  renderLane(); renderBubble();
}
function spawnOnline(){
  var flavorsOn = FLAVORS.filter(function(f){ return state.unlocked[f]; });
  var sidesOn = SIDES.filter(function(s){ return state.unlocked[s]; });
  var flavor = M(flavorsOn);
  var sides = [];
  if(O(0.5) && sidesOn.length) sides.push(M(sidesOn));
  var spice = Math.floor(Math.random()*4);
  var cdef = M(CUST);
  var c = {
    id: ++ui.spawnId,
    name: makeName(cdef),
    ic: '🛵',
    say: 'Đơn app:',
    end: '',
    order: {flavor:flavor, sides:sides, spice:spice},
    pat: 80, max: 80, wrong: 0, online: true
  };
  ui.slots[ui.slots.indexOf(null)] = c;
  if(!ui.focus) ui.focus = c.id;
  sfx('ding');
  toast('Ting ting! Có đơn app mới');
  renderLane(); renderBubble();
}
function makeName(cdef){
  var isF = cdef.g==='f' || (cdef.g==='x' && O(0.5));
  var name = M(isF ? NAMES_F : NAMES_M);
  return cdef.pre ? cdef.pre + name : (O(0.4) ? M(SURNAME)+' '+name : name);
}
function addTimeoutReview(c){
  state.reviews.unshift({
    s:1, t:'Chờ mãi không tới lượt, bỏ về luôn',
    n:c.name, d:state.day, o:false, f:c.ic
  });
  if(state.reviews.length>400) state.reviews.length = 400;
  toast(c.name+' bỏ về, 1 sao');
  save();
}

/* ============================================================
   PAUSE / END DAY
   ============================================================ */
function pauseGame(){
  if(!ui.run || ui.paused) return;
  ui.paused = true;
  modal('<h2>Tạm dừng</h2><p>Khách và nồi chiên đang đứng yên chờ bạn.</p>',[
    ['Chơi tiếp', function(){ ui.paused = false; },1],
    [(state.sound?'Âm thanh: Bật':'Âm thanh: Tắt'), function(){
      state.sound = !state.sound; save(); ui.paused=false; pauseGame();
    },0,1],
    ['Đóng cửa hôm nay', function(){
      modal('<h2>Đóng cửa hôm nay?</h2><p>Khách đang chờ sẽ ra về và chuyển sang tổng kết.</p>',[
        ['Quay lại', function(){ ui.paused=false; pauseGame(); }],
        ['Đóng cửa', function(){ ui.paused=false; endDay(); },1]
      ]);
    },0,1]
  ]);
}
function endDay(){
  clearInterval(loopTimer);
  ui.run = false;
  sfx('day');
  ui.slots.forEach(function(c){ if(c) state.cur.lost++; });
  ui.slots = [];
  var wasted = spoiledItems();
  var wastedValue = wasted.reduce(function(s,x){return s+x.v;},0);
  state.cur.spoil += wastedValue;
  var rent = G.rent;
  var util = G.util + activeUpgCount()*G.utilPer;
  var wage = staffWageTotal();
  state.money -= (rent + util + wage);
  var cur = state.cur;
  var rev = cur.sales + cur.tips + (cur.bonus||0);
  var cost = cur.ing + cur.equip + rent + util + wage + cur.fee + (cur.spoil||0);
  var profit = rev - cost;
  var avg = cur.stars.length ? cur.stars.reduce(function(a,b){return a+b;},0)/cur.stars.length : 0;
  var rec = {
    day: state.day, rev: rev, cost: cost, served: cur.served, lost: cur.lost, avg: avg,
    d: {
      sales: cur.sales, tips: cur.tips, bonus: cur.bonus, goals: cur.goals,
      fee: cur.fee, onl: cur.onl, apps: cur.apps,
      ing: cur.ing, ingBy: cur.ingBy, equip: cur.equip, buys: cur.buys,
      rent: rent, util: util, wage: wage,
      wages: STAFF.filter(function(s){return state.staff[s.id];}).map(function(s){return [s.n, s.wage];}),
      spoil: cur.spoil, xp: cur.xp
    }
  };
  state.history.push(rec);
  if(state.history.length>120) state.history.shift();
  state.tot.rev += rev;
  state.tot.cost += cost;
  state.tot.served += cur.served;
  state.cur = newCur();
  var bankrupt = state.money < 0;
  if(!bankrupt){
    state.best = Math.max(state.best, state.day);
    state.day++;
    rollEvent(state.day);
  }
  save();
  showEndDay(rec, profit, wasted, bankrupt);
}
function showEndDay(rec, profit, wasted, bankrupt){
  var p = levelProgress();
  var html = '<div style="font-size:60px;line-height:1">'+(profit>=0?'🍗':'😢')+'</div>' +
    '<h2>'+(bankrupt?'Két âm rồi!':'Hết ngày '+rec.day)+'</h2>' +
    '<div class="kpis">' +
      '<div><b>'+rec.served+'</b><small>phần bán được</small></div>' +
      '<div><b>'+rec.lost+'</b><small>khách bỏ về</small></div>' +
      '<div><b>'+(rec.avg?rec.avg.toFixed(1).replace('.',','):'–')+'</b><small>sao trung bình</small></div>' +
    '</div>' +
    '<div class="ledger">' +
      '<div><span>Tổng thu</span><span>+'+v(rec.rev)+'</span></div>' +
      '<div><span>Tổng chi</span><span>−'+v(rec.cost)+'</span></div>' +
      '<div class="tot"><span>Lãi hôm nay</span><span class="'+(profit<0?'neg':'pos')+'">'+(profit<0?'−':'+')+v(Math.abs(profit))+'</span></div>' +
      '<div class="tot"><span>Tiền trong két</span><span>'+v(state.money)+'</span></div>' +
    '</div>' +
    '<details class="bill"><summary><span class="bo">Xem chi tiết thu chi</span><span class="bc">Thu gọn</span></summary>' +
    '<div class="ledger">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#b0675a;margin:10px 0 2px">Thu</div>' +
      '<div><span>Tiền bán gà · '+rec.served+' phần</span><span>+'+v(rec.d.sales)+'</span></div>' +
      (rec.d.tips? '<div><span>Tiền tip</span><span>+'+v(rec.d.tips)+'</span></div>':'') +
      (rec.d.bonus? '<div><span>Thưởng nhiệm vụ</span><span>+'+v(rec.d.bonus)+'</span></div>':'') +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:#b0675a;margin:10px 0 2px">Chi</div>' +
      '<div><span>Nhập hàng</span><span>−'+v(rec.d.ing)+'</span></div>' +
      (rec.d.equip? '<div><span>Trang bị &amp; mở khóa</span><span>−'+v(rec.d.equip)+'</span></div>':'') +
      (rec.d.fee? '<div><span>Phí app</span><span>−'+v(rec.d.fee)+'</span></div>':'') +
      '<div><span>Mặt bằng</span><span>−'+v(rec.d.rent)+'</span></div>' +
      '<div><span>Điện nước</span><span>−'+v(rec.d.util)+'</span></div>' +
      (rec.d.wage? '<div><span>Lương nhân viên</span><span>−'+v(rec.d.wage)+'</span></div>':'') +
      (rec.d.spoil? '<div><span>Hao hụt / bỏ đi</span><span>−'+v(rec.d.spoil)+'</span></div>':'') +
      (wasted.length ? wasted.map(function(w){
        return '<div><span>Hết hạn: '+H(ITEMS[w.k].n)+' × '+w.q+'</span><span>−'+v(w.v)+'</span></div>';
      }).join('') : '') +
    '</div></details>' +
    (rec.d.xp ? '<div class="lvline"><b>Cấp '+p.l+'</b><span class="xpbar"><i style="width:'+p.pct+'%"></i></span><small>+'+rec.d.xp+' XP hôm nay · '+p.txt+'</small></div>':'') +
    (state.ev && state.evDay===state.day ? '<p class="lvup">Ngày mai: <b>'+EVENTS[state.ev.id].n+'</b>. '+EVENTS[state.ev.id].d+'</p>' : '');
  var btns = [];
  if(bankrupt){
    btns.push(['Mở quán mới', function(){
      state = newState(); save(); renderSplash();
    },1]);
  } else {
    btns.push(['Chuẩn bị ngày '+state.day, function(){
      ui.tab = 'kho'; ui.plan = {};
      renderPrep();
    },1]);
  }
  modal(html, btns);
}

/* ============================================================
   INIT  ← ĐÃ SỬA
   ============================================================ */
(function init(){
  try{
    var loaded = load();
    if(!loaded || !state) state = newState();
    if(!state.cur) state.cur = newCur();
    if(!state.stock) state.stock = newStock();
    if(!state.reviews) state.reviews = [];
    if(!state.history) state.history = [];
    if(!state.tot) state.tot = {rev:0,cost:0,served:0};
    if(!state.upg) state.upg = {};
    if(!state.staff) state.staff = {};
    if(!state.unlocked) state.unlocked = {};
    if(!state.sell) state.sell = {};
    if(!state.goalsDay || state.goalsDay!==state.day) makeGoals();
    renderSplash();
  }catch(err){
    console.error('LỖI KHỞI ĐỘNG GAME:', err);
    var viewEl = document.getElementById('view');
    if(viewEl){
      viewEl.innerHTML =
        '<div style="padding:24px;font-family:sans-serif;color:#4A2A2A;max-width:480px;margin:0 auto">' +
        '<h2>Game gặp lỗi khi khởi động</h2>' +
        '<p style="color:#C7362B;font-family:monospace;font-size:12px;word-break:break-all">' +
        (err && err.message ? err.message : String(err)) + '</p>' +
        '<p>Mở Console (F12) để xem chi tiết. Bấm nút bên dưới để xoá dữ liệu cũ và thử lại.</p>' +
        '<button onclick="localStorage.removeItem(\'gaRan1\');location.reload()" ' +
        'style="padding:10px 20px;border-radius:10px;background:#EF4B3F;color:#fff;border:0;font-weight:700;cursor:pointer">' +
        'Xoá dữ liệu và tải lại</button></div>';
    }
  }
})();

/* Debug hook */
window.__game = {state: state, ui: ui, ITEMS: ITEMS, level: level};
})();