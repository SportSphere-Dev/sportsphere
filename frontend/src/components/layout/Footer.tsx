export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 px-6 py-4 text-center text-xs text-slate-500">
      <div className="mx-auto max-w-7xl">
        © {new Date().getFullYear()} SportSphere. All rights reserved.
      </div>
    </footer>
  );
}