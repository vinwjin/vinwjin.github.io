"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import SiteFooter from "./SiteFooter";
import SearchDialog from "./SearchDialog";
import ScrollEffects from "./ScrollEffects";

export default function Shell({ children }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  useEffect(() => {
    function shortcut(event) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase()==="k") {
        event.preventDefault();
        setSearchOpen(value=>!value);
      }
    }
    window.addEventListener("keydown",shortcut);
    return ()=>window.removeEventListener("keydown",shortcut);
  }, []);
  return <>
    <Header onSearch={()=>setSearchOpen(true)}/>
    <div id="main-content" tabIndex={-1}>{children}</div>
    <SiteFooter/>
    <ScrollEffects key={pathname}/>
    <SearchDialog open={searchOpen} onClose={closeSearch}/>
  </>;
}
