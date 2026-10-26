import { LEVELS, PRODUCTS } from './levels.js';
import { canMove } from './rules.js';
const $=id=>document.getElementById(id);
export function render(game, arrival=null) {
  document.body.classList.toggle('reduced',game.settings.reduced);
  const level=LEVELS[game.level];
  $('level-badge').textContent=`第 ${game.level+1} 關 / 共 ${LEVELS.length} 關`;
  $('level-title').textContent=level.title;
  $('level-note').textContent=level.note;
  $('journey-count').textContent=`${game.passed.length} / ${LEVELS.length}`;
  const journeyScroll=$('journey').scrollTop;
  $('journey').innerHTML=LEVELS.map((l,i)=>`<button class="journey-item ${i===game.level?'current':''}" data-action="choose" data-level="${i}" ${i>game.unlocked?'disabled':''} ${i===game.level?'aria-current="step"':''}><span class="journey-number">${String(i+1).padStart(2,'0')}</span><span>${l.title}</span><span class="journey-check">${game.passed.includes(i)?'✓':i>game.unlocked?'·':''}</span></button>`).join('');
  $('journey').scrollTop=journeyScroll;
  $('sound-button').setAttribute('aria-label',game.settings.sound?'關閉音效':'開啟音效');
  $('sound-button').setAttribute('aria-pressed',String(game.settings.sound));
  $('sound-button').innerHTML=`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 4 6 8H3v8h3l5 4z"/>${game.settings.sound?'<path d="M15 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>':'<path d="m16 9 5 6m0-6-5 6"/>'}</svg>`;
  const reveal=game.hint?.stage===2;
  $('shelves').innerHTML=game.board.map((shelf,i)=>{
    const selected=game.selected===i,done=shelf.length===3&&shelf.every(x=>x===shelf[0]);
    const legal=game.selected!==null&&canMove(game.board,game.selected,i);
    const source=reveal&&game.hint.step.from===i&&!selected,target=reveal&&game.hint.step.to===i;
    const names=shelf.length?shelf.map(id=>PRODUCTS[id].name).join('、'):'空貨架';
    const letter=String.fromCharCode(65+i);
    return `<button type="button" class="shelf ${selected?'selected':''} ${legal?'legal':''} ${source?'hint-source':''} ${target?'hint-target':''} ${done?'done':''}" data-shelf="${i}" aria-label="貨架 ${letter}：${names}${selected?'，已選取':''}" aria-pressed="${selected}" ${game.paused||game.busy||game.completed||!game.started?'disabled':''}>
    <span class="shelf-label" aria-hidden="true">${letter}</span>
    ${Array.from({length:3},(_,n)=>shelf[n]?`<span class="slot ${selected&&n===shelf.length-1?'picked':''} ${arrival===i&&n===shelf.length-1?'arrival':''}"><svg class="product-icon" viewBox="0 0 80 96" aria-hidden="true"><use href="assets/products.svg#${shelf[n]}"/></svg><span class="product-name">${PRODUCTS[shelf[n]].name}</span></span>`:'<span class="slot empty" aria-hidden="true"></span>').join('')}
    <span class="shelf-tail" aria-hidden="true">${done?'✓':'←'}</span></button>`;
  }).join('');
  $('feedback').textContent=game.message||(game.completed?'今天的小店，整理好了。':game.selected!==null?`已選取${PRODUCTS[game.board[game.selected].at(-1)].name}，點亮起的貨架放下；再點原架取消。`:'點選商品所在貨架，再點要放的位置。');
  $('hint-panel').hidden=!game.hint;
  if(game.hint){
    $('hint-text').textContent=game.hint.text;
    const next=$('hint-next');next.hidden=!game.hint.step&&!game.hint.recovery;
    next.dataset.action=game.hint.recovery?'recover':'reveal';
    next.textContent=game.hint.recovery?`幫我退回 ${game.hint.recovery.steps} 步`:game.hint.stage===2?'已標示這一步':'看這一步';
    next.disabled=game.hint.stage===2;
  }
  $('undo-button').disabled=!game.history.length||game.paused||game.busy||game.completed;
  $('hint-button').disabled=game.paused||game.busy||game.completed;
  $('hint-button').hidden=game.completed;$('undo-button').hidden=game.completed;
  $('next-button').hidden=!game.completed;
  $('next-button').textContent=game.isLastLevel?'選關重玩 →':'下一關 →';
}
export function flashShelf(index,invalid=false){
  const el=document.querySelector(`[data-shelf="${index}"]`);if(!el)return;
  el.classList.add(invalid?'invalid':'flash');
}
export function openDialog(title,body,buttons,kicker='留一點時間給自己',art=false){
  const dialog=$('dialog');
  $('dialog-content').innerHTML=`${art?'<img class="dialog-art" src="assets/shop.svg" alt="小雜貨店">':''}<div class="dialog-kicker">${kicker}</div><h2 id="dialog-title" class="dialog-title">${title}</h2>${body}<div class="dialog-buttons">${buttons}</div>`;
  if(!dialog.open)dialog.showModal();
  requestAnimationFrame(()=>dialog.querySelector('button:not(:disabled)')?.focus());
}
export function closeDialog(){ $('dialog').close(); }
export const dialogButton=(action,label,primary=false,extra='')=>`<button data-action="${action}" class="${primary?'primary':'dialog-secondary'}" ${extra}>${label}</button>`;
export function status(message,warning=false){
  $('save-warning').hidden=!warning;$('save-warning').textContent=warning?message:'';
  $('save-status').textContent=warning?'本次進度未保存':message;
}
