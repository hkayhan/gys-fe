'use client'
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAnglesRight, faPlus, faTrashCan,} from "@fortawesome/free-solid-svg-icons";
import TextEditor from "@/components/textEditor/textEditorComp";
import {useRouter, useSearchParams} from "next/navigation";
import {
    ApiGetRequest,
    ApiPostRequest,
    ApiPostRequestWithModel,
    GetFileListByReferenceId,
    HandleImageUpload
} from "@/services/admin";
import InputField from "@/FormComponents/inputText/InputText";
import useSelectedItems from "@/hooks/useSelectedItems";
import LoadingComp from "@/components/loading/LoadingComp";
import swal from "sweetalert2";
import AddAdvertStepsComp from "@/components/addAdvertSteps/AddAdvertStepsComp";

function AddAdvertComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const advertId = searchParams.get("id")
    const [isLoading, setIsLoading] = useState(false)
    const [images, setImages] = useState([])
    const [advertisement, setAdvertisement] = useState({})
    const [childCategories, setChildCategories] = useState([])
    const [selectedChildCategories, setSelectedChildCategories] = useState()
    const [advertisementProperties, setAdvertisementProperties] = useState([])
    const [maxImageCount, setMaxImageCount] = useState(0)
    const [selectedItems, handleSelect, handleSelectMultiple, removeAndAdd] = useSelectedItems();
    const [errorMessage, setErrorMessage] = useState([])

    useEffect(() => {

        getAdvertById(advertId)
    }, [])


    useEffect(() => {
        //console.log("advertisementProperties")
        //console.log(advertisementProperties)
    }, [advertisementProperties])
    const getAdvertById = async () => {
        try {
            const response = await ApiGetRequest("/Advertisement/GetById", `id=${advertId}`)
            //console.log(response.errorMessage);

            if (response.errorMessage === null) {
                setAdvertisement(response.advertisementVM)

                //console.log("burqda 1",response.advertisementVM);
                if (response?.advertisementType === "employee") {
                    await getChildCategories(response?.advertisementVM.categoryId)
                }
                // setMaxImageCount(1)
                setMaxImageCount(10)
                // setMaxImageCount(response.addebleImageCount)
                // await getActivePropertyAdvertisement(advertId)
                // await getAdvertisementProperties(response.advertisementType)
                // await getUploadedImages()
                await Promise.all([
                        getActivePropertyAdvertisement(advertId),
                        getAdvertisementProperties(response.advertisementType),
                        getUploadedImages(response.advertisement.uid)
                    ]
                )
            }

            //console.log(response)

        } catch (e) {

        }
        setIsLoading(true)
    }

    const getActivePropertyAdvertisement = async (id) => {
        const response = await ApiGetRequest("/AdvertisementProperty/GetAdvertisementPropertyByAdvertisementId", `advertisementId=${id}&isSocialMedia=true`)
        if (response.errorMessage === null) {
            //console.log(response.advertisementPropertyVMList);
            const propertyIds = response.advertisementPropertyVMList.map(item => item.propertyId);

            handleSelectMultiple(propertyIds)

            /*   response.advertisementPropertyVMList.forEach(p => {
                   //console.log("p.propertyId",p.propertyId)

                   handleSelectMultiple(p.propertyId)
               })*/
        }
    }
    const getChildCategories = async (parentId) => {
        const response = await ApiGetRequest("/Category/GetChildCategories", `parentCategory=${parentId}`)
        //console.log("response");
        //console.log(response);
        if (response.errorMessage === null) {
            setChildCategories(response.categoryList)
        }

    }
    const getAdvertisementProperties = async (categoryName) => {
        const response = await ApiGetRequest("/Definition/GetByAdvertisementType", `advertisementType=${categoryName}`)
        //console.log("response");
        //console.log(response);
        if (response.errorMessage === null) {
            const groupedAndSortedData = groupAndSortByOrder(response.definitionsVMList, 'group');

            //console.log(groupedAndSortedData);
            setAdvertisementProperties(groupedAndSortedData)
        }

    }


    const groupAndSortByOrder = (array, key) => {
        // Gruplanmış ve sıralanmış verileri tutacak olan dizi
        const groupedAndSorted = [];

        // Verilen array üzerinde döngü
        array.forEach((item) => {
            // Öğenin 'group' özelliğini al
            const group = item[key];
            const propertyGroupName = item["propertyGroupName"]
            const selectionType = item["selectionType"]


            // Grup adı ile eşleşen bir öğe var mı kontrol et
            const existingGroup = groupedAndSorted.find((groupItem) => groupItem.group === group);

            // Grup adı ile eşleşen bir öğe yoksa, yeni bir grup oluştur
            if (!existingGroup) {
                groupedAndSorted.push({group, items: [], propertyGroupName, selectionType});
            }

            // Öğeyi sıralanmış bir şekilde ilgili gruba ekle
            groupedAndSorted.find((groupItem) => groupItem.group === group).items.push(item);
            groupedAndSorted.find((groupItem) => groupItem.group === group).items.sort((a, b) => a.order - b.order);
        });

        return groupedAndSorted;
    };


    useEffect(() => {
        // //console.log(images);
    }, [images])
    const handleChange = (e) => {
        const {name, value} = e.target;
        //console.log("name, value");
        //console.log(name, value);

        setAdvertisement(prevData => ({
            ...prevData, [name]: value
        }));
    };
    const handleChangeEditor = (e) => {
        const data = e.editor.getData();
        setAdvertisement(prevData => ({
            ...prevData, ["description"]: data
        }));
    };


    const getUploadedImages = async (uid) => {
        const imageList = []
        let fileList = await GetFileListByReferenceId(uid)
        //console.log(fileList);
        fileList.forEach(f => {
            let newImage = {
                id: f.id,
                picSrc: "data:image/jpeg;base64," + f.thumbnailImageBase64,
                status: "complated",
                fileName: f.fileName
            }

            imageList.push(newImage)
        })

        setImages(imageList)
    }
    const addNewPic = async () => {
        // let userPic = document.getElementById("userPic")
        let inputPic = document.getElementById("inputPic")
        //console.log("inputText pic onchange 1", inputPic.files[0])
        if (inputPic.files[0] === null) {
            return
        }


        let maxSizeInBytes = 2 * 1024 * 1024; // 2MB
        let file = inputPic.files[0];

        console.log("dosya boyutu :", file.size)

        if (file.size > maxSizeInBytes) {
            await swal.fire({title:"Dosya boyutu 2MB'tan küçük olmalı!", denyButtonText:"Tamam", icon:"error"})
            return;
        }


        let currentImages = images

        let newImage = {
            id: Math.random(),
            picSrc: URL.createObjectURL(inputPic.files[0]),
            status: "waiting",
            fileName: inputPic.files[0].name
        }

        setImages([...currentImages, newImage])
        currentImages.push(newImage)
        //
        // setImages(currentImages)
        // return
        //console.log(advertisement);
        const fileStoreImage = await HandleImageUpload(inputPic.files[0], "advertisement_photo", advertisement.uid, "advertisement_photo")
        console.log("fileStoreImagefileStoreImage", fileStoreImage);

        let fileImage = {
            id: fileStoreImage.file.id,
            picSrc: URL.createObjectURL(inputPic.files[0]),
            status: "complated",
            fileName: fileStoreImage.file.fileName
        }
        currentImages.push(fileImage)
        // console.table("before remove", currentImages);
        // setImages(currentImages)

        currentImages = removeWaitingWithCompleted(currentImages)
        setImages(currentImages)
    }
    const removeWaitingWithCompleted = (array) => {
        //console.log("removeWaitingWithCompleted");
        const completedNames = array.filter(item => item.status === 'completed').map(item => item.name);
        const newArray = [];
        array.forEach(item => {
            // Eğer nesnenin status alanı "waiting" ise ve name alanı completedNames içinde değilse
            if (!(item.status === 'waiting' && !completedNames.includes(item.name))) {
                newArray.push(item); // Yeni diziyi oluştururken bu nesneyi ekle
            }
        });

        return newArray

    };
    const deleteImages = async (id) => {
        await ApiGetRequest("/File/Delete", `id=${id}`)
        setImages(images.filter(function (c) {
            return c.id !== id
        }))
    }
    const updateAdvertisement = async () => {


        let errorArr = []


        if (advertisement.title === "") {
            errorArr.push("title")
            // setCompanyError(true)
            // return
        }
        //console.log("advertisement.description",advertisement.description);
        if (advertisement.description === "") {
            errorArr.push("description")
            // setFirstNameError(true)
            // return
        }
        //console.log("errorArr",errorArr);
        if (errorArr.length > 0) {
            //console.log(errorArr);
            setErrorMessage(errorArr)
            return
        }

        const response = await ApiPostRequestWithModel("/Advertisement/UpdateVM", "", advertisement)
        //console.log(response);
        await updateProperties()
        // router.push("/advert/addAdvertProperty");
        // router.refresh();

    }

    const updateProperties = async () => {
        //console.log("updateProperties");
        let formDataArr = []
        selectedItems.forEach(s => {
            formDataArr.push({
                name: "propertyIdList", value: s
            })
        })

        await ApiPostRequest("/AdvertisementProperty/UpdateAdvertisementProperties", `advertisementId=${advertId}`, formDataArr)

        // await swal.fire({
        //     title: "Başarıyla Eklendi!",
        //     text: "Tamam",
        //     icon: "success"
        // })
        await swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Eklendi!",
            showConfirmButton: false,
            timer: 1000
        });
        router.push(`/advert/addAdvertProperty?id=${advertId}`);
        router.refresh();
    }


    const handleCategoryChange = (e) => {
        // //console.log(e.target.value)
        setSelectedChildCategories(e.target.value);
        setAdvertisement(prevData => ({
            ...prevData, ["categoryId"]: e.target.value
        }));

    };

    const getIdsWithGroupName = (groupName) => {

        const group = advertisementProperties.find(obj => obj.group === groupName);

        if (group) {
            // //console.log(groupItemIds); //
            return group.items.map(item => item.id)
        } else {
            //console.log('Group Name Not Found.');
        }

    }

    useEffect(() => {
        //console.log("selectedItems",selectedItems)
    }, [selectedItems])

    if (!isLoading) {
        return <LoadingComp/>
    }

    return (
        <div className={`${styles['addAdvertMain']} mt-2 container`}>
            <AddAdvertStepsComp count={2}/>

            <div className={`${styles['']} rounded bg-white mt-3 mb-5 p-3`}>
                <div className={" mb-3"}>
                    <h5 className={"text-right"}>İlan Detayları</h5>
                    <hr/>
                </div>
                <div className={"col-md-12"}>
                    <InputField
                        label="İlan Başlığı"
                        name={"title"}
                        value={advertisement.title}
                        onChange={handleChange}
                        error={errorMessage.includes("title")
                            && "İlan başlığı boş bırakılamaz!"}

                    />
                </div>

                {childCategories.length > 0 &&
                    <div className={" mt-2"}>
                        <label htmlFor="category">İş Alanı:</label>
                        <select className="form-select form-select-sm" aria-label="İş Alanı Seçiniz" id="category"
                                value={selectedChildCategories} onChange={handleCategoryChange}>
                            {childCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                }

                <div className={"col-md-12 mt-4"}><label className={"labels"}>İlan Metni</label>
                    <TextEditor name={"description"} onChange={handleChangeEditor} value={advertisement.description}/>

                    {errorMessage.includes("description")
                        && <div className={"text-danger"}>İlan açıklaması boş bırakılamaz!</div>}
                </div>

                {
                    maxImageCount > 0 && <>
                        <div className={"mt-5 mb-3"}>
                            <h5 className={"text-right"}>İlan Resmi</h5>
                            <hr/>
                        </div>
                        {/*{maxImageCount}*/}
                        <div className={" p-2 d-flex flex-wrap"}>
                            {images.map((im, index) => <div className={`${styles['advertImageBox']} mb-2`} key={index}>

                                {im.status !== "waiting" && <span onClick={() => deleteImages(im.id)}
                                                                  className={"pointer text-center d-flex justify-content-center align-items-center"}><FontAwesomeIcon
                                    icon={faTrashCan}/> </span>}


                                <img alt={""}
                                     id={im.id}
                                     className={im.status === "waiting" ? "opacity-50" : ""}
                                     width={"150px"}
                                     height={"150px"}
                                     src={im.picSrc}/>

                            </div>)}
                            {
                                images && images.length < maxImageCount &&
                                <div
                                    className={`${styles['addAdvertImageBox']} d-flex justify-content-center align-items-center `}>
                                    <label htmlFor="inputPic"
                                           className={"pointer text-center d-flex justify-content-center align-items-center"}><FontAwesomeIcon
                                        size={"2xl"} icon={faPlus}/> </label>
                                    <input onChange={() => addNewPic()}
                                        // defaultValue={"https://st3.depositphotos.com/15648834/17930/v/600/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"}
                                           className={"d-none"}
                                           id={"inputPic"} type={"file"}
                                           accept={"image/jpg, image/png, image/jpeg"}/>

                                </div>
                            }

                        </div>

                    </>
                }

                {/*checbbox*/}
                <div className={"mt-5 mb-3"}>
                    <h5 className={"text-right"}>İlan Özellikleri</h5>
                    <hr/>
                </div>
                <div className={"mt-3  d-flex flex-wrap justify-content-start"}>
                    {advertisementProperties.map((f, index) =>

                        <div className={"col-12 col-sm-6 col-md-3 mb-2 p-2 border rounded bg-white me-1"} key={index}>
                            <div className="">
                                <h6 className={"fw-bold mb-0 "}>{f.propertyGroupName}</h6>
                                <hr/>
                            </div>

                            <ul className={`${styles['children-list']} list-group list-group-flush `} key={index}>

                                {f.items.map((fc, index) => <li className="list-group-item" key={index}>

                                    <input className={"me-2"}
                                           type={f.selectionType === "Tekli" ? "radio" : "checkbox"}
                                           id={fc.key}
                                           name={fc.group}
                                           value={fc.value}
                                           checked={selectedItems.includes(fc.id)}

                                           onChange={() => f.selectionType === "Tekli" ? removeAndAdd(fc.id, getIdsWithGroupName(fc.group)) : handleSelect(fc.id)}
                                    />
                                    <label htmlFor={fc.key}>{fc.value}</label>
                                    <br/>
                                </li>)}


                            </ul>
                        </div>)}
                </div>


                {/*
                <div className="row">

                    <div className="col-12 col-md-4">
                        <div>Şehir Seçin</div>

                        <select className="form-select" onChange={selectCity} aria-label="Default select example" defaultValue={"0"}>
                            <option value={"0"} disabled={true}>Şehir Seçin</option>
                            {cities.map((l, index) =>
                                <option value={l.plate} key={index}>{l.cityName}</option>
                            )}
                        </select>

                    </div>


                    <div className="col-12 col-md-4">
                        <div>İlçe Seçin</div>

                        <select className="form-select" onChange={selectCity} aria-label="Default select example" defaultValue={"0"}>
                            <option value={"0"} disabled={true}>İlçe Seçin</option>
                            {province.map((l, index) =>
                                <option value={l.plate} key={index}>{l.cityName}</option>
                            )}
                        </select>

                    </div>

                </div>
*/}


                <div className={"d-flex justify-content-center mt-5"}>
                    <button onClick={() => updateAdvertisement()} className={`${styles['']} btn btn-success `}>
                        <FontAwesomeIcon className={"me-2"}
                                         icon={faAnglesRight}/>Devam Et
                    </button>
                </div>
            </div>

        </div>);
}

export default AddAdvertComp;
