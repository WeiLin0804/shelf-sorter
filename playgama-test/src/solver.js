import { canMove, move, clone, isSolved } from './rules.js';

// 貨架位置對可解性等價；保留實際節點的座標，回傳可直接操作的路徑。
const key = board => board.map(s=>s.join(',')).sort().join('|');
export function solve(board, maxStates=100000) {
  if(isSolved(board)) return {status:'solved',path:[]};
  const queue=[{board:clone(board),parent:-1,step:null}];
  const seen=new Set([key(board)]);
  for(let head=0; head<queue.length; head++) {
    if(head>=maxStates) return {status:'limited',path:[]};
    const node=queue[head];
    for(let from=0;from<board.length;from++) for(let to=0;to<board.length;to++) {
      if(!canMove(node.board,from,to))continue;
      const next=move(node.board,from,to), stateKey=key(next);
      if(seen.has(stateKey))continue;
      seen.add(stateKey);
      const child={board:next,parent:head,step:{from,to}};
      queue.push(child);
      if(isSolved(next)) {
        const path=[];let current=child;
        while(current.parent!==-1) {path.push(current.step);current=queue[current.parent];}
        return {status:'solved',path:path.reverse()};
      }
    }
  }
  return {status:'dead',path:[]};
}
export function recovery(history) {
  for(let i=history.length-1;i>=0;i--) {
    const result=solve(history[i]);
    if(result.status==='limited') return {status:'limited'};
    if(result.status==='solved')return {status:'solved',board:clone(history[i]),steps:history.length-i,index:i};
  }
  return {status:'missing'};
}
