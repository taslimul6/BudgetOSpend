

const Footer = () => {
    return (
        <div>
            <footer className="mt-auto border-t border-ink/10 bg-bg/40 py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
                    <p>© 2026 BentoSpend • Smart Expense Tracker</p>
                    <div className="flex items-center gap-4">
                        <span>Design System: Bento Modular</span>
                        <span className="w-1 h-1 rounded-full bg-muted"></span>
                        <span>Tailwind CSS v4</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;