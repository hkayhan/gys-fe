import React, {Suspense} from 'react';
import ListingDetailContainer from "@/containers/listingDetail";
import LoadingComp from "@/components/loading/LoadingComp";

function Page(props) {
    return (
        <Suspense fallback={<LoadingComp/>}>
            <ListingDetailContainer/>
        </Suspense>
    );
}

export default Page;