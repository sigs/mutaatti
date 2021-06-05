import { mutate, mutateText } from "../src/mutate.ts"

Deno.test("test run for mutate", () => {
    const wordlist = ["verinäyte","avomerikalastus","huikentelevainen","tehdasmainen","saatana","kalskahtaa","rohtoemäkki","toimeentulotuki","värinäyte","vooninki"]
    for (const word of wordlist) {
        const mutated = mutate(word)
        console.log(`${word} -> ${mutated}`)
    }
})

Deno.test("test run for mutateText", () => {
    const text = "Hyväntahtoinen aurinko katseli heitä. Se ei missään tapauksessa ollut heille vihainen. Kenties tunsi jonkinlaista myötätuntoakin heitä kohtaan. Aika velikultia."
    for (let mutationCount = 0; mutationCount < 10; mutationCount++) {
        const result = mutateText(text, { mutationCount })
        console.log(mutationCount, "mutations: ", result.text)
    }
})
