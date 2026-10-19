import "./globals.css";
import Shell from "@/components/Shell";
import {site} from "@/lib/site";
export const metadata={
  metadataBase:new URL(site.url),
  title:{default:"Vinwjin Lab · 个人实验室",template:"%s | Vinwjin Lab"},
  description:"Vinwjin 的个人实验室与数字花园。记录 AI、NAS、浏览器自动化和工具实践。",
  authors:[{name:site.author}],
  alternates:{canonical:"/",types:{"application/atom+xml":"/atom.xml"}},
  icons:{icon:"/images/favicon.svg"},
  openGraph:{type:"website",locale:"zh_CN",siteName:site.title,title:"Vinwjin Lab · 个人实验室",description:"保持好奇，把想法变成日常。",images:["/images/social-cover.svg"]}
};
const themeScript=`try{var t=localStorage.getItem("theme");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){}`;
export default function RootLayout({children}){
  return <html lang={site.language} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body><Shell>{children}</Shell></body></html>;
}
