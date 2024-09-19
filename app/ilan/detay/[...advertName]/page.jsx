import React from 'react';
import ListingDetailContainer from "@/containers/listingDetail";
import Head from "next/head";

function Page({params}) {
    console.log(params);
    console.log(params.advertName);
    console.log(params.advertName.length);
    if (params.advertName.length!==2){
        return (<div>
            Hata!!!
        </div>)
    }
    return (
        // <Suspense fallback={<LoadingComp/>}>
        <div>

            <ListingDetailContainer advertTitle={params.advertName[0]} advertId={params.advertName[1]}/>

        </div>
        // </Suspense>
    );
}

export default Page;