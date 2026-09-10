import { Code2, Database, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-white/[0.06] bg-[#030303] px-5 py-6 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/5">
            <Database
              size={15}
              className="text-red-500"
            />
          </div>

          <div>
            <p className="text-xs font-bold tracking-wide text-zinc-300">
              SQLForge
            </p>

            <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-700">
              SQL Practice & Placement
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-center gap-1 sm:items-end">
          <p className="text-[10px] text-zinc-600">
            © {new Date().getFullYear()} SQLForge. All rights reserved.
          </p>

          <div className="flex items-center gap-1.5">
            <Code2
              size={11}
              className="text-red-500"
            />

            <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
              Made with
            </p>

            <Heart
              size={11}
              className="fill-red-500 text-red-500"
            />

            <p className="text-[9px] uppercase tracking-[0.16em] text-zinc-700">
              by Joe
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;