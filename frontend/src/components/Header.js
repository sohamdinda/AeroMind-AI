
function Header({ darkMode, setDarkMode }) {
    return (
        <header className="header">
            <div className="header-content">
                <div className="header-brand">
                    <div className="header-logo">🌍</div>
                    <div>
                        <h1>AeroMind AI</h1>
                        <p>AI-Powered Air Quality Intelligence</p>
                    </div>
                </div>

                <button
                    type="button"
                    className="theme-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                    aria-label={
                        darkMode
                            ? "Switch to light mode"
                            : "Switch to dark mode"
                    }
                    aria-pressed={darkMode}
                >
                    <span aria-hidden="true">
                        {darkMode ? "☀️" : "🌙"}
                    </span>
                    {darkMode ? "Light mode" : "Dark mode"}
                </button>
            </div>
        </header>
    );
}

export default Header;
