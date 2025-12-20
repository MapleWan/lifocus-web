import { defineConfig } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  shortcuts: [
    // ['border-circle', 'border rounded-full'],
    ['text-overflow', 'overflow-hidden text-ellipsis whitespace-nowrap']
  ],
  theme: {
    colors: {
      primary: {
        900: '#0a0a0a',
        800: '#1a1a1a',
        700: '#2d2d2d',
        600: '#404040',
        500: '#525252',
        400: '#656565',
        300: '#787878',
        200: '#8a8a8a',
        100: '#9d9d9d',
        50: '#b0b0b0',
      },
      background: {
        primary: '#f4f7fa',
        secondary: '#161c2d',
        light: '#fafafa',
        hover: '#eeedf5',
      },
      font: {
        primary: '#0a0a0a',
        secondary: '#7c3aed',
        revert: '#f2f2f2',
        hover: '#7c3aed'
      },
    }
  }
})
