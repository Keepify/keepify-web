module.exports = {
  purge: ['./pages/**/*.tsx', './components/**/*.tsx'],
  darkMode: false,
  theme: {
    extend: {
      maxWidth: {
        '1/4': '25%',
        '2/5': '40%',
        '1/2': '50%',
        '3/5': '60%',
        '3/4': '75%',
      },
    },
    fontFamily: {
      body: ['Sen', 'Sans-serif'],
    },
    colors: {
      orange: '#FF8E6E',
      'orange-light': '#FFBB9E',
      purple: '#515070',
      'light-purple': '#FBF7FF',
      white: '#F6F6F6',
      'full-white': '#FFFFFF',
      grey: '#BEBEBE',
      'light-grey': '#CCCCCC',
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};