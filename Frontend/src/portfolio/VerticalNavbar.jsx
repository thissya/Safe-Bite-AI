function VerticalNavbar({ onNavigate }) {
    return (
        <nav className="mb-20 flex items-center justify-between py-6">
            <div className="flex flex-shrink-0 items-center">
                <h2 className="mx-2 text-purple-400 text-2xl font-bold font-mono">Safe Bite AI</h2>
            </div>
            <div className="m-8 flex items-center justify-center gap-4 text-base font-mono">
                <span
                    className="text-purple-300 cursor-pointer"
                    onClick={() => onNavigate("home")}
                >
                    Home
                </span>
                <span
                    className="text-purple-300 cursor-pointer"
                    onClick={() => onNavigate("about")}
                >
                    About
                </span>
                <span
                    className="text-purple-300 cursor-pointer"
                    onClick={() => onNavigate("contact")}
                >
                    Contact
                </span>
            </div>
        </nav>
    );
}

export default VerticalNavbar;
