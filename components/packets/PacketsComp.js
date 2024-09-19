'use client'
import React, {useEffect, useState} from 'react';
import styles from './Packets.module.css'
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import Swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faPlus, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/navigation";
import Link from "next/link";

function PacketsComp(props) {
    const router = useRouter()
    const [editItems, setEditItems] = useState(0)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [formDataInputs, setFormDataInputs] = useState("")
    const [isActiveCheckbox, setIsActiveCheckbox] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const getPackagesList = async () => {
        const result = await ApiGetRequest("/Package/GetPackageList");

        if (result.errorMessage === null) {
            setData(result.packageVMList);

        }
        setIsLoading(true)
    };
    const selectEditItems = (id) => {
        setEditItems(id)
    }

    useEffect(() => {

        getPackagesList();

    }, []);
    const handleCheckboxChange = (event) => {
        setIsActiveCheckbox(event.target.checked);
    };
    const handleChange = (e) => {


        setFormDataInputs({
            ...formDataInputs, [e.target.name]: e.target.value,
        });

        //console.log(e.target.name);
        //console.log(e.target.value);

    }
    const updateItem = async (uid) => {

        if (isNaN(formDataInputs['duration']) || !formDataInputs['duration'] || formDataInputs['duration'] <= 0) {
            // alert("Gün Değeri Geçerli Bir Sayı Olmalıdır!");
            await Swal.fire({
                title: "Hata!",
                text: "Gün Değeri Geçerli Bir Sayı Olmalıdır.",
                denyButtonText:"Tamam",
                icon: "error"
            });
            return

        }

        if (isNaN(formDataInputs['price']) || formDataInputs['price'] < 0) {
            // alert("Ücret Değeri Geçerli Bir Sayı Olmalıdır!", formDataInputs['price']);
            await Swal.fire({
                title: "Hata!",
                text: "Ücret Değeri Geçerli Bir Sayı Olmalıdır.",
                denyButtonText:"Tamam",
                icon: "error"
            });
            return

        }


        await Swal.fire({
            title: "Geçerli Değeri Güncellemek İstiyor Musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                let query = `uid=${uid}&&duration=${formDataInputs['duration']}&price=${formDataInputs['price']}
            &isActive=${isActiveCheckbox}`
                let response = ApiGetRequest("/AdvertisementPrice/Update", query)
                response.then(data => {
                    // Swal.fire("Güncellendi!", "", "success");
                    Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Güncellendi!",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }).catch(error => {
                    // Swal.fire("Değişiklikler uygulanamadı!", "", "error");
                    Swal.fire({
                        position: "top-end",
                        icon: "error",
                        title: "Değişiklikler uygulanamadı!",
                        text:error,
                        showConfirmButton: false,
                        timer: 1000
                    });
                })
                setEditItems("")
                getPackagesList()

                // Swal.fire("Güncellendi!", "", "success");

            } else if (result.isDenied) {
                // Swal.fire("Değşiklik Uygulanamadı!", "", "info");
            }
        });
        // let confirmResult = confirm("Geçerli Değeri Güncellemek İstiyor Musunuz?")
        //
        // if (confirmResult) {
        //     let query = `uid=${uid}&&duration=${formDataInputs['duration']}&price=${formDataInputs['price']}
        //     &isActive=${isActiveCheckbox}`
        //     let response = await AdminGetRequest("/AdvertisementPrice/Update", query)
        //
        //     setEditItems("")
        //     await getPriceList()
        // }

    }

    function getCurrentDateTime() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Aylar 0-11 arası olduğu için +1 eklenir
        const year = now.getFullYear();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');

        return `${day}/${month}/${year} ${hours}:${minutes}`;
    }

    const addItem = async () => {
        let swalResult= await Swal.fire({
            title: "Yeni bir paket oluşturmak istiyor musunuz?",
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        })

        if (swalResult.isConfirmed) {
            let formDataArr = []

            formDataArr.push({name:"Name", value:"Yeni Paket ("+getCurrentDateTime()+")"});
            formDataArr.push({name:"Description", value:"Paket Açıklaması"});
            formDataArr.push({name:"UsageDuration", value:"0"});
            formDataArr.push({name:"Price", value:"0"});
            formDataArr.push({name:"DiscountPercentage", value:"0"});
            formDataArr.push({name:"IsActive", value:"false"});

             let response=await ApiPostRequest("/Package/Add","",formDataArr)

            if (response.errorMessage===null){
                router.push( "/admin/packets/editPackage?id="+response.package.id);
                router.refresh();
            }else{
                await Swal.fire({
                    title:"Hata",
                    text:response.errorMessage,
                    icon:"error",denyButtonText:"Tamam"
                })
            }
        }

    }
    const deleteItem = async (uid) => {
        // let confirmResult = confirm("Ücret Türünü Silmek İstiyor Musunuz?")

        Swal.fire({
            title: "Sil",
            text: "Ücretlendirme Türünü Silmek İstiyor Musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {

                let query = `uid=${uid}`
                let response = ApiGetRequest("/AdvertisementPrice/Delete", query)

                 Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Başarılı",
                    text:"Ücretlendirme Türü Silindi",
                    showConfirmButton: false,
                    timer: 1500
                });
                getPackagesList()

            }
        });
    }
    if (!isLoading) {
        return <LoadingComp/>
    }

    return (
        <div className={`${styles['']} shadow rounded bg-white mt-3 mb-3 p-2 container mainContent`}>
            <div className={"d-flex justify-content-between px-2 py-1"}><h4>Paket Ücretleri </h4>
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
                    <th scope="col">Açıklama</th>
                    <th scope="col">Süre</th>
                    <th scope="col">Ücret</th>
                    <th scope="col" className={"text-center"}>
                        <div>Havale/EFT</div>
                        <div>İndirimi</div>
                    </th>
                    <th scope="col">Aktif</th>
                    <th scope="col" className={"text-center"}>Düzenle</th>
                </tr>
                </thead>
                <tbody>


                {data.map((d, index) => <tr key={index}>
                     <>

                        <td>{d.name}</td>
                        <td><span className={"text-muted"}>{d.description}</span></td>
                        <td>{d.usageDuration} Ay</td>
                        <td>
                            {d.price}₺
                        </td>
                        <td className={"text-center"}>
                            %{d.discountPercentage}₺
                        </td>
                        <td>{d.isActive ? "Aktif" : "Pasif"}</td>
                        <td className={"text-center"} >
                            <Link href={"/admin/packets/editPackage?id="+d.id} className={"hoverRed pointer"}>

                                <FontAwesomeIcon icon={faEdit}/>
                            </Link>
                            </td>
                    </>

                </tr>)}
                </tbody>
            </table>


        </div>

    );
}

export default PacketsComp;