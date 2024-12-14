export interface bords {
    description: string;
    last_modify_string: string;
    menu_list: categorys[];
    last_modify: number;
}
export interface categorys {
    category_number: string;
    category_name: string;
    category_total: number;
    category_content: category[];
}
export interface category {
    url: string;
    category_order: number;
    category: number;
    board_name: string;
    directory_name: string;
    category_name: string;
}
export interface threads {
    name: string;
    threads: thread[]
}
export interface thread {
    url: string;
    title: string;
    res: number;
    unixtime: number;
}