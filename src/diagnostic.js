export function displayObjectKeysAndValues(obj) {
  for (const key in obj) {
    console.log(`key is ${key} and value is ${obj[key]}`);
  }
}
