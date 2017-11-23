export function debugLog(message: any) {
  if (__DEV__) {
    console.log(message)
  }
}

export function removingHeadingTrailingSpaces(str: string): string {
  let editedStr = str.replace(/\s+$/, '')
  editedStr = editedStr.replace(/^\s+/, '')
  return editedStr
}
