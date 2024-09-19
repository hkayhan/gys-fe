'use client'
import React, {useEffect, useState} from 'react';
import styles from './CategoriesManage.module.css'
import Link from "next/link";
import 'react-tabs/style/react-tabs.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faGlasses, faMagnifyingGlass, faPlus} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";

function CategoriesManageComp(props) {
    const [selectedCategories, setSelectedCategories] = useState([{
        "parentId": null,
        "statusId": 1,
        "name": "Kategoriler",
        "key": null,
        "id": null,

    }])


    const [isLoading, setIsLoading] = useState(false)
    const [allCategories, setAllCategories] = useState([])

    const getAllCategories = async () => {

        setIsLoading(false)
        const data = await ApiGetRequest("/Category/GetCategoryList");

        setIsLoading(true)

        setAllCategories(data)

    }


    useEffect(() => {
        getAllCategories()
    }, [])


    const hasSubCategories = (category) => {
        for (let i = 0; i < allCategories.length; i++) {
            if (allCategories[i].parentId === category.id) {
                return true
            }
        }
        return false
    }

    const addSelectedCategories = (c) => {
        let newCategories = []

        for (let i = 0; i < selectedCategories.length; i++) {
            newCategories.push(selectedCategories[i])
            if (selectedCategories[i].id === c.parentId) {
                break
            }
        }

        newCategories.push(c)

        setSelectedCategories(newCategories)

    }

    const getSubcategoryCount = (category) => {
        let count = 0
        for (let i = 0; i < allCategories.length; i++) {
            if (allCategories[i].parentId === category.id) {
                count++
            }
        }
        return count
    }
    if (!isLoading) {
        return (<LoadingComp/>)
    }


    return (
        <div className={`${styles['']} container mainContent bg-white rounded shadow my-3 p-2`}>

            <div className={"p-3 d-flex justify-content-end"}><Link href={"addCategory?id=0"}
                                                                    className={"btn btn-success"}><FontAwesomeIcon
                icon={faPlus}/>Ekle</Link></div>


            {
                selectedCategories.map((c, index) =>
                    hasSubCategories(c) &&


                    <div className={"border rounded mt-2 p-2"} key={index}>
                        <h5>{c.name}</h5>
                        <hr/>
                        <table className=" table table-striped  w-100">
                            <thead>
                            <tr className={""}>
                                {/*<th scope="col">#</th>*/}
                                {/*<th scope="col" >Profil</th>*/}
                                <th scope="col" className={"w-50"}>Kategori Adı</th>
                                <th scope="col" className={"text-center"}>Alt Kategori</th>
                                <th scope="col" className={"text-end"}>Düzenle</th>
                                {/*<th scope="col">Seç</th>*/}
                            </tr>
                            </thead>
                            <tbody>


                            {
                                allCategories.map((ac, index) =>
                                    ac.parentId === c.id &&
                                    <tr key={index}>
                                        <td>
                                            <div onClick={() => addSelectedCategories(ac)}
                                                 className={"d-flex align-items-center"}>
                                                {/*<img*/}
                                                {/*    className={"rounded-circle"}*/}
                                                {/*    width={35}*/}
                                                {/*    height={35}*/}
                                                {/*    src={"/images/yegesan.png"} alt={""}/>*/}
                                                <div className={"ms-2 text-underline pointer"}>
                                                    {ac.name}
                                                </div>
                                            </div>
                                        </td>

                                        <td>
                                            <div onClick={() => addSelectedCategories(ac)} className={"text-center"}>
                                                {/*<img*/}
                                                {/*    className={"rounded-circle"}*/}
                                                {/*    width={35}*/}
                                                {/*    height={35}*/}
                                                {/*    src={"/images/yegesan.png"} alt={""}/>*/}
                                                <div className={"ms-2 text-underline pointer"}>
                                                    {getSubcategoryCount(ac)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className={"text-end hoverRed pointer"}>
                                            <Link href={"addCategory?id=" + ac.id}><FontAwesomeIcon
                                                icon={faEdit}/></Link>
                                        </td>


                                    </tr>
                                )}


                            </tbody>
                        </table>


                        {/*       {
                                allCategories.map((ac, i) =>
                                    <div key={i}>
                                        {//console.log("ac", ac)}
                                        {
                                            ac.parentId === c.id &&
                                            <div onClick={() => addSelectedCategories(ac)}>
                                                {ac.name}
                                            </div>
                                        }

                                    </div>
                                )
                            }*/}
                    </div>
                )
            }


            {/*     <h4>Ana Kategoriler</h4>
            <hr/>

            <table className=" table table-striped  w-100">
                <thead>
                <tr className={""}>
                    <th scope="col">#</th>
                    <th scope="col" >Profil</th>
                    <th scope="col">Kategori Adı</th>
                    <th scope="col" className={"text-end"}>Düzenle</th>
                    <th scope="col">Seç</th>
                </tr>
                </thead>
                <tbody>


                {parentCategories.map((d, index) => <tr key={index}>
                    <td>
                        <div className={"d-flex align-items-center"}>
                            <img
                                className={"rounded-circle"}
                                width={35}
                                height={35}
                                src={"/images/yegesan.png"} alt={""}/>
                            <div className={"ms-2 text-underline pointer"}>
                                {d.name}
                            </div>
                        </div>
                    </td>
                    <td className={"text-end hoverRed pointer"}>
                        <FontAwesomeIcon icon={faEdit}/>
                    </td>

                </tr>)}


                </tbody>
            </table>
*/}
        </div>

    );
}

export default CategoriesManageComp;