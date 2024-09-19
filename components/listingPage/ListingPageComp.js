'use client'
import React, {useCallback, useEffect, useState} from 'react';
import styles from './ListingPage.module.css'
import FilterComp from "@/components/filter/filterComp";
import ShowCaseCategoryComp from "@/components/showCaseCategory/showCaseCategoryComp";
import ListingComp from "@/components/listingComp/listingComp";
import PaginationComp from "@/components/pagination/PaginationComp";
import {ApiGetRequest} from "@/services/admin";
import Swal from "sweetalert2";
import {useSearchParams} from "next/navigation";
import LoadingComp from "@/components/loading/LoadingComp";

function ListingPageComp(props) {
    const searchParams = useSearchParams();
    const type = searchParams.get("type");
    const searchKey = searchParams.get("searchKey");
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0);
    const [adverts, setAdverts] = useState([]);
    const [filterIds, setFilterIds] = useState([]);


    const getAdverts = useCallback(async () => {
        let query = `page=${currentPage}&categoryKey=${type}`;
        if (searchKey) {
            query = query + "&search=" + searchKey;
        }

        if (filterIds.length > 0) {
            filterIds.forEach(f => {
                query = query + "&selectedPropertyIds=" + f;
            });
        }

        console.log(query);

        const response = await ApiGetRequest("/Advertisement/SearchInGroupAdvertisementListQuery", query);
        if (response.errorMessage === null) {
            setAdverts(response.advertisementVMList);
            setTotalListCount(response['count']);
        } else {
            await Swal.fire("Hata", response.errorMessage);
        }
        setIsLoading(true);
        //console.log(response);
    }, [currentPage, filterIds, searchKey, type]);

    useEffect(() => {
        getAdverts();
    }, [getAdverts]);

    const handleChangeFilterIds = useCallback((filterIds) => {
        console.log("filter ids on listing :", filterIds);
        setFilterIds(filterIds);
        getAdverts();
    }, [getAdverts]);


    const paginate = useCallback(pageNumber => setCurrentPage(pageNumber), []);

    if (!isLoading) {
        return <LoadingComp/>
    }

    return (
        <div className={`${styles['']} container `}>
            <div className="d-flex flex-wrap justify-content-center">
                <div className="col-lg-3 col-12">
                    <FilterComp type={type} selectIds={handleChangeFilterIds}/>
                </div>
                <div className="col-lg-9 col-12">
                    <ShowCaseCategoryComp />
                    <ListingComp adverts={adverts}/>
                    {totalListCount > 25 && (
                        <PaginationComp
                            currentPage={currentPage}
                            totalPosts={totalListCount}
                            paginate={paginate}
                        />
                    )}
                    <br/>
                </div>
            </div>

        </div>

    );
}

export default ListingPageComp;