import { Injectable, signal, Signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TranslationService {
    // Signal for the current language
    private currentLanguage = signal<string>('en');

    constructor() {
        if (this.isBrowser()) {
            const savedLang = localStorage.getItem('language') || 'en';
            this.currentLanguage.set(savedLang);
        }
    }

    // Getter for the current language signal
    get language(): Signal<string> {
        return this.currentLanguage;
    }

    // Set the language and save it to localStorage if in a browser
    setLanguage(lang: string): void {
        this.currentLanguage.set(lang);
        if (this.isBrowser()) {
            localStorage.setItem('language', lang);
        }
    }

    // Helper method to check if the code is running in a browser
    private isBrowser(): boolean {
        return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
    }
}
