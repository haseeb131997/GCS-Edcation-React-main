module.exports = {
  getCurrency: code => {
    switch (code) {
      case 'USD':
        return '$';
      case 'IND':
        return '₹';
      default:
        return '$';
    }
  },
};
