const nerfScore = (txnCount) => {
 // 5yo kids implementation not me 
  switch (true) {
    case txnCount <= 100:
      return 30;
    case txnCount <= 400:
      return 20;
    case txnCount <= 600:
      return 10;
    default:
      return 0;
  }
};
module.exports = {
  nerfScore,
};
