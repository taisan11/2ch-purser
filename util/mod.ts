//https://rio2016.5ch.net/disaster/ -> rio2016,disaster
export function URL2ServerID(url: string): {server:string,board:string} {
    const u = new URL(url);
    return {server:u.host.split(".")[0],board:u.pathname.split("/")[1]};
}
export function URL2ServerIDDat(url: string): {server:string,board:string,datid:string} {
    const u = new URL(url);
    return {server:u.host.split(".")[0],board:u.pathname.split("/")[1],datid:u.pathname.split("/")[3].split(".")[0]};
}
export function dat2URL(server:string,board:string,dat:string):string {
    return `https://${server}.5ch.net/${board}/dat/${dat}.dat`;
}