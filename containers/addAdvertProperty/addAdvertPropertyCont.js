import React, {Suspense} from 'react';
import AddAdvertPropertyComp from "@/components/addAdvertProperty/addAdvertPropertyComp";
import Topbar from "@/components/topbar/TopbarComponent";
import LoadingComp from "@/components/loading/LoadingComp";

function AddAdvertPropertyCont(props) {
    return (
        <div>
            <Topbar/>
            <Suspense fallback={<LoadingComp/>}>
                <AddAdvertPropertyComp/>
            </Suspense>
        </div>
    );
}

export default AddAdvertPropertyCont;