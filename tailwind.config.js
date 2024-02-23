/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
        extend: {
          lineHeight: {
            'zero': '0',
          }
        }
    },
  plugins: [],
}

