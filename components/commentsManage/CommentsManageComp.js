'use client'
import React, {useEffect, useState} from 'react';
import styles from './CommentsManage.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser, faStar} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Switch from "react-switch";
import {ApiGetRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import PaginationComp from "@/components/pagination/PaginationComp";

function CommentsManageComp(props) {

    const [isLoading, setIsLoading] = useState(false)
    const [comments, setComments] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)

    useEffect(() => {

        getComments()
    }, [currentPage])

    const getComments = async () => {
        setIsLoading(false)
        let response = ApiGetRequest(`/Comment/GetCommentList`, `page=${currentPage}`)
        //console.log(response);
        let data = response.then(data => {
            setComments(data["commentVMList"])
            setTotalListCount(data['count'])
            setIsLoading(true)
            //console.log("data")
            //console.log(data)
        })
    }
    const countCommentStar = (count) => {
        let starLabel = []
        for (let i = 0; i < count; i++) {

            starLabel.push(<FontAwesomeIcon key={i} className={"text-warning"} icon={faStar}/>)
        }

        return starLabel

    }

    const formatDate = (dateStr) => {
        let date = new Date(dateStr)
        let localDate = date// .toLocaleString('tr-TR'); // Türkçe yerel saat dilimi kullanarak biçimlendirme

        let dtf = new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // 24 saat biçiminde göstermek için
        });

        return dtf.format(localDate);
    }
    const handleChange = (uid, isPublishable) => {
        //console.log(uid);
        setIsLoading(false)
        let response = ApiGetRequest(`/Comment/SetPublishable`, `uid=${uid}&isPublishable=${isPublishable?"false":"true"}`)
        let data = response.then(data => {
            //console.log("handleChange data")
            getComments()
            //console.log(data)
            setIsLoading(true)

        })

    }
    // Change page
    const paginate = pageNumber => setCurrentPage(pageNumber);


    return (<div className={`${styles['']} container mainContent bg-white rounded shadow my-3 p-3`}>
            {!isLoading && <LoadingComp/>}
            {isLoading && <>

                <h4>Yorumlar</h4>
                <hr/>
                <br/>
                <table className=" table table-striped text-center">
                    <thead>
                    <tr>
                        {/*<th scope="col">#</th>*/}
                        <th scope="col">Profil</th>
                        <th scope="col">Ad</th>
                        <th scope="col">Yorum</th>
                        <th scope="col">Puan</th>
                        <th scope="col">Tarih</th>
                        <th scope="col">Anasayfada Yayınla</th>
                    </tr>
                    </thead>
                    <tbody>
                    {comments?.map((d, index) => <tr key={index}>
                        {/*<th scope="row">1</th>*/}
                        <td><img
                            className={"rounded-circle"}
                            width={35}
                            height={35}
                            src={d.avatarUrl} alt={""}/></td>
                        <td><Link href={"/admin/userProfileActions"}>{d.userFirstName} {d.userLastName}</Link></td>
                        <td>{d.message}</td>
                        <td>{countCommentStar(d.star)}</td>
                        <td>{formatDate(d.createdAt)}</td>
                        <td>

                            <Switch onChange={()=>handleChange(d.uId, d.isPublishable)} checked={d.isPublishable}/>

                        </td>
                    </tr>)}


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
            </>}
        </div>
        // </div>

    );
}

export default CommentsManageComp;