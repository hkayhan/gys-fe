'use client'
import React, {useEffect, useState} from 'react';
import styles from './userProfileActions.module.css'
import {useRouter, useSearchParams} from "next/navigation";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import swal from "sweetalert2";
import MyProfileComp from "@/components/myProfile/myProfileComp";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClipboardUser, faEdit, faTrash, faTrashCan} from "@fortawesome/free-solid-svg-icons";
import EditCompanyProfileComp from "@/components/editCompanyProfile/editCompanyProfileComp";

function UserProfileActionsComp(props) {
    const router = useRouter()

    const searchParams = useSearchParams()
    const uid = searchParams.get("uid")


    const [userData, setUserData] = useState()
    const [roleList, setRoleList] = useState([])
    const [showUserEditModal, setShowUserEditModal] = useState(false)
    const [showUserLogs, setShowUserLogs] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userLogs, setUserLogs] = useState([])
    const [checkboxValues, setCheckboxValues] = useState({
        default: false, operator: false, admin: false, isBanned: false, showInReferences: false
    });

    const cancel = () => {
        router.push("/admin/users");
        router.refresh();

    }

    const save = async () => {

        const formDataArr = []
        if (checkboxValues.operator) {
            formDataArr.push({
                name: "roleIdList", value: "2"
            })
        }
        if (checkboxValues.admin) {
            formDataArr.push({
                name: "roleIdList", value: "3"
            })
        }

        try {
            setIsLoading(false)

            let query = `userUId=${uid}&isBanned=${checkboxValues["isBanned"] ? "true" : "false"}&showInReferences=${checkboxValues["showInReferences"] ? "true" : "false"}`

            const response = await ApiPostRequest("/Users/UpdateUserRolePermissionInProfile", query, formDataArr);
            setIsLoading(true)
            response.then(data => {
                getUserData()
            })
            //console.log('Response:', response);
        } catch (error) {
            console.error('Error:', error);
        }


        // router.push("/admin/users");
        // router.refresh();

    }
    const isUserRoleExist = (roleId, userData) => {
        // console.log("is role exist :", roleId);
        // console.log("userData exist :", userData);
        if (roleId === 1) {
            return true
        }

        if (userData?.userRoles !== undefined) {
            return userData?.userRoles.some(function (userRole) {
                return userRole.roleId === roleId
            })
        }
        return false
    }


    const getUserData = async () => {
        const response = await ApiGetRequest("/Users/GetByUid", "uId=" + uid);
        if (!response.errorMessage) {
            setUserData(response['user']);
            const roleList = await getRoleList()
            // console.log("roleList 1:", roleList);
            // console.log("user 1:", data['user']);
            // console.log();
            setCheckbox(roleList, response['user'])
            setIsLoading(true)
        }

    };
    const getRoleList = async () => {
        const data = await ApiGetRequest("/Role/GetRoleList");
        setRoleList(data);
        return data
        // setIsLoading(true)
    };

    const handleCheckboxChange = (event) => {
        const {name, checked} = event.target;
        setCheckboxValues({...checkboxValues, [name]: checked});
        //console.log(checkboxValues);
    };
    useEffect(() => {
        getUserData();

    }, []);


    const setCheckbox = (roleList, userData) => {
        let cv = checkboxValues
        // console.log("role list :",roleList)
        if (roleList.length > 0) {
            roleList.forEach(r => {
                // console.log("cv name:", r);
                // console.log("is role exist:", isUserRoleExist(r.id));
                // console.log("userDAta:", userData);
                cv[r.name] = isUserRoleExist(r.id, userData);
            })

        }

        if (userData?.userRoles) {
            cv['isBanned'] = userData.isBanned
            cv['showInReferences'] = userData.showInReferences
        }


        setCheckboxValues(cv)

    }

    useEffect(() => {
        // setCheckbox()
    }, [userData, roleList])


    if (!isLoading) {
        return (<LoadingComp/>)
    }

    const deleteUser = async () => {
        const modalResult = await swal.fire({
            title: "Dikkat", text: "Kullanıcıyı Sistemden Tamamen Silmek İstiyor Musunuz?", icon: "warning",
            confirmButtonText: "Onayla",
            cancelButtonText: "Vazgeç",
            showCancelButton: true
        })
        if (modalResult.isConfirmed) {
            const response = ApiGetRequest('/Users/DeleteByUid', 'uid=' + uid)
            if (!response.errorMessage) {
                // await swal.fire("Başarılı","Kullanıcı Başarıyla Sistemden Silindi","success")
                await swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Başarıyla Silindi!",
                    text: "Kullanıcı Başarıyla Sistemden Silindi",
                    showConfirmButton: false,
                    timer: 1000
                });
                router.push("/admin/users")
                router.refresh()
            } else {
                await swal.fire("Hata", response.errorMessage, "error")

            }
        }
    }

    const getUserLogs = async () => {
        const response = await ApiPostRequest("/Users/GetUserLogList", "", [{name: "userUid", value: uid}])
        if (!response.errorMessage) {
            setUserLogs(response.userSystemLogVMList)
        }
    }

    const formatDate = (dateStr) => {
        let date = new Date(dateStr)
        let localDate = date// .toLocaleString('tr-TR'); // Türkçe yerel saat dilimi kullanarak biçimlendirme

        let dtf = new Intl.DateTimeFormat('tr-TR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false, // 24 saat biçiminde göstermek için
        });

        return dtf.format(localDate);
    }


    return (
        <div>
            <div className={`${styles['']} container shadow shadowHover rounded bg-white mt-2 mb-5 p-3`}>
                <div>
                    <div className={"d-flex justify-content-between align-items-center mb-3"}>
                        <h4 className={"text-right"}>Kullanıcı Yönetimi</h4>
                    </div>
                    {/* {JSON.stringify(roleList)}
            <hr/>
            {JSON.stringify(checkboxValues)}*/}
                    {userData?.userType?.key === "person" &&
                        <>
                            <div className={"d-flex justify-content-between align-items-center mb-0"}>
                                <h6 className={" fw-bold text-right"}>Rol Yönetimi</h6>
                            </div>
                            <hr className={"py-0 mt-0"}/>
                            <div className={`${styles['']} d-flex flex-wrap form-check`}>
                                {roleList.map((r, i) => <div key={i} className={"form-check col-12 col-md-4"}>
                                    {/*{//console.log(r)}*/}
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name={r.name}
                                        id={r.name}
                                        checked={checkboxValues[r.name]}
                                        onChange={handleCheckboxChange}
                                    />
                                    <label className="form-check-label" htmlFor={r.name}>{r.description}</label>

                                </div>)}

                            </div>


                        </>

                    }

                    <div className={"d-flex justify-content-between align-items-center mt-3 mb-0"}>
                        <h6 className={" fw-bold text-right"}>Giriş İzni</h6>
                    </div>
                    <hr className={"py-0 mt-0"}/>
                    <div className={`${styles['']} d-flex flex-wrap form-check`}>
                        <div className={"form-check col-12 col-md-4"}>
                            {/*{//console.log(r)}*/}
                            <input
                                className="form-check-input"
                                type="checkbox"
                                name={"isBanned"}
                                id={"isBanned"}
                                checked={checkboxValues["isBanned"]}
                                onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor={"isBanned"}>Kullanıcının Sisteme Girişini
                                Engelle</label>

                        </div>

                    </div>

                    {userData?.userType?.key === "firm" && <>
                        <div className={"d-flex mt-4 justify-content-between align-items-center mt-3 mb-0"}>
                            <h6 className={" fw-bold text-right"}>Referanslar'a ekle (Şirketler İçin)</h6>
                        </div>
                        <hr className={"py-0 mt-0"}/>
                        <div className={`${styles['']} d-flex flex-wrap form-check`}>
                            <div className={"form-check col-12 col-md-4"}>
                                {/*{//console.log(r)}*/}
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name={"showInReferences"}
                                    id={"showInReferences"}
                                    checked={checkboxValues["showInReferences"]}
                                    onChange={handleCheckboxChange}
                                />
                                <label className="form-check-label" htmlFor={"showInReferences"}>Referans Şirketler'e
                                    Ekle</label>

                            </div>
                        </div>
                    </>}


                    <div className={"d-flex justify-content-center mt-5"}>
                        <button onClick={() => cancel()} className={"btn btn-danger me-2"}>İptal</button>
                        <button onClick={() => save()} className={"btn btn-success"}>Kaydet</button>
                    </div>

                </div>


            </div>
            <div>
                <div className={`${styles['']} container shadow shadowHover rounded bg-white mt-2 mb-5 p-3`}>
                    <div className={"d-flex justify-content-between align-items-center mb-3"}>
                        <h4 className={"text-right"}>Kullanıcı İşlemleri</h4>
                        <hr/>
                    </div>
                    <p>
                        Kullanıcı <strong>Silme</strong> ve <strong>Güncelleme</strong> işlemlerini aşağıdaki butonlar
                        aracılığıyla yapabilirsiniz.
                    </p>

                    <div className={"d-flex justify-content-center mt-5"}>
                        <button onClick={() => deleteUser()} className={"btn btn-danger me-2"}>
                            <FontAwesomeIcon icon={faTrashCan} className={"me-2"}/>Kullanıcıyı Sil
                        </button>
                        <button onClick={() => {
                            setShowUserEditModal(true)
                            setShowUserLogs(false)
                        }} className={"btn btn-secondary me-2"}><FontAwesomeIcon icon={faEdit} className={"me-2"}/>Kullanıcı
                            Bilgilerini Düzenle
                        </button>
                        <button onClick={() => {
                            setShowUserEditModal(false)
                            setShowUserLogs(true)
                            getUserLogs()
                        }} className={"btn btn-warning"}><FontAwesomeIcon icon={faClipboardUser}
                                                                          className={"me-2"}/> Giriş Kayıtları
                        </button>
                    </div>

                </div>
            </div>


            {showUserEditModal &&
                <div>
                    <div className={`${styles['']} container shadow shadowHover rounded bg-white mt-2 mb-5 p-3`}>
                        {userData.userType.key === "person" ?
                            <MyProfileComp userUid={uid}/>:
                            <EditCompanyProfileComp userUid={uid}/>
                        }
                    </div>
                </div>

            }


            {showUserLogs &&
                <div className={`${styles['']} container shadow shadowHover rounded bg-white mt-2 mb-5 p-0`}>
                    {userLogs.length === 0 ?
                        <div className={"p-3"}>
                            Kayıt Bulunamadı
                        </div> :
                        <div>
                            <div className={"d-flex border-bottom mb-2 flex-wrap text-center fw-bold bg-info-subtle"}>
                                <div className="col-2 p-2 text-break border-end">Tarih</div>
                                <div className="col-2 p-2 text-break border-end">IP</div>
                                <div className="col-4 p-2 text-break border-end">Link</div>
                                <div className="col-4 p-2 text-break">Detay</div>
                            </div>
                            {userLogs.map((l, i) =>
                                <div className={"d-flex border-bottom mb-2 flex-wrap text-center"}>
                                    <div className="col-2 p-2 text-break border-end">{formatDate(l.createDate)}</div>
                                    <div className="col-2 p-2 text-break border-end">{l.clientIp}</div>
                                    <div className="col-4 p-2 text-break border-end">{l.action}</div>
                                    <div className="col-4 p-2 text-break">{l.content}</div>
                                </div>
                            )}

                        </div>


                    }


                </div>
            }
        </div>

    );
}

export default UserProfileActionsComp;