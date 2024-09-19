'use client'
import React, {useEffect, useState, useRef} from 'react';
import styles from './PaymentDetail.module.css'
import {useSearchParams} from "next/navigation";
import {ApiGetRequest} from "@/services/admin";
import swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPrint} from "@fortawesome/free-solid-svg-icons";
import LoadingComp from "@/components/loading/LoadingComp";

function PaymentDetailComp(props) {
    const searchParams = useSearchParams()
    const advertId = searchParams.get("advertId")
    const [paymentDetail, setPaymentDetail] = useState([])
    const [ownerDetail, setOwnerDetail] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const printRef = useRef();
    if (!advertId) {
        return (<div>
            Hata!!!
        </div>)
    }
    const handlePrint = () => {
        //console.log('print');
        let printContents = document.getElementById('printablediv').innerHTML;
        let originalContents = document.body.innerHTML;
        document.body.innerHTML = printContents;
        window.print();
        document.body.innerHTML = originalContents;
    };




    const getPaymentDetail = async () => {
        const advertisementPayment = await ApiGetRequest("/Payment/GetAdvertisementPayments", "advertisementId=" + advertId)
        if (!advertisementPayment.errorMessage) {
            setPaymentDetail(advertisementPayment.paymentVMList)
            console.log(advertisementPayment)
        }
    }


    const getOwnerDetail = async () => {

        const advertOwner = await ApiGetRequest("/Users/GetByAdvertisementId", "advertisementId=" + advertId)
        if (!advertOwner.errorMessage) {
            setOwnerDetail(advertOwner.userVM)
            console.log(advertOwner)
            setIsLoading(true)
        }

    }

    useEffect(() => {
        getOwnerDetail()
        getPaymentDetail()
    }, [])

    if (!isLoading){
        return (<LoadingComp/>)
    }

    return (
        <div className={`${styles['']} container mainContent shadow bg-white rounded p-3 my-3`}>
            <div id={"printablediv"} className={styles['printableDiv']+" "} >
                <div className={" "}>
                    <h4 className="mb-2">{advertId} Nolu İlan Sahibine Ait Bilgiler </h4>
                    <hr/>
                    <div className="d-flex mb-2 ">
                        <div className="col-2 fw-bold ">İlan Sahibi</div>
                       <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.firstName} {ownerDetail?.lastName}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Şirket Adı</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.companyName}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Telefon</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.phone}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Eposta</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.email}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Adres 1</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.address1}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Adres 2</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.address2}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Vergi Dairesi</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.taxOffice}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Vergi Numarası</div>
                        <span className="fw-bold me-2">:</span>
                        <div className="col-7">{ownerDetail?.taxNumber}</div>
                    </div>
                </div>
                <br/>
                <br/>
                <div>
                    <h4 className="mb-4 ">{advertId} Nolu İlana Ait Ödeme Kalemleri</h4>
                    <hr/>
                    <div>
                        {
                            paymentDetail?.map((p, index) =>
                                <div key={index}>
                                    {
                                        p.referenceNumber === null &&
                                        <div className="d-flex mb-2">

                                            <div className="col-2 fw-bold">{p.priceType===""?"Toplam":p.priceType}</div>
                                            <span className="fw-bold me-2">:</span>
                                            <div className="col-7">{p.transferAmount}₺</div>
                                        </div>
                                    }

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
{/*
            <div  >
                <div className="mt-4">
                    <h4 className="mb-2">{advertId} Nolu İlan Sahibine Ait Bilgiler</h4>
                    <hr/>
                    <div className="d-flex mb-2 ">
                        <div className="col-2 fw-bold ">İlan Sahibi:</div>
                        <div className="col-7">{ownerDetail?.firstName} {ownerDetail?.lastName}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Şirket Adı:</div>
                        <div className="col-7">{ownerDetail?.companyName}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Telefon:</div>
                        <div className="col-7">{ownerDetail?.phone}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Eposta:</div>
                        <div className="col-7">{ownerDetail?.email}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Adres 1:</div>
                        <div className="col-7">{ownerDetail?.address1}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Adres 2:</div>
                        <div className="col-7">{ownerDetail?.address2}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Vergi Dairesi:</div>
                        <div className="col-7">{ownerDetail?.taxOffice}</div>
                    </div>
                    <div className="d-flex mb-2">
                        <div className="col-2 fw-bold">Vergi Numarası:</div>
                        <div className="col-7">{ownerDetail?.taxNumber}</div>
                    </div>
                </div>
                <br/>
                <br/>
                <div>
                    <h4 className="mb-4 ">{advertId} Nolu İlana Ait Ödeme Kalemleri</h4>
                    <hr/>
                    <div>
                        {
                            paymentDetail?.map((p, index) =>
                                <div key={index}>
                                    {
                                        p.referenceNumber === null &&
                                        <div className="row mb-2">

                                            <div className="col-2 fw-bold">{p.priceType}</div>
                                            <div className="col-7">{p.transferAmount}₺</div>
                                        </div>
                                    }

                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
*/}
            <div className={"d-flex justify-content-center mt-5"}>
                <button onClick={handlePrint} className="btn btn-primary"><FontAwesomeIcon icon={faPrint} className={"me-2"}/> Yazdır</button>
            </div>


        </div>

    );
}

export default PaymentDetailComp;