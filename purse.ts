import { category } from "./types.ts";
import { bords } from "./types.ts";

type MenuItem = {
    url: string;
    title: string;
    category: string | null;
};

type MenuParseResult = {
    items: MenuItem[];
    lastUpdated: string | null; // 更新日を表す（フォーマット: YYYY/MM/DD または YY/MM/DD）
};

function get2chBbsMenu(input: string): MenuParseResult {
    let category: string | null = null;
    const result: MenuItem[] = [];
    let lastUpdated: string | null = null;

    // 行ごとに分割して解析する
    const lines = input.split("\n");
    for (const line of lines) {
        let match: RegExpMatchArray | null;

        // URLとタイトルの解析
        if ((match = line.match(/^<A HREF=(https?:\/\/[^\/]+\/[^\/]+\/)>(.*)<\/A><br>/))) {
            result.push({
                url: match[1],
                title: match[2],
                category: category
            });
        }
        // カテゴリの解析
        else if ((match = line.match(/^<BR><BR><B>(.*)<\/B><BR>/))) {
            category = match[1];
        }
        // 更新日の解析 (通常形式 YYYY/MM/DD)
        else if ((match = line.match(/<br><br>更新日 (\d{4}\/\d{2}\/\d{2})/))) {
            lastUpdated = match[1];
        }
        // 更新日の解析 (短縮形式 YY/MM/DD)
        else if ((match = line.match(/<br><br><br>更新日(\d{2}\/\d{2}\/\d{2})/))) {
            lastUpdated = match[1];
        }
    }

    return { items: result, lastUpdated: lastUpdated };
}



export function purseBBSmenu(arrayBuffer: ArrayBuffer): bords {
    const decoder = new TextDecoder("shift_jis");
    const text = decoder.decode(arrayBuffer);
    const bbsMenu = get2chBbsMenu(text);
    const result: bords = { description: "BBSmenu gen for BBSmenu.html", last_modify_string: String(bbsMenu.lastUpdated), menu_list: [], last_modify: 0 };
    bbsMenu.items.forEach((item, i) => {
        const category_content: category[] = [{ url: item.url, category_order: i, category: 0, board_name: item.title, directory_name: "", category_name: item.category || "" }];
        result.menu_list.push({ category_number: String(i), category_name: item.category || "", category_total: 1, category_content });
    })

    return result;
}