function isVowel(char: string) {
  if (!char) {
    return false
  }
  return "aeiouyöäAEIOUYÄÖ".includes(char[0])
}

function shorten(word: string) {
  if (word.length < 3) {
    return word
  }

  // find a double letter
  for (let i = 0; i < word.length - 1; i++) {
    if (word[i] === word[i + 1]) {
      return word.substring(0, i) + word.substring(i + 1)
    }
  }

  // find a double consonant or vowel in the middle
  for (let i = 1; i < word.length - 2; i++) {
    if (isVowel(word[i]) === isVowel(word[i + 1])) {
      return word.substring(0, i) + word.substring(i + 1)
    }
  }

  // check starting consonant cluster
  if (!isVowel(word[0]) && !isVowel(word[1])) {
    return word.substring(1)
  }

  // just remove random middle letter
  const cutIndex = 1 + Math.floor(Math.random() * (word.length - 2))
  return word.substring(0, cutIndex) + word.substring(cutIndex + 1)
}

function lengthen(word: string) {
  // pick random middle letter
  const i = 1 + Math.floor(Math.random() * (word.length - 2))

  // check it's not double already...
  if (word[i] !== word[i + 1]) {
    return word.substring(0, i) + word[i] + word.substring(i)
  } else {
    // try after the double
    if (word[i + 2] !== word[i + 3]) {
      return word.substring(0, i + 2) + word[i + 2] + word.substring(i + 2)
    }
  }

  return word
}

function alterVoicing(word: string) {
  // pick random letter to start search from
  const startIndex = Math.floor(Math.random() * word.length)

  const mutationList = [
    { letter: "k", target: "g", startIndex, prio: 2 + Math.random() },
    { letter: "p", target: "b", startIndex, prio: 2 + Math.random() },
    { letter: "t", target: "d", startIndex, prio: 2 + Math.random() },
    { letter: "g", target: "k", startIndex, prio: 2 + Math.random() },
    { letter: "b", target: "p", startIndex, prio: 2 + Math.random() },
    { letter: "d", target: "t", startIndex, prio: 2 + Math.random() },
    { letter: "k", target: "g", startIndex: 0, prio: 1 + Math.random() },
    { letter: "p", target: "b", startIndex: 0, prio: 1 + Math.random() },
    { letter: "t", target: "d", startIndex: 0, prio: 1 + Math.random() },
    { letter: "g", target: "k", startIndex: 0, prio: 1 + Math.random() },
    { letter: "b", target: "p", startIndex: 0, prio: 1 + Math.random() },
    { letter: "d", target: "t", startIndex: 0, prio: 1 + Math.random() },
    { letter: "a", target: "ä", startIndex, prio: 0.5 + Math.random() },
    { letter: "o", target: "ö", startIndex, prio: 0.5 + Math.random() },
    { letter: "u", target: "y", startIndex, prio: 0.5 + Math.random() },
    { letter: "ä", target: "a", startIndex, prio: 0.5 + Math.random() },
    { letter: "ö", target: "o", startIndex, prio: 0.5 + Math.random() },
    { letter: "y", target: "u", startIndex, prio: 0.5 + Math.random() },
    { letter: "i", target: "j", startIndex, prio: 0.5 + Math.random() },
    { letter: "j", target: "i", startIndex, prio: 0.5 + Math.random() },
  ]
  mutationList.sort((a, b) => b.prio - a.prio) // descending

  for (const { letter, target, startIndex } of mutationList) {
    const i = word.indexOf(letter, startIndex)
    if (i > -1) {
      if (word[i] == word[i + 1]) {
        return word.substring(0, i) + target + target + word.substring(i + 2)
      }
      return word.substring(0, i) + target + word.substring(i + 1)
    }
  }

  return word
}

export function mutate(word: string, options: any = {}) {
  const {
    shortenPr = 0.3,
    lengthenPr = 0.5,
    alterVoicingPr = 0.2, // k <-> g, p <-> b, t <-> d
  } = options

  const r = Math.random()
  return r < shortenPr
    ? shorten(word)
    : r - shortenPr < lengthenPr
    ? lengthen(word)
    : alterVoicing(word)
}

export function mutateText(originalText: string, options: any = {}) {
  const words = originalText.split(" ")
  const {
    frequency = 0.1,
    mutationCount = Math.ceil(words.length * frequency),
  } = options
  const mutations = Array(words.length).fill(0)
    .map((_, index) => ({ index, prio: Math.random() }))
    .sort((a, b) => b.prio - a.prio)
    .slice(0, mutationCount)
    .map(({ index }) => {
      const correct = words[index]
      const corrupt = mutate(correct)
      words[index] = corrupt
      return { index, correct, corrupt }
    })
  const text = words.join(" ")
  return { originalText, text, mutations }
}
