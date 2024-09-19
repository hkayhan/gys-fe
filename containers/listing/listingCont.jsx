import React from 'react';
import Topbar from "@/components/topbar/TopbarComponent";
import AdvertisementHorizontal from "@/components/advertisementHorizontal/AdHorzComp";
import ListingPageComp from "@/components/listingPage/ListingPageComp";

function ListingContainer(props) {

    return (
        <>
            <Topbar />
            <AdvertisementHorizontal />
            <ListingPageComp/>
        </>
    );
}

export default React.memo(ListingContainer);
