"use client";

import React from "react";
import Link from "next/link";
import { TreePine, ShieldCheck } from "lucide-react";

export default function PublicFooter() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-white pt-16 pb-8 px-6 lg:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
                <TreePine className="h-4 w-4" />
              </div>
              <span className="font-extrabold text-lg text-white">FamilyRoots</span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your private sanctuary for preserving family history and connecting generations in a secure, modern space.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Company</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About Platform</Link></li>
              <li><Link href="/support" className="hover:text-white transition-colors">Support Center</Link></li>
              <li><Link href="/signin" className="hover:text-white transition-colors">Member Sign In</Link></li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase tracking-wider">Security & Privacy</h4>
            <ul className="space-y-2 text-slate-400">
              <li><span className="text-slate-400">Multi-Tenant Isolation</span></li>
              <li><span className="text-slate-400">Encrypted Document Vault</span></li>
              <li><span className="text-slate-400">Zero Public Feed / No Ads</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} FamilyRoots. All rights reserved.</p>
          <div className="flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-slate-300 font-semibold">Secure & Private Sanctuary</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
