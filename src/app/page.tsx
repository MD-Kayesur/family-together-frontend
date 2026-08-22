import Link from "next/link";
import {
  TreePine,
  ArrowRight,
  ShieldCheck,
  Users,
  Calendar,
  Image as ImageIcon,
  FolderLock,
  Sparkles,
  Heart,
  LogIn
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 bg-mesh-amber selection:bg-amber-500 selection:text-white">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-stone-200/80 dark:border-stone-800/80 bg-white/75 dark:bg-stone-950/75 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-all">
              <TreePine className="h-5 w-5 stroke-[2.5]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-stone-900 dark:text-stone-50 leading-none">
                FamilyRoots
              </span>
              <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                Family SaaS Suite
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-stone-700 dark:text-stone-200 hover:text-stone-900 dark:hover:text-white bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800 transition-all"
            >
              <LogIn className="h-4 w-4" />
              <span>Sign In</span>
            </Link>

            <Link
              href="/signin"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
            >
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center text-center space-y-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <span>Interactive Family Relationship & Tree Visualizer</span>
        </div>

        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-stone-900 dark:text-stone-50 leading-[1.1]">
            Build, visualize & protect your{" "}
            <span className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 bg-clip-text text-transparent">
              family history
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 leading-relaxed font-normal">
            A private, multi-generational digital space to map family relationships, record milestone memories, schedule family events, and store encrypted documents.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link
            href="/signin"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 text-white font-bold text-base shadow-xl shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In to Your Workspace</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pt-12 text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <TreePine className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Interactive Family Tree
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              5 layout modes (Tree, Horizontal, Vertical, Compact, Graph) with zoom, pan, and node drawer.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <Users className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Relationship Engine
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Spouse, parents, siblings, cousins, in-laws, and custom relation links with full history.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center font-bold">
              <ImageIcon className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Shared Memories Gallery
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Media gallery with tagged family members, story mode, comments, and milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-sm space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <FolderLock className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
              Secure Document Vault
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
              Encrypted storage for family certificates, heirlooms, and legal records with access controls.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-stone-200 dark:border-stone-800 py-6 px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        FamilyRoots © {new Date().getFullYear()} — Private Family Network SaaS Platform.
      </footer>
    </div>
  );
}
