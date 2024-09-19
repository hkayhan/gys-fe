'use client'
import React, {useEffect, useState} from 'react';
import styles from './MyAdverts.module.css'
import {ApiGetRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import ListingComp from "@/components/listingComp/listingComp";
import PaginationComp from "@/components/pagination/PaginationComp";

function MyAdvertsComp(props) {


    const [adverts, setAdverts] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)


    const getAdverts = async () => {
        setIsLoading(false)

        const response =await ApiGetRequest("/Advertisement/GetCurrentUserAdvertisements", `page=${currentPage}&limit=25`)
        if (!response.errorMessage) {
            setAdverts(response.advertisementVMList)
            // console.log(response.advertisementVMList)
            setTotalListCount(response['count'])
            setIsLoading(true)
        }
    }

    useEffect(() => {
        getAdverts()

    }, [currentPage])

    useEffect(() => {
        //console.log(adverts);
    }, [adverts])


    const paginate = pageNumber => setCurrentPage(pageNumber);
    if (!isLoading) {
        return (<LoadingComp/>)
    }

    return (
        <div>
            <div className={"container mt-3 mainContent"}>
                <h4 className={"border-bottom"}>İlanlarım</h4>
                {/*<h6 className={"fst-italic"}>Bu alanda alanda yalnızca aktif ilanlr gözükmektedir.</h6>*/}
                {/*<hr/>*/}
                <ListingComp adverts={adverts} isOwner/>
                <div className="d-flex  flex-column justify-content-center align-items-center mt-5">
                    {/*<h2><FontAwesomeIcon icon={faExclamation}/></h2>*/}
                    {totalListCount === 0 &&
                        <h4 className={" "}>İlanınız bulunamadı.</h4>

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
            </div>


        </div>
    );
}

export default MyAdvertsComp;