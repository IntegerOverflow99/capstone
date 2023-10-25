export const camelToCapsAndSpaces = (str: string) => {
  //add spaces where it goes from lower to upper case, then capitalize
  //needs to work regardless of how many words are in the string
  return str.replace(/([A-Z])/g, ' $1').toUpperCase();
};
