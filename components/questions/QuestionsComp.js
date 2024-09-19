'use client'
import React, {useEffect, useState} from 'react';
import styles from './Questions.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown,
    faArrowUp, faCheck,
    faChevronDown,
    faChevronUp,
    faEdit, faHourglass, faHourglassStart,
    faPlus,
    faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import SelectBox from "@/FormComponents/selectBox";
import {AdminGetRequest, AdminPostRequestWithJSON, AdminPostRequestWithModel} from "@/services/admin";
import swal from "sweetalert2";
import Link from "next/link";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import PaginationComp from "@/components/pagination/PaginationComp";
import LoadingComp from "@/components/loading/LoadingComp";

function QuestionsComp(props) {
    const router = useRouter()
    const [questions, setQuestions] = useState([])
    const [queryParams, setQueryParams] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(0)
    const [expandAllQuestion, setExpandAllQuestion] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)

    const getQuestions = async () => {
        setIsLoading(false)
        let query = ""
        if (queryParams?.topicId && queryParams.topicId !== 0) {
            query = query + "topicId=" + queryParams.topicId+"&"
        }

        query=query+"page="+currentPage
        const res = await AdminGetRequest("/question/getAll", query)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            setIsLoading(true)
            return
        }
        setQuestions(res.result)
        setTotalListCount(res?.count)
        setIsLoading(true)
    }
    useEffect(() => {
        getQuestions()
    }, [queryParams])

    useEffect(() => {
        getQuestions()
    }, [currentPage])
    const handleChange = (name, value) => {
        setQueryParams((prevValues) => ({
            ...prevValues, [name]: value, // Seçilen değeri ilgili selectbox'ın ismi ile state'e kaydediyoruz.
        }));
    };

    const approveQuestion = async (question) => {
        console.table(question)

        const sr = await swal.fire({
            icon: "warning",
            title: "Dikkat",
            text: "Soruyu Onaylamak İstiyor Musunuz?",
            showCancelButton: true,
            cancelButtonText: "Vazgeç",
            confirmButtonText: "Onayla",
            showConfirmButton: true,
        });
        if (!sr.isConfirmed) {
            return
        }
        const res = await AdminPostRequestWithJSON("/question/approve", "", question)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        console.log(question);

        swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Onaylandı!",
            showConfirmButton: false,
            timer: 1500
        });
        getQuestions()
    }

    const deleteQuestion = async (question) => {
        const sr = await swal.fire({
            icon: "warning",
            title: "Dikkat",
            text: "Soruyu Silmek İstiyor Musunuz?",
            showCancelButton: true,
            cancelButtonText: "Vazgeç",
            confirmButtonText: "Onayla",
            showConfirmButton: true,
        });
        if (!sr.isConfirmed) {
            return
        }
        const res = await AdminPostRequestWithJSON("/question/delete", "", question)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        console.log(question);

        swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Silindi!",
            showConfirmButton: false,
            timer: 1500
        });
        getQuestions()
    }

    const paginate = pageNumber => setCurrentPage(pageNumber);
    if (!isLoading){
        return (<LoadingComp/>)
    }
    return (
        <div className={`${styles['']} container mainContent mt-2 p-3 bg-white shadow rounded`}>
            <h4 className={"border-bottom"}>Sorular</h4>
            <div className={" d-flex justify-content-end align-items-start"}>


                <button className={"btn btn-success"} onClick={() => {
                    router.push("/admin/questions/questionAdd")
                    router.refresh()
                }}><FontAwesomeIcon icon={faPlus} className={"me-1"}/> Ekle
                </button>
            </div>

            <div className={"d-flex justify-content-between align-items-end"}>
                <div className={"col-2"}>
                    <h6 className={"mt-2"}>Soru Tipi</h6>
                    <SelectBox name={"topicId"} onChange={handleChange} firstOption={"Tümü"}
                               apiUrl={"/topic/getAll"}/>
                    <br/>
                </div>
                <div>
                    <button className="btn btn-sm " onClick={() => {
                        setSelectedQuestion(0)
                        setExpandAllQuestion(!expandAllQuestion)
                    }}><FontAwesomeIcon icon={expandAllQuestion ? faChevronUp : faChevronDown}
                                        className={"me-1"}/> Tümünü {expandAllQuestion ? "Gizle" : "Göster"}
                    </button>
                </div>
            </div>

            <br/>
            {questions.map((q, index) =>
                <div key={index} onClick={() => {
                    setSelectedQuestion(selectedQuestion === q.id ? 0 : q.id)
                }} className={"border  p-3 mb-1  pointer container bg-light"}>
                    <div
                        className={"d-flex flex-wrap align-items-center "}>

                        <div className={" fw-bold col-12 col-sm-1 d-flex flex-row align-items-center"}>{
                            !q?.controller?.firstName ?
                                <div className={"p-2"}><FontAwesomeIcon icon={faHourglassStart}
                                                                        className={"text-warning"}/>
                                </div> :
                                <div className={"p-2"}><FontAwesomeIcon icon={faCheck}
                                                                        className={"text-success"}/></div>
                        }
                            <div>{((currentPage-1)*25)+ (index + 1)}</div>
                        </div>
                        <div className={"col-12 col-sm-10"}
                             dangerouslySetInnerHTML={{__html: q.question}}
                        />
                        <div
                            className={"col-12 col-sm-1 d-flex flex-sm-column align-items-sm-end justify-content-center"}>
                            <div><Link href={"/admin/questions/questionAdd?id=" + q.id} title={"Düzenle"}
                                       className="btn btn-warning m-1 "><FontAwesomeIcon icon={faEdit} className={""}/></Link>
                            </div>
                            <div>
                                <button onClick={() => deleteQuestion(q)} title={"Sil"} className="btn btn-danger m-1">
                                    <FontAwesomeIcon icon={faTrashCan}
                                                     className={""}/>
                                </button>
                            </div>

                        </div>
                    </div>
                    {
                        (expandAllQuestion || selectedQuestion === q.id) &&
                        <>
                            <hr/>
                            <div className={"d-flex"}>
                                <span className={"me-2 fw-bold col-1"}>A.</span>
                                <div className={""}
                                     dangerouslySetInnerHTML={{__html: q.a}}
                                />
                            </div>
                            <div className={"d-flex"}>
                                <span className={"me-2 fw-bold col-1"}>B.</span>
                                <div className={""}
                                     dangerouslySetInnerHTML={{__html: q.b}}
                                />
                            </div>

                            <div className={"d-flex"}>
                                <span className={"me-2 fw-bold col-1"}>C.</span>
                                <div className={""}
                                     dangerouslySetInnerHTML={{__html: q.c}}
                                />
                            </div>

                            <div className={"d-flex "}>
                                <span className={"me-2 fw-bold col-1"}>D.</span>
                                <div className={""}
                                     dangerouslySetInnerHTML={{__html: q.d}}
                                />
                            </div>

                            <div className={"d-flex"}>
                                <span className={"me-2 fw-bold col-1"}>E.</span>
                                <div className={""}
                                     dangerouslySetInnerHTML={{__html: q.e}}
                                />
                            </div>
                            <br/>


                            <div className={"d-flex flex-wrap justify-content-start"}>


                                <div className="col-6 col-md-2 border bg-white p-2 m-1">
                                    <div className={"fw-bold"}>
                                        Doğru Cevap
                                    </div>
                                    <div className={""}
                                         dangerouslySetInnerHTML={{__html: q.correctAnswer}}
                                    />
                                </div>

                                <div className="col-6 col-md-2 border bg-white p-2 m-1">
                                    <div className={"fw-bold"}>
                                        Konu
                                    </div>
                                    <div>
                                        {q?.topic?.name}
                                    </div>
                                </div>

                                <div className="col-6 col-md-2  border bg-white p-2 m-1">
                                    <div className={"fw-bold"}>
                                        Zorluk Seviyesi
                                    </div>
                                    <div>
                                        {q?.difficult.value}
                                    </div>
                                </div>

                                <div className="col-6 col-md-2  border bg-white p-2 m-1">
                                    <div className={"fw-bold"}>
                                        Soru Tipi
                                    </div>
                                    <div>
                                        {q?.questionType.value}
                                    </div>
                                </div>
                                <div className="col-6 col-md-2  border bg-white p-2 m-1">
                                    <div className={"fw-bold"}>
                                        Hazırlayan
                                    </div>
                                    <div>
                                        {q?.creator?.firstName} {q?.creator?.lastName}
                                    </div>
                                </div>
                                <div className="col-6 col-md-2  border bg-white p-2 m-1">
                                    <div className={"fw-bold"}>
                                        Kontrol Eden
                                    </div>
                                    <div>
                                        {q?.controller?.firstName ? q?.controller?.firstName + " " + q?.controller?.lastName : "Kontrol Edilmedi"}
                                    </div>
                                </div>
                                {!q?.controller?.firstName &&
                                    <div
                                        className="col-6 col-md-2    p-2 m-1 d-flex justify-content-center align-items-center">
                                        {/*<div className={"fw-bold"}>
                                        Soruyu Onayla
                                    </div>*/}
                                        <div>
                                            <button onClick={() => approveQuestion(q)} className={"btn btn-success"}>
                                                <FontAwesomeIcon icon={faCheck}
                                                                 className={"me-1"}/>Soruyu
                                                Onayla
                                            </button>
                                        </div>
                                    </div>}
                            </div>

                            <hr/>
                            <div className={"bg-white p-2"}>
                                <div className={"me-2 fw-bold"}>Çözüm</div>
                                <hr/>
                                <div className={""}
                                     dangerouslySetInnerHTML={{__html: q.description}}
                                />
                            </div>

                        </>

                    }


                </div>)
            }

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

export default QuestionsComp;