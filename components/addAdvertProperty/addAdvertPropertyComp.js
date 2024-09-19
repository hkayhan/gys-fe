'use client'
import React, {useEffect, useState} from 'react';
import styles from "@/components/addAdvertProperty/addAdvertProperty.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAnglesRight,
    faArrowLeft,
    faCheck,
    faCheckCircle,
    faTrash,
    faTrashCan
} from "@fortawesome/free-solid-svg-icons";
import {useRouter, useSearchParams} from "next/navigation";
import ShowPacketsComp from "@/components/showPackets/ShowPacketsComp";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import useSelectedItems from "@/hooks/useSelectedItems";
import swal from "sweetalert2";
import LoadingComp from "@/components/loading/LoadingComp";
import InputText from "@/FormComponents/inputText/InputText";
import TextEditor from "@/components/textEditor/textEditorComp";
import Link from "next/link";
import AddAdvertStepsComp from "@/components/addAdvertSteps/AddAdvertStepsComp";

function AddAdvertPropertyComp(props) {
    const searchParams = useSearchParams()
    const advertId = searchParams.get("id")
    if (advertId === null) {
        return (<div>Hata!!!</div>)
    }

    const router = useRouter()
    const [pricesGrouped, setPricesGrouped] = useState([])
    const [pricesRaw, setPricesRaw] = useState([])
    const [selectedItems, handleSelect, handleSelectMultiple, removeAndAdd, clearItems] = useSelectedItems();
    const [totalAmount, setTotalAmount] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [socialIds, setSocialIds] = useState([])
    const [socialInputVisible, setSocialInputVisible] = useState(false)
    const [socialMediaText, setSocialMediaText] = useState("")
    const [userPackages, setUserPackages] = useState([])
    const [selectUserPackets, setSelectUserPackets] = useState(false)
    const [selectedItemInThePast, setSelectedItemInThePast] = useState([])
    const [alreadyPayments, setAlreadyPayments] = useState([])

    useEffect(() => {
        getPricesList()
        getUserPackages()
    }, [])

    const getPricesList = async () => {
        const response = await ApiGetRequest("/AdvertisementPrice/GetAdvertisementPriceListOfCurrentUser")
        //console.log("response");
        //console.log(response);
        if (!response.errorMessage) {
            setPricesRaw(response)
            const groupedAndSortedData = groupAndSortByOrder(response, 'group');

            //console.log(groupedAndSortedData);
            setPricesGrouped(groupedAndSortedData)
            setSocialIds(getSocialMediaIds(response))
        }
        setIsLoading(true)
    }
    const getSocialMediaIds = (priceList) => {
        return priceList
            .filter(advertisement => advertisement.advertisementTypeName === "Facebook" || advertisement.advertisementTypeName === "Instagram")
            .map(advertisement => advertisement.id)
    }
    const groupAndSortByOrder = (array, key) => {
        // Gruplanmış ve sıralanmış verileri tutacak olan dizi
        const groupedAndSorted = [];
        //console.log(array);
        // Verilen array üzerinde döngü
        array.forEach((item) => {
            // Öğenin 'group' özelliğini al
            const group = item[key];
            //console.log(group);
            const propertyGroupName = item["group"]
            const selectionType = item["selectionType"]


            // Grup adı ile eşleşen bir öğe var mı kontrol et
            const existingGroup = groupedAndSorted.find((groupItem) => groupItem.group === group);

            // Grup adı ile eşleşen bir öğe yoksa, yeni bir grup oluştur
            if (!existingGroup) {
                groupedAndSorted.push({group, items: [], propertyGroupName, selectionType});
            }

            // Öğeyi sıralanmış bir şekilde ilgili gruba ekle
            groupedAndSorted.find((groupItem) => groupItem.group === group).items.push(item);
            groupedAndSorted.sort((a, b) => a.group - b.group);
            // groupedAndSorted.find((groupItem) => groupItem.group === group).items.sort((a, b) => a.group - b.group);
        });

        return groupedAndSorted;
    };


    const getIdsWithGroupName = (groupName) => {

        const group = pricesGrouped.find(obj => obj.group === groupName);

        if (group) {
            //console.log(group.items.map(item => item.id)); //
            return group.items.map(item => item.id)
        } else {
            //console.log('Group Name Not Found.');
        }


    }
    const getUserPackages = async () => {
        const response = await ApiGetRequest("/Package/GetCurrentUserAvailablePackages")
        if (!response.errorMessage) {
            // console.log(response);
            setUserPackages(response.packageCreditsVMList)
        }

    }

    useEffect(() => {
        const total = pricesRaw.reduce((accumulator, currentValue) => {
            if (selectedItems.includes(currentValue.id)) {
                return accumulator + currentValue.price;
            }
            return accumulator;
        }, 0);

        setTotalAmount(total)
        //console.log(selectedItems);
    }, [selectedItems])

    const getAdvertSelectedPrice = async () => {
        const response = await ApiGetRequest("/Payment/GetAdvertisementPayments", `advertisementId=${advertId}&status=waiting`)
        if (response.errorMessage === null) {
            // console.log(response);
            setAlreadyPayments(response.paymentVMList)
            // const advertisementPriceIds = [];

            // response.paymentVMList.forEach(item => {
            //     advertisementPriceIds.push(item.advertisementPriceId);
            // });


            // handleSelectMultiple(advertisementPriceIds)
            // setSelectedItemInThePast(advertisementPriceIds)

        }

    }
    useEffect(() => {
        // console.log(selectedItemInThePast);
        // console.log(pricesGrouped, pricesGrouped.length);

        // if (selectedItemInThePast.length === 0 && pricesGrouped && pricesGrouped.length > 0) {
        //     // console.log("in here 1", pricesGrouped[0]?.items[0]?.id);
        //     handleSelect(pricesGrouped[0]?.items[0]?.id)
        // }else{
        //     clearItems()
        // }
    }, [selectedItemInThePast, pricesGrouped])

    const addSocialMediaText = async () => {

        let formDataArr = []
        formDataArr.push({
            name: "AdvertisementId", value: advertId
        })

        formDataArr.push({
            name: "PropertyValue", value: "social_media_message"
        })
        formDataArr.push({
            name: "Value", value: socialMediaText
        })
        formDataArr.push({
            name: "ShowInAdvertisement", value: "false"
        })
        const response = await ApiPostRequest("/AdvertisementProperty/Add", "", formDataArr)

        //console.log(response);
    }

    useEffect(() => {
        getAdvertSelectedPrice()
    }, [])

    useEffect(() => {
        let inputVisible = false
        socialIds.forEach(id => {
            if (selectedItems.includes(id)) {
                inputVisible = true
            }
        })

        setSocialInputVisible(inputVisible)
    }, [selectedItems])


    const addAdvertProperty = async () => {
        let formDataArr = []
        selectedItems.forEach(s => {
            if (s !== 0) {
                formDataArr.push({
                    name: "priceIdList", value: s
                })
            }

        })

        await ApiPostRequest("/Payment/CreateAdvertisementPayments", `advertisementId=${advertId}`, formDataArr)

        // await swal.fire({
        //     title: "Başarıyla Eklendi!",
        //     // text: "You clicked the button!",
        //     icon: "success"
        // })
        await swal.fire({
            position: "top-end", icon: "success", title: "Başarıyla Eklendi!", showConfirmButton: false, timer: 1000
        });
        if (socialInputVisible) {
            await addSocialMediaText()
        }
        router.push(`/advert/addAdvertPreview?id=${advertId}`);
        router.refresh();

    }
    const handleChangeEditor = (e) => {
        const data = e.editor.getData();
        setSocialMediaText(data);
    };

    const selectUserPacket = async (packetId) => {
        if (packetId === 0) {
            setSelectUserPackets(false)
        } else {
            setSelectUserPackets(true)
        }

        clearItems();
        handleSelectMultiple([packetId])

    }

    if (!isLoading) {
        return <LoadingComp/>
    }
    return (
        <div className={"mainContent container"}>
            <AddAdvertStepsComp count={3}/>

            <div>
                <div className={"mt-3 justify-content-start"}>

                </div>

                <div className={`${styles['']} rounded bg-white mt-5 mb-5 p-3`}>
                    <div className={" mb-3"}>
                        <h5 className={"text-right"}>Doping Ekle</h5>
                        <div className="fst-italic text-muted fw-lighter">İlanınızın daha fazla dikkat çekmesi için
                            destekleyebilirsiniz.
                        </div>
                        <hr/>
                    </div>


                    {alreadyPayments && alreadyPayments.length > 0 &&
                        <div className={"mb-5 border rounded p-3 bg-light"}>
                            <div className={""}>
                                <h4>Bu İlan İçin Alınan Özellikler</h4>
                                <span className={"text-muted"}> Bu ilan için daha önce aldığınız özellikler aşağıda listelenmektedir.</span>
                                {alreadyPayments.map((fc, index) =>

                                    // <div className={"col-12 col-sm-6 col-md-3 mb-2 p-2  rounded bg-white me-1"} key={index}>


                                    <div className={`${styles['']}  bg-success rounded text-white`} key={index}>


                                        <div
                                            className="border rounded p-2 mt-1  form-check d-flex justify-content-between"
                                            key={index}>
                                            <div className={""}>
                                                <FontAwesomeIcon icon={faCheckCircle}
                                                                 className={"text-white me-2"}/>{fc.advertisementTitle}
                                            </div>
                                            <div>{fc.transferAmount}&#8378;</div>


                                        </div>
                                    </div>)}

                            </div>

                            {/*<hr/>*/}
                        </div>

                    }
                    {userPackages && userPackages.length > 0 && <div className={"mb-5 border rounded p-3 bg-light"}>
                        <div>
                            <h4>Satın Alınan Paketlerim</h4>
                            <span className={"text-muted"}> Satın almış olduğunuz paketlerden kalan kullanımlar aşağıda listelenmiştir. Kullanmak istediğiniz paketi seçerek devam edebilirsiniz.</span>
                            {userPackages.map((fc, index) =>

                                    // <div className={"col-12 col-sm-6 col-md-3 mb-2 p-2  rounded bg-white me-1"} key={index}>


                                    <div
                                        className={styles['priceItem'] + " border rounded p-2 mt-1 bg-white hoverSm form-check d-flex justify-content-between"}
                                        key={index}>
                                        <div className={""}>

                                            <input className={"form-check-input ms-0 me-1"}
                                                   type={"radio"}
                                                   id={fc.id}
                                                   name={fc.name}
                                                   value={fc.name}
                                                   checked={selectedItems.includes(fc.id)}

                                                   onChange={() => selectUserPacket(fc.id)}
                                            />
                                            <label className={"form-check-label fw-bold"}
                                                   htmlFor={fc.id}>{fc.name}
                                                <span title={"Kullanılabilir"}
                                                      className={"text-muted ms-1 fw-lighter fst-italic"}>({fc.totalCount})
                                             </span>
                                            </label>
                                            <div className={"text-muted ms-4 fw-lighter fst-italic"}>{fc.packageDetail}
                                            </div>
                                        </div>

                                    </div>



                                // </div>
                            )}


                        </div>

                        {/*<hr/>*/}
                    </div>

                    }


                    {!selectUserPackets && <div className={"mb-5 border rounded p-3 bg-light"}>
                        <div>
                            {pricesGrouped.map((f, index) =>

                                    // <div className={"col-12 col-sm-6 col-md-3 mb-2 p-2  rounded bg-white me-1"} key={index}>


                                    <div className={`${styles['']}  `} key={index}>

                                        {f.items.map((fc, index) => <div
                                            className="border rounded p-2 mt-1 hoverSm form-check d-flex justify-content-between bg-white"
                                            key={index}>
                                            <div className={""}>
                                                <input className={"form-check-input ms-0 me-1"}
                                                       type={f.selectionType === "Tekli" ? "radio" : "checkbox"}
                                                       id={fc.id}
                                                       name={fc.group}
                                                       value={fc.advertisementTypeName}
                                                       checked={selectedItems.includes(fc.id)}

                                                       onChange={() => f.selectionType === "Tekli" ? removeAndAdd(fc.id, getIdsWithGroupName(fc.group)) : handleSelect(fc.id)}
                                                />
                                                <label className={"form-check-label"}
                                                       htmlFor={fc.id}>{fc.advertisementTypeName}</label>
                                            </div>
                                            <div>{fc.price}&#8378;</div>
                                        </div>)}

                                        <hr/>
                                    </div>


                                // </div>
                            )}
                        </div>

                        <div className={"fw-bold d-flex justify-content-end"}> Toplam: {totalAmount}&#8378; </div>
                    </div>}
                    <div className={"p-3 border rounded"}>

                        <div onClick={() => {
                            clearItems()
                            setSelectUserPackets(false)
                        }}
                             className="border rounded p-2 mt-1 hoverSm form-check d-flex justify-content-center pointer "
                        >
                            <div className={""}>

                                <FontAwesomeIcon icon={faTrashCan} className={"me-2"}/>Seçimleri Temizle
                            </div>

                        </div>
                    </div>

                    {socialInputVisible && <div>
                        <h4>Sosyal Medya İçin Metin Girebilirsiniz</h4>
                        <hr/>
                        <div className="d-flex justify-content-evenly flex-wrap">

                            <div className={styles["socialInputText"] + " col-md-6 mb-3"}>
                                <TextEditor name={"description "} onChange={handleChangeEditor} value={""}/>

                                {/*<textarea name={"" } rows={10} cols={40} onChange={(e)=>setSocialMediaText(e.target.value)}/>*/}
                            </div>
                            <div className={styles['socialBox'] + " col-md-6  border"}>
                                <div dangerouslySetInnerHTML={{__html: socialMediaText}}/>
                            </div>
                        </div>
                    </div>}
                    <br/>
                    <br/>
                    <ShowPacketsComp/>
                    <div className={" d-flex justify-content-between mt-5"}>
                        <Link href={"/advert/addAdvert?id=" + advertId}
                              className={`${styles['']} btn btn-secondary me-3 `}>
                            {/*<button onClick={() => addSocialMediaText()} className={`${styles['']} btn btn-success `}>*/}
                            <FontAwesomeIcon className={"me-2"} icon={faArrowLeft}/>Geri Dön
                        </Link>

                        <button onClick={() => addAdvertProperty()} className={`${styles['']} btn btn-success `}>
                            {/*<button onClick={() => addSocialMediaText()} className={`${styles['']} btn btn-success `}>*/}
                            <FontAwesomeIcon className={"me-2"} icon={faAnglesRight}/>Devam Et
                        </button>
                    </div>

                </div>

            </div>
        </div>);
}

export default AddAdvertPropertyComp;