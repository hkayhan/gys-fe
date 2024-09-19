'use client'
import React, {useEffect, useState} from 'react';
import styles from './AwaitingApproval.module.css'
import ListingDetailComp from "@/components/listingDetail/listingDetailComp";
import {useRouter, useSearchParams} from "next/navigation";
import LoadingComp from "@/components/loading/LoadingComp";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import Swal from "sweetalert2";

function AwaitingApprovalComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(true)
    const advertId = searchParams.get("id")
    const parentId = searchParams.get("parentId")
    if (!advertId) {
        return (<div>
            Hata!!!
        </div>)
    }
    const [paymentList, setPaymentList] = useState([])
    const [socialMediaText, setSocialMediaText] = useState("")
    const [advertMessage, setAdvertMessage] = useState("")
    const getActivePropertyAdvertisement = async (id) => {
        const response = await ApiGetRequest("/AdvertisementProperty/GetAdvertisementPropertyByAdvertisementId", `advertisementId=${id}&isSocialMedia=false`)
        //console.log(response);
        if (response.errorMessage === null) {
            setSocialMediaText(response?.advertisementPropertyVMList[0]?.propertyValue);
        }
    }

    const getAdvertMessage = async (id) => {
        const response = await ApiGetRequest("/AdvertisementProperty/GetAdvertisementPropertyByProperty", `advertisementId=${id}&propertyKey=cancel_reason`)
        console.log(response);
        if (response.errorMessage === null) {
            setAdvertMessage(response?.advertisementPropertyVMList[0]?.propertyValue);
        }
    }

    const getAdvertSelectedPrice = async () => {
        const response = await ApiGetRequest("/Payment/GetAdvertisementPayments", `advertisementId=${advertId}`)
        if (response.errorMessage === null) {

            setPaymentList(response);
            console.log(response);

        }

    }

    const updateAdvert = async () => {
        const response = await ApiGetRequest("/Advertisement/UpdateStatus", `advertisementId=${advertId}&status=active`)
        if (!response.errorMessage) {
            await Swal.fire("Başarılı", "İlan Onaylandı", "success")
            router.back()
        }
    }

    const cancelAdvert = async () => {
        const response = await ApiGetRequest("/Advertisement/CancelAdvertisement", `?advertisementId=${advertId}&message=${advertMessage}`)
        if (!response.errorMessage) {
            await Swal.fire("Başarılı", "İlan İptal Edildi", "success")
            router.back()
        }
    }

    useEffect(() => {
        getAdvertSelectedPrice()
        getActivePropertyAdvertisement(advertId)
        getAdvertMessage(advertId)
    }, [])
    if (!isLoading) {
        return (<LoadingComp/>)
    }

    return (
        <div className={`${styles['']} container mainContent`}>
            <div className={"cursorNotAllowed d-flex"}>
                {parentId && <ListingDetailComp advertId={parentId}/>
                }
                <ListingDetailComp advertId={advertId}/>
            </div>
            {/*<div className="d-flex justify-content-center mt-3  p-2">*/}


            <hr/>
            <div className={"container bg-light shadow p-3 rounded mb-2"}>
                <h5>İlanın İçin Yapılan Ödemeler</h5>
                <hr/>
                <ul>
                    {
                        paymentList?.paymentVMList?.map((p, index) =>
                            <li key={index}>{p.priceType}</li>
                        )
                    }
                </ul>

            </div>
            {
                socialMediaText !== "" && <div className={"container bg-light shadow p-3 mb-2 rounded"}>
                    <h5>İlanın Sosyal Medya Mesajı</h5>
                    <hr/>
                    <div dangerouslySetInnerHTML={{__html: socialMediaText}}/>
                </div>
            }

            {
                socialMediaText !== "" && <div className={"container bg-light shadow p-3 rounded"}>
                    <h5>İlan Hakkında Notlar</h5>
                    <hr/>
                    <div dangerouslySetInnerHTML={{__html: advertMessage}}/>
                </div>
            }


            <div className="d-grid gap-2 my-5  p-2">
                <button onClick={() => updateAdvert()} className={"btn btn-success"}>Onayla</button>
                <button onClick={() => cancelAdvert()} type={"button"} className={"btn  btn-danger"}>İptal Et</button>
            </div>

            <div className="my-3">
                <h5>İlan Mesajı</h5>
                <hr/>
                <p className={"text-muted"}>İlanın Ret olma nedenini aşağıdaki alana girebilirisiniz. Girdiğiniz mesaj aynı zamanda ilan sahibine mesaj ve E-Posta yoluyla iletilecektir. </p>
                <textarea
                    value={advertMessage}
                    className="form-control"
                    onChange={(e)=>setAdvertMessage(e.target.value)}
                    name={"advertMessage"}
                    maxLength={500} // maksimum karakter sayısı
                    rows={5}
                    style={{width: '100%'}} // textarea'nin boyutunu değiştirememe
                />
            </div>

            {/*</div>*/}
            {/*</div>*/}


        </div>

    );
}

export default AwaitingApprovalComp;