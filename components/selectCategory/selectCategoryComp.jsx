'use client'
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
// import data from '/app/mocs/categories.json'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleRight, faAnglesRight, faCheck, faCheckCircle, faEdit} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import {usePathname, useRouter} from "next/navigation";
import Swal from "sweetalert2";
import AddAdvertStepsComp from "@/components/addAdvertSteps/AddAdvertStepsComp";

function SelectCategoryComp(props) {
    const router = useRouter();
    const pathname = usePathname()

    const [selectedCategories, setSelectedCategories] = useState([{
        "parentId": null, "statusId": 1, "name": "Kategoriler", "key": null, "id": null,

    }])
    const [isLoading, setIsLoading] = useState(false)
    const [allCategories, setAllCategories] = useState([])
    const [lastSelectedId, setLastSelectedId] = useState(0)
    /*

        const [parentCategories, setParentCategories] = useState([])
        const [parentCategoryId, setParentCategoryId] = useState(0)

        const [subCategories1, setSubCategories1] = useState([])
        const [subCategory1Id, setSubCategory1Id] = useState(0)

        const [subCategories2, setSubCategories2] = useState([])
        const [subCategory2Id, setSubCategory2Id] = useState(0)
    */

    const [isCompleted, setIsCompleted] = useState(false)
    /*    const getParentCategories = async () => {

            setIsLoading(false)
            const data = await AdminGetRequest("/Category/GetCategoryList");

            setIsLoading(true)

            //console.log("data");
            //console.log(data);
            setAllCategories(data)
            setParentCategories(data?.filter(function (c) {
                return c.parent === null
            }))
        }

        const selectSubCategories1 = (id) => {
            setLastSelectedId(id)
            setParentCategoryId(id)
            setSubCategories2([])
            setSubCategory1Id(0)
            setSubCategory2Id(0)
            let subCategories = allCategories.filter(function (c) {
                return c.parentId === id
            })

            if (subCategories.length !== 0) {
                setSubCategories1(subCategories)
                setIsCompleted(false)
            } else {
                setSubCategories1([])
                setSubCategories2([])

                setIsCompleted(true)
            }

        }
        const selectSubCategories2 = (id) => {
            // //console.log("id");
            // //console.log(id);
            setLastSelectedId(id)

            setSubCategory1Id(id)
            setSubCategory2Id(0)
            let subCategories = allCategories.filter(function (c) {
                return c.parentId === id
            })

            if (subCategories.length !== 0) {
                setSubCategories2(subCategories)
                setIsCompleted(false)
            } else {
                setSubCategories2([])

                setIsCompleted(true)
            }
        }

        */

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
        //console.log(c);


        setLastSelectedId(c.id)

        let newCategories = []
        console.log("------------------------------")
        for (let i = 0; i < selectedCategories.length; i++) {
            console.log(i, selectedCategories[i]);
            newCategories.push(selectedCategories[i])
            if (selectedCategories[i].id === c.parentId) {
                break
            }
        }
        if (c.key === "employee") {
            setIsCompleted(true)
            setSelectedCategories([{
                "parentId": null, "statusId": 1, "name": "Kategoriler", "key": null, "id": null,

            }])
            return
        }

        if (!hasSubCategories(c)) {
            completeSelection(c.id)
        } else {
            setIsCompleted(false)
            newCategories.push(c)

        }
        setSelectedCategories(newCategories)
        console.log(newCategories);
    }

    const isSelected = (categoryId) => {
        return selectedCategories.some(item => item.id === categoryId);
    }

    const completeSelection = (id) => {
        setIsCompleted(true)
    }

    const createNewAdvert = async () => {
        //console.log("lastSelectedId");
        //console.log(lastSelectedId);
        if (lastSelectedId === 0) {
            return
        }
        const data = await ApiGetRequest("/Advertisement/Create", `categoryId=${lastSelectedId}`);

        //console.log(data);
        // return
        if (data.errorMessage !== null) {

            Swal.fire({
                icon: "error",
                title: "Eksik Bilgileriniz Var",
                text: data.errorMessage,
                // showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: "Devam Et",
                // denyButtonText: `Don't save`
                cancelButtonText: "Vazgeç"
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    if (data.userType === "person") {
                        //console.log(pathname);
                        router.push("/myProfile?next=" + pathname);

                    } else if (data.userType === "firm") {
                        router.push("/editCompanyProfile");

                    }
                    router.refresh();

                }
            })

            return
        }

        if (data?.advertisement.id && data?.advertisement.id > 0) {
            //console.log("in data id");
            //console.log("/advert/addAdvert?id=" + data?.advertisement.id);

            router.push("/advert/addAdvert?id=" + data?.advertisement.id);
            router.refresh();
        }
        // href={"/advert/addAdvert"}
        //console.log(data)
    }


    if (!isLoading) {
        return (<div>
            <LoadingComp/>
        </div>)
    }


    return (
        <div className={"mainContent d-flex flex-column align-items-center justify-content-"}>
            <AddAdvertStepsComp count={1}/>
            <div className={"m-auto d-flex align-items-center flex-column"}>
                <h4>Kategori seçimini tamamladıktan sonra ilan detaylarına geçebilirsiniz.</h4>
                <br/>
                <br/>
                <div className={`${styles['allCategories']}  d-flex flex-wrap align-items-center1 justify-content-center`}>

                    {selectedCategories.map((c, index) =>


                        <div key={index} className={"d-flex align-items-center"}  style={{height:"300px"}}>
                            <div
                                className={`${styles['selectContainerCard']} me-3 shadow shadowHover   d-flex  justify-content-center flex-column text-center`}>
                                <ul className={"list-group"}>

                                    {allCategories.map((ac, index) => ac.parentId === c.id &&
                                        <li className={`${styles['selectContainerCardItem']} ${(isSelected(ac.id) || lastSelectedId === ac.id) && " fw-bold"} list-group-item pointer`}
                                            onClick={() => addSelectedCategories(ac)}
                                            key={index}>
                                            {(isSelected(ac.id) || lastSelectedId === ac.id) &&
                                                <FontAwesomeIcon icon={faCheck}
                                                                 className={"text-success"}/>}   {ac.name}
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <FontAwesomeIcon className={"me-3 "} size={'2xl'} icon={faAngleRight}/>
                        </div>
                    )}

                    {/*

            <div
                className={`${styles['selectContainerCard']} me-3 border rounded shadow shadowHover d-flex  justify-content-center flex-column text-center`}>

                <ul className={"list-group"}>
                    {parentCategories?.map((p, index) => <li className={"list-group-item pointer"}
                                                             onClick={() => selectSubCategories1(p.id)}
                                                             key={index}>
                        {p.name}
                    </li>)}

                </ul>
            </div>

            {subCategories1.length !== 0 && <><FontAwesomeIcon className={"me-3 "} size={'2xl'}
                                                               icon={faAngleRight}/>
                <div
                    className={`${styles['selectContainerCard']} me-3 border rounded shadow shadowHover d-flex  justify-content-center flex-column text-center`}>

                    <ul className={"list-group"}>
                        {subCategories1?.map((p, index) => <li className={"list-group-item pointer"}
                                                               onClick={() => selectSubCategories2(p.id)}
                                                               key={index}>
                            {p.name}
                        </li>)}

                    </ul>
                </div>
            </>}

            {subCategories2.length !== 0 && <><FontAwesomeIcon className={"me-3 "} size={'2xl'}
                                                               icon={faAngleRight}/>
                <div
                    className={`${styles['selectContainerCard']} me-3 border rounded shadow shadowHover d-flex  justify-content-center flex-column text-center`}>

                    <ul className={"list-group"}>
                        {subCategories2?.map((p, index) => <li className={"list-group-item pointer"}
                                                               onClick={() => {
                                                                   setLastSelectedId(p.id)
                                                                   completeSelection()
                                                               }}
                                                               key={index}>
                            {p.name}
                        </li>)}

                    </ul>
                </div>
            </>}

*/}


                    {isCompleted && <>
                        <div
                            className={`${styles['selectContainerCard']} border rounded shadow shadowHover p-4 d-flex bg-white  justify-content-center flex-column text-center`}>
                            <h1><FontAwesomeIcon className={"text-success fst-1"} size={"2xl"}
                                                 icon={faCheckCircle}/></h1>
                            <br/>
                            <div className="card-body">Kategori Seçimini Tamamladınız</div>
                            <br/>
                            <button onClick={() => createNewAdvert()} className={`${styles['']} btn btn-success `}>
                                <FontAwesomeIcon
                                    className={"me-2"} icon={faAnglesRight}/>Devam Et
                            </button>
                        </div>
                    </>}

                </div>

            </div>


        </div>);
}

export default SelectCategoryComp;