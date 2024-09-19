'use client'
import React, {useEffect, useState} from 'react';
import styles from './EditAdsence.module.css'
import {useRouter, useSearchParams} from "next/navigation";
import {ApiGetRequest, ApiPostRequestWithModel} from "@/services/admin";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import InputText from "@/FormComponents/inputText/InputText";
import CheckBox from "@/FormComponents/checbox/CheckBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave, faTrash} from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import 'react-datepicker/dist/react-datepicker.css';

import tr from "date-fns/locale/tr";
import useSelectedItems from "@/hooks/useSelectedItems";
import AddPhotoComp from "@/components/addPhoto/AddPhotoComp";

function EditAdsenceComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedItems, handleSelect, handleSelectMultiple, removeAndAdd, clearItems] = useSelectedItems();

    const id = searchParams.get("id")
    if (id === null) {
        return <div>
            Hata
        </div>
    }
    const [isLoading, setIsLoading] = useState(false)

    const [adsense, setAdsense] = useState([])
    const [packet, setPacket] = useState([])
    const [locations, setLocations] = useState([])
    const [packetPrices, setPacketPrices] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [addNewItem, setAddNewItem] = useState({
        AdvertisementPriceId: 0,
        PackageId: id,
        Quantity: 0
    })

    const getAdsenseData = async () => {
        console.log(adsense);
        const response = await ApiGetRequest("/Commercial/GetById", "id=" + id)

        if (response.errorMessage === null) {
            setAdsense(response.commercialVMList[0])
        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage, icon:"error",denyButtonText:"Tamam"})
        }
        setIsLoading(true)
    }

    const getLocations = async () => {
        const response = await ApiGetRequest("/Definition/GetByGroup", `group=commercial_location`)
        if (response.errorMessage === null) {
            setLocations(response.definitionList)
        }
    }


    useEffect(() => {
        getAdsenseData()
        getLocations()
    }, [])

    const handleChangeCheckbox = (e) => {
        const {name, checked} = e.target;
        setAdsense(prevData => ({
            ...prevData, [name]: checked // checked değerini kullanın
        }));
    };

    const handleStartDateChange = (date) => {
        console.log(date);
        setAdsense(prevData => ({
            ...prevData, startDate: date
        }));
    };

    const handleEndDateChange = (date) => {
        setAdsense(prevData => ({
            ...prevData, endDate: date
        }));
    };


    const updateAdsense = async () => {
        console.log(adsense);
        // return
        if  (adsense.startDate){
            adsense.startDate= dateToStr(adsense.startDate)
        }
        if (adsense.endDate){
            adsense.endDate= dateToStr(adsense.endDate)
        }

        const response = await ApiPostRequestWithModel("/Commercial/Update", "", adsense)

        if (response.errorMessage === null) {
            //await Swal.fire("Başarılı", "Başarıyla Güncellendi ")
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarıyla Güncellendi",
                showConfirmButton: false,
                timer: 1000
            });
            router.push("/admin/adsense/adsenseList")
            router.refresh()

        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})

        }

    }

    const dateToStr=(date)=>{
        // const date = new Date('Fri Jun 25 2024 00:00:00 GMT+0300');

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`
    }

    const deleteAdsense = async () => {

        let result = await Swal.fire({
            title: "Sil",
            text: "Ücretlendirme Türünü Silmek İstiyor Musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        })
        if (result.isConfirmed) {

            const response = await ApiGetRequest("/Commercial/Delete", "id=" + id)

            if (response.errorMessage === null) {
               // await Swal.fire("Başarılı", "Başarıyla Silindi ")
                await Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Başarılı",
                    text:"Başarıyla Silindi",
                    showConfirmButton: false,
                    timer: 1500
                });
                router.push("/admin/adsense/adsenseList")
                router.refresh()

            } else {
                await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})

            }

        }


    }

    const handleChange = (e) => {
        console.log(e.target.name);
        setAdsense({
            ...adsense, [e.target.name]: e.target.value,
        });

    }

    if (!isLoading) {
        return <LoadingComp/>
    }
    return (
        <div className={`${styles['']} shadow rounded bg-white mt-3 mb-3 p-3 container mainContent`}>
            <h4>Paket Özellikleri</h4>
            <hr/>
            <div className="row">
                <div className="col-md-6">
                    <div className="">
                        <InputText label={"Reklam Adı"}
                                   name={"title"}
                                   value={adsense.title}
                                   onChange={handleChange}
                        />


                        <InputText label={"Reklam Linki"}
                                   name={"Url"}
                                   value={adsense.url}
                                   onChange={handleChange}
                        />
                        <div className="row mt-2">
                            <div className={"col-6"}>
                                <DatePicker
                                    selected={adsense.startDate}
                                    className={"form-control d-block"}
                                    onChange={handleStartDateChange}
                                    placeholderText="Başlangıç Tarihi"
                                    dateFormat="dd/MM/yyyy"
                                    locale={tr}

                                />
                            </div>

                            <div className={"col-6"}>
                                <DatePicker
                                    selected={adsense.endDate}
                                    className={"form-control d-block"}
                                    onChange={handleEndDateChange}
                                    placeholderText="Bitiş Tarihi"
                                    dateFormat="dd/MM/yyyy"
                                    locale={tr}

                                />
                            </div>


                        </div>
                        <hr/>
                        <div className={"mt-2"}>
                            <CheckBox label={"Aktif"} name={"statusName"}
                                      value={adsense.statusName} onChange={handleChangeCheckbox}/>
                        </div>
                        <div className={"mt-2"}>
                            <CheckBox label={"Masaüstünde Göster"} name={"showInDesktop"}
                                      value={adsense.showInDesktop} onChange={handleChangeCheckbox}/>
                        </div>
                        <div className={"mt-2"}>
                            <CheckBox label={"Mobilde Göster"} name={"showInMobile"}
                                      value={adsense.showInMobile} onChange={handleChangeCheckbox}/>
                        </div>


                    </div>
                    <hr/>
                    <div className={"mt-2"}>
                        <h4>Reklam Konumu</h4>
                        <ul className={`list-group list-group-flush `}>

                            {locations.map((fc, index) =>
                                <li className="list-group-item" key={index}>

                                    <input className={"me-2"}
                                           type={"radio"}
                                           id={fc.key}
                                           name={fc.group}
                                           value={fc.value}
                                           checked={selectedItems.includes(fc.id)}

                                           onChange={() => removeAndAdd(fc.id, selectedItems)}
                                    />

                                    <label htmlFor={fc.key}>{fc.value}</label>
                                    <br/>
                                </li>)}
                        </ul>

                    </div>

                </div>
                <div className="col-md-6">
                    <h4>Reklam Kodu</h4>
                    <textarea
                        id={"content"}
                        name={"content"}
                        cols={50}
                        rows={30}
                        defaultValue={"Reklam Kodu"}
                        value={adsense.content}
                        onChange={handleChange}
                    />
<hr/>
                    <AddPhotoComp uid={adsense?.uId}/>

                </div>



            </div>


            <hr/>
            <div className={"text-center mt-4 d-flex justify-content-center"}>
                <button onClick={() => {
                    updateAdsense()
                }} className={"btn btn-success me-3"}><FontAwesomeIcon icon={faSave} className={"me-2"}/> Reklam
                    Bilgilerini
                    Güncelle
                </button>
                <button onClick={() => {
                    deleteAdsense()
                }} className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash} className={"me-2"}/> Reklamı Sil
                </button>
            </div>

        </div>

    );
}

export default EditAdsenceComp;