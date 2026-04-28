"use client";

import Header from "./Header";
import SearchDialog from "./SearchDialog";
import ScrollEffects from "./ScrollEffects";
import { useState } from "react";

export default function Shell({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <ScrollEffects />
      <Header onSearch={() => setSearchOpen(true)} />
      {children}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

