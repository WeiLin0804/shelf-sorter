import { Platform } from './platform.js';
import { PlatformStore } from './platform-store.js';
import { setLanguage, translatePage } from './i18n.js';
import { mountGame } from './main.js';

setLanguage(navigator.language);translatePage();
const boot=document.getElementById('boot-screen');
try{
  const platform=new Platform(window.bridge);
  await platform.initialize();setLanguage(platform.language);translatePage();
  const store=new PlatformStore(window.bridge.storage),loaded=await store.load();
  mountGame(platform,store,loaded);boot.hidden=true;
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  await platform.ready();
}catch{
  console.warn('遊戲尚未完成平台準備，請重新載入。');
  boot.hidden=false;
  document.getElementById('dialog').close();
  for(const el of document.querySelectorAll('header,main,footer,dialog'))el.inert=true;
  boot.innerHTML='<div><h1>連線暫時不順</h1><p>平台服務暫時無法連線，請重新載入再試一次。</p><button id="reload-game">重新載入</button></div>';
  document.getElementById('reload-game').addEventListener('click',()=>window.location.reload());
  translatePage();
}
