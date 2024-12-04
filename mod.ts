import { purseBBSmenu } from "./purse.ts";
import type { bords } from "./types.ts";
//memo:{headers:{"User-Agent":"Monazilla/1.00"}}
export class purseCh {
  private target_base_url: string;
  
  constructor(target_base_url: string) {
    this.target_base_url = new URL(target_base_url).host;
  }

  public async get_bords(html:boolean = false): Promise<bords> {
    if (html) {
      const res = (await fetch("https://"+this.target_base_url+"/bbsmenu.html",{headers:{"User-Agent":"Monazilla/1.00"}})).arrayBuffer();
      return purseBBSmenu(await res);
    }
    const res = fetch("https://menu."+this.target_base_url+"/bbsmenu.json",{headers:{"User-Agent":"Monazilla/1.00"}}).then(res => res.status === 200 ? res : fetch("https://"+this.target_base_url+"/bbsmenu.html",{headers:{"User-Agent":"Monazilla/1.00"}}));
    const data = res.then(async res => {
      const clonedRes = res.clone();
      try {
        return await res.json();
      } catch {
        return purseBBSmenu(await clonedRes.arrayBuffer());
      }
    })
    return data
  }
}