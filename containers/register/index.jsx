import React, {Suspense} from 'react';
import RegisterComponent from "@/components/register/registerComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";

function RegisterContainer(props) {
    return (<>
            <Suspense fallback={<LoadingComp/>}>

                <Topbar/>
                <RegisterComponent/>


            </Suspense>

        </>

    );
}

export default RegisterContainer;