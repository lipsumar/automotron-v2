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
  primary: '#8F69FF',
  primaryDark: '#36295F',
  primaryLight: '#E3DCF6',
  white: '#fff',
  black: '#232323',
  accent: '#F78110',
};

export const colors = {
  edge: colorsDefinitions.primary,
  edgeNoSpace: colorsDefinitions.primaryLight,
  startNode: colorsDefinitions.primaryDark,
  agreementEdge: colorsDefinitions.accent,
  generatorEdge: '#A9A570', // colorsDefinitions.primary,
  gridLine: '#DCDCCB',
  nodeOutlet: colorsDefinitions.primary,
  nodeOutletOutline: '#fff',
  userSelection: '#65a8f0',
  nodeTitle: colorsDefinitions.primaryLight,
  nodeTitleText: colorsDefinitions.primaryDark,
  node: '#fff',
  loopNode: colorsDefinitions.primaryDark,
  nodeGenerated: colorsDefinitions.primaryLight,
  nodeMultiValueSeparator: '#D4D4D4',
  agreementMarker: colorsDefinitions.accent,
  sidebarBackground: colorsDefinitions.black,
  sidebarText: colorsDefinitions.white,
};
