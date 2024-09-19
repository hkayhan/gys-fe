import React from 'react';
import Topbar from "@/components/topbar/TopbarComponent";
import ListingDetailComp from "@/components/listingDetail/listingDetailComp";
import LoadingComp from "@/components/loading/LoadingComp";
import {useSearchParams} from "next/navigation";

function ListingDetailContainer(props) {
    // const searchParams = useSearchParams()
    // const advertId = searchParams.get("id")
    const {advertId, advertTitle} = props

    return (<>

            <Topbar/>
            <ListingDetailComp advertId={advertId} advertTitle={advertTitle}/>
        </>
    );
}

export default ListingDetailContainer;