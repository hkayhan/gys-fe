'use client'
import React, {useEffect, useState} from 'react';
import styles from './AdvertPrices.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck, faEdit, faPlus, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import LoadingComp from "@/components/loading/LoadingComp";
import {ApiGetRequest} from '@/services/admin'
import Swal from 'sweetalert2'
import Select from 'react-select'

function AdvertPricesComp(props) {
    const [editItems, setEditItems] = useState(0)
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [formDataInputs, setFormDataInputs] = useState("")
    const [isActiveCheckbox, setIsActiveCheckbox] = useState(false)
    const [addNew, setAddNew] = useState(false)
    const getPriceList = async () => {
        const result = await ApiGetRequest("/AdvertisementPrice/GetAdvertisementPriceList");
        console.log(result);
        setData(result);
        setIsLoading(true)
    };
    const selectEditItems = (id) => {
        setEditItems(id)
    }

    useEffect(() => {

        getPriceList();

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
                icon: "error",
                denyButtonText:"Tamam"
            });
            return

        }

        if (isNaN(formDataInputs['price']) || formDataInputs['price'] < 0) {
            // alert("Ücret Değeri Geçerli Bir Sayı Olmalıdır!", formDataInputs['price']);
            await Swal.fire({
                title: "Hata!",
                text: "Tüm alanlar dolurulmalıdır.",
                icon: "error",
                denyButtonText:"Tamam"
            });
            return

        }


        let result = await Swal.fire({
            title: "Geçerli Değeri Güncellemek İstiyor Musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        })
        if (result.isConfirmed) {
            let query = `uid=${uid}&group=${formDataInputs['group']}&groupOrder=${formDataInputs['groupOrder']}&selectionType=${formDataInputs['selectionType']}&duration=${formDataInputs['duration']}&price=${formDataInputs['price']}
            &isActive=${isActiveCheckbox}`
            let response = await ApiGetRequest("/AdvertisementPrice/Update", query).then(data => {
               // Swal.fire("Güncellendi!", "", "success");
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Güncellendi",
                    showConfirmButton: false,
                    timer: 1000
                });
            }).catch(error => {
                Swal.fire({title:"Değişiklikler uygulanamadı!", text:error, icon:"error",denyButtonText:"Tamam"});

            })
            setEditItems("")
            getPriceList()

            // Swal.fire("Güncellendi!", "", "success");

        } else if (result.isDenied) {
            // Swal.fire("Değşiklik Uygulanamadı!", "", "info");
        }

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

    const addItem = async () => {
        if (formDataInputs['itemName'] === undefined || formDataInputs['itemName'] === "") {
            await Swal.fire({
                title: "Hata!",
                text: "Ad Değeri Boş Bırakılamaz.",
                icon: "error",
                denyButtonText:"Tamam"
            });
            return

        }
        if (formDataInputs['duration'] === undefined || !formDataInputs['duration'] || formDataInputs['duration'] <= 0) {
            await Swal.fire({
                title: "Hata!",
                text: "Gün Değeri Geçerli Bir Sayı Olmalıdır.",
                icon: "error",
                denyButtonText:"Tamam"
            });
            return

        }

        if (isNaN(formDataInputs['price']) || formDataInputs['price'] < 0) {
            await Swal.fire({
                title: "Hata!",
                text: "Ücret Değeri Geçerli Bir Sayı Olmalıdır.",
                icon: "error"
            });
            return

        }


        const swalRes = await Swal.fire({
            title: "Ekle",
            text: "Yeni Ücretlendirme Türünü Eklemek İstiyor Musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        })
        if (swalRes.isConfirmed) {
            setIsLoading(false)
            // let query = `uid=${uid}&group=${formDataInputs['group']}&selectionType=${formDataInputs['selectionType']}&duration=${formDataInputs['duration']}&price=${formDataInputs['price']}
            let query = `group=${formDataInputs['group']}&groupOrder=${formDataInputs['groupOrder']}&selectionType=${formDataInputs['selectionType']}&advertisementType=${formDataInputs['itemName']}&duration=${formDataInputs['duration']}&price=${formDataInputs['price']}
            &isActive=${isActiveCheckbox}`
            let response = await ApiGetRequest("/AdvertisementPrice/Add", query)

            setAddNew(false)
            await Swal.fire({
                title: "Başarılı!",
                text: "Yeni Ücretlendirme Türü Eklendi.",
                icon: "success"
            });

            getPriceList()

        }
    }


    const deleteItem = async (uid) => {
        // let confirmResult = confirm("Ücret Türünü Silmek İstiyor Musunuz?")

        let result = await Swal.fire({
            title: "Sil",
            text: "Ücretlendirme Türünü Silmek İstiyor Musunuz?",
            showDenyButton: true,
            showCancelButton: false,
            confirmButtonText: "Evet",
            denyButtonText: `Hayır`
        })
        if (result.isConfirmed) {

            let query = `uid=${uid}`
            let response = await ApiGetRequest("/AdvertisementPrice/Delete", query)

            await Swal.fire({
                title: "Başarılı!",
                text: "Ücretlendirme Türü Silindi.",
                icon: "success"
            });
            getPriceList()
            setAddNew(false)

        }
    }

    const selectBoxChange = (e) => {
        console.log(e);
        setFormDataInputs({
            ...formDataInputs, ["selectionType"]: e.value,
        });
    }

    if (!isLoading) {
        return <LoadingComp/>
    }
    const options = [
        {value: 'Çoklu', label: 'Çoklu'},
        {value: 'Tekli', label: 'Tekli'},
    ]

    const priceKeys = [
        {label: 'Bedava İlan', value: 'free_ad'},
        {label: 'Ücretli İlan', value: 'normal'},
        {label: 'Vitrin', value: 'showcase'},
        {label: 'Öne Çıkan', value: 'highlights'},
        {label: 'Sosyal Medya', value: 'social_media'},
        {label: 'Diğer', value: 'other'},
    ]
    return (
        <div className={`${styles['']} shadow rounded bg-white mt-3 mb-3 p-2 mainContent`}>
            <div className={"d-flex justify-content-between px-2 py-1"}><h4>İlan Ücretleri </h4>
                <div className="btn btn-success" onClick={() => {
                    setAddNew(!addNew)
                    setEditItems(0)
                }}><FontAwesomeIcon
                    icon={faPlus}/> Ekle
                </div>
            </div>
            <hr/>
            <div className="alert alert-danger" role="alert">

                Kullanıcılar ilan için özellik seçme ekranlarına geldiklerinde seçebilecekleri özellikler aşağıdaki sıra
                ile gösterilecektir. <br/>
                Seçebilecekleri ilk özellik varsayılan olarak seçilecektir. <br/>
                Örneğin;
                <ul>
                    <li>"Ücretsiz" ve "Ücretli" ilan hakkı bulunan bir kullanıcıda "Ücretsiz" ilan seçili olarak gelecektir.
                        Kullanıcı isterse "Ücretli" seçeneğini seçebilecektir. </li>
                    <li>Eğer kullanıcının "Ücretsiz" ilan hakkı
                        yoksa varsayılan olarak "Ücretli" seçili olarak gelecektir.</li>
                </ul>
            </div>
            <div className="alert alert-info" role="alert">

                Tablodaki ücretler öncelikle <strong>Grup</strong> numaralarına göre, daha sonra <strong>Grup Sırası</strong>'na göre sıralanmaktadır.
            </div>

            <br/>
            <table className=" table table-striped text-center">
                <thead>
                <tr>
                    {/*<th scope="col">#</th>*/}
                    <th scope="col" className={"col-2 text-start"}>Ad</th>
                    <th scope="col" className={"col-1 text-start"}>Ücret Türü</th>
                    <th scope="col" className={"col-1"}>Grup</th>
                    <th scope="col" className={"col-1"}>Grup Sırası</th>
                    <th scope="col" className={"col-1"}>Seçim Türü</th>
                    <th scope="col" className={"col-1"}>Süre</th>
                    <th scope="col" className={"col-2"}>Ücret</th>
                    <th scope="col" className={"text-center col-1"}>Aktif</th>
                    <th scope="col" className={" text-center col-1"}>Düzenle</th>
                </tr>
                </thead>
                <tbody>


                {data.map((d, index) => <tr key={index}>
                    {editItems === d.uid ? < >

                        <td className={"text-start"}>{d.advertisementTypeName}</td>
                        <td className={"text-start"}><Select
                            onChange={selectBoxChange}
                            placeholder="Ücret Türü"
                            options={priceKeys} /></td>
                        <td>
                            <input onChange={handleChange} name={"group"} type="number"
                                   defaultValue={d.group}/>
                        </td>
                        <td>
                            <input onChange={handleChange} name={"groupOrder"} type="number"
                                   defaultValue={d.groupOrder}/>
                        </td>
                        <td>
                     {/*       <input onChange={handleChange} name={"selectionType"} type="text"
                                   defaultValue={d.selectionType}/>*/}
                            <Select
                                onChange={selectBoxChange}
                                placeholder="Seçim Türü"
                                options={options} />
                        </td>
                        <td><input onChange={handleChange} name={"duration"} type="number"
                                   defaultValue={parseInt(d.duration)}/>Gün
                        </td>

                        <td><input onChange={handleChange} name={"price"} type="number"
                                   defaultValue={parseInt(d.price)}/>₺
                        </td>

                        <td className={"text-center"}>
                            <input className={"rounded"} style={{width: "25px", height: "25px"}}
                                   type="checkbox"
                                   name={"isActiveCheckBox"}
                                   checked={isActiveCheckbox}
                                // defaultChecked={d.isActive}
                                   onChange={handleCheckboxChange}
                            />
                        </td>
                        <td className={"text-center"}>

                            <button onClick={() => setEditItems(0)} className=" btn btn-sm btn-secondary">
                                <FontAwesomeIcon icon={faXmark}/></button>
                            <button onClick={() => deleteItem(d.uid)} className="ms-1 btn btn-sm btn-danger">
                                <FontAwesomeIcon icon={faTrash}/></button>

                            <button onClick={() => updateItem(d.uid)} className="ms-1 btn btn-sm btn-success">
                                <FontAwesomeIcon
                                    icon={faCheck}/>
                            </button>
                        </td>
                    </> : <>

                        <td className={"text-start"}>{d.advertisementTypeName}</td>
                        <td className={"text-start"}>{d.advertisementType}</td>
                        <td>{d.group}</td>
                        <td>{d.groupOrder}</td>
                        <td>{d.selectionType}</td>
                        <td>{d.duration} Gün</td>
                        <td>
                            {d.price}₺
                        </td>
                        <td className={"text-center"}>{d.isActive ? "Aktif" : "Pasif"}</td>
                        <td onClick={() => {
                            selectEditItems(d.uid)
                            setIsActiveCheckbox(d.isActive)
                            setFormDataInputs({
                                ...formDataInputs,
                                ["duration"]: d.duration,
                                ["price"]: d.price,
                                ["group"]: d.group,
                                ["groupType"]: d.groupType,
                                ["groupOrder"]: d.groupOrder,
                                ["selectionType"]: d.selectionType,
                            });
                            setAddNew(false)
                        }} className={"hoverRed pointer text-center"}>
                            <FontAwesomeIcon icon={faEdit}/></td>
                    </>}

                </tr>)}

                {addNew && <tr>

                    <td className={"text-start"}><input onChange={handleChange} name={"itemName"} type="text"
                                                        placeholder={"Ad"}/>
                    </td>
                    <td className={"text-start"}>
                        <Select
                            onChange={selectBoxChange}
                            placeholder="Ücret Türü"
                            options={priceKeys} />

                    </td>
                    <td><input onChange={handleChange} name={"group"} type="number"
                               placeholder={"Grup"}/>
                    </td>
                    <td><input onChange={handleChange} name={"groupOrder"} type="number"
                               placeholder={"Grup Sırası"}/>
                    </td>
                    <td>

                        <Select
                            onChange={selectBoxChange}
                            placeholder="Seçim Türü"
                            options={options}/>
                        {/*
                        <input onChange={handleChange} name={"selectionType"} type="text"
                               placeholder={"Seçim Türü"}/>*/}
                    </td>
                    <td><input onChange={handleChange} name={"duration"} type="number"
                               placeholder={"Süre"}/>
                    </td>
                    <td><input onChange={handleChange} name={"price"} type="number"
                               placeholder={"Ücret"}/>
                    </td>

                    <td>
                        <input className={"rounded"} style={{width: "25px", height: "25px"}}
                               type="checkbox"
                               name={"isActiveCheckBox"}
                               checked={isActiveCheckbox}
                            // defaultChecked={d.isActive}
                               onChange={handleCheckboxChange}
                        />
                    </td>
                    <td>
                        <button onClick={() => setAddNew(false)} className="btn btn-sm btn-secondary">
                            <FontAwesomeIcon icon={faXmark}/></button>
                        <button onClick={() => addItem()} className="ms-1 btn btn-sm btn-success">
                            <FontAwesomeIcon
                                icon={faCheck}/>
                        </button>
                    </td>
                </tr>}
                </tbody>
            </table>


        </div>


    );
}

export default AdvertPricesComp;