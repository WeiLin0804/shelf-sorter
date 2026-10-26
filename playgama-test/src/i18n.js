import { LEVELS } from './levels.js';
let language='zh';
export const getLanguage=()=>language;
export function setLanguage(value){language=String(value).toLowerCase().startsWith('zh')?'zh':'en';return language;}
const englishLevels=[
  ['One last item','Return the last cookie to its friends.'],['A little spare space','Borrow an empty shelf to uncover the items behind.'],['A new friend','Take your time. Find a place for one item at a time.'],['Make a little room','Gently make space and bring matching items together.'],['A whole little shop','Four everyday comforts. A friendly hint is always here.'],
  ['An afternoon delivery','A new delivery. Start wherever feels comfortable.'],['Cookies meet tea','Leave a little space for friends. It will come together.'],['Room for a small surprise','Settle the outer items, then see what is behind.'],['Slow moments by the window','A gentle little tidy is enough today.'],['Halfway, one small success','Halfway already. It is fine to think slowly.'],
  ['A honey-coloured afternoon','Find a pair that can rest together.'],['A familiar little rhythm','Make room a little at a time, in your own way.'],['A little detour','Borrow the empty shelf. No need to finish in one move.'],['A cup of tea for yourself','Relax and let matching items come together.'],['An afternoon practice','Think one small step ahead. Hints are always here.'],
  ['A little breathing room','There is no rush. Take this shelf slowly too.'],['Everyday things in order','Look after this one item. The rest can wait.'],['A tidy before closing','Settle the outer items to reveal more room.'],['The last warm sunlight','Bring your familiar little tricks together.'],['A lovely tidy today','One last small challenge. Finish at your own pace.']
];
export function levelText(index){return language==='zh'?LEVELS[index]:{title:englishLevels[index][0],note:englishLevels[index][1]};}
const pairs={
  '貨架整理王':'Shelf Sorter','小店日常':'Little Shop','一間小店，一點小成就':'A little shop, a little joy','慢慢整理，':'Tidy slowly,','好好生活':'live gently','。':'.',
  '留一點時間，給整齊的小日常。':'Make a little room for everyday calm.','本機試玩版':'Playgama edition','網頁試玩版':'Playgama edition','平台試玩版':'Playgama edition',
  '讓每件商品找到同伴，':'Let every item find its friends,','也讓心情，回到舒服的位置。':'and let your mind find a little peace.','今天的整理旅程':'Your little tidy journey',
  '沒有倒數，不用趕路。':'No countdown, no rush.','需要的時候，提示一直都在。':'A friendly hint is always here.','進度透過平台保存':'Progress is saved through the platform','不同網站的進度不會自動搬移':'Progress does not transfer from other websites',
  '同類放一起，每架最多三件':'Match items · three per shelf','從右端取放':'Move from the right end','點選商品所在貨架，再點要放的位置。':'Choose a shelf, then choose where to put its rightmost item.',
  '看這一步':'Show me a move','自己試試':'Try it myself','復原一步':'Undo','給我一點提示':'A little hint','下一關 →':'Next level →','選關重玩 →':'Choose a level →',
  '按自己的步調就好':'At your own pace','只在這個瀏覽器保存':'Saved through the platform','本次進度未保存':'Progress is not saved','正在保存進度…':'Saving progress…','進度已透過平台保存':'Progress saved through the platform',
  '關小旅程':'gentle levels','20 關小旅程':'20 gentle levels','無計時・無評分':'No timer · no score','歡迎來到你的小店':'Welcome to your little shop',
  '一件一件，讓商品找到同伴。':'One by one, let items find their friends.','沒有倒數，也沒有分數，':'No countdown and no score,','依照自己的步調整理就好。':'just tidy at your own pace.',
  '開始整理 →':'Start tidying →','慢慢整理，好好生活':'Tidy slowly, live gently','休息一下也很好':'A little rest is lovely too','進度留在這裡，準備好了再繼續。':'Your progress is here. Continue whenever you are ready.',
  '繼續整理':'Keep tidying','選擇關卡':'Choose a level','音效與動畫設定':'Sound and motion','重玩本關':'Restart this level','今天的小店，整理好了':'Your little shop is all tidy','又一個整齊的小角落':'Another cosy corner, all tidy',
  '謝謝你，替每件商品找到舒服的位置。':'Thank you for finding a cosy place for every item.','看看眼前整整齊齊的貨架。':'Look at those lovely tidy shelves.','這份小成就，值得停下來欣賞。':'This little success deserves a moment of joy.',
  '選關重玩':'Play a level again','留在這裡欣賞':'Stay and enjoy','每一件商品，都有自己的位置':'A little place for every item','今天想整理哪一架？':'What shall we tidy today?','按自己的步調，慢慢來就好。':'Take it slowly, at your own pace.',
  '已完成':'Complete','尚未解鎖':'Locked','整理中':'In progress','可開始':'Ready','返回':'Back','換一個角落整理？':'Tidy a different corner?',
  '切換關卡後，目前這一關下次會重新開始。':'Switching levels will restart this arrangement next time.','已解鎖與通關紀錄會保留。':'Unlocked levels and completed levels will stay.',
  '切換關卡':'Switch level','舒服的整理方式':'Make yourself comfortable','播放柔和音效':'Gentle sound effects','減少動畫':'Reduce motion','返回選單':'Back to menu',
  '重新整理這一關？':'Start this level again?','本關會回到初始排列，復原紀錄也會重設。':'This level and its undo history will start over.','重新開始':'Start again','留一點時間給自己':'A little time for yourself','小雜貨店':'A little corner shop',
  '關閉音效':'Mute sound','開啟音效':'Enable sound','空貨架':'Empty shelf','，已選取':', selected','今天的小店，整理好了。':'Your little shop is all tidy.',
  '先選一件商品，再放到這裡。':'Choose an item first, then put it here.','這個貨架放滿了。':'This shelf is full.','只能放在相同商品旁邊，或空貨架。':'Use an empty shelf or one with the same item.',
  '暫時無法找到退回位置，可以先復原一步再看看。':'Try undoing one move and taking another look.','這次還沒找到建議，這不代表沒有解。可以先自己試試。':'No suggestion yet, but a solution may still exist. Try a little move.',
  '已退回可以繼續整理的位置。':'Back to a place where you can keep tidying.','已標示這一步':'Move highlighted',
  '無法讀取原有進度。已保留原存檔，本次可暫時試玩，但不會覆寫保存。':'Your saved progress could not be read. It is protected. You can play, but this session will not be saved.',
  '原有存檔已保留；本次進度暫時不會保存。':'Your original save is protected. This session will not be saved.','目前無法保存，離開後可能遺失進度。':'Saving is unavailable. Progress may be lost when you leave.',
  '進度格式不符，未寫入平台存檔。':'Progress could not be validated and was not saved.','平台暫停中，稍後繼續':'Paused by the platform. We will continue shortly.',
  '正在準備下一關…':'Getting the next level ready…','正在載入小店…':'Opening your little shop…','連線暫時不順':'A little connection trouble',
  '平台服務暫時無法連線，請重新載入再試一次。':'The platform service is unavailable. Please reload and try again.','重新載入':'Reload','語言':'Language',
  '貨架整理王，開啟選單':'Shelf Sorter, open menu','暫停與設定':'Pause and settings','關卡旅程':'Level journey','貨架整理遊戲':'Shelf sorting game','商品貨架':'Product shelves','整理提示':'Tidy hints'
};
LEVELS.forEach((l,i)=>{pairs[l.title]=englishLevels[i][0];pairs[l.note]=englishLevels[i][1];});
const product={牛奶:'milk',餅乾:'cookies',茶罐:'tea',蜂蜜:'honey'};
export function t(text){
  if(language==='zh')return text;
  if(Object.hasOwn(pairs,text))return pairs[text];
  let m;
  if((m=text.match(/^第 (\d+) 關 \/ 共 (\d+) 關$/)))return `Level ${m[1]} / ${m[2]}`;
  if((m=text.match(/^(\d+) 關小旅程走到這裡了。$/)))return `Your journey through ${m[1]} gentle levels is complete.`;
  if((m=text.match(/^幫我退回 (\d+) 步$/)))return `Undo ${m[1]} moves for me`;
  if((m=text.match(/^退回 (\d+) 步，就能換個順序繼續整理。$/)))return `Undo ${m[1]} moves to try a different order.`;
  if((m=text.match(/^讓(.+)和同伴靠在一起，也能替原來的貨架騰出空間。$/)))return `Bring the ${product[m[1]]||m[1]} together to make room on the original shelf.`;
  if((m=text.match(/^先讓(.+)在空架休息，露出裡面的商品。$/)))return `Let the ${product[m[1]]||m[1]} rest on an empty shelf to uncover what is behind it.`;
  if((m=text.match(/^已選取(.+)，點亮起的貨架放下；再點原架取消。$/)))return `${product[m[1]]||m[1]} selected. Choose a highlighted shelf, or tap the same shelf to cancel.`;
  if((m=text.match(/^貨架 ([A-E])：(.+)$/)))return `Shelf ${m[1]}: ${m[2].replace('，已選取','').split('、').map(x=>product[x]||t(x)).join(', ')}${m[2].endsWith('，已選取')?', selected':''}`;
  if((m=text.match(/^(\d{2})　(.+)$/)))return `${m[1]}  ${t(m[2])}`;
  return product[text]||text;
}
const original=new WeakMap();
const originalAlt=new WeakMap();
// 保留每個節點的原文，切換語言時可恢復繁體中文；不碰遊戲狀態與商品識別碼。
export function translatePage(root=document.body){
  document.documentElement.lang=language==='zh'?'zh-Hant':'en';
  document.title=language==='zh'?'貨架整理王｜慢慢整理，好好生活':'Shelf Sorter | Tidy slowly, live gently';
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){
    if(node.parentElement?.closest('script,style'))continue;
    const current=node.nodeValue,old=original.get(node);
    const source=old&&old.result===current?old.source:current;
    const trimmed=source.trim(),result=trimmed?source.replace(trimmed,t(trimmed)):source;
    node.nodeValue=result;original.set(node,{source,result});
  }
  for(const el of root.querySelectorAll('[aria-label]')){
    const current=el.getAttribute('aria-label'),old=original.get(el);
    const source=old&&old.result===current?old.source:current,result=t(source);
    el.setAttribute('aria-label',result);original.set(el,{source,result});
  }
  for(const el of root.querySelectorAll('img[alt]')){
    const source=originalAlt.get(el)||el.getAttribute('alt');originalAlt.set(el,source);el.setAttribute('alt',t(source));
  }
}
