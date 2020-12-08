/* eslint-disable import/prefer-default-export */
export const GRID_SIZE = 25;
// original palette
// const colorsDefinitions = {
//   primary: '#7791F9',
//   primaryDark: '#5069cd',
//   primaryLight: '#b2bff6',
//   white: '#fff',
//   agreement: '#3ee164',
// };

const colorsDefinitions = {
  primary: '#9A78FE',
  primaryDark: '#36295F',
  primaryLight: '#E3DCF6',
  white: '#fff',
  accent: '#F78110',
};

export const colors = {
  edge: colorsDefinitions.primary,
  edgeNoSpace: colorsDefinitions.primaryLight,
  startNode: colorsDefinitions.primaryDark,
  agreementEdge: colorsDefinitions.accent,
  generatorEdge: colorsDefinitions.primary,
  gridLine: '#DCDCCB',
  nodeOutlet: colorsDefinitions.primary,
  nodeOutletOutline: '#fff',
  userSelection: '#65a8f0',
  nodeTitle: colorsDefinitions.primaryDark,
  nodeTitleText: colorsDefinitions.white,
  node: '#fff',
  nodeGenerated: colorsDefinitions.primaryLight,
  nodeMultiValueSeparator: '#d7e2ee',
  agreementMarker: colorsDefinitions.accent,
};
