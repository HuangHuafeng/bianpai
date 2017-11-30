export function debugLog(message: any) {
  if (__DEV__) {
    console.log(message)
  }
}

export function removingHeadingTrailingSpaces(str: string): string {
  if (str === undefined) {
    throw new Error('UNEXPECTED!')
  }
  let editedStr = str.replace(/\s+$/, '')
  editedStr = editedStr.replace(/^\s+/, '')
  return editedStr
}

export function toZeorOrPositiveIntegerString(str: string): string | undefined {
  let numberInString: string = str.replace('.', 'DOT_REPLACED')
  numberInString = removingHeadingTrailingSpaces(numberInString)
  const number = Number(numberInString)
  if (Number.isInteger(number) && number >= 0) {
    return numberInString
  } else {
    return undefined
  }
}

export function getFileName(path: string): string | undefined {
  const separator = __WIN32__ ? '\\' : '/'
  return path.split(separator).pop()
}
