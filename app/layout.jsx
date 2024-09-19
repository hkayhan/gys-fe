import {Inter} from "next/font/google";
import "bootstrap/dist/css/bootstrap.min.css"; // Import bootstrap CSS
import "styles/sites.css"
import 'styles/reset.css'
import 'styles/global.css'
import Footer from '@/components/footer/FooterComp'

import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fortawesome/free-brands-svg-icons";
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';
import Script from 'next/script';

library.add(fab);

import {config} from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;


export const metadata = {
    title: 'GYS', description: 'GYS',
}

const interFontFamily = Inter({subsets: ['latin']})
export default function RootLayout({children}) {
    return (
        <html lang="tr" className={interFontFamily.className}>
        <head>
            <script async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6309169153932120"
                    crossOrigin="anonymous"></script>
        </head>
        <body className={"main-body"}>
        <div className={'horizontalMenu'}>
            {/*<Header>header</Header>*/}
            {/*<main>*/}
            <div className={"mainContentBody"}>
                {children}

            </div>
            {/*</main>*/}
            <Footer/>
        </div>

        </body>


        </html>
    )
}
