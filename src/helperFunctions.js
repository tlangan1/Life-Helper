// This function simply finds a DOM parent of type parentType
// It has nothing to do with the parent() signal in LifeHelperApp.jsx
export function FindParentElement(currentElement, parentType) {
  if (currentElement.localName == parentType) return currentElement;
  else return FindParentElement(currentElement.parentElement, parentType);
}
