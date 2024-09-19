import React from 'react';
import TopbarComponent from "@/components/topbar/TopbarComponent";
import FavoritesComp from "@/components/favorites/FavoritesComp";

function FavoritesCont(props) {
    return (
        <>
            <TopbarComponent/>
            <FavoritesComp/>
        </>
    );
}

export default FavoritesCont;