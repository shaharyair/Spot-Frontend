export function isValidTextRegexString(regexString, text) {
  const regexPattern = new RegExp(regexString);
  return regexPattern.test(text);
}

export function isValidTextRegex(regex, text) {
  return regex.test(text);
}

export function capitalizeEveryWord(str) {
  return str.replace(/\b\w/g, function (l) {
    return l.toUpperCase();
  });
}
