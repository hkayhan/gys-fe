'use client'
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHeart, faHeartCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest} from "@/services/admin";

function FavoritesButtonItem(props) {
    //console.log(props);
    const {advertId}=props
    //console.log(advertId);
    const [isFav, setIsFav]=useState(false)
    const [favorite, setFavorite]=useState([])

    const addFavorites=async ()=>{
        const response = await ApiGetRequest("/Favorite/Add",`advertisementId=${advertId}`)
       if (!response.errorMessage){
           setFavorite(response.favorite)
           setIsFav(true)

       }
    }

    const deleteFavorites=async ()=>{
        const response = await ApiGetRequest("/Favorite/Delete",`id=${favorite.id}`)
        if (!response.errorMessage){
            setFavorite(null)
            setIsFav(false)
        }
    }

    const hasFavorites=async ()=>{
        const response = await ApiGetRequest("/Favorite/HasUserAddedFavorite",`advertisementId=${advertId}`)
        if (!response.errorMessage){
            setFavorite(response.favorite)
            setIsFav(true)
        }else {
            setIsFav(false)
        }
    }

    useEffect(()=>{
        hasFavorites()
    },[])

    const handleClick=()=>{
        setIsFav(!isFav)
    }



    return (
        <div className={"pointer"}>
            {isFav ?

               <div onClick={()=>deleteFavorites()}> <FontAwesomeIcon className={"me-1 text-danger"} icon={faHeartCircleCheck}/><span className={"d-none d-md-inline"}>Favorilerde</span></div>
            :
             <div onClick={()=>addFavorites()}><FontAwesomeIcon className={"me-1 "} icon={faHeart}/><span className={"d-none d-md-inline"}>Favoriye Ekle</span> </div>}
</div>
    );
}

export default FavoritesButtonItem;