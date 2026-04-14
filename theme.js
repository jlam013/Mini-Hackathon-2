const THEME_STORAGE_KEY = "mru-cs-hub-theme";

function getSystemTheme() {
    return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

function getSavedTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY);
}

function getActiveTheme() {
    return document.documentElement.getAttribute("data-theme") || getSavedTheme() || getSystemTheme();
}

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
}

function saveTheme(theme) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function updateToggleButtons(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
        button.textContent = nextTheme === "dark" ? "🌙 Dark mode" : "☀️ Light mode";
        button.setAttribute("aria-label", `Switch to ${nextTheme} mode`);
        button.setAttribute("aria-pressed", String(theme === "dark"));
        button.dataset.currentTheme = theme;
    });
}

function toggleTheme() {
    const nextTheme = getActiveTheme() === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    saveTheme(nextTheme);
    updateToggleButtons(nextTheme);
}

function initializeThemeToggle() {
    const activeTheme = getActiveTheme();
    applyTheme(activeTheme);
    updateToggleButtons(activeTheme);

    document.querySelectorAll("[data-theme-toggle]").forEach(button => {
        button.addEventListener("click", toggleTheme);
    });

    if (window.matchMedia) {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        mediaQuery.addEventListener("change", event => {
            if (!getSavedTheme()) {
                const theme = event.matches ? "dark" : "light";
                applyTheme(theme);
                updateToggleButtons(theme);
            }
        });
    }
}

initializeThemeToggle();
