'use client'
import React, {useEffect, useState} from 'react';
import styles from './Messages.module.css'
import {ApiGetRequest} from "@/services/admin";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faEnvelopeOpen} from "@fortawesome/free-solid-svg-icons";
import PaginationComp from "@/components/pagination/PaginationComp";

function MessagesComp(props) {
    const [messages, setMessages] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)
    const getMessages = async () => {
        const response = await ApiGetRequest("/Message/GetCurrentUserMessageList", "")
        if (response.errorMessage === null) {
            setMessages(response.messageVMList)
            console.log(response.messageVMList);
            setTotalListCount(response['count'])

        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }
        setIsLoading(true)
        //console.log(response);

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
    useEffect(() => {
        getMessages()

    }, [])
    const paginate = pageNumber => setCurrentPage(pageNumber);

    const markAsRead =async (messageUid) => {
      const response = await ApiGetRequest("/Message/UpdateMessageStatus",`uid=${messageUid}&status=read`)
        if (response.errorMessage===null){
            getMessages()
        }else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }
    }
    if (!isLoading) {
        return <LoadingComp/>
    }
    return (
        <div className={`${styles['']} shadow rounded bg-white mt-3 mb-3 p-2 container mainContent`}>
            {totalListCount===0&&
            <div className={"d-flex flex-column mt-5 justify-content-center align-items-center"}>
                <div>
                    <FontAwesomeIcon size={"2xl"} icon={faEnvelope}/>
                </div>
                <h5 className={"mt-3 "}>Henüz mesajınız yok</h5>

            </div>

            }
            {messages.map((m, index) =>
                <div key={index} className={"border rounded mt-2"}>
                    {m.readDate === null ?
                        <div className={"bg-light p-2 fw-bold d-flex align-items-center"}>
                            <FontAwesomeIcon icon={faEnvelope} className={"me-2 text-danger"}/><span>{m.title}<span className={"text-muted ms-2 fw-lighter"}>{formatDate(m.createdAt)}</span></span>
                            <span onClick={()=>markAsRead(m.uId)} className={"ms-auto text-muted fw-lighter fst-italic text-underline pointer"}>Okundu Olarak İşaretle</span>

                        </div>
                        :
                        <div className={"bg-light p-2  d-flex align-items-center"}>
                            <FontAwesomeIcon icon={faEnvelopeOpen} className={"me-2 "}/><span>{m.title}<span className={"text-muted ms-2 fw-lighter"}>{formatDate(m.createdAt)}</span></span>
                            {/*<span className={"ms-auto text-muted fw-lighter fst-italic text-underline pointer"}>Okundu Olarak İşaretle</span>*/}

                        </div>

                    }


                    
                    <div className={" p-2 "}>
                        {m.body}
                    </div>
                </div>
            )}
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

export default MessagesComp;