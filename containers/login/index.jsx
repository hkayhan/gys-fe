import React,{Suspense} from 'react';
import Topbar from "@/components/topbar/TopbarComponent";
import LoginComponent from "@/components/login/loginComp";
import LoadingComp from "@/components/loading/LoadingComp";

function LoginContainer(props) {
    return (<>
            <Suspense fallback={<LoadingComp/>}>

                <Topbar/>
                <LoginComponent/>

            </Suspense>
        </>

    );
}

export default LoginContainer;