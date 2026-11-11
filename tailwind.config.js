import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @wisdom-source/vendor/bin/patch-type-declarations {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            colors: {
                m3: {
                    primary: '#2B5E41',
                    'on-primary': '#FFFFFF',
                    'primary-container': '#D1EADB',
                    'on-primary-container': '#052112',
                    'secondary-container': '#DFEBE1',
                    'on-secondary-container': '#151E17',
                    'tertiary-container': '#F4DAC9',
                    'on-tertiary-container': '#2C1504',
                    surface: '#FBF9F5',
                    'on-surface': '#191C1A',
                    outline: '#89938B',
                }
            },
            fontFamily: {
                sans: ['Plus Jakarta Sans', ...defaultTheme.fontFamily.sans],
            },
            fontSize: {
                'base': '16px',
            },
            borderRadius: {
                '3xl': '1.5rem',
                '4xl': '2.5rem',
            },
            boxShadow: {
                'm3-soft': '0 10px 40px -10px rgba(43,94,65,0.1)',
                'm3-glow': '0 20px 60px -15px rgba(43,94,65,0.3)',
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
            }
        },
    },

    plugins: [forms],
};
