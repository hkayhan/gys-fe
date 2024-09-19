import React, {Suspense} from 'react';
import EditPackageComp from "@/components/editPackage/EditPackageComp";
import LoadingComp from "@/components/loading/LoadingComp";

function EditPackageCont(props) {
    return (<>
        <Suspense fallback={<LoadingComp/>}>
            <EditPackageComp/>
        </Suspense>
    </>);
}

export default EditPackageCont;