import type { bords } from "../types.ts";
//memo:{headers:{"User-Agent":"Monazilla/1.00"}}
export class purse5Ch {
    private target_base_url: string= "itest.5ch.net";

    public async get_bords(html: boolean = false): Promise<bords> {
        const res = fetch("https://menu."+this.target_base_url+"/bbsmenu.json",{headers:{"User-Agent":"Monazilla/1.00"}})
        return (await res).json()
    }

    public async get_threads(board: string): Promise<any> {
        const res = fetch(`https://${this.target_base_url}/subbacks/${board}`,{headers:{"User-Agent":"Monazilla/1.00"}})
        return (await res).json()
    }

    public async get_thread(board: string, thread: string): Promise<any> {
        const res = fetch(`https://${this.target_base_url}/public/newapi/client.php?subdomain=medaka&board=honobono&dat=1725241686&rand=2rEzBpUcDPaaaaaa%E3%81%82%E3%81%8B%E3%81%95%E3%81%9F%E3%81%AA`,{headers:{"User-Agent":"Monazilla/1.00"}})
        return (await res).json()
    }
}