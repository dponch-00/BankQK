import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'BanQK',description:'Gastos e ingresos en pesos mexicanos.',manifest:'/manifest.webmanifest',icons:{icon:'/favicon.svg',apple:'/icon-192.png'}};
const themeScript="try{var p=localStorage.getItem('banqk-theme');document.documentElement.dataset.theme=p||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light')}catch(e){}";
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es-MX" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body>{children}</body></html>}
