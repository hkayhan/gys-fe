'use client'
import React, {useEffect, useState} from 'react';
import styles from './PaymentsManage.module.css'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faMagnifyingGlass, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest} from "@/services/admin";
import PaginationComp from "@/components/pagination/PaginationComp";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";

function PaymentsManageComp(props) {
    const [isLoading, setIsLoading] = useState(false)
    const [payments, setPayments] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [totalListCount, setTotalListCount] = useState(0)
    const [editId, setEditId] = useState(0)

    const getPayments = async () => {

        setIsLoading(false)
        const response = ApiGetRequest("/Payment/GetPaymentList", `page=${currentPage}`)
        let data = response.then(data => {
            setPayments(data["paymentVMList"])
            setTotalListCount(data['count'])
            setIsLoading(true)
            console.log("data")
            console.log(data)
        })

    }


    useEffect(() => {

        getPayments()
    }, [currentPage])
    const paginate = pageNumber => setCurrentPage(pageNumber);
    const formatDate = (dateStr) => {
        let date = new Date(dateStr)
        let localDate = date// .toLocaleString('tr-TR'); // Türkçe yerel saat dilimi kullanarak biçimlendirme

        let dtf = new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
            hour12: false, // 24 saat biçiminde göstermek için
        });

        return dtf.format(localDate);
    }

    const updatePayment = async (payment) => {
        //console.log(payment);
        await Swal.fire({
            title: "Ödeme Durumunu Güncelle",
            text: "Havale İle Yapılan Ödemeyi Güncelleyeceksiniz",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Onayla",
            denyButtonText: `Reddet`,
            cancelButtonText: `Vazgeç`,
        }).then((result) => {
            //console.log(result);
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                let query = `uid=${payment.uId}&status=approved`
                let response = ApiGetRequest("/Payment/UpdatePaymentStatus", query)
                response.then(data => {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Başarılı",
                        text: "Ödeme Onaylandı",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    getPayments()
                })


            } else if (result.isDenied) {

                let query = `uid=${payment.uId}&status=cancelled`
                let response = ApiGetRequest("/Payment/UpdatePaymentStatus", query)
                response.then(data => {
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Başarılı",
                        text: "Ödeme Reddedildi",
                        showConfirmButton: false,
                        timer: 1500
                    });

                    getPayments()
                })


            }
        });
    }

    if (!isLoading) {
        return (<LoadingComp/>)
    }

    return (
        <div className={`${styles['']}  mainContent shadow rounded bg-white p-3 my-3`}>
            <h4>Ödemeler</h4>
            <hr/>
            <br/>
            <table className=" table table-striped text-start">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">İlan No</th>
                    <th scope="col" className={"text-start"}>Adı</th>
                    <th scope="col">Sahibi</th>
                    <th scope="col">Tarih</th>
                    <th scope="col">Toplam Ücret</th>
                    <th scope="col">İlan Durumu</th>
                    <th scope="col">Ödeme Durumu</th>
                    <th scope="col">Referans No</th>
                    <th scope="col">Düzenle</th>
                    <th scope="col">İncele</th>
                </tr>
                </thead>
                <tbody>
                {payments.map((d, index) =>
                    <tr key={index}>


                        {/*<th scope="row">1</th>*/}
                        <td>

                            {/*<img
                                className={"rounded"}
                                width={35}
                                height={35}
                                src={d.imageUrl === "" ? "https://www.tvreklam.com.tr/wp-content/uploads/2020/03/reklam-sozlugu-tv-reklam.jpg" : d.imageUrl}
                                alt={""}/>*/}
                            <div>
                                <img
                                    src={d.imageBase64 ? ("data:image/jpeg;base64," + d.imageBase64) : "/images/no_image.jpg"}
                                    width={35} height={35} className={styles[''] + " rounded"}
                                    alt={d.advertisementTitle}/>

                            </div>


                        </td>


                        <td className={"text-start"}>{d['advertisementId']}</td>
                        <td className={"text-start"}>{d['advertisementTitle']}</td>
                        <td>{d['advertisementOwner']}</td>
                        <td>{formatDate(d['transferDate'])}</td>
                        <td className={"text-center"}>{d['transferAmount']}₺</td>
                        <td>{d['advertisementStatus']}</td>
                        <td className={"p-2 " +
                            (d['status'] === "Onaylandı" ? "bg-success text-center text-white" : (
                                d['status'] === "İptal Edildi" ? "bg-danger text-center text-white" :
                                    "bg-warning text-center text-white"
                            ))
                        }>{d['status']}</td>
                        <td>{d['referenceNumber']}</td>
                        {
                            d['type'] === "Havale/EFT" ?
                                <td onClick={() => {
                                    updatePayment(d)
                                }} className={"hoverRed pointer "}>
                                    <FontAwesomeIcon icon={faEdit}/>
                                </td> :
                                <td>
                                    KK İle Ödendi
                                </td>
                        }


                        <td className={"text-center align-baseline "}>
                            <Link href={"/admin/paymentsManage/paymentDetail?advertId=" + d.advertisementId}
                                  className={"p-2 hoverRed pointer"}><FontAwesomeIcon
                                icon={faMagnifyingGlass}/>
                            </Link>
                            {/*
                            <span onClick={() => getPaymentsDetail(d.advertisementId)}
                                  className={"hoverRed pointer"}><FontAwesomeIcon icon={faMagnifyingGlass}/></span>
*/}
                        </td>
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
        </div>


    );
}

export default PaymentsManageComp;