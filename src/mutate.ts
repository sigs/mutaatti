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
  return word
}

export function mutate(word: string, options: any = {}) {
  const {
    shortenPr = 0.3,
    lengthenPr = 0.6,
    alterVoicingPr = 0.1, // k <-> g, p <-> b, t <-> d
  } = options

  const r = Math.random()
  return r < shortenPr
    ? shorten(word)
    : r - shortenPr < lengthenPr
    ? lengthen(word)
    : alterVoicing(word)
}
