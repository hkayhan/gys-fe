import React, {Suspense} from 'react';
import ListingContainer from "@/containers/listing/listingCont";
import LoadingComp from "@/components/loading/LoadingComp";

function ListingPage(props) {
    return (
        <Suspense>
            <ListingContainer/>
        </Suspense>
    );
}

export default ListingPage;