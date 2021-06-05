import pogo from "https://deno.land/x/pogo/main.ts"
import parse from "https://denopkg.com/nekobato/deno-xml-parser/index.ts"
import * as log from "https://deno.land/std/log/mod.ts"
await log.setup({
  handlers: {
    console: new log.handlers.ConsoleHandler("DEBUG"),
  },

  loggers: {
    default: {
      level: "DEBUG",
      handlers: ["console"],
    },
  },
})

import { mutate, mutateText } from "./mutate.ts"

const infile = "./kotus-sanalista_v1/kotus-sanalista_v1.xml"
const input = await Deno.readTextFile(infile)
const xml = parse(input)
const wordlist: string[] =
  xml?.root?.children?.map((wordxml) => wordxml.children[0].content) || []
log.debug(`Read ${wordlist.length} words`)

const server = pogo.server({ port: 3000 })
server.router.get("/random", () => {
  const correct = wordlist[Math.floor(Math.random() * wordlist.length)]
  const corrupt = mutate(correct)
  return { correct, corrupt }
})
server.router.get("/word/{word}", (request) => {
  const correct = request.params.word
  const corrupt = mutate(correct)
  return corrupt
})
server.router.post("/text", async (request) => {
  const bodyText = new TextDecoder().decode(await Deno.readAll(request.body))
  return mutateText(bodyText, Object.fromEntries(request.searchParams))
})

server.start()
