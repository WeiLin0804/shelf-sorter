// 所有 Bridge 生命週期集中管理；不記錄 SDK 例外內容或玩家資料。
export class Platform {
  constructor(bridge,{now=()=>performance.now(),adTimeout=30000}={}){
    this.bridge=bridge;this.now=now;this.adTimeout=adTimeout;this.initialized=false;
    this.hostPaused=false;this.adBusy=false;this.adOpen=false;this.audioEnabled=false;this.readySent=false;
    this.lastAttempt=now();this.onChange=()=>{};
  }
  get blocked(){return this.hostPaused||this.adBusy||this.adOpen;}
  get language(){return this.bridge.platform.language;}
  async initialize(){
    if(!this.bridge)throw new Error('平台服務尚未載入');
    try{
      await this.bridge.initialize();this.initialized=true;
      this.audioEnabled=this.bridge.platform.isAudioEnabled===true;
      this.hostPaused=this.bridge.platform.isPaused===true;
      const events=this.bridge.EVENT_NAME;
      this.adOpen=this.bridge.advertisement.interstitialState==='opened';
      // 全程監聽，包含請求逾時後才開啟的廣告；SDK 的載入無法由遊戲取消。
      this.bridge.advertisement.on(events.INTERSTITIAL_STATE_CHANGED,state=>{
        if(state==='opened')this.adOpen=true;
        if(state==='closed'||state==='failed')this.adOpen=false;
        this.onChange();
      });
      this.bridge.platform.on(events.AUDIO_STATE_CHANGED,value=>{this.audioEnabled=value===true;this.onChange();});
      this.bridge.platform.on(events.PAUSE_STATE_CHANGED,value=>{this.hostPaused=value===true;this.onChange();});
      this.onChange();
    }catch{this.initialized=false;console.warn('平台服務初始化失敗。');throw new Error('平台服務初始化失敗');}
  }
  async ready(){
    if(!this.initialized)throw new Error('平台服務尚未就緒');
    if(this.readySent)return;
    try{await this.bridge.platform.sendMessage('game_ready');this.readySent=true;}
    catch{console.warn('平台載入完成通知失敗。');throw new Error('平台載入完成通知失敗');}
  }
  async betweenLevels(){
    if(!this.initialized||this.blocked||this.now()-this.lastAttempt<180000||!this.bridge.advertisement.isInterstitialSupported)return false;
    this.lastAttempt=this.now();this.adBusy=true;this.onChange();
    const ads=this.bridge.advertisement,event=this.bridge.EVENT_NAME.INTERSTITIAL_STATE_CHANGED;
    return new Promise(resolve=>{
      let finished=false,timer=null,opened=false;
      const finish=success=>{
        if(finished)return;finished=true;clearTimeout(timer);ads.off(event,changed);
        this.adBusy=false;this.onChange();resolve(success);
      };
      const changed=state=>{
        if(state==='opened')opened=true;
        if(state==='closed')finish(opened);
        if(state==='failed')finish(false);
      };
      ads.on(event,changed);
      // 沒廣告或載入無回應時繼續；已開啟的廣告必須等關閉事件，不能穿透操作。
      timer=setTimeout(()=>{if(!opened)finish(false);},this.adTimeout);
      try{
        const result=ads.showInterstitial('level_completed');
        if(result&&typeof result.catch==='function')result.catch(()=>finish(false));
      }catch{console.warn('關卡間廣告未能顯示，繼續遊戲。');finish(false);}
    });
  }
}
