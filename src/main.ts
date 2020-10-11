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

import { mutate } from "./mutate.ts"
import { exists } from "https://deno.land/std@0.74.0/fs/exists.ts"

const TEST_RUN = !!Deno.env.get("TEST_RUN")

const infile = "./kotus-sanalista_v1/kotus-sanalista_v1.xml"
const input = await Deno.readTextFile(infile)
const xml = parse(input)
const wordlist:string[] =
  xml?.root?.children?.map((wordxml) => wordxml.children[0].content) || []
log.debug(`Read ${wordlist.length} words`)

if (TEST_RUN) {
  for (var i = 0; i < 10; i++) {
    const word = wordlist[Math.floor(Math.random() * wordlist.length)]
    const mutated = mutate(word)
    console.log(`${word} -> ${mutated}`)
  }
  Deno.exit(0)
}

const server = pogo.server({ port: 3000 })
server.router.get("/random", () => {
  const correct = wordlist[Math.floor(Math.random() * wordlist.length)]
  const corrupt = mutate(correct)
  return { correct, corrupt }
})

server.start()