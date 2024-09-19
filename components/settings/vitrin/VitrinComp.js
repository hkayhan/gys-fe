'use client'
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPlus, faSave} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";

const VitrinComp = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectValues, setSelectValues] = useState([]);
    const [options, setOptions] = useState([]);
    const [isLoading, setIsLoading]= useState(false)

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const getShowcaseList = async () => {
        const response = await ApiGetRequest("/Advertisement/AdvertisementComboList", "dopingType=showcase")
        if (!response.errorMessage) {
            // console.log(response)
            setOptions(response.advertisementVMList)
        }
        setIsLoading(true)
    }
    const getActiveShowcaseList = async () => {
        // console.log("getActiveShowcaseList");
        const response = await ApiGetRequest("/MainPageSetting/GetByType", "type=showcase")
        if (!response.errorMessage) {
            let list =response.mainPageSettingVMList
            list.sort((a, b) => a.order - b.order);

            console.log("list")
            console.log(list)
            setSelectValues(list)
        }
    }

    useEffect(()=>{
        getShowcaseList()
        getActiveShowcaseList()
    },[])

    const handleSaveClick = () => {
        const number = parseInt(inputValue);
        if (!isNaN(number)) {
            const newSelectValues = Array.from({length: number}, (_, index) => ({
                id: index + 1,
                advertisementId: 0
            }));
            setSelectValues(newSelectValues);
        } else {
            alert('Lütfen geçerli bir sayı girin!');
        }
    };

    const handleSelectChange = (e, id) => {
        const {value:advertisementId} = e.target;
        setSelectValues(prevSelectValues => {
            return prevSelectValues.map(select => {
                if (select.id === id) {
                    return {...select, advertisementId};
                }
                return select;
            });
        });
    };

    const deleteOldReferenceList = async () => {
        const response = await ApiGetRequest("/MainPageSetting/DeleteByType?type=showcase")
    }

    const saveData = async () => {
        setIsLoading(false)
        await deleteOldReferenceList()
        for (let i = 0; i < selectValues.length; i++) {
            console.log(selectValues[i]);
            await ApiPostRequest(`/MainPageSetting/Add?type=showcase${selectValues[i].advertisementId !== 0 ? "&AdvertisementId=" + selectValues[i].advertisementId : ""}&order=${selectValues[i].id}`, "", [])

        }
        setIsLoading(true)

    }
    if (!isLoading){
        return <LoadingComp/>
    }

    return (
        <div>
            {/*<hr/>*/}
            {/*{JSON.stringify(selectValues)}*/}
            {/*<hr/>*/}
            <input
                type="number"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Sayı girin"
            />

            <button onClick={handleSaveClick} className="ms-4 btn btn-sm btn-success"><FontAwesomeIcon icon={faPlus}/> Oluştur
            </button>
            <div className={"mt-4"}>
                {selectValues.map((select, index) => (
                    <div key={`selectValues` + index} className={" mt-2 d-flex  align-baseline"}>
                        <div className={"w-25"}> {index + 1} Nolu Sıra</div>
                        <select
                            className={"w-75"}
                            key={select.id}
                            value={select.advertisementId?select.advertisementId:0}
                            onChange={(e) => handleSelectChange(e, select.id)}
                        >
                            <option value="0">Rastgele</option>
                            {options.map((o, index) =>
                                <option key={index} value={o.id}>{o.advertisementId+"-"+o.advertisementTitle+"-"+o.companyName}</option>
                            )}
                        </select>
                        <hr/>
                    </div>


                ))}
            </div>
            <div>
                <button onClick={() => saveData()} className="mt-4 w-100 btn  btn-success"><FontAwesomeIcon
                    icon={faSave}/> Kaydet
                </button>

                {/*<h3>Saklanan Değerler</h3>*/}
                {/*<ul>*/}
                {/*    {selectValues.map((select, index) => (*/}
                {/*        <li key={index}>Select {select.id}: {select.value}</li>*/}
                {/*    ))}*/}
                {/*</ul>*/}
            </div>
        </div>
    );
};

export default VitrinComp;
