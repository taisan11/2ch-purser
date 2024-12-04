import {purseCh} from "./mod.ts"

const purse = new purseCh("https://5ch.net/")

const main = async () => {
    const thread = await purse.get_bords(true)
    console.log(thread)
}

main()