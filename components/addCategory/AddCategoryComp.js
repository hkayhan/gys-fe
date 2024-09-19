'use client'
import React, {useEffect, useState} from 'react';
import styles from './AddCategory.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleRight, faAnglesRight, faCheck, faCheckCircle, faEdit, faLock, faSave, faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {useRouter, useSearchParams} from "next/navigation";
import {ApiGetRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import Swal from "sweetalert2";
import InputText from "@/FormComponents/inputText/InputText";
import swal from "sweetalert2";

function AddCategoryComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = parseInt(searchParams.get("id"))
    const [errorMessage, setErrorMessage] = useState([])

    // let allCategories = []
    const [lastSelectedId, setLastSelectedId] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [allCategories, setAllCategories] = useState([])
    const [currentCategory, setCurrentCategory] = useState({})
    // const [selectedCategory, setSelectedCategory] = useState()
    const [organizedCategory, setOrganizedCategory] = useState({})
    // const [lastLevel, setLastLevel] = useState(0)
    // const [isCompleted, setIsCompleted] = useState(false)
    const [selectedCategories, setSelectedCategories] = useState([{
        "parentId": null, "statusId": 1, "name": "Kategoriler", "key": null, "id": null,

    }])


    const getAllCategories = async () => {

        setIsLoading(false)
        const data = await ApiGetRequest("/Category/GetCategoryList");
        // //console.log("data");
        // //console.log(data);

        await setAllCategories(data)
        // allCategories=data


        setIsLoading(true)

    }


    useEffect(() => {
        getAllCategories()
    }, [])

    useEffect(() => {
        if (id === 0) {
            setSelectedCategories([{
                "parentId": null, "statusId": 1, "name": "Kategoriler", "key": null, "id": null,

            }])
        } else {
            createParentPath()
        }
    }, [allCategories])

    const createParentPath = async () => {
        // console.log("id :", id)
        let category = await getCategoryWithId(id)
        setOrganizedCategory(category)
        setCurrentCategory(category)
        // console.log(category);
        setLastSelectedId(id)
        let categoryTree = [category]
        setSelectedCategories([category])

        let parentId = category.parentId
        while (parentId !== null) {
            // console.log("parent ıd :",parentId)
            let parentCategory = await getCategoryWithId(parentId)
            categoryTree.push(parentCategory)
            parentId = parentCategory.parentId
        }
        categoryTree.push(await getCategoryWithId(0))
        // console.log(categoryTree);
        setSelectedCategories(categoryTree.reverse())
    }
    const getCategoryWithId = async (id) => {
        // console.log("getCategoryWithId :", id)
        // console.log("allCategories :", allCategories)
        const foundCategory = allCategories.find(function (category) {
            return category.id === id;
        });
        console.log("found category :", foundCategory);
        return foundCategory ? foundCategory : {
            "parentId": null, "statusId": 1, "name": "Kategoriler", "key": null, "id": null,

        };
    }

    const hasSubCategories = (category) => {
        // console.log(category);
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
        // console.log("------------------------------")
        for (let i = 0; i < selectedCategories.length; i++) {
            // console.log(i, selectedCategories[i]);
            newCategories.push(selectedCategories[i])
            if (selectedCategories[i].id === c.parentId) {
                break
            }
        }
        // newCategories.push(c)
        /*  if (c.key === "employee") {
              setIsCompleted(true)
              setSelectedCategories([{
                  "parentId": null, "statusId": 1, "name": "Kategoriler", "key": null, "id": null,

              }])
              return
          }*/

        if (!hasSubCategories(c)) {
            // completeSelection(c.id)
        } else {
            // setIsCompleted(false)
            newCategories.push(c)

        }
        setSelectedCategories(newCategories)
        // console.log(newCategories);
    }


    const isSelected = (categoryId) => {
        // selectedCategories.find(s=> {
        //     return s.id === categoryId
        // })
        // console.log("in here");
        // console.log(selectedCategories);
        // console.log(categoryId);
        // selectedCategories.forEach(c => console.log(c.id))
        return selectedCategories.some(item => item.id === categoryId);


    }

    /*   const completeSelection = (id) => {
           setIsCompleted(true)
       }
   */
    /*

        const getCategoryWithId = (id) => {
            const foundCategory = allCategories.find(function (category) {
                return category.id === id;
            });

            return foundCategory ? foundCategory : {};
        }

        const getCategoryPath = (id) => {
            let path = []
            let category = getCategoryWithId(id)
            path.push(category)
            if (category.parentId !== null) {
                path.push(...getCategoryPath(category.parentId))
            }
            return path
        }

        useEffect(() => {

            if (allCategories.length > 0) {
                if (id === 0) {
                    const defaultCategory = {
                        id: 0,
                        parentId: null,
                        name: ""
                    }

                    setSelectedCategory(defaultCategory)

                    setCurrentCategory(defaultCategory)

                    setSelectedCategories([defaultCategory])


                } else {
                    setCurrentCategory(getCategoryWithId(id))
                    setSelectedCategory(getCategoryWithId(id))
                    //console.log("before get category path :", id);
                    let parentCategories = getCategoryPath(id)
                    // parentCategories.push({
                    //     id:null
                    // })
                    //console.log(parentCategories);
                    setSelectedCategories(parentCategories.reverse())
                }
            }
            setIsLoading(true)


        }, [allCategories])


        const handleChange = (e) => {
            const {name, value} = e.target;

            setCurrentCategory(prevData => ({
                ...prevData, [name]: value
            }))
            // //console.log(e.target.value);
        }

        const hasChild = (id) => {

            return allCategories.some(function (cat) {
                return cat.parentId === id
            })
        }

        const handleChangeSelectBox = (e) => {
            // e.preventDefault()
            const {name, value} = e.target;
            if (value === "") {
                return
            }
            //console.log("name, value");
            //console.log(name, value);


            let category = getCategoryWithId(parseInt(value))

            let parentCategories = getCategoryPath(category.id)
            //console.log(parentCategories.reverse());
            setSelectedCategory(category)
            setSelectedCategories(parentCategories)
            setLastLevel(lastLevel+1)


            //console.log(category.id, " hasChild :", hasChild(category.id));

        }

    */

    const handleChange = (e) => {
        const {name, value} = e.target;
        //console.log("name, value");
        //console.log(name, value);

        setCurrentCategory(prevData => ({
            ...prevData, [name]: value
        }));
    }
    const saveCategory = async () => {
        console.log(currentCategory);
        if (!currentCategory?.name || currentCategory.name === "") {
            await Swal.fire({
                icon: "error", title: "Hata", text: "Kategori Adı Boş Olamaz!", denyButtonText: "Tamam"
            })
            return
        }

        if (lastSelectedId === 0) {
            await Swal.fire({
                icon: "error", title: "Hata", denyButtonText: "Tamam", text: "Ana Kategori Seçimi Yapılmalıdır!",
            })
            return
        }


        const swalResult = await Swal.fire({
            title: "Kaydetmek İstiyor Musunuz?", // showDenyButton: true,
            showCancelButton: true, confirmButtonText: "Evet", // denyButtonText: `Don't save`
            cancelButtonText: "Vazgeç"
        })
        // .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (swalResult.isConfirmed) {
            if (id === 0) {
                // add
                const response = await ApiGetRequest("/Category/Add", `name=${currentCategory.name}&parentId=${lastSelectedId}`)

                console.log(response.category.id);
                if (response.errorMessage) {
                    await swal.fire({title: "Hata", html: response.errorMessage, icon: "error"})
                    return
                } else {
                    await Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Kaydedildi",
                        showConfirmButton: false,
                        timer: 1000
                    });


                    // getAllCategories();
                    router.push("/admin/addCategory?id=" + response?.category?.id)
                    router.refresh()

                }
            } else if (id > 0) {

                //console.log("selected category",selectedCategory)
                // if (organizedCategory.id === currentCategory.id) {
                let parent = await getCategoryWithId(lastSelectedId)
                const response = await ApiGetRequest("/Category/Update", `id=${id}&name=${currentCategory.name}&parentId=${parent.parentId}`)
                if (response.errorMessage) {
                    await swal.fire({title: "Hata", html: response.errorMessage, icon: "error"})
                    return
                }
                await Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Güncellendi",
                    showConfirmButton: false,
                    timer: 1000
                });

                router.push("/admin/addCategory?id=" + id)
                router.refresh()

                // } else {
                //     const response = AdminGetRequest("/Category/Update", `id=${id}&name=${currentCategory.name}&parentId=${organizedCategory.id}`)
                //     if (response.errorMessage) {
                //         swal.fire({title: "Hata", html: response.errorMessage, icon: "error"})
                //     }
                // }
            }

            //Swal.fire("Kaydedildi!", "", "success").then(d=>{
            // router.push( "/admin/categoriesManage");
            // router.refresh();
            // })
        }
        // });
    }

    const deleteCategory = async () => {
        const swalResult = await Swal.fire({
            title: "Dikkat",
            html: `${id} Kodlu Kategoriyi Ve Tüm Alt Kategorilerini Silmek İstiyor Musunuz?`,
            confirmButtonText: "Evet",
            cancelButtonText: "Vazgeç",
            showCancelButton: true
        })
        if (swalResult.isConfirmed) {
            const response = await ApiGetRequest("/Category/Delete?id=" + id)
            if (!response.errorMessage) {
                await Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Silindi",
                    showConfirmButton: false,
                    timer: 1000
                });

                router.push("/admin/categoriesManage");
                router.refresh();

            } else {
                await swal.fire({title: "Hata", html: response.errorMessage, icon: "error"})
            }
        }

    }


    if (!isLoading) {
        return (<LoadingComp/>)
    }
    return (<div
        className={"mainContent bg-white  shadow rounded mt-3 d-flex flex-column align-items-center justify-content-start p-3"}>
        <h3 className={"border-bottom border-danger border-2 mt-2"}>Kategori {id > 0 ? "Düzenleme" : "Ekleme"}</h3>
        <div className={"d-flex w-100 justify-content-center align-items-baseline border-bottom p-3"}>
            <div className="me-4 fw-bold">Kategori Adı:</div>
            <InputText label={"Kategori Adı"}
                       name={"name"}
                       type={"text"}
                       icon={faLock}
                       value={currentCategory?.name}
                       onChange={handleChange}
                       error={errorMessage.includes("categoryName") && "Kategori Adı Boş Bırakılamaz!"}
            />
        </div>
        <div className={"m-auto1 d-flex align-items-center flex-column"}>
            <br/>

            <h4>Kategori Ağacı</h4>
            {/*{JSON.stringify(selectedCategories)}*/}
            <br/>
            <div
                className={`${styles['allCategories']}  d-flex flex-wrap align-items-center justify-content-center`}>
                {/*{JSON.stringify(selectedCategories,2)}*/}
                {selectedCategories.map((c, index) =>


                    <div key={index} className={"d-flex align-items-center"} style={{height: "300px"}}>
                        <div
                            className={`${styles['selectContainerCard']} me-3 shadow shadowHover rounded  d-flex  justify-content-center flex-column text-center`}>
                            <ul className={"list-group"}>

                                {allCategories.map((ac, index) => ac.parentId === c.id &&
                                    <li className={`${styles['selectContainerCardItem']} ${(isSelected(ac.id) || lastSelectedId === ac.id) && " fw-bold"} list-group-item pointer`}
                                        onClick={() => addSelectedCategories(ac)}
                                        key={index}>
                                        {(isSelected(ac.id) || lastSelectedId === ac.id) &&
                                            <FontAwesomeIcon icon={faCheck}
                                                             className={"text-success"}/>} {ac.id}-{ac.name}
                                    </li>)}
                            </ul>
                        </div>
                        {hasSubCategories(c) && <FontAwesomeIcon className={"me-3 "} size={'2xl'} icon={faAngleRight}/>}
                    </div>)}


            </div>


            {lastSelectedId > 0 && <div className={"mt-5"}>
                {id > 0 && <button onClick={() => deleteCategory()} className={`${styles['']} btn btn-danger mx-2`}>
                    <FontAwesomeIcon icon={faTrashCan} className={"me-2"}/>
                    Sil
                </button>
                }
                <button onClick={() => saveCategory()} className={`${styles['']} btn btn-success `}>
                    <FontAwesomeIcon
                        className={"me-2"} icon={faSave}/>Kaydet
                </button>

                {/*<div*/}
                {/*    className={`${styles['']} border rounded shadow shadowHover p-4 d-flex bg-white  justify-content-center flex-column text-center`}>*/}
                {/*    */}
                {/*    <h1><FontAwesomeIcon className={"text-success fst-1"} size={"2xl"}*/}
                {/*                         icon={faCheckCircle}/></h1>*/}
                {/*    <br/>*/}
                {/*    <div className="card-body">Son Kategoriyi Seçtiniz</div>*/}
                {/*    <br/>*/}
                {/*    <button onClick={() => saveCategory()} className={`${styles['']} btn btn-success `}>*/}
                {/*        <FontAwesomeIcon*/}
                {/*            className={"me-2"} icon={faSave}/>Kaydet*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>}

        </div>


    </div>);
}

export default AddCategoryComp;