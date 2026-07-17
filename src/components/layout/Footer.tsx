export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 text-xs text-ink/50 sm:flex-row">
        <p>© {new Date().getFullYear()} Red Sand</p>
      </div>
    </footer>
  );
}
