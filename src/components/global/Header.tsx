"use client";

import HeaderActions from "./HeaderActions";
import HeaderSearch from "./HeaderSerach";

export default function Header() {
  return (
    <header className="bg-white shadow-custom px-6 py-4">
      <div className="flex justify-between items-center">
        <HeaderSearch />
        <HeaderActions />
      </div>
    </header>
  );
}
