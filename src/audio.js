// 音效集中管理；暫停時關閉舊音訊狀態，避免下次恢復播放殘留聲音。
export class Sound {
  constructor(createContext){this.createContext=createContext;this.context=null;}
  stop(){
    const old=this.context;this.context=null;
    if(old)old.close().catch(()=>{});
  }
  play(completed=false){
    try{
      this.context??=this.createContext();if(!this.context)return;
      const audio=this.context;audio.resume().catch(()=>{});const now=audio.currentTime;
      for(const [i,f] of (completed?[523.25,659.25,783.99]:[659.25]).entries()){
        const oscillator=audio.createOscillator(),gain=audio.createGain(),start=now+i*.12;
        oscillator.type='sine';oscillator.frequency.value=f;gain.gain.setValueAtTime(0,start);
        gain.gain.linearRampToValueAtTime(.035,start+.012);gain.gain.exponentialRampToValueAtTime(.0001,start+.30);
        oscillator.connect(gain);gain.connect(audio.destination);oscillator.start(start);oscillator.stop(start+.32);
      }
    }catch{console.warn('音效暫時無法播放，遊戲仍可繼續。');}
  }
}
