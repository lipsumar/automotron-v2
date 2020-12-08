/* eslint-disable import/prefer-default-export */
export const GRID_SIZE = 25;
const colorsDefinitions = {
  primary: '#7791F9',
  primaryDark: '#5069cd',
  primaryLight: '#b2bff6',
  white: '#fff',
  agreement: '#3ee164',
};

export const colors = {
  edge: colorsDefinitions.primary,
  edgeNoSpace: colorsDefinitions.primaryLight,
  startNode: colorsDefinitions.primaryDark,
  agreementEdge: colorsDefinitions.agreement,
  generatorEdge: '#b35fff',
  gridLine: '#DCDCCB',
  nodeOutlet: colorsDefinitions.primary,
  nodeOutletOutline: '#fff',
  userSelection: '#65a8f0',
  nodeTitle: colorsDefinitions.primaryDark,
  nodeTitleText: colorsDefinitions.white,
  node: '#fff',
  nodeGenerated: '#e5d4f5',
  nodeMultiValueSeparator: '#d7e2ee',
  agreementMarker: colorsDefinitions.agreement,
};
