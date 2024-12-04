import { category } from "./types.ts";
import { bords } from "./types.ts";

export function get2chBbsMenu(text:string): Record<string, Record<string, string>> {
    const p1 = /<BR><BR><B>(.*)<\/B><BR>/;
    const p2 = /^<A HREF=([0-9a-zA-Z_:/\.]*\.2ch\.net\/[0-9a-zA-Z_]*)>(.*)<\/A><br>$/;
    const p4 = /<br><br>更新日 (\d{4}\/\d{2}\/\d{2})/;

    const bbsMenu: Record<string, Record<string, string>> = {};
    let category: string | undefined;

    text.split('\n').forEach(line => {
        const m1 = p1.exec(line);
        const m2 = p2.exec(line);
        const m4 = p4.exec(line);

        if (m1) {
            category = m1[1];
            bbsMenu[category] = {};
        } else if (m2 && category) {
            const boardName = m2[2];
            const boardUrl = m2[1];
            bbsMenu[category][boardName] = boardUrl;
        }
        if (m4) {
            if (!bbsMenu['last_modify_string']) {
                bbsMenu['last_modify_string'] = {};
            }
            bbsMenu['last_modify_string']["a"] = m4[1];
        }
    });

    for (const key in bbsMenu) {
        if (Object.keys(bbsMenu[key]).length === 0) {
            delete bbsMenu[key];
        }
    }
    return bbsMenu;
}

export function purseBBSmenu(arrayBuffer:ArrayBuffer): bords {
    const decoder = new TextDecoder("shift_jis");
    const text = decoder.decode(arrayBuffer);
    const bbsMenu = get2chBbsMenu(text);
    console.log(bbsMenu);
    const result: bords = {description: "BBSmenu gen for BBSmenu.html", last_modify_string: bbsMenu["last_modify_string"]["a"], menu_list: [], last_modify: 0};
    Object.entries(bbsMenu).forEach(([key, value]) => {
        const category_content:category[] = Object.entries(value).map(([board_name, url],i) => {
            return {url: url, category_order: i, category: 0, board_name: board_name, directory_name: "", category_name: key};
        })
        //categoryを追加
        result.menu_list.push({category_number: key, category_name: key, category_total: Object.keys(value).length, category_content});
    })


    return result;
}