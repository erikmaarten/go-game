/*globals CapitalizeFirstLetter:true */
CapitalizeFirstLetter = function(word) {
  check(word, String);
  if (word.length === 0) {
    return word;
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};