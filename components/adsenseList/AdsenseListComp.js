'use client'
import React, {useEffect, useState} from 'react';
import styles from './AdsenseList.module.css'
import {useRouter} from "next/navigation";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import Switch from "react-switch";

function AdsenseListComp(props) {

    const router = useRouter()
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const getAdsenseList = async () => {
        const result = await ApiGetRequest("/Commercial/GetCommercialList");
        console.log(result);
        if (result.errorMessage === null) {
            setData(result.commercialVMList);

        }
        setIsLoading(true)
    };


    useEffect(() => {

        getAdsenseList();

    }, []);

    const addItem = async () => {
        let swalResult = await Swal.fire({
            title: "Yeni bir paket oluşturmak istiyor musunuz?",
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        })

        if (swalResult.isConfirmed) {
            let formDataArr = []

            formDataArr.push({name: "LocationName", value: "top"});
            formDataArr.push({name: "ShowInMobile", value: false});
            formDataArr.push({name: "CategoryName", value: "other"});
            // formDataArr.push({name: "EndDate", value: ""});
            // formDataArr.push({name: "StartDate", value: ""});
            formDataArr.push({name: "Url", value: ""});
            formDataArr.push({name: "Title", value: "Reklam Başlığı"});
            formDataArr.push({name: "Content", value: "Reklam İçeriği"});
            formDataArr.push({name: "ShowInDesktop", value: true});
            formDataArr.push({name: "StatusName", value: "active"});
            formDataArr.push({name: "ForwardLink", value: "www.google.com.tr"});

            let response = await ApiPostRequest("/Commercial/Add", "", formDataArr)
            console.log(response);
            if (response.errorMessage === null) {
                router.push("/admin/adsense/editAdsence?id=" + response.commercial.id);
                router.refresh();
            } else {
                await Swal.fire({
                    title: "Hata",
                    text: response.errorMessage,
                    icon: "error",
                    denyButtonText:"Tamam"
                })
            }
        }

    }
    const deleteItem = async (uid) => {
        // let confirmResult = confirm("Ücret Türünü Silmek İstiyor Musunuz?")

        Swal.fire({
            title: "Sil",
            text: "Reklamı silmek istiyor musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                let query = `uid=${uid}`
                let response = ApiGetRequest("/AdvertisementPrice/Delete", query)

                {/*
                    Swal.fire({
                        title: "Başarılı!",
                        text: "Ücretlendirme Türü Silindi.",
                        icon: "success"
                    });
                */}
                Swal.fire({
                    position: "top-end",
                    title: "Başarılı!",
                    text: "Ücretlendirme Türü Silindi.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 100
                });
                getAdsenseList()

            }
        });
    }

    const formatDate = (dateStr) => {
        let localDate = new Date(dateStr)

        let dtf = new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
            hour12: false // 24 saat biçiminde göstermek için
        });

        return dtf.format(localDate);

    }
    if (!isLoading) {
        return <LoadingComp/>
    }

    return (
        <div className={`${styles['']} shadow rounded bg-white mt-3 mb-3 p-2 container mainContent`}>
            <div className={"d-flex justify-content-between px-2 py-1"}><h4>Reklam Yönetim Sayfası </h4>
                <div className="btn btn-success" onClick={() => {
                    addItem()
                }}><FontAwesomeIcon
                    icon={faPlus}/> Ekle
                </div>
            </div>
            <hr/>
            <br/>
            <table className=" table table-striped ">
                <thead>
                <tr>
                    {/*<th scope="col">#</th>*/}
                    <th scope="col" className={"w-25"}>Ad</th>
                    {/*<th scope="col">Açıklama</th>*/}
                    <th scope="col">Başlangıç</th>
                    <th scope="col">Bitiş</th>
                    <th scope="col">Konum</th>
                    {/*<th scope="col" className={"text-center"}>*/}
                    {/*    <div>Havale/EFT</div>*/}
                    {/*    <div>İndirimi</div>*/}
                    {/*</th>*/}
                    <th scope="col">Durum</th>
                    <th scope="col" className={"text-center"}>Düzenle</th>
                </tr>
                </thead>
                <tbody>


                {data.map((d, index) => <tr key={index}>
                    <>

                        <td>{d.title}</td>
                        {/*<td><span className={"text-muted"}>{d.description}</span></td>*/}
                        <td>{formatDate(d.startDate)} </td>
                        <td>{formatDate(d.endDate)} </td>
                        <td>
                            {d.locationName}
                        </td>
                        {/*<td className={"text-center"}>*/}
                        {/*    %{d.discountPercentage}₺*/}
                        {/*</td>*/}
                        <td>

                            {/*<Switch onChange={() => handleChange(d.uId, d.isPublishable)} checked={d.statusName==="Aktif"}/>*/}
                            {d.statusName}
                        </td>
                        <td className={"text-center"}>
                            <span href={"/admin/packets/editPackage?id=" + d.id} className={"hoverRed pointer"}>
                                {/*<CheckBox onChange={()=>handleCheckboxChange()} value={""} name={"IsActive"} label={""}/>*/}
                                {/*<FontAwesomeIcon icon={faCheck}/>*/}
                            </span>

                            <Link href={"/admin/adsense/editAdsence?id=" + d.id} className={"hoverRed pointer ms-2"}>

                                <FontAwesomeIcon icon={faEdit}/>
                            </Link>
                            {/*<span onClick={()=>deleteItem(d.uId)} className={"hoverRed pointer ms-2"}>*/}

                            {/*    <FontAwesomeIcon icon={faTrashCan}/>*/}
                            {/*</span>*/}
                        </td>
                    </>

                </tr>)}
                </tbody>
            </table>


        </div>

    );
}

export default AdsenseListComp;