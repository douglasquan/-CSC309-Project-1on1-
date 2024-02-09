let cellColorStates = {}; // Private variable to hold the state

export function setColorState(cellKey, color) {
  cellColorStates[cellKey] = color;
}

export function getColorState() {
  return cellColorStates;
}

export function resetColorStates() {
  cellColorStates = {}; // Reset to initial state
}