/**
 * base mrhorin/2ch-parser on github
 */


// 掲示板仕様ごとのURLにパースするクラス
export default class UrlParser {

    // subject.txtのURLを返す
    static getSubjectUrl(boardUrl) {
        return UrlParser.convertUrl(boardUrl) + '/subject.txt'
    }

    // スレッドURLからDATファイルURLを取得
    static getDatUrl(threadUrl) {
        threadUrl = this.convertUrl(threadUrl)
        if (UrlParser.isShitaraba(threadUrl)) {
            return threadUrl.replace(/read.cgi/, "rawmode.cgi")
        } else {
            let url = threadUrl.split("/")
            return `${url[0]}/\/${url[2]}/${url[5]}/dat/${url[6]}.dat`
        }
    }

    // 板URLとスレッドキーからスレッドURLを取得
    static getThreadUrl(boardUrl, threadKey) {
        boardUrl = this.convertUrl(boardUrl)
        let uri = boardUrl.split("/")
        if (UrlParser.isShitaraba(boardUrl)) {
            return `${uri[0]}/\/${uri[2]}/bbs/read.cgi/${uri[3]}/${uri[4]}/${threadKey.split(".")[0]}`
        } else {
            return `${uri[0]}/\/${uri[2]}/test/read.cgi/${uri[3]}/${threadKey.split(".")[0]}`
        }
    }

    // URLから板のURLを取得  
    static getBoardUrl(url) {
        let uri = this.convertUrl(url).split("/")
        if (this.isShitaraba(url)) {
            // .cgiが出現するクエリーの位置を探す
            let cgiIndex = uri.findIndex((value) => { if (value.match(/^\w+\.cgi$/i)) return true })
            if (cgiIndex >= 0) {
                let category = uri[cgiIndex + 1]
                let boardNo = uri[cgiIndex + 2]
                return `${uri[0]}/\/${uri[2]}/${category}/${boardNo}`
            } else {
                // .cgiが含まれない時
                return this.convertUrl(url)
            }
        } else {
            let cgiIndex = uri.findIndex((value) => { if (value.match(/^\w+\.cgi$/i)) return true })
            if (cgiIndex >= 0) {
                return `${uri[0]}/\/${uri[cgiIndex - 2]}/${uri[cgiIndex + 1]}`
            } else {
                return this.convertUrl(url)
            }
        }
    }

    // したらばのURLか
    static isShitaraba(url) {
        return url.includes('jbbs.')
    }

    // 2ch.scのURLか  
    static isSc(url) {
        return url.includes('2ch.sc')
    }

    // URLの末尾の/を削除して返す
    static convertUrl(url) {
        if (url.slice(-1) == '/') {
            return url.slice(0, -1)
        } else {
            return url
        }
    }

}