import React, {Suspense} from 'react';
import AddAdvertComp from "@/components/addAdvertComp/addAdvertComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";


function AddAdvertCont(props) {
    return (
        <div>
            <Topbar/>

            <Suspense fallback={<LoadingComp/>}>
                <AddAdvertComp/>

            </Suspense>
        </div>
    );
}

export default AddAdvertCont;