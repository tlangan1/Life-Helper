export function FindParentElement(currentElement, parentType) {
  if (currentElement.localName == parentType) return currentElement;
  else return FindParentElement(currentElement.parentElement, parentType);
}
