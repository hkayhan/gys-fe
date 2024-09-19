'use client'
import React, {useState} from 'react';
import styles from './SearchBar.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import Swal from "sweetalert2";
import {useRouter} from "next/navigation";

function SearchBarComp(props) {
    const router = useRouter()
    const [searchText, setSearchText] = useState("")

    const handleEnterKey = (event) => {
        if (event.key === 'Enter') {
            console.log('Enter tuşuna basıldı');
            // Burada çağırmak istediğiniz fonksiyonu ekleyebilirsiniz
            searchByKeyword();
        }
    };
    const searchByKeyword = async () => {
        if (searchText===""){
            return
        }
        const response = await ApiGetRequest("/Advertisement/SearchAndGroupAdvertisements", "searchText=" + searchText)
        if (!response.errorMessage) {
            const groupedData = response.advertisementCategoryVMList.reduce((acc, item) => {
                const existingCategory = acc.find(category => category.categoryName === item.categoryName && category.categoryKey === item.categoryKey);

                if (existingCategory) {
                    existingCategory.count += item.count;
                } else {
                    acc.push({
                        categoryName: item.categoryName,
                        categoryKey: item.categoryKey,
                        count: item.count
                    });
                }

                return acc;
            }, []);

            console.log(groupedData);
            if (groupedData.length === 0) {
                await Swal.fire({
                    title: "Aramanıza uygun sonuç bulamadık",
                    // text: "You won't be able to revert this!",
                    confirmButtonText: "Tamam",
                    icon: "warning",
                    // showCancelButton: true,
                    // confirmButtonColor: "#3085d6",
                    // cancelButtonColor: "#d33",
                    // confirmButtonText: "Yes, delete it!"
                })
            } else if (groupedData.length === 1) {
                router.push(`/listing?type=${groupedData[0].categoryKey}&searchKey=${searchText}`)
                router.refresh()
            } else if (groupedData.length > 1) {
                // const htmlContent = groupedData.map(item =>
                //     `<a class="item " style="cursor: pointer" data-key="${item.categoryKey}">${item.categoryName}(${item.count})</a><br/><br/>`
                // ).join('');
                const htmlContent = `
            <style>
                .item {
                    cursor: pointer;
                    margin: 5px 0;
                    margin-bottom: 10px;
                }
                .item:hover {
                    text-decoration: underline;
                }
            </style>
            ${groupedData.map(item =>
                    `<p class="item" data-key="${item.categoryKey}">${item.categoryName}(${item.count})</p>`
                ).join('')}
        `;
                await Swal.fire({
                    title: 'Kategori Seç',
                    html: htmlContent,
                    showConfirmButton: false,
                    showCloseButton: false,
                    focusConfirm: false,
                    didOpen: () => {
                        const items = Swal.getHtmlContainer().querySelectorAll('.item');
                        items.forEach(item => {
                            item.addEventListener('click', () => {
                                const key = item.getAttribute('data-key');
                                if (key) {
                                    Swal.close()
                                    router.push(`/listing?type=${key}&searchKey=${searchText}`);
                                }
                            });
                        });
                    }
                })
            }
        }

    }


    return (
        <div className={styles['searchBar']}>
            <input type="text" placeholder={"Aramaya Başlayın"} name={"q"}
                   onKeyDown={handleEnterKey}
                   onChange={e => {
                setSearchText(e.target.value)
            }}/>
            <button onClick={() => searchByKeyword()}>
                <FontAwesomeIcon icon={faSearch} size={'xl'}/>
            </button>

        </div>

    );
}

export default SearchBarComp;