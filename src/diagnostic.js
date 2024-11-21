export function displayObjectKeysAndValues(componentName, obj) {
  console.log(`In component: ${componentName}`);
  for (const key in obj) {
    console.log(`\tkey is ${key} and value is ${obj[key]}`);
  }
}
