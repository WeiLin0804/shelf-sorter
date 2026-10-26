import { Game } from './game.js';
import { Store } from './storage.js';
import { LEVELS } from './levels.js';
import { Sound } from './audio.js';
import { render, flashShelf, openDialog, closeDialog, dialogButton as button, status } from './view.js';

let storage;
try{storage=window.localStorage;}catch{storage={getItem(){throw new Error('無法使用本機保存');}};}
const store=new Store(storage),loaded=store.load();
const game=new Game(loaded.status==='ok'?loaded.data:null);
let animationTimer=null, feedbackTimer=null, mode='',pendingLevel=null;
const sound=new Sound(()=>{const Context=window.AudioContext||window.webkitAudioContext;return Context?new Context():null;});
const paragraph=text=>`<p class="dialog-text">${text}</p>`;
const reduced=()=>game.settings.reduced||window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function persist(){
  const result=store.save(game.snapshot());
  status(result.ok?'進度已保存在這個瀏覽器':result.message,!result.ok);
}
function paint(arrival=null){render(game,arrival);}
function stopAudio(){sound.stop();}
function chime(completed=false){
  if(!game.settings.sound||game.paused||document.hidden)return;
  sound.play(completed);
}
function endMotion(){clearTimeout(animationTimer);animationTimer=null;game.busy=false;}
function startLevel(index){
  endMotion();game.start(index);pendingLevel=null;closeDialog();mode='';paint();persist();
}
function welcome(){
  mode='welcome';game.pause();paint();
  openDialog('歡迎來到你的小店',paragraph('一件一件，讓商品找到同伴。<br>沒有倒數，也沒有分數，<br>依照自己的步調整理就好。'),button('begin','開始整理 →',true), '慢慢整理，好好生活',true);
}
function paused(){
  mode='pause';endMotion();game.pause();stopAudio();paint();persist();
  openDialog('休息一下也很好',paragraph('進度留在這裡，準備好了再繼續。'),button('resume','繼續整理',true)+button('levels','選擇關卡')+button('settings','音效與動畫設定')+button('restart-confirm','重玩本關'));
}
function complete(){
  mode='complete';
  openDialog(game.isLastLevel?'今天的小店，整理好了':'又一個整齊的小角落',paragraph(game.isLastLevel?`${LEVELS.length} 關小旅程走到這裡了。<br>謝謝你，替每件商品找到舒服的位置。`:'看看眼前整整齊齊的貨架。<br>這份小成就，值得停下來欣賞。'),button('next',game.isLastLevel?'選關重玩':'下一關 →',true)+button('admire','留在這裡欣賞'),'每一件商品，都有自己的位置',true);
}
function levels(){
  mode='levels';endMotion();game.pause();stopAudio();paint();persist();
  const choices=LEVELS.map((l,i)=>`<button class="level-choice" data-action="choose" data-level="${i}" ${i>game.unlocked?'disabled':''}><span>${String(i+1).padStart(2,'0')}　${l.title}</span><small>${game.passed.includes(i)?'已完成':i>game.unlocked?'尚未解鎖':i===game.level&&game.started?'整理中':'可開始'}</small></button>`).join('');
  openDialog('今天想整理哪一架？',paragraph('按自己的步調，慢慢來就好。'),choices+button(game.started?'resume':'welcome','返回'));
}
function choose(index){
  if(!Number.isInteger(index)||index<0||index>game.unlocked)return;
  if(game.started&&index===game.level&&!game.completed){closeDialog();mode='';game.resume();paint();return;}
  if(game.started&&!game.completed){
    pendingLevel=index;mode='switch';endMotion();game.pause();stopAudio();paint();
    openDialog('換一個角落整理？',paragraph('切換關卡後，目前這一關下次會重新開始。<br>已解鎖與通關紀錄會保留。'),button('resume','繼續整理',true)+button('switch','切換關卡'));
  }else startLevel(index);
}
function settings(){
  mode='settings';
  openDialog('舒服的整理方式',`<div class="settings-group"><label class="setting-row">播放柔和音效<input type="checkbox" id="setting-sound" ${game.settings.sound?'checked':''}></label><label class="setting-row">減少動畫<input type="checkbox" id="setting-reduced" ${game.settings.reduced?'checked':''}></label></div>`,button('menu','返回選單',true));
}
function handle(action,el){
  if(game.busy&&!['menu','sound'].includes(action))return;
  switch(action){
    case 'begin':startLevel(0);break;
    case 'welcome':welcome();break;
    case 'menu':if(!game.started)welcome();else paused();break;
    case 'resume':
      pendingLevel=null;closeDialog();mode='';game.resume();paint();
      if(game.completed)complete();break;
    case 'levels':levels();break;
    case 'choose':choose(Number(el.dataset.level));break;
    case 'switch':if(pendingLevel!==null)startLevel(pendingLevel);break;
    case 'restart-confirm':
      mode='restart';openDialog('重新整理這一關？',paragraph('本關會回到初始排列，復原紀錄也會重設。<br>已解鎖與通關紀錄會保留。'),button('resume','繼續整理',true)+button('restart','重新開始'));break;
    case 'restart':startLevel(game.level);break;
    case 'undo':if(game.undo()){paint();persist();}break;
    case 'hint':game.requestHint();paint();break;
    case 'reveal':game.revealHint();paint();break;
    case 'dismiss-hint':game.dismissHint();paint();break;
    case 'recover':if(game.recover()){paint();persist();}break;
    case 'sound':game.settings.sound=!game.settings.sound;if(!game.settings.sound)stopAudio();paint();persist();break;
    case 'settings':settings();break;
    case 'next':if(!game.completed)return;if(game.isLastLevel)levels();else startLevel(game.level+1);break;
    case 'admire':closeDialog();mode='';paint();break;
  }
}
document.addEventListener('click',event=>{
  const el=event.target.closest('[data-action]');if(el){event.preventDefault();handle(el.dataset.action,el);return;}
  const shelf=event.target.closest('[data-shelf]');if(!shelf)return;
  const index=Number(shelf.dataset.shelf),result=game.pick(index);
  if(result.type==='ignored')return;
  clearTimeout(feedbackTimer);
  if(result.type==='move'){
    game.busy=true;paint(result.to);persist();chime(result.completed);
    animationTimer=setTimeout(()=>{game.busy=false;paint();if(game.completed)complete();else document.querySelector(`[data-shelf="${result.to}"]`)?.focus({preventScroll:true});},reduced()?20:240);
  }else{
    paint();document.querySelector(`[data-shelf="${index}"]`)?.focus({preventScroll:true});
    if(result.type==='invalid'||result.type==='empty'){
      flashShelf(index,result.type==='invalid');
      feedbackTimer=setTimeout(()=>{game.message='';paint();},2500);
    }
  }
});
document.addEventListener('change',event=>{
  if(event.target.id==='setting-sound')game.settings.sound=event.target.checked;
  else if(event.target.id==='setting-reduced')game.settings.reduced=event.target.checked;
  else return;
  if(!game.settings.sound)stopAudio();paint();persist();
});
document.getElementById('dialog').addEventListener('cancel',event=>{
  event.preventDefault();
  if(mode==='welcome')return;
  if(mode==='complete'){closeDialog();mode='';}
  else handle('resume');
});
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){endMotion();stopAudio();if(game.started)paused();}
});
window.addEventListener('pagehide',()=>{if(game.started)persist();});
setInterval(()=>{
  if(document.hidden||document.getElementById('dialog').open||!game.shouldNudge())return;
  game.nudged=true;const hint=document.getElementById('hint-button');hint.classList.remove('nudge');void hint.offsetWidth;hint.classList.add('nudge');
},1000);

paint();
if(loaded.status==='blocked')status(loaded.message,true);
if(game.started){if(game.completed)complete();else paused();}else welcome();
