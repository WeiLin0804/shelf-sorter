import { Store, STORAGE_KEY, validateSave } from './storage.js';

// 沿用原版存檔驗證；平台讀寫集中在這裡，失敗不轉存本機。
export class PlatformStore {
  constructor(storage,{timeout=15000}={}){this.storage=storage;this.timeout=timeout;this.blocked=true;this.queue=Promise.resolve();}
  async bounded(operation){
    let timer;
    try{return await Promise.race([Promise.resolve().then(operation),new Promise((_,reject)=>{timer=setTimeout(()=>{const error=new Error('平台存檔逾時');error.code='SAVE_TIMEOUT';reject(error);},this.timeout);})]);}
    finally{clearTimeout(timer);}
  }
  async load(){
    try{
      const values=await this.bounded(()=>this.storage.get([STORAGE_KEY],false));
      if(!Array.isArray(values))throw new Error('平台存檔回應格式不符');
      const raw=values[0];
      const result=new Store({getItem:()=>raw}).load();
      this.blocked=result.status==='blocked';return result;
    }catch{
      this.blocked=true;console.warn('讀取平台進度失敗，已禁止覆寫。');
      return {status:'blocked',message:'無法讀取原有進度。已保留原存檔，本次可暫時試玩，但不會覆寫保存。'};
    }
  }
  save(snapshot){
    if(this.blocked)return Promise.resolve({ok:false,message:'原有存檔已保留；本次進度暫時不會保存。'});
    if(!validateSave(snapshot))return Promise.resolve({ok:false,message:'進度格式不符，未寫入平台存檔。'});
    // 立即序列化擷取當下狀態，並依序等待每一筆寫入。
    const raw=JSON.stringify(snapshot);
    const operation=this.queue.then(async()=>{
      if(this.blocked)return {ok:false,message:'原有存檔已保留；本次進度暫時不會保存。'};
      try{await this.bounded(()=>this.storage.set([STORAGE_KEY],[raw]));return {ok:true};}
      catch(error){
        if(error?.code==='SAVE_TIMEOUT')this.blocked=true;
        console.warn('寫入平台進度失敗，請留意畫面的保存狀態。');return {ok:false,message:'目前無法保存，離開後可能遺失進度。'};
      }
    });
    this.queue=operation.then(()=>undefined);return operation;
  }
}
