import { defineStore } from 'pinia';

export const useThemeStore = defineStore('theme', {
    state: () => ({
        isDarkMode: false, // Výchozí mód je light
    }),
    actions: {
        // Přepínání módu
        toggleDarkMode() {
            this.isDarkMode = !this.isDarkMode;
            localStorage.setItem('darkMode', this.isDarkMode ? 'true' : 'false');
            this.applyTheme();
        },
        // Aplikování tématu na celou aplikaci
        applyTheme() {
            if (this.isDarkMode) {
                document.body.classList.add('dark');
            } else {
                document.body.classList.remove('dark');
            }
        },
        // Inicializace tématu při načtení stránky
        initializeTheme() {
            const savedMode = localStorage.getItem('darkMode');
            this.isDarkMode = savedMode === 'true';
            this.applyTheme();
        },
    },
});