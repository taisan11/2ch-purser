import { purseBBSmenu } from "./purse.ts";
import type { bords } from "./types.ts";
import { URL2ServerID } from "./util/mod.ts";
//memo:{headers:{"User-Agent":"Monazilla/1.00"}}
export class purseCh {
  private target_base_url: string;
  private decode = new TextDecoder("shift_jis");
  
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
  /**
   * @description get threads from URL
   * @param URL string
   * @returns 
   */
  public async get_threads(URL: string): Promise<{id:string,title:string,resnum:string}[]|'error'> {
    const result:{id:string,title:string,resnum:string}[] = [];
    const { server, board } = URL2ServerID(URL);
    try {
      const subject = await fetch(`https://${server}.${this.target_base_url}/${board}/subject.txt`, { headers: { "User-Agent": "Monazilla/1.00" } }).then(res => res.arrayBuffer()
          .then(res => this.decode.decode(res)));
      const regex = /^(\d+\.dat)<>\s*(.*?)\s*(\[BE-ID\]\s*)?\((\d+)\)$/;
      subject.split("\n").forEach((line) => {
        const match = line.match(regex);
        if (match) {
          result.push({id:match[1].replace(".dat",""),title:match[2],resnum:match[4]});
        }
      });
    } catch (error) {
      console.error("Error fetching subject.txt:", error);
      return 'error';
    }
    return result.length > 0 ? result : 'error';
  }
  /**
   * @example ```ts
   * const purse = new purseCh("5ch.net");
   * const aaa = URL2ServerIDDat("https://rio2016.5ch.net/disaster/dat/1619820000.dat");
   * purse.get_thread(aaa.server,aaa.board,aaa.datid).then(console.log);
   * //or
   * purse.get_threads("https://rio2016.5ch.net/disaster/").then((res) => {console.log(get_thread(aaa.server,aaa.board,res[0].id))});
   * @param URL string
   */
  public async get_thread(server:string,board:string,datid:string): Promise<{ title: string, post: { postid: string, name: string, mail?: string, date: string, message: string }[] }> {
    const dat = fetch(`https://${server}.${this.target_base_url}/${board}/dat/${datid}.dat`, { headers: { "User-Agent": "Monazilla/1.00" } }).then(res => res.arrayBuffer()).then(res => this.decode.decode(res));
    const line = (await dat).split("\n");
    let title = ""
    const posts: {postid:string,name:string,mail?:string,date:string,message:string}[] = [];
    line.forEach((line, index) => {
      const parts = line.split("<>");
      if (parts.length >= 4) {
        if (index === 0) {
          title = parts[4];
        }
        const post: {postid:string,name:string,mail?:string,date:string,message:string} = {
          postid: (index + 1).toString(),
          name: parts[0],
          mail: parts[1],
          date: parts[2],
          message: index === 0 ? parts[4] : parts[3],
        };
        posts.push(post);
      }
    });
    const result = {
      title: title,
      post: posts,
    };
    return result
  }
}