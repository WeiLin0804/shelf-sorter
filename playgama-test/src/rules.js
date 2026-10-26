export const clone = board => board.map(shelf => [...shelf]);
export function canMove(board, from, to) {
  if (!Number.isInteger(from) || !Number.isInteger(to) || from === to) return false;
  const a=board[from], b=board[to];
  return !!(a?.length && b && b.length < 3 && (!b.length || a.at(-1) === b.at(-1)));
}
export function move(board, from, to) {
  const next=clone(board);
  if (canMove(board,from,to)) next[to].push(next[from].pop());
  return next;
}
export function isSolved(board) {
  return board.some(s => s.length) && board.every(s => !s.length || (s.length === 3 && s.every(x => x === s[0])));
}
export const sameBoard = (a,b) => JSON.stringify(a) === JSON.stringify(b);
export function isTransition(before, after) {
  for (let i=0;i<before.length;i++) for(let j=0;j<before.length;j++) {
    if(canMove(before,i,j) && sameBoard(move(before,i,j),after)) return true;
  }
  return false;
}
