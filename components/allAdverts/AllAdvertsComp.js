'use client'
import React, {useEffect, useState} from 'react';
import styles from './AllAdverts.module.css'
import {useRouter, useSearchParams} from "next/navigation";
import {ApiGetRequest} from "@/services/admin";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import ListingDetailComp from "@/components/listingDetail/listingDetailComp";
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import PaginationComp from "@/components/pagination/PaginationComp";

function AllAdvertsComp(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [adverts, setAdverts] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)


    const getAdverts = async () => {
        setIsLoading(false)
        const response = await ApiGetRequest("/Advertisement/AdvertisementListQuery", `page=${currentPage}`)
        if (response.errorMessage === null) {
            setAdverts(response.advertisementVMList)
            setTotalListCount(response['count'])

        } else {
            await Swal.fire("Hata", response.errorMessage)
        }
        setIsLoading(true)
        //console.log(response);
    }

    useEffect(()=>{
        getAdverts()
    },[currentPage])

    const paginate = pageNumber => setCurrentPage(pageNumber);
    if (!isLoading){
        return (<LoadingComp/>)
    }

    return (
        <div className={`${styles['']} container mainContent p-2`}>
            <h4>Tüm İlanlar</h4>
            <hr/>
            <table className=" table table-striped text-center">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">İlan No</th>
                    <th scope="col">Adı</th>
                    <th scope="col">Sahibi</th>
                    <th scope="col">Tarih</th>
                    <th scope="col">İlan Durumu</th>
                    <th scope="col">Düzenle</th>
                    <th scope="col">İncele</th>
                </tr>
                </thead>
                <tbody>
                {adverts.map((d, index) =>
                    <tr key={index}>


                        {/*<th scope="row">1</th>*/}
                        <td>

                            <img
                                className={"rounded"}
                                width={35}
                                height={35}
                                src={d.imageBase64  ? "data:image/jpeg;base64," + d.imageBase64: "/images/logo.svg"}
                                alt={"..."}/></td>
                        <td>{d.id}</td>
                        <td>{d.advertisementTitle}</td>
                        <td>{d.companyName}</td>
                        <td title={"Oluşturulma Tarihi"}>{d.advertisementCreatedAt}</td>
                        <td>
                            <span
                                className={ "p-2 bg-successs text-whites rounded" }> {d.statusValue}</span>
                        </td>
                        <td title={"İlanı İncele"} className={"text-center align-baseline pointer"}>
                            <Link href={"/advert/addAdvert?type=update&id=" +d.advertisementId+(d.parentId?"&parentId="+d.parentId:"")}
                                  className={"p-2"}>
                                <FontAwesomeIcon icon={faEdit}/>
                            </Link>
                        </td>
                        <td title={"İlanı İncele"} className={"text-center align-baseline pointer"}><Link href={"/admin/awaitingApproval?id="+d.advertisementId+(d.parentId?"&parentId="+d.parentId:"")}
                                                                                                          className={"p-2"}><FontAwesomeIcon
                            icon={faMagnifyingGlass}/>
                        </Link></td>
                    </tr>
                )}

                </tbody>
            </table>

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

    );
}

export default AllAdvertsComp;