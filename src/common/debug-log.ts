export function debugLog(message: any) {
  if (__DEV__) {
    console.log(message)
  }
}
