import {purseCh} from "./mod.ts"
import { dat2URL,URL2ServerID } from "./util/mod.ts"
import {Hono} from "jsr:@hono/hono"

const purse = new purseCh("https://5ch.net")
const app = new Hono()

app.get("/", async (c) => {
    const threads = await purse.get_threads("https://egg.5ch.net/software/")
    if (threads === 'error') return c.json({error:"error"})
    console.log(threads[0].id)
    const posts = await purse.get_thread("egg","software",threads[0].id)
    return c.json(posts)
})

export default app