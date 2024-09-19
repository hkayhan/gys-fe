'use client'
import React, {useEffect, useState} from 'react';
import styles from './Users.module.css'
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons";
import LoadingComp from "@/components/loading/LoadingComp";
import Link from "next/link";
import 'react-tabs/style/react-tabs.css';
import {ApiGetRequest} from "@/services/admin";

function UsersComp(props) {


    const [tabIndex, setTabIndex] = useState(0)
    const [users, setUsers] = useState([]);
    const [firms, setFirms] = useState([]);
    const [isLoadingUser, setIsLoadingUser] = useState(false)
    const [isLoadingFirms, setIsLoadingFirms] = useState(false)
    const [formDataInputs, setFormDataInputs] = useState("")

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await ApiGetRequest("/Users/GetByType", "type=person")
                setUsers(data['userVMList']);
                setIsLoadingUser(true)


            } catch (error) {
                console.error('Error fetching users:', error);
            }

        };

        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // const response = await fetch('https://esknet.asystee.com/api/Users/GetByType?type=2');
                const data = await ApiGetRequest("/Users/GetByType", "type=firm")

                //console.log("data");
                //console.log(data);
                setFirms(data['userVMList']);
                setIsLoadingFirms(true)


            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);


    const searchByKeyword = () => {

    }


    const handleChange = (e) => {
        setFormDataInputs({
            ...formDataInputs,
            [e.target.name]: e.target.value,
        });

    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let type_string=""
        if (tabIndex === 0) {
            setIsLoadingUser(false)
            type_string="person"

        } else {
            setIsLoadingFirms(false)
            type_string="firm"
        }
        // //console.log(formDataInputs);
        try {
            const response = await fetch('https://esknet.asystee.com/api/Users/UserQuery?search=' + formDataInputs['searchBar'] + '&userType=' + type_string);
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            const data = await response.json();
            //console.log("data");
            //console.log(data);
            if (tabIndex === 0) {
                setUsers(data['userVMList']);
                setIsLoadingUser(true)
            } else {
                setFirms(data['userVMList']);
                setIsLoadingFirms(true)
            }


        } catch (error) {
            console.error('Error fetching users:', error);
        }


    };


    return (

        <div className={`${styles['']} container mainContent p-2`}>

            <Tabs
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
            >
                <TabList>
                    <Tab>
                        Kişiler</Tab>
                    <Tab>Şirketler</Tab>
                </TabList>

                <TabPanel>
                    <h4>Kişiler</h4>
                    <hr/>

                    <form className={styles['form']} onSubmit={handleSubmit}>
                        <input name={"searchBar"} className={styles['input']} onChange={handleChange} type="search"
                               placeholder="Ara..."/>
                        <button className={"btn btn-primary "} onClick={() => searchByKeyword()}><FontAwesomeIcon
                            icon={faMagnifyingGlass}/></button>
                    </form>

                    {!isLoadingUser && <LoadingComp/>}

                    {isLoadingUser && <table className=" table table-striped text-center">
                        <thead>
                        <tr>
                            {/*<th scope="col">#</th>*/}
                            <th scope="col">Profil</th>
                            <th scope="col">Ad</th>
                            <th scope="col">Soyad</th>
                            <th scope="col">E-Posta</th>
                            <th scope="col">TC No</th>
                            <th scope="col">Telefon</th>
                            <th scope="col">Rol</th>
                            <th scope="col">Aksiyon</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            users.map((u, i) =>
                                <tr key={i}>
                                    {/*<th scope="row">1</th>*/}
                                    <td>
                                        <img id={u.uid+"_photo"}
                                        className={"rounded-circle"}
                                        width={35}
                                        height={35}
                                        // src={u.imageBase64?u.imageBase64:"/images/person_avatar.png"}
                                        // src={"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"

                                            src={u.imageBase64?"data:image/jpeg;base64," + u.imageBase64:"/images/person_avatar.png" }
                                        alt={""}/>
                                    </td>
                                    <td>{u.firstName}</td>
                                    <td>{u.lastName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.identityNumber}</td>
                                    <td>{u.phone}</td>
                                    <td>

                                        {
                                            u.userRoleNames?.length > 0 ?
                                                u.userRoleNames?.map((ur, i) =>

                                                    <span key={i}>
                                                        {ur === "admin" &&
                                                            <span
                                                                className={"rounded  border bg-danger s text-white p-2"}> Admin</span>

                                                        }

                                                        {ur === "operator" &&
                                                            <span
                                                            className={"rounded  border bg-warning s text-white p-2"}> Moderatör</span>

                                                        }    {ur === "default" &&
                                                            <span
                                                            className={"rounded  border bg-success text-white p-2"}>Normal</span>

                                                        }

                                                    </span>
                                                )


                                                :
                                                <span
                                                    className={"rounded  border bg-success text-white p-2"}>Normal</span>


                                        }
                                    </td>


                                    <td className={"text-center "}><Link href={"/admin/userProfileActions?userType=person&uid=" + u.uid}
                                                                         className={"btn btn-outline-primary"}><FontAwesomeIcon
                                        icon={faMagnifyingGlass}/> </Link></td>
                                </tr>
                            )
                        }


                        </tbody>

                    </table>
                    }

                    {isLoadingUser && users.length === 0 &&
                        <div className='text-center'><span>Kullanıcı listesi bulunamadı!</span></div>}

                </TabPanel>
                <TabPanel>
                    <h4>Şirketler</h4>
                    <hr/>

                    <form className={styles['form']} onSubmit={handleSubmit}>
                        <input name={"searchBar"} className={styles['input']} onChange={handleChange} type="search"
                               placeholder="Ara..."/>
                        <button className={"btn btn-primary "} onClick={() => searchByKeyword()}>
                            <FontAwesomeIcon icon={faMagnifyingGlass}/>
                        </button>
                    </form>

                    {!isLoadingFirms && <LoadingComp/>}
                    {
                        isLoadingFirms &&
                        <table className=" table table-striped text-center">
                            <thead>
                            <tr>
                                {/*<th scope="col">#</th>*/}
                                <th scope="col">Profil</th>
                                <th scope="col">Ad</th>
                                <th scope="col">E-Posta</th>
                                <th scope="col">Telefon</th>
                                <th scope="col">Aksiyon</th>
                            </tr>
                            </thead>
                            <tbody>
                            {/*{//console.log(firms)}*/}
                            {firms.map((f, index) =>
                                <tr key={index}>
                                    {/*<th scope="row">1</th>*/}
                                    <td><img
                                        className={"rounded"}
                                        width={35}
                                        height={35}
                                        src={f.imageBase64?"data:image/jpeg;base64," + f.imageBase64:"/images/company_avatar.jpeg" }
                                        alt={""}/></td>
                                    <td>{f.companyName}</td>
                                    <td>{f.email}</td>
                                    <td>{f.phone}</td>
                                    <td className={"text-center "}><Link href={"/admin/userProfileActions?userType=firm&uid=" + f.uid}
                                                                         className={"btn btn-outline-primary"}><FontAwesomeIcon
                                        icon={faMagnifyingGlass}/> </Link></td>
                                </tr>)}


                            </tbody>
                        </table>
                    }

                </TabPanel>

            </Tabs>

        </div>

    );
}

export default UsersComp;