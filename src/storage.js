import { LEVELS, PRODUCTS } from './levels.js';
import { sameBoard, isTransition, isSolved } from './rules.js';
export const STORAGE_KEY='shelf-sorter.v1';
function validBoard(board,level) {
  if(!Array.isArray(board)||board.length!==LEVELS[level].shelves.length)return false;
  const counts={};
  for(const shelf of board){
    if(!Array.isArray(shelf)||shelf.length>3)return false;
    for(const id of shelf){if(!Object.hasOwn(PRODUCTS,id))return false;counts[id]=(counts[id]||0)+1;}
  }
  const expected={};for(const id of LEVELS[level].shelves.flat())expected[id]=(expected[id]||0)+1;
  return Object.keys(counts).length===Object.keys(expected).length&&Object.entries(expected).every(([id,n])=>counts[id]===n);
}
export function validateSave(s) {
  if(!s||s.version!==1||!Number.isInteger(s.level)||!LEVELS[s.level])return false;
  if(!Number.isInteger(s.unlocked)||s.unlocked<s.level||s.unlocked>=LEVELS.length||!Array.isArray(s.passed)||!s.passed.every(n=>Number.isInteger(n)&&n>=0&&n<=s.unlocked))return false;
  if(typeof s.started!=='boolean'||typeof s.completed!=='boolean'||!s.settings||typeof s.settings.sound!=='boolean'||typeof s.settings.reduced!=='boolean')return false;
  if(!validBoard(s.board,s.level)||!Array.isArray(s.history)||s.completed!==isSolved(s.board))return false;
  let previous=LEVELS[s.level].shelves;
  if(!s.history.length)return sameBoard(s.board,previous);
  if(!sameBoard(s.history[0],previous))return false;
  for(let i=0;i<s.history.length;i++) {
    if(!validBoard(s.history[i],s.level))return false;
    if(i>0&&!isTransition(previous,s.history[i]))return false;
    previous=s.history[i];
  }
  return isTransition(previous,s.board);
}
export class Store {
  constructor(storage){this.storage=storage;this.blocked=false;}
  load(){
    try {
      const raw=this.storage.getItem(STORAGE_KEY);if(raw===null||raw===undefined)return {status:'empty'};
      const data=JSON.parse(raw);
      if(!validateSave(data))throw new Error('存檔格式不符');
      // 關卡擴充不改存檔格式；舊版終點通關者開放下一關，保留排列與歷史。
      if(data.passed.length)data.unlocked=Math.max(data.unlocked,Math.min(LEVELS.length-1,Math.max(...data.passed)+1));
      return {status:'ok',data};
    }catch{this.blocked=true;return {status:'blocked',message:'無法讀取原有進度。已保留原存檔，本次可暫時試玩，但不會覆寫保存。'};}
  }
  save(data){
    if(this.blocked)return {ok:false,message:'原有存檔已保留；本次進度暫時不會保存。'};
    try{this.storage.setItem(STORAGE_KEY,JSON.stringify(data));return {ok:true};}
    catch{return {ok:false,message:'目前無法保存，離開後可能遺失進度。'};}
  }
}
