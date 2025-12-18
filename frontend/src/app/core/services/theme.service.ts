import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    // Signal to track theme state (true = dark, false = light)
    // Defaulting to true as per "Midnight" preference
    isDarkTheme = signal<boolean>(true);

    constructor() {
        this.initializeTheme();
    }

    private initializeTheme(): void {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkTheme.set(savedTheme === 'dark');
        } else {
            // Default to dark if no preference saved
            this.isDarkTheme.set(true);
        }
        this.applyTheme(this.isDarkTheme());
    }

    toggleTheme(): void {
        this.isDarkTheme.update(current => !current);
        const isDark = this.isDarkTheme();
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.applyTheme(isDark);
    }

    private applyTheme(isDark: boolean): void {
        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }
    }
}
