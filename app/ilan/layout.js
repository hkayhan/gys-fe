import "@fortawesome/fontawesome-svg-core/styles.css";
import "@fortawesome/free-brands-svg-icons";
import {library} from '@fortawesome/fontawesome-svg-core';
import {fab} from '@fortawesome/free-brands-svg-icons';

library.add(fab);

import {config} from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;

import SidebarComp from "@/components/sidebar/SidebarComp";
import TopbarComponent from "@/components/topbar/TopbarComponent";


export default function RootLayout({children}) {
    return (<div>
            {/*<TopbarComponent/>*/}
            <div className={"d-flex"}>

                <div className={'flex-grow-1 '}>
                    {children}


                </div>

            </div>
        </div>

    )
}
