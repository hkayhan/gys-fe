'use client'
import React, {useEffect, useState} from 'react';
import {ApiGetRequest} from "@/services/admin";
import PaginationComp from "@/components/pagination/PaginationComp";
import ListingComp from "@/components/listingComp/listingComp";
import LoadingComp from "@/components/loading/LoadingComp";

function MyApplicationsComp(props) {
    const [applicants, setApplicants] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)

    const getApplicants = () => {
        try {
            const response = ApiGetRequest("/Applicant/GetActiveUserApplicants", `page=${currentPage}&limit=25`)
            response.then(data => {
                //console.log(data);
                setApplicants(data.applicantVMList)
                setTotalListCount(data['count'])
                setIsLoading(true)
            })

        } catch (error) {
            //console.log(error)
        }
    }

    useEffect(() => {
        getApplicants()

    }, [currentPage])

    useEffect(() => {
        //console.log(applicants);
    }, [applicants])

    const paginate = pageNumber => setCurrentPage(pageNumber);
    if (!isLoading) {
        return (<LoadingComp/>)
    }

    return (
        <div className={"container mt-3 "}>
            <h4>Başvurularım</h4>
            <h6 className={"fst-italic"}>Bu alanda alanda yalnızca aktif ilanlar gözükmektedir.</h6>
            <hr/>

            <ListingComp adverts={applicants}/>
            <div className="d-flex  flex-column justify-content-center align-items-center mt-2">
                {/*<h2><FontAwesomeIcon icon={faExclamation}/></h2>*/}
                {totalListCount === 0 &&
                    <h4 className={" "}>Başvuru yaptığınız aktif ilan bulunamadı.</h4>

                }
            </div>

            {/* <table className=" table table-striped">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Şirket Adı</th>
                    <th scope="col">İlan Başlığı</th>
                    <th scope="col">Başvuru Tarihi</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>Eti Makina</td>
                    <td>Vasıfsız Eleman</td>
                    <td>22/11/2023</td>
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
            {
                totalListCount > 25 &&

                <PaginationComp
                    // postsPerPage={perPage}
                    currentPage={currentPage}
                    totalPosts={totalListCount}
                    paginate={paginate}
                />
            }
        </div>
    );
}

export default MyApplicationsComp;