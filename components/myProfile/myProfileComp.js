'use client'
import React, {useEffect, useState} from 'react';
import styles from './myProfile.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faBookmark,
    faCancel,
    faCertificate,
    faPlus,
    faSave,
    faTrashCan,
    faUserCheck
} from "@fortawesome/free-solid-svg-icons";
import {
    ApiGetRequest,
    ApiPostRequestWithModel,
} from "@/services/admin";
import LoadingComp from "@/components/loading/LoadingComp";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import tr from 'date-fns/locale/tr';
import Swal from 'sweetalert2'
import {useRouter, useSearchParams} from "next/navigation";
import UserProfilePhotoComp from "@/components/userProfilePhoto/UserProfilePhotoComp";
import InputText from "@/FormComponents/inputText/InputText";

function MyProfileComp(props) {
    const {userUid} = props
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [userData, setUserData] = useState([])
    const [cvProperties, setCvProperties] = useState([])

    const property = {
        organizationName: "", position: "", startDate: "", endDate: "",
    }
    const [propertyAdd, setPropertyAdd] = useState(property)
    const [showPropertyAddArea, setShowPropertyAddArea] = useState("")


    /*    const [educationInfo, setEducationInfo] = useState([{
            "eduSchool": "Porsuk Meslek Yüksek Okulu", "eduDepartment": "Otobüs Kaptanlığı", "start": "2017", "end": "2019",
        }, {
            "eduSchool": "Baksan Çıraklık", "eduDepartment": "Kaynakçı", "start": "2017", "end": "2015",
        }])

        const [experience, setExperience] = useState([{
            "expPosition": "Kaynakçı", "expPlace": "Jimsa Jant Fabrikası", "start": "2015", "end": "2024",
        }, {
            "expPosition": "Kaynakçı", "expPlace": "Eti Makina", "start": "2013", "end": "2015",
        }])*/


    const getCurrentUserData = async () => {
        try {
            const response = await ApiGetRequest("/Users/GetCurrentUser")
            setUserData(response?.user)
            setCvProperties(response?.cvPropertyVMList)
            setPropertyAdd(property)
            setShowPropertyAddArea("")

        } catch (error) {
            //console.log(error)
        }
        setIsLoading(true)

    }



    const getUserDataByUid = async () => {
        try {
            const response = await ApiGetRequest("/Users/GetByUid","uId=" + userUid)
            setUserData(response?.user)
            setCvProperties(response?.cvPropertyVMList)
            setPropertyAdd(property)
            setShowPropertyAddArea("")

        } catch (error) {
            //console.log(error)
        }
        setIsLoading(true)

    }


    useEffect(() => {
        if (userUid){
            getUserDataByUid()
        }else {
            getCurrentUserData()

        }
    }, [])

    useEffect(() => {
        setPropertyAdd(property);
    }, [showPropertyAddArea])



    const handleChange = (e) => {
        const {name, value} = e.target;
        //console.log("name, value");
        //console.log(name, value);

        setUserData(prevData => ({
            ...prevData, [name]: value
        }));
    };

    const handleDateChange = (date) => {
        setUserData(prevData => ({
            ...prevData, birthdate: date
        }));
    };

    const handleChangeCheckbox = (e) => {
        const {name, checked} = e.target;
        setUserData(prevData => ({
            ...prevData, [name]: checked // checked değerini kullanın
        }));
    };

    const handleChangeProperty = (e) => {
        const {name, value} = e.target;

        setPropertyAdd(prevData => ({
            ...prevData, [name]: value
        }));
    };

    const saveProperty = async () => {
        setIsLoading(false)
        try {
            let query = `userUId=${userData.uid}&propertyType=${showPropertyAddArea}&position=${propertyAdd.position}&startDate=${propertyAdd.startDate}&endDate=${propertyAdd.endDate}&organizationName=${propertyAdd.organizationName}`
            const response = await ApiGetRequest("/CvProperty/Add", query)
            //console.log(response);
            // await Swal.fire("Başarıyla Eklendi!");
            Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarıyla Eklendi!",
                showConfirmButton: false,
                timer: 1000
            });
            await getCurrentUserData()

        } catch (error) {
            //console.log(error);
        }
    }
    function isValidTCKN(tckn) {
        if (typeof tckn !== 'string' || tckn.length !== 11 || !/^\d+$/.test(tckn) || tckn[0] === '0') {
            return false;
        }

        let digits = tckn.split('').map(Number);

        let sumOdd = digits[0] + digits[2] + digits[4] + digits[6] + digits[8];
        let sumEven = digits[1] + digits[3] + digits[5] + digits[7];

        let checksum1 = (sumOdd * 7 - sumEven) % 10;
        let checksum2 = (digits.slice(0, 10).reduce((a, b) => a + b, 0)) % 10;

        return checksum1 === digits[9] && checksum2 === digits[10];
    }
    const updateProfile = async () => {
        try {
            // ${userData}

            let swalResult = await Swal.fire({
                title: "Değişiklikleri Kaydetmek İstiyor Musunuz?",
                // showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Evet",
                // denyButtonText: `Don't save`
                cancelButtonText: "Vazgeç"
            })

            if (!isValidTCKN(userData?.identityNumber)){
                await Swal.fire({title:"Hatalı TCKNO",text:"Geçerli bir TCKNO girmelisiniz!",icon:"warning", denyButtonText:"Tamam"})
                return
            }

            /* Read more about isConfirmed, isDenied below */
            if (swalResult.isConfirmed) {
                // let query = `uid=${userData.uid}&identityNumber=${userData.identityNumber}&firstName=${userData.firstName}&lastName=${userData.lastName}&birthDate=${userData.birthdate}&phone=${userData.phone}&email=${userData.email}&address1=${userData.address1}h&address2=${userData.address2}&street=${userData.street}&district=${userData.district}&city=${userData.city}&showMyCVData=${userData.showMyCVData}&personalInfo=${userData.personalInfo}`
                // query = query.replace("null", "")

                let query = objectToString(userData)
                /*
                                //console.log(query);

                               return
                */

                const response = await ApiPostRequestWithModel("/Users/UpdateProfile", query, userData)
                //console.log(response);

                if (response?.errorMessage !== null) {
                    //console.log(response);
                    await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})

                } else {
                    // await Swal.fire("Kaydedildi!", "", "success")
                   await Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Kaydedildi",
                        showConfirmButton: false,
                        timer: 1000
                    });
                    const next = searchParams.get("next")
                    //console.log(next);


                    router.push(next ? next : "/userProfile?uid=" + userData.uid);
                    router.refresh();


                }

            }


        } catch (error) {

        }
    }

    const removeProperty = async (property) => {
        //console.log(property);
        let text
        if (property.type === "education") {
            text = "Seçili Eğitim'i Kaldırmak İstiyor Musunuz?"
        } else if (property.type === "experience") {
            text = "Seçili Deneyim'i Kaldırmak İstiyor Musunuz?"

        } else {
            text = "Seçili Yeteneği Kaldırmak İstiyor Musunuz? "
        }
        Swal.fire({
            title: text,
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: "Evet",
            // denyButtonText: `Don't save`
            cancelButtonText: "Vazgeç"
        }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                setIsLoading(false)
                const response = ApiGetRequest("/CvProperty/Delete", "id=" + property.id)
                response.then(d => {
                     Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: "Başarılı",
                        text:"Başarıyla Kaldırıldı!",
                        showConfirmButton: false,
                        timer: 1500
                    });                    getCurrentUserData()
                })
            }
        });
    }

    const objectToString = (object) => {
        return Object.entries(object)
            .filter(([key, value]) => value !== null && value !== undefined)
            .map(([key, value]) => key + "=" + value)
            .join("&");
    }

    if (!isLoading) {
        return (<LoadingComp/>)
    }
    return (<div>
        <div className={`${styles['userProfileMain']} container rounded bg-white mt-5 mb-5 p-3`}>
            <div className={"d-flex justify-content-between align-items-center mb-3"}>
                <h4 className={"text-right"}>Profil Bilgileri</h4>
            </div>
            <hr/>
            <div className={"row"}>
                {/*profile photo*/}
                <div className={"col-md-3 border-right"}>
                    <UserProfilePhotoComp uid={userData?.uid??userUid} userType={userData?.userType?.key}/>
                </div>

                {/*kimlik ve adres*/}
                <div className={"col-md-5 border-right"}>
                    <div className={"p-3 py-5"}>

                        <div className={"row mt-2"}>
                            {/*<div className={"col-md-6"}><label className={"labels"}>Ad</label>*/}
                            {/*    <inputText type="text" className={"form-control"}*/}
                            {/*           placeholder={userData?.firstName ?? "Ad"}*/}
                            {/*           defaultValue={userData?.firstName}*/}
                            {/*    />*/}
                            {/*</div>*/}
                            <div className={"col-md-6"}>
                             {/*   <label className={"labels"}>Ad</label>
                                <inputText type="text" className={"form-control"}
                                       placeholder={"Ad"}

                                       name={"firstName"}
                                       value={userData?.firstName}
                                       onChange={handleChange}
                                />*/}

                                <InputText
                                    label="Ad"
                                    name={"firstName"}
                                    value={userData.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={"col-md-6"}>
                                <InputText
                                    label="Soyad"
                                    name={"lastName"}
                                    value={userData.lastName}
                                    onChange={handleChange}
                                />

                            </div>
                        </div>
                        <div className={"mt-2"}>
                            <InputText type="text"
                                   label={"TC Kimlik Numarası"}
                                   name={"identityNumber"}
                                   value={userData?.identityNumber}
                                   onChange={handleChange}
                            />


                        </div>

                        <div className={"mt-2"}>
                            <label htmlFor="birthday">Doğum Tarihi</label>
                            {/*<inputText type="text"*/}
                            {/*       className={"form-control"}*/}
                            {/*       placeholder={"Doğum Tarihi"}*/}

                            {/*       name={"birthdate"}*/}
                            {/*       value={userData?.birthdate}*/}
                            {/*       onChange={handleChange}*/}
                            {/*/>*/}
                            <div>
                                <DatePicker
                                    selected={userData.birthdate}
                                    className={"form-control d-block"}
                                    onChange={handleDateChange}
                                    placeholderText="Doğum Tarihi"
                                    dateFormat="dd/MM/yyyy"
                                    locale={tr}

                                />
                            </div>


                        </div>

                        <div className={"row mt-3"}>
                            <div className={"col-md-12"}>
                                {/*<label className={"labels"}>Telefon Numarası</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"Telefon Numarası"}

                                       name={"phone"}
                                       value={userData?.phone}
                                       onChange={handleChange}
                                />
                            </div>

                            <div className="col-md-12 mt-2">
                                {/*<label className="labels">E-Posta</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"E-Posta"}

                                       name={"email"}
                                       value={userData?.email}
                                       onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12 mt-2">
                                {/*<label className="labels">Adres</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"Adres Giriniz"}

                                       name={"address1"}
                                       value={userData?.address1}
                                       onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-12 mt-1">
                                {/*<label className="labels">Adres Devamı</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"Adres Devamı"}

                                       name={"address2"}
                                       value={userData?.address2}
                                       onChange={handleChange}
                                />
                            </div>
                            {/*       <div className="col-md-12">
                                    <label className="labels">Postcode</label>
                                    <inputText type="text"
                                           className="form-control"
                                           placeholder="enter address line 2"
                                           value=""/>
                                </div>*/}
                            <div className="col-md-12 mt-2">
                                {/*<label className="labels">Cadde/Sokak</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"Cadde/Sokak"}

                                       name={"street"}
                                       value={userData?.street}
                                       onChange={handleChange}
                                />
                            </div>
                            {/*<div className="col-md-12">
                                    <label className="labels">Area</label>
                                    <inputText type="text"
                                           className="form-control"
                                           placeholder="enter address line 2"
                                           value=""/>
                                </div>*/}

                            {/*<div className="col-md-12">
                                    <label className="labels">Education</label>
                                    <inputText type="text"
                                           className="form-control"
                                           placeholder="education"
                                           value=""/>
                                </div>*/}
                        </div>
                        <div className="row mt-3">
                            <div className="col-md-6">
                                {/*<label className="labels">İlçe</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"İlçe"}

                                       name={"district"}
                                       value={userData.district}
                                       onChange={handleChange}
                                />
                            </div>
                            <div className="col-md-6">
                                {/*<label className="labels">Şehir</label>*/}
                                <InputText type="text"
                                       // className={"form-control"}
                                       label={"İl"}

                                       name={"city"}
                                       value={userData?.city}
                                       onChange={handleChange}
                                /></div>
                        </div>

                    </div>
                </div>

                {/*eğitim ve deneyim*/}
                <div className="col-md-4">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-end experience">
                            <h5 className={"fw-bold mb-0"}>Eğitim</h5>
                            <button
                                className="border px-3 p-1 add-experience"
                                onClick={() => setShowPropertyAddArea("education")}
                            >
                                <FontAwesomeIcon className={"me-1"} icon={faPlus}/>

                                Ekle
                            </button>
                        </div>
                        <hr/>
                        {cvProperties?.map((e, index) =>

                            e.type === "education" && <div className={"mb-3"} key={index}>

                                <div className={`${styles['']}  fw-bold d-flex `}>
                                    <FontAwesomeIcon className={"me-2"} icon={faBookmark}/>
                                    <div>{e.position}</div>
                                    <div className={"flex-grow-1 justify-self-end "}></div>
                                    <FontAwesomeIcon title={"Kaldır"} className={"hoverRed pointer"}
                                                     onClick={() => removeProperty(e)} icon={faTrashCan}/>

                                </div>
                                <div>{e.organizationName}</div>
                                <div className={"text-muted"}>{e.startDate}-{e.endDate}</div>
                                <hr className={"text-muted"}/>
                            </div>)}
                        <br/>

                        {/*add new education*/}
                        {
                            showPropertyAddArea === "education" &&
                            <div className={"row mb-5"}>
                                <h6>Eğitim Ekle</h6>
                                <div className={"col-md-12"}>
                                    {/*<label className={"labels"}>Ad</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Bölüm"}

                                           name={"position"}
                                           value={propertyAdd.position}
                                           onChange={handleChangeProperty}
                                    />
                                </div>
                                <div className={"col-md-12 mt-1"}>
                                    {/*<label className={"labels"}>Okul Adı</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Okul Adı"}

                                           name={"organizationName"}
                                           value={propertyAdd.organizationName}
                                           onChange={handleChangeProperty}
                                    />
                                </div>


                                <div className={"col-md-6 col-12  mt-1"}>

                                    {/*<label className={"labels"}>Başlangıç</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Başlangıç"}

                                           name={"startDate"}
                                           value={propertyAdd.startDate}
                                           onChange={handleChangeProperty}
                                    />
                                </div>

                                <div className={"col-md-6 col-12 mt-1 "}>
                                    {/*<label className={"labels"}>Ad</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Bitiş"}

                                           name={"endDate"}
                                           value={propertyAdd.endDate}
                                           onChange={handleChangeProperty}
                                    />
                                </div>
                                <div className={"col-12 col-md-6  mt-1 p-1 text-center"}>
                                    <button className={" btn btn-secondary "} onClick={() => {
                                        setShowPropertyAddArea("")
                                    }}>
                                        <FontAwesomeIcon className={"me-1 "} icon={faCancel}/>
                                        Vazgeç
                                    </button>
                                </div>

                                <div className={"col-12 col-md-6  mt-1 p-1 text-center"}>
                                    <button className={" btn btn-success "} onClick={() => {
                                        saveProperty()
                                    }}>
                                        <FontAwesomeIcon className={"me-1"} icon={faSave}/>
                                        Kaydet
                                    </button>
                                </div>
                            </div>

                        }


                        {/*<div className="col-md-12">
                            <label className={"labels"}>Eğitim</label>
                            <inputText type="text" className={"form-control"}
                                   placeholder={"Eğitim Ekle"}/>
                        </div>*/}
                        {/*<hr/>*/}
                        <div className="d-flex justify-content-between align-items-end experience">
                            <h5 className={"fw-bold mb-0"}>Deneyim</h5>
                            <button onClick={() => setShowPropertyAddArea("experience")}
                                    className="border px-3 p-1 add-experience">
                                <FontAwesomeIcon className={"me-1"} icon={faPlus}/>

                                Ekle
                            </button>
                        </div>
                        <hr/>
                        {cvProperties?.map((e, index) =>

                            e.type === "experience" && <div className={"mb-3"} key={index}>

                                <div className={`${styles['']}  fw-bold d-flex `}>
                                    <FontAwesomeIcon className={"me-2"} icon={faUserCheck}/>
                                    <div>{e.position}</div>
                                    <div className={"flex-grow-1 justify-self-end "}></div>
                                    <FontAwesomeIcon title={"Kaldır"} className={"hoverRed pointer"}
                                                     onClick={() => removeProperty(e)} icon={faTrashCan}/>

                                </div>
                                <div>{e.organizationName}</div>
                                <div className={"text-muted"}>{e.startDate}-{e.endDate}</div>
                            </div>)}

                        {/*add new education*/}
                        {
                            showPropertyAddArea === "experience" &&
                            <div className={"row mb-5"}>
                                <h6>Deneyim Ekle</h6>
                                <div className={"col-md-12"}>
                                    {/*<label className={"labels"}>Ad</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Çalışılan Pozisyon"}

                                           name={"position"}
                                           value={propertyAdd.position}
                                           onChange={handleChangeProperty}
                                    />
                                </div>
                                <div className={"col-md-12 mt-1"}>
                                    {/*<label className={"labels"}>Okul Adı</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"İş Yeri Adı"}

                                           name={"organizationName"}
                                           value={propertyAdd.organizationName}
                                           onChange={handleChangeProperty}
                                    />
                                </div>


                                <div className={"col-md-6 col-12  mt-1"}>

                                    {/*<label className={"labels"}>Başlangıç</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Başlangıç"}

                                           name={"startDate"}
                                           value={propertyAdd.startDate}
                                           onChange={handleChangeProperty}
                                    />
                                </div>

                                <div className={"col-md-6 col-12 mt-1 "}>
                                    {/*<label className={"labels"}>Ad</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Bitiş"}

                                           name={"endDate"}
                                           value={propertyAdd.endDate}
                                           onChange={handleChangeProperty}
                                    />
                                </div>
                                <div className={"col-12 col-md-6  mt-1 p-1 text-center"}>
                                    <button className={" btn btn-secondary "} onClick={() => {
                                        setShowPropertyAddArea("")
                                    }}>
                                        <FontAwesomeIcon className={"me-1 "} icon={faCancel}/>
                                        Vazgeç
                                    </button>
                                </div>

                                <div className={"col-12 col-md-6  mt-1 p-1 text-center"}>
                                    <button className={" btn btn-success "} onClick={() => {
                                        saveProperty()
                                    }}>
                                        <FontAwesomeIcon className={"me-1"} icon={faSave}/>
                                        Kaydet
                                    </button>
                                </div>
                            </div>

                        }

                        <div className="d-flex justify-content-between align-items-end experience">
                            <h5 className={"fw-bold mb-0"}>Beceri</h5>
                            <button onClick={() => setShowPropertyAddArea("knowledge")}
                                    className="border px-3 p-1 add-experience">
                                <FontAwesomeIcon className={"me-1"} icon={faPlus}/>

                                Ekle
                            </button>
                        </div>
                        <hr/>
                        {cvProperties?.map((e, index) =>

                            e.type === "knowledge" && <div className={"mb-3"} key={index}>

                                <div className={`${styles['']}  fw-bold d-flex `}>
                                    <FontAwesomeIcon className={"me-2"} icon={faCertificate}/>
                                    <div>{e.position}</div>
                                    <div className={"flex-grow-1 justify-self-end "}></div>
                                    <FontAwesomeIcon title={"Kaldır"} className={"hoverRed pointer"}
                                                     onClick={() => removeProperty(e)} icon={faTrashCan}/>

                                </div>
                                <div>{e.organizationName}</div>
                                <div className={"text-muted"}>{e.startDate}-{e.endDate}</div>
                            </div>)}
                        {/*add new education*/}
                        {
                            showPropertyAddArea === "knowledge" &&
                            <div className={"row mb-5"}>
                                <h6>Beceri Ekle</h6>
                                <div className={"col-md-12"}>
                                    {/*<label className={"labels"}>Ad</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Beceri Adı"}

                                           name={"position"}
                                           value={propertyAdd.position}
                                           onChange={handleChangeProperty}
                                    />
                                </div>
                                <div className={"col-md-12 mt-1"}>
                                    {/*<label className={"labels"}>Okul Adı</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Açıklama (Düzey vs.) "}

                                           name={"organizationName"}
                                           value={propertyAdd.organizationName}
                                           onChange={handleChangeProperty}
                                    />
                                </div>


                                <div className={"col-md-6 col-12  mt-1"}>

                                    {/*<label className={"labels"}>Başlangıç</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Başlangıç"}

                                           name={"startDate"}
                                           value={propertyAdd.startDate}
                                           onChange={handleChangeProperty}
                                    />
                                </div>

                                <div className={"col-md-6 col-12 mt-1 "}>
                                    {/*<label className={"labels"}>Ad</label>*/}
                                    <input type="text" className={"form-control"}
                                           placeholder={"Bitiş"}

                                           name={"endDate"}
                                           value={propertyAdd.endDate}
                                           onChange={handleChangeProperty}
                                    />
                                </div>
                                <div className={"col-12 col-md-6  mt-1 p-1 text-center"}>
                                    <button className={" btn btn-secondary "} onClick={() => {
                                        setShowPropertyAddArea("")
                                    }}>
                                        <FontAwesomeIcon className={"me-1 "} icon={faCancel}/>
                                        Vazgeç
                                    </button>
                                </div>

                                <div className={"col-12 col-md-6  mt-1 p-1 text-center"}>
                                    <button className={" btn btn-success "} onClick={() => {
                                        saveProperty()
                                    }}>
                                        <FontAwesomeIcon className={"me-1"} icon={faSave}/>
                                        Kaydet
                                    </button>
                                </div>
                            </div>

                        }
                        <hr/>
                        <div className="col-md-12">
                            <label className="labels">Kendiniz Hakkında Bilgi Vermek İster Misiniz?</label>

                            <textarea
                                value={userData?.personalInfo}
                                className="form-control"
                                onChange={handleChange}
                                name={"personalInfo"}
                                maxLength={500} // maksimum karakter sayısı
                                rows={5}
                                style={{width: '100%'}} // textarea'nin boyutunu değiştirememe
                            />

                            <div className={"text-end"}>
                                {500- (userData?.personalInfo?.length??0)} kaldı
                            </div>
                        </div>
                    </div>
                </div>

                <div className="form-check">

                    {/*<inputText className="form-check-inputText" type="checkbox" id="flexCheckDefault"/>*/}
                    <input type="checkbox"
                           className={"form-check-input"}
                           id="showMyCVData"
                           name={"showMyCVData"}
                           value={userData.showMyCVData}
                           onChange={handleChangeCheckbox}/>
                    <label className="form-check-label fw-bold" htmlFor="showMyCVData">
                        İş başvurusu yaptığım firmaların bu sayfada paylaştığım bilgilerimi görmesine izin
                        veriyorum.
                    </label>
                </div>
                <div className="mt-5 text-center">
                    <button className="btn btn-primary profile-button" type="button" onClick={() => updateProfile()}>
                        <FontAwesomeIcon icon={faSave} className={`${styles['']} me-2`}/>
                        Kaydet ve Profili İncele
                    </button>
                </div>
            </div>
        </div>
    </div>);
}

export default MyProfileComp;