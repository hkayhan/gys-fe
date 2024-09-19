'use client'
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
import {ApiGetRequest} from "@/services/admin";
import useSelectedItems from "@/hooks/useSelectedItems";
import {useCollapse} from "react-collapsed";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowDown, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

function FilterComp(props) {
    const [selectedItems, handleSelect, handleSelectMultiple, removeAndAdd, clearItems] = useSelectedItems();

    const {type, selectIds} = props

    const [advertisementProperties, setAdvertisementProperties] = useState([])
    const {getCollapseProps, getToggleProps, isExpanded} = useCollapse();

    const getAdvertisementProperties = async (categoryName) => {
        const response = await ApiGetRequest("/Definition/GetByAdvertisementType", `advertisementType=${type}`)
        if (response.errorMessage === null) {
            const groupedAndSortedData = groupAndSortByOrder(response.definitionsVMList, 'group');

            // console.log(groupedAndSortedData);
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
        getAdvertisementProperties()
    }, [])

    // useEffect(()=>{
    //     // console.log("selectedItemsInFilter :",selectedItems)
    //     onChange(selectedItems)
    // },[selectedItems])

    const getIdsWithGroupName = (groupName) => {

        const group = advertisementProperties.find(obj => obj.group === groupName);

        if (group) {
            // //console.log(groupItemIds); //
            return group.items.map(item => item.id)
        } else {
            //console.log('Group Name Not Found.');
        }

    }
    return (

        <div className={`${styles['filterMain']} mb-1`}>


            <div className="collapsible  w-100  d-lg-none d-block ">
                <div
                    className="header bg-light border rounded p-2 mb-3 d-flex justify-content-between fw-bold" {...getToggleProps()}>
                    <div>Filtreler <span>{selectedItems.length > 0 && selectedItems.length}</span></div>
                    <div><FontAwesomeIcon icon={!isExpanded ? faChevronDown : faChevronUp}/></div>

                </div>
                <div {...getCollapseProps()}>
                    <div className="content">

                        <div className={"d-flex flex-wrap justify-content-center"}>
                            {advertisementProperties.map((f, index) =>

                                <div
                                    className={styles['filterCard'] + " mt-2 card border-light col-12  p-2 border rounded bg-white me-1 mb-2 "}
                                    key={index}>
                                    <div className="">
                                        <h6 className={"fw-bold mb-0 "}>{f.propertyGroupName}</h6>
                                        <hr/>
                                    </div>

                                    <ul className={`list-group list-group-flush `} key={index}>

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
                        <div className={"d-flex flex-row-reverse w-100"}>
                            <button className={"btn btn-primary w-50 "} onClick={() => selectIds(selectedItems)}> Ara
                            </button>
                            <div className={"ms-2"}></div>
                            <button className={"btn btn-secondary w-50"} onClick={() => {
                                selectIds([])
                                clearItems()
                            }}>Seçimi Temizle
                            </button>
                        </div>


                    </div>
                </div>

                {isExpanded && <div
                    className="header bg-light border rounded p-2 mt-3 d-flex justify-content-center fw-bold" {...getToggleProps()}>
                    <div><FontAwesomeIcon icon={faChevronUp}/></div>

                </div>}
            </div>
            <div className={"d-none d-lg-block"}>
                <div className={"d-flex flex-wrap justify-content-center"}>
                    {advertisementProperties.map((f, index) =>

                        <div
                            className={styles['filterCard'] + " mt-2 card border-light col-12  p-2 border rounded bg-white me-1 mb-2 "}
                            key={index}>
                            <div className="">
                                <h6 className={"fw-bold mb-0 "}>{f.propertyGroupName}</h6>
                                <hr/>
                            </div>

                            <ul className={`list-group list-group-flush `} key={index}>

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
                <div>

                </div>
                <div className={"d-flex justify-content-center"}>

                    <div className={"d-flex flex-row-reverse w-90"}>

                        <button className={"btn btn-primary w-50 "} onClick={() => selectIds(selectedItems)}> Ara</button>
                        <div className={"ms-2"}></div>
                        <button className={"btn btn-secondary w-50"} onClick={() => {
                            selectIds([])
                            clearItems()
                        }}>Seçimi Temizle
                        </button>
                    </div>
                </div>

            </div>


        </div>);
}

export default FilterComp;