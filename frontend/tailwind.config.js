/* @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      // 'sans': ['ui-sans-serif', 'system-ui', ...],
      // 'serif': ['ui-serif', 'Georgia', ...],
      // 'mono': ['ui-monospace', 'SFMono-Regular', ...],
      // 'display': ['Oswald', ...],
      // 'body': ['"Open Sans"', ...],
      kalnia: ['Kalnia', 'system-ui', 'sans-serif'],
      Rubik: ['Rubik Doodle Shadow', 'system-ui', 'sans-serif'],
      adamina: ['Adamina','system-ui', 'sans-serif'],
    },
    fontSize: {
      '8xl': ['6.884rem', {
        lineHeight: '2rem',
        letterSpacing: '0em',
        fontWeight: '700',
      }],
      '7xl':['72px',{
        lineHeight: '80px',
        letterSpacing: '-4.5px',
        fontWeight: '600',
      }],
      '6xl':['55px',{
        lineHeight: '60px',
        letterSpacing: '-2.5px',
        fontWeight: '500',
      }],
      '5xl':['48px',{
        lineHeight: '54px',
        letterSpacing: '-1.6px',
        fontWeight: '500',
      }],
      '4xl':['38px',{
        lineHeight: '44px',
        letterSpacing: '-1.2px',
        fontWeight: '500',
      }],
      '3xl':['28px',{
        lineHeight: '34px',
        letterSpacing: '-0px',
        fontWeight: '500',
      }],
      '2xl':['24px',{
        lineHeight: '30px',
        letterSpacing: '-1px',
        fontWeight: '400',
      }],
      'xl':['24px',{
        lineHeight: '30px',
        letterSpacing: '-1px',
        fontWeight: '400',
      }],
      'lg':['21px',{
        lineHeight: '30px',
        letterSpacing: '-0px',
        fontWeight: '400',
      }],
      'base':['17px',{
        lineHeight: '25px',
        letterSpacing: '-0.69px',
        fontWeight: '400',
      }],
      'sm':['15px',{
        lineHeight: '23px',
        letterSpacing: '-0.6px',
        fontWeight: '400',
      }],
      'caption1':['20px',{
        lineHeight: '24px',
        letterSpacing: '0.6px',
        fontWeight: '400',
      }],
      'caption2':['18px',{
        lineHeight: '20px',
        letterSpacing: '0.3px',
        fontWeight: '400',
      }],
      'caption3':['16px',{
        lineHeight: '18px',
        letterSpacing: '0.5px',
        fontWeight: '400',
      }],
      'caption4':['13px',{
        lineHeight: '15px',
        letterSpacing: '-0.2px',
        fontWeight: '400',
      }
      ]
    },
    borderRadius: {
      DEFAULT: '20px',
      full: '9999px',
    },
    extend: {
      colors: {
        white:'#FFFFFF',
        black: '#000000',
        primary:{
          200:'#bfcc2d',
          300:'#ABB728',
          400:'#C5D142',
          DEFAULT:'#F0DB1B',
        },
        secondary:{
          200:'#9ed9a3',
          300:'#8cc191',
          DEFAULT: '#BFE9D9',
        },
        accent: {
          DEFAULT:'#d8c518',
          200: '#A1AC26',
        },
        gray:{
          DEFAULT: '#1E2421',
        },
      },
    },
  },
  plugins: [
    require('postcss-nesting'),
  ],
}