'use client'
import React, {useEffect, useState} from 'react';
import styles from './EditPackage.module.css'
import InputText from "@/FormComponents/inputText/InputText";
import {ApiGetRequest, ApiPostRequestWithModel} from "@/services/admin";
import {useRouter, useSearchParams} from "next/navigation";
import UserProfilePhotoComp from "@/components/userProfilePhoto/UserProfilePhotoComp";
import LoadingComp from "@/components/loading/LoadingComp";
import Swal from "sweetalert2";
import CheckBox from "@/FormComponents/checbox/CheckBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faSave, faTrash} from "@fortawesome/free-solid-svg-icons";

function EditPackageComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get("id")
    if (id === null) {
        return <div>
            Hata
        </div>
    }
    const [isLoading, setIsLoading] = useState(false)
    const [packet, setPacket] = useState([])
    const [prices, setPrices] = useState([])
    const [packetPrices, setPacketPrices] = useState([])
    const [errorMessage, setErrorMessage] = useState([])
    const [addNewItem, setAddNewItem] = useState({
        AdvertisementPriceId: 0,
        PackageId: id,
        Quantity: 0
    })
    const [isAddNewItem, setIsAddNewItem] = useState(false)
    const getPrices = async () => {
        let data = await ApiGetRequest("/AdvertisementPrice/GetAdvertisementPriceList")

        setPrices(data)
        setIsLoading(true)

    }

    const getPacketPrices = async () => {
        const response = await ApiGetRequest("/PackageDetail/GetPackageDetailList", "packageId=" + id)
        //console.log(response);
        if (response.errorMessage === null) {
            setPacketPrices(response.packageDetailVMList)
        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }
    }
    const getPacket = async () => {
        //console.log(id);
        const response = await ApiGetRequest("/Package/GetPackageById", "packageId=" + id)

        if (response.errorMessage === null) {
            setPacket(response.packageVM)
        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }

    }


    useEffect(() => {
        getPacket()
        getPrices()
        getPacketPrices()
    }, [])

    const handleChangeCheckbox = (e) => {
        const {name, checked} = e.target;
        setPacket(prevData => ({
            ...prevData, [name]: checked // checked değerini kullanın
        }));
    };
    const deletePrice = async (itemId) => {
        const response = await ApiGetRequest("/PackageDetail/Delete", 'id=' + itemId)
        if (response.errorMessage === null) {
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarılı",
                text:"Başarıyla Silindi",
                showConfirmButton: false,
                timer: 1500
            });        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }
        await getPacketPrices()
    }

    const addItem = async () => {
        const response = await ApiPostRequestWithModel("/PackageDetail/Add", "", addNewItem)
        //console.log(response);
        if (response.errorMessage === null) {
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarılı",
                text:"Başarıyla Eklendi",
                showConfirmButton: false,
                timer: 1500
            });
        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
        }
        await getPacketPrices()
    }


    const handleChangeNewItem = (e) => {
        e.preventDefault()

        const {name, value} = e.target;
        //console.log("name,value");
        //console.log(name, value);

        if (value === "") {
            return
        }
        setAddNewItem({
            ...addNewItem, [name]: value
        })
    }

    const updatePacket = async () => {
        const response = await ApiPostRequestWithModel("/Package/Update", "", packet)

        if (response.errorMessage === null) {
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarılı",
                text:"Başarıyla Güncellendi",
                showConfirmButton: false,
                timer: 1500

            });
            router.push("/admin/packets")
            router.refresh()

        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})

        }

    }

    const deletePacket = async () => {
        const response = await ApiGetRequest("/Package/Delete", "id=" + id)

        if (response.errorMessage === null) {
            await Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarılı",
                text:"Başarıyla Silindi",
                showConfirmButton: false,
                timer: 1500
            });
            router.push("/admin/packets")
            router.refresh()

        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})

        }

    }

    const handleChange = (e) => {
        setPacket({
            ...packet, [e.target.name]: e.target.value,
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
                        <InputText label={"Paket Adı"}
                                   name={"name"}
                                   value={packet.name}
                                   onChange={handleChange}
                        />

                        <InputText label={"Açıklama"}
                                   name={"description"}
                                   value={packet.description}
                                   onChange={handleChange}
                        />

                        <InputText label={"Süresi(Ay)"}
                                   name={"usageDuration"}
                                   value={packet.usageDuration}
                                   onChange={handleChange}
                        />

                        <InputText label={"Paket Ücreti"}
                                   name={"price"}
                                   value={packet.price}
                                   onChange={handleChange}
                        />

                        <InputText label={"Paketin Görüntülenme Sırası"}
                                   name={"order"}
                                   value={packet.order}
                                   onChange={handleChange}
                        />

                        <InputText label={"Havale/Eft İndirimi"}
                                   name={"discountPercentage"}
                                   value={packet.discountPercentage}
                                   onChange={handleChange}
                        />
                        <br/>
                        <CheckBox label={"Aktif"} name={"isActive"}
                                  value={packet.isActive} onChange={handleChangeCheckbox}/>

                    </div>

                </div>
                <div className="col-md-6">
                    <UserProfilePhotoComp uid={packet?.uid} userType={"firm"} photoType={"package_photo"}/>

                </div>
                <div className={"mt-4"}>
                    <h5>Paket İçeriği</h5>
                    <hr/>
                    <div className={"d-flex justify-content-between px-2 py-1"}><h4>Paket Ücretleri </h4>
                        <div className="btn btn-success" onClick={() => {
                            setIsAddNewItem(!isAddNewItem)
                        }}><FontAwesomeIcon
                            icon={faPlus}/> Ekle
                        </div>
                    </div>
                    <div>
                        <button></button>
                    </div>
                    <table className=" table table-striped  w-100">
                        <thead>
                        <tr className={""}>
                            <th scope="col" className={"w-50"}>Ücret Adı</th>
                            <th scope="col" className={""}>Süresi</th>
                            <th scope="col" className={"text-center"}>Adet</th>
                            <th scope="col" className={""}>Sil</th>
                        </tr>
                        </thead>
                        <tbody>


                        {
                            packetPrices.map((pp, index) =>

                                <tr key={index}>
                                    <td>
                                        {
                                            pp.advertisementPriceType
                                        }
                                    </td>
                                    <td>
                                        {
                                            pp.advertisementPriceDuration
                                        }
                                    </td>
                                    <td className={"text-center"}>
                                        {
                                            pp.quantity
                                        }
                                    </td>

                                    <td>
                                        <div onClick={() => deletePrice(pp.id)}>
                                            <button className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash}
                                                                                                  className={"me-2 pointer hoverRed"}/> Sil
                                            </button>

                                        </div>

                                    </td>
                                    {/*<td className={"text-end hoverRed pointer"}>*/}
                                    {/*    <Link href={"addCategory?id=" + ac.id}><FontAwesomeIcon*/}
                                    {/*        icon={faEdit}/></Link>*/}
                                    {/*</td>*/}


                                </tr>
                            )}

                        {
                            isAddNewItem &&
                            <tr>
                                <td className={"h-100 "}>
                                    <div className={"d-flex align-items-center"}>
                                        <select
                                            className={"w-75 p-1"}
                                            onChange={handleChangeNewItem}
                                            name={"AdvertisementPriceId"}
                                            id={"AdvertisementPriceId"}
                                        >
                                            <option value="">Seçiniz</option>
                                            {prices.map((m, index) =>
                                                <option key={index} value={m.id}>{m.advertisementTypeName}-{m.duration} Gün
                                                </option>)}

                                        </select>
                                    </div>

                                </td>
                                <td></td>
                                <td className={"d-flex justify-content-center"}>
                                    <div className={"w-25 "}>
                                        <InputText
                                            label={"Adet"}
                                            name={"Quantity"}
                                            onChange={handleChangeNewItem}
                                            value={addNewItem.Quantity}/>

                                    </div>
                                </td>

                                <td>
                                    <button onClick={() => {
                                        addItem()
                                        setIsAddNewItem(false)
                                    }} className={"btn btn-success"}>
                                        <FontAwesomeIcon icon={faSave} className={"me-2"}/>
                                        Ekle
                                    </button>
                                </td>
                            </tr>
                        }


                        </tbody>
                    </table>

                </div>


            </div>
            <hr/>
            <div className={"text-center mt-4 d-flex justify-content-center"}>
                <button onClick={() => {
                    updatePacket()
                }} className={"btn btn-success me-3"}><FontAwesomeIcon icon={faSave} className={"me-2"}/> Paket
                    Bilgilerini
                    Güncelle
                </button>
                <button onClick={() => {
                    deletePacket()
                }} className={"btn btn-danger"}><FontAwesomeIcon icon={faTrash} className={"me-2"}/> Paketi Sil
                </button>
            </div>

        </div>

    );
}

export default EditPackageComp;