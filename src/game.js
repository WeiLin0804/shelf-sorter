import { LEVELS, PRODUCTS } from './levels.js';
import { canMove, move, clone, isSolved } from './rules.js';
import { solve, recovery } from './solver.js';

export class Game {
  get isLastLevel(){return this.level===LEVELS.length-1;}
  constructor(saved=null) {
    this.level=0;this.board=clone(LEVELS[0].shelves);this.history=[];
    this.unlocked=0;this.passed=[];this.settings={sound:true,reduced:false};
    this.started=false;this.completed=false;
    if(saved) {
      this.level=saved.level;this.board=clone(saved.board);this.history=saved.history.map(clone);
      this.unlocked=saved.unlocked;this.passed=[...saved.passed];this.settings={...saved.settings};
      this.started=saved.started;this.completed=isSolved(this.board);
    }
    this.selected=null;this.hint=null;this.paused=false;this.busy=false;this.message='';
    this.lastMove=Date.now();this.nudged=false;
  }
  start(index, now=Date.now()) {
    if(!LEVELS[index])return;
    this.level=index;this.board=clone(LEVELS[index].shelves);this.history=[];
    this.unlocked=Math.max(this.unlocked,index);this.started=true;this.completed=false;
    this.selected=null;this.hint=null;this.paused=false;this.busy=false;this.message='';
    this.lastMove=now;this.nudged=false;
  }
  pick(index, now=Date.now()) {
    if(this.paused||this.busy||this.completed||!this.board[index])return {type:'ignored'};
    if(this.selected===index){this.selected=null;this.hint=null;this.message='';return {type:'cancel'};}
    if(this.selected===null) {
      if(!this.board[index].length){this.message='先選一件商品，再放到這裡。';return {type:'empty',index};}
      if(this.hint && (this.hint.stage!==2||this.hint.step?.from!==index))this.hint=null;
      this.selected=index;this.message='';return {type:'select'};
    }
    if(!canMove(this.board,this.selected,index)) {
      this.message=this.board[index].length===3?'這個貨架放滿了。':'只能放在相同商品旁邊，或空貨架。';
      return {type:'invalid',index};
    }
    const from=this.selected, product=this.board[from].at(-1);
    this.history.push(clone(this.board));this.board=move(this.board,from,index);
    this.selected=null;this.hint=null;this.message='';this.lastMove=now;this.nudged=false;
    this.completed=isSolved(this.board);
    if(this.completed) {
      if(!this.passed.includes(this.level))this.passed.push(this.level);
      this.unlocked=Math.max(this.unlocked,Math.min(LEVELS.length-1,this.level+1));
    }
    return {type:'move',from,to:index,product,completed:this.completed};
  }
  undo() {
    if(this.paused||this.busy||this.completed||!this.history.length)return false;
    this.board=this.history.pop();this.selected=null;this.hint=null;this.message='';return true;
  }
  requestHint() {
    if(this.paused||this.busy||this.completed)return;
    this.selected=null;this.nudged=true;this.message='';
    const result=solve(this.board);
    if(result.status==='solved'&&result.path.length) {
      const step=result.path[0],name=PRODUCTS[this.board[step.from].at(-1)].name;
      const destination=this.board[step.to];
      this.hint={stage:1,step,text:destination.length?`讓${name}和同伴靠在一起，也能替原來的貨架騰出空間。`:`先讓${name}在空架休息，露出裡面的商品。`};
    } else if(result.status==='dead') {
      const back=recovery(this.history);
      this.hint=back.status==='solved'?{stage:1,recovery:back,text:`退回 ${back.steps} 步，就能換個順序繼續整理。`}:{stage:1,text:'暫時無法找到退回位置，可以先復原一步再看看。'};
    } else this.hint={stage:1,text:'這次還沒找到建議，這不代表沒有解。可以先自己試試。'};
  }
  revealHint(){if(this.hint?.step)this.hint.stage=2;}
  dismissHint(){this.hint=null;this.selected=null;this.message='';this.nudged=true;}
  recover() {
    if(!this.hint?.recovery||this.paused||this.busy)return false;
    const back=this.hint.recovery;this.board=clone(back.board);this.history=this.history.slice(0,back.index);
    this.selected=null;this.hint=null;this.message='已退回可以繼續整理的位置。';this.nudged=true;return true;
  }
  pause(){this.paused=true;this.selected=null;this.hint=null;this.message='';}
  resume(){this.paused=false;this.lastMove=Date.now();}
  restart(){this.start(this.level);}
  shouldNudge(now=Date.now()){return this.started&&!this.completed&&!this.paused&&!this.busy&&!this.hint&&!this.nudged&&now-this.lastMove>=30000;}
  snapshot(){return {version:1,level:this.level,board:clone(this.board),history:this.history.map(clone),unlocked:this.unlocked,passed:[...this.passed],settings:{...this.settings},started:this.started,completed:this.completed};}
}
