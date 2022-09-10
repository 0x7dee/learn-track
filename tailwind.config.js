module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      gridTemplateRows: {
        '8': 'repeat(8, minmax(0, 1fr))'
      },
      gridRow: {
        'span-8': 'span 8 / span 8',
        'span-7': 'span 7 / span 7',
      }
    },
  },
  plugins: [],
}