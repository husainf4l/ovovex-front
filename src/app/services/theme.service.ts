import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    isDarkMode = false;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {

        if (isPlatformBrowser(this.platformId)) {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                this.setDarkTheme();
            } else {
                this.setLightTheme();
            }
        }
    }

    // Set the dark theme
    setDarkTheme() {
        this.isDarkMode = true;
        document.documentElement.classList.add('dark');
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('theme', 'dark');
        }
    }

    // Set the light theme
    setLightTheme() {
        this.isDarkMode = false;
        document.documentElement.classList.remove('dark');
        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('theme', 'light');
        }
    }

    // Toggle between light and dark themes
    toggleTheme() {
        if (this.isDarkMode) {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
    }

}
