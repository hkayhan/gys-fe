'use client'
import React, {useEffect, useState} from 'react';
import styles from './QuestionAdd.module.css'
import TextEditorComp from "@/components/textEditor/textEditorComp";
import TextEditor from "@/components/textEditor/textEditorComp";
import SelectBox from "@/FormComponents/selectBox";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSave} from "@fortawesome/free-solid-svg-icons";
import {AdminGetRequest, AdminPostRequest, AdminPostRequestWithJSON, AdminPostRequestWithModel} from "@/services/admin";
import swal from "sweetalert2";
import {useRouter, useSearchParams} from "next/navigation";
import LoadingComp from "@/components/loading/LoadingComp";

function QuestionAddComp(props) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    let id = searchParams.get("id")
    if (!id) {
        id = "0"
    }

    const [question, setQuestion] = useState({})


    const getById = async () => {

        if (!id && id === "0") {
            return
        }
        const res = await AdminGetRequest("/question/getById", "id=" + id)
        console.log(res.result);
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        setQuestion(res.result)
        setIsLoading(true)

    }

    useEffect(() => {
        console.log("get by id", id);
        console.log("get by id", id !== "0");

        if (id && id !== "0") {
            getById()
        } else {
            setIsLoading(true)
        }
    }, [])
    const handleChange = (name, value) => {
        setQuestion((prevValues) => ({
            ...prevValues,
            [name]: value, // Seçilen değeri ilgili selectbox'ın ismi ile state'e kaydediyoruz.
        }));
    };


    const handleChangeEditor = (e) => {
        console.log(e);
        const data = e.editor.getData();
        setQuestion(prevData => ({
            ...prevData, [e.editor.name]: data // checked değerini kullanın
        }));
    };

    const addQuestion = async () => {
        const res = await AdminPostRequestWithModel("question/add", "", question)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Eklendi!",
            showConfirmButton: false,
            timer: 1500
        });

        router.push("/admin/questions")
        router.refresh()

    }

    const updateQuestion = async () => {
        question.difficultLevel = parseInt(question?.difficultLevel)
        const res = await AdminPostRequestWithJSON("question/update", "", question)
        if (res.errorMessage) {
            await swal.fire({title: "Hata", text: res.errorMessage, icon: "error"})
            return
        }
        swal.fire({
            position: "top-end",
            icon: "success",
            title: "Başarıyla Güncellendi!",
            showConfirmButton: false,
            timer: 1500
        });

        router.push("/admin/questions")
        router.refresh()

    }

    if (!isLoading) {
        return <LoadingComp/>
    }
    return (<div className={`${styles['']} container mainContent mt-2`}>
            <h3 className={"border-bottom"}>Soru Ekleme Modülü</h3>
            <h5 className={""}>Soru Kökü</h5>
            <TextEditor name={"question"} onChange={handleChangeEditor} value={question.question}/>
            <br/>
            <h5 className={"mt-2"}>A Şıkkı</h5>
            <TextEditor name={"a"} onChange={handleChangeEditor} value={question.a}/>
            <br/>  <h5 className={"mt-2"}>B Şıkkı</h5>
            <TextEditor name={"b"} onChange={handleChangeEditor} value={question.b}/>
            <br/>   <h5 className={"mt-2"}>C Şıkkı</h5>
            <TextEditor name={"c"} onChange={handleChangeEditor} value={question.c}/>
            <br/>  <h5 className={"mt-2"}>D Şıkkı</h5>
            <TextEditor name={"d"} onChange={handleChangeEditor} value={question.d}/>
            <br/>  <h5 className={"mt-2"}>E Şıkkı</h5>
            <TextEditor name={"e"} onChange={handleChangeEditor} value={question.e}/>
            <br/>  <h5 className={"mt-2"}>Doğru Cevap</h5>
            <TextEditor name={"correctAnswer"} onChange={handleChangeEditor} value={question.correctAnswer}/>

            <br/>  <h5 className={"mt-2"}>Çözüm</h5>
            <TextEditor name={"description"} onChange={handleChangeEditor} value={question.description}/>
            <br/>  <h5 className={"mt-2"}>İlgili Konu</h5>
            <SelectBox name={"topicId"} onChange={handleChange} defaultValue={question.topicId}
                       apiUrl={"/topic/getAll"}/>
            <br/>
            <h5 className={"mt-2"}>Zorluk Derecesi</h5>
            <SelectBox name={"difficultLevel"} onChange={handleChange} defaultValue={question.difficultLevel}
                       apiUrl={"/definition/getByGroup?group=question_level"}/>
            <br/>

            <h5 className={"mt-2"}>Soru Tipi</h5>
            <SelectBox name={"questionTypeId"} onChange={handleChange} defaultValue={question.questionTypeId}
                       apiUrl={"/definition/getByGroup?group=question_type"}/>
            <br/>
            <div className={"d-flex justify-content-center"}>
                <button className="btn btn-success" onClick={() => id === "0" ? addQuestion() : updateQuestion()}>
                    <FontAwesomeIcon icon={faSave} className={"me-1"}/>
                    Kaydet
                </button>
            </div>
            <br/>
            <br/>
        </div>

    );
}

export default QuestionAddComp;