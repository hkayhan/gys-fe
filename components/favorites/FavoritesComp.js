'use client'
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamation, faHeart} from "@fortawesome/free-solid-svg-icons";
import ListingComp from "@/components/listingComp/listingComp";
import {ApiGetRequest} from "@/services/admin";
import PaginationComp from "@/components/pagination/PaginationComp";
import LoadingComp from "@/components/loading/LoadingComp";

function FavoritesComp(props) {

    const [favorites, setFavorites] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)


    const getFavorites = () => {
        try {
            const response = ApiGetRequest("/Favorite/GetActiveUserFavorites", `page=${currentPage}&limit=25`)
            response.then(data => {
                setFavorites(data.favoritesVMList)
                setTotalListCount(data['count'])
            })

        } catch (error) {
            //console.log(error)
        }
        setIsLoading(true)
    }

    useEffect(() => {
        getFavorites()

    }, [currentPage])

    useEffect(() => {
        //console.log(favorites);
    }, [favorites])



    const paginate = pageNumber => setCurrentPage(pageNumber);
    if (!isLoading){
        return (<LoadingComp/>)
    }

    return (
        <div>
            <div className={"container mt-3 mainContent"}>
                <h4 className={"border-bottom"}>Favorilerim</h4>
                {/*<h6 className={"fst-italic"}>Bu alanda alanda yalnızca aktif ilanlr gözükmektedir.</h6>*/}
                {/*<hr/>*/}
                <ListingComp adverts={favorites}/>
                <div className="d-flex  flex-column justify-content-center align-items-center mt-5">
                    {/*<h2><FontAwesomeIcon icon={faExclamation}/></h2>*/}
                    {totalListCount===0&&
                        <h4 className={" "}>Favorilerinize eklediğiniz ilan bulunamadı.</h4>

                    }
                </div>

                {
                    totalListCount > 25 &&

                    <PaginationComp
                        // postsPerPage={perPage}
                        currentPage={currentPage}
                        totalPosts={totalListCount}
                        paginate={paginate}
                    />
                }
                <br/>
                {/*
                <table className=" table table-striped">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Şirket Adı</th>
                        <th scope="col" >İlan Başlığı</th>
                        <th scope="col">Favori İşlemleri</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <th scope="row"> <FontAwesomeIcon className={"text-danger"} icon={faHeart}/></th>
                        <td>Eti Makina</td>
                        <td>Vasıfsız Eleman</td>
                        <td ><button className={"text-underline"}>
                            <FontAwesomeIcon className={"text-danger"} icon={faHeart}/> Favorilerden Çıkar</button> </td>
                    </tr>
                    <tr>
                        <th scope="row">2</th>
                        <td>Arçelik</td>
                        <td>Forklift Operatörü</td>
                        <td>23/11/2023</td>
                    </tr>
                    <tr>
                        <th scope="row">3</th>
                        <td >Ay Plastik</td>
                        <td>Forklift Operatörü</td>
                        <td>25/11/2023</td>
                    </tr>
                    </tbody>
                </table>
*/}
            </div>


        </div>
    );
}

export default FavoritesComp;