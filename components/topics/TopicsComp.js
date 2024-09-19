'use client'
import React, {useEffect, useState} from 'react';
import styles from './Topics.module.css'
import {AdminGetRequest, AdminPostRequest, AdminPostRequestWithModel, ApiGetRequest} from "@/services/admin";
import swal from "sweetalert2";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faSave, faTrash, faXmark} from "@fortawesome/free-solid-svg-icons";
import InputText from "@/FormComponents/inputText/InputText";
import Swal from "sweetalert2";

function TopicsComp(props) {
    const [allTopics, setAllTopics] = useState([])
    const [editItem, setEditItem] = useState(0)
    const [addNew, setAddNew] = useState(false)
    const [newItem, setNewItem] = useState({})

    const getAllTopic = async () => {
        const res = await AdminGetRequest("/topic/getAll")
        console.log(res);
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        setAllTopics(res.result)
    }
    const handleChange = (e) => {
        const {name, value} = e.target;

        setNewItem(prevData => ({
            ...prevData, [name]: value
        }));
    };


    useEffect(() => {
        getAllTopic()
    }, [])


    const updateTopic = async () => {
        if (!newItem.name || newItem.name === "") {
            await swal.fire({title: "Hata", text: "Kategori Adı Boş Olamaz!", icon: "error"})
            return
        }
        const res = await AdminPostRequestWithModel("/topic/update", "", newItem)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Güncellendi!",
            showConfirmButton: false,
            timer: 1000
        });
        setAddNew(false)
        setNewItem({})
        setEditItem(0)
        getAllTopic()
    }
    const deleteTopic = async (id) => {
        const sr = await swal.fire({
            title: "Dikkat",
            text: "Konuyu Silmek İstiyor Musunuz?",
            showConfirmButton: true,
            showCancelButton: true,
            denyButtonText: "Vazgeç",
            confirmButtonText: "Onayla",
            icon: "warning"
        })

        if (sr.isConfirmed) {
            const res = await AdminPostRequestWithModel("/topic/delete","",{"id":id})
            if (res.errorMessage) {
                await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
                return
            }
            swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarıyla Silindi!",
                showConfirmButton: false,
                timer: 1000
            });

            getAllTopic()
        }
    }

    const addTopic = async () => {
        if (!newItem.name || newItem.name === "") {
            await swal.fire({title: "Hata", text: "Kategori Adı Boş Olamaz!", icon: "error"})
            return
        }
        const res = await AdminPostRequestWithModel("/topic/add", "", newItem)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Eklendi!",
            showConfirmButton: false,
            timer: 1000
        });
        setAddNew(false)
        setNewItem({})
        setEditItem(0)
        getAllTopic()
    }


    return (
        <div className={`${styles['']} container mainContent mt-2 p-3 bg-white rounded shadow`}>

            <h4 className={"border-bottom"}>Konular</h4>
            <div className={"d-flex justify-content-end"}>
                <button className="btn btn-success" onClick={() => {
                    setNewItem({})
                    setAddNew(!addNew)
                    setEditItem(0)
                }}><FontAwesomeIcon icon={faPlus}
                                    className={"me-1"}></FontAwesomeIcon> Ekle
                </button>
            </div>
            <div className={"mt-4 border-bottom fw-bold my-2   d-flex justify-content-end align-items-center"}>
                <div className={"flex-fill"}>Konu Adı</div>
            </div>
            {addNew && <div className={"d-flex align-items-baseline"}>
                <div className={"flex-fill px-2"}>
                    <InputText name={"name"} value={newItem.name} onChange={handleChange}
                               label={"Konu Adı Giriniz"}/>
                </div>
                <div className={"me-2"}>
                    <button onClick={() => setAddNew(false)} className="btn btn-sm btn-secondary"><FontAwesomeIcon
                        icon={faXmark} className={"me-1"}/> Vazgeç
                    </button>
                </div>

                <div>
                    <button className="btn btn-sm btn-success" onClick={() => addTopic()}>
                        <FontAwesomeIcon icon={faSave} className={"me-1"}/> Kaydet
                    </button>
                </div>
            </div>}
            {allTopics.map((t, index) => <div key={index}
                                              className={"border rounded  my-2  p-2 d-flex justify-content-end align-items-center"}>
                {editItem !== t.id ? <>
                    <div className={"flex-fill"}>{t.name}</div>
                    <div className={"me-2"}>
                        <button className=" btn btn-sm btn-danger" onClick={() => deleteTopic(t.id)}><FontAwesomeIcon
                            className={"me-1"} icon={faTrash}/>Sil
                        </button>
                    </div>
                    <div>
                        <button className="btn btn-sm btn-primary" onClick={() => {
                            setEditItem(t.id)
                            setAddNew(false)
                            setNewItem(t)
                        }}>
                            <FontAwesomeIcon className={"me-1"} icon={faEdit}/>Düzenle
                        </button>
                    </div>
                </> : <>
                    <div className={"flex-fill px-2"}>
                        <InputText name={"name"} value={newItem.name} onChange={handleChange}
                                   label={"Konu Adı Giriniz"}/>
                    </div>
                    <div className={"me-2"}>
                        <button onClick={() => {
                            setEditItem(0)
                            setAddNew(false)
                        }} className="btn btn-sm btn-secondary"><FontAwesomeIcon
                            icon={faXmark} className={"me-1"}/> Vazgeç
                        </button>
                    </div>

                    <div>
                        <button className="btn btn-sm btn-success" onClick={() => updateTopic()}>
                            <FontAwesomeIcon icon={faSave} className={"me-1"}/> Kaydet
                        </button>
                    </div>
                </>
                }
            </div>)}


        </div>

    );
}

export default TopicsComp;