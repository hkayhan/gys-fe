'use client'
import React, {useEffect, useState} from 'react';
import styles from './styles.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCircleUser, faCommentDots, faStar} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import swal from "sweetalert2";
import Rating from "react-rating-stars-component";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const MySwal = withReactContent(swal);

/*const getComments = async () => {
    const response = await AdminGetRequest("/Comment/GetRandomComments?count=3")
    if (!response.errorMessage) {
            return response.commentVMList
    }

}*/


function CommentsComp(props) {
    const [rating, setRating] = useState(0);
    const [comments, setComments]=useState([])

    const getComments = async () => {
        const response = await ApiGetRequest("/Comment/GetRandomComments?count=3")
        if (!response.errorMessage) {
            setComments(response.commentVMList)
        }
    }

    useEffect(()=>{getComments()},[])
    const sendMessage =async (text, star) => {
        console.log("asdasdasdasd",text, star);

        const response = await ApiPostRequest("/Comment/Add", "", [{
            name: "Message", value: text
        },{
            name: "Star", value: star
        }])

        if (!response.errorMessage){
            await   Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Yorumunuz Başarıyla Gönderildi!",
                showConfirmButton: false,
                timer: 1000
            });
        }


    }
    const openMessageBox = async () => {
           await MySwal.fire({
                title: "Görüşlerinizi paylaşın",
                html: (
                    <div style={{display:"flex", justifyContent:"center", flexDirection:"column", alignItems:"center"}}>
          <textarea
              id="swal-input-textarea"
              placeholder="Görüşlerinizi yazın..."
              rows="4"
              style={{ width: "100%", marginBottom: "10px" }}
          ></textarea>
                        <Rating
                            count={5}
                            size={30}
                            activeColor="#ffd700"
                            value={rating}
                            onChange={(newRating) => {
                                setRating(newRating);
                            }}
                        />
                    </div>
                ),
                showCancelButton: true,
                confirmButtonText: "Gönder",
                cancelButtonText: "İptal",
                preConfirm: () => {
                    const textareaValue = document.getElementById("swal-input-textarea").value;
                    return { textareaValue, rating };
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    console.log(result.value); // textarea ve rating değerlerini burada kullanabilirsiniz
                sendMessage(result.value.textareaValue, result.value.rating)
                }
            });
    }



    // const comments= await getComments()
    // const comments= []

    const countCommentStar = (count) => {
        let starLabel = []
        for (let i = 0; i < count; i++) {

            starLabel.push(<FontAwesomeIcon key={i} className={"text-warning"} icon={faStar}/>
            )
        }

        return starLabel
    }

    const handleClick = () => {
        MySwal.fire({
            title: "Görüşlerinizi paylaşın",
            html: (
                <div>
          <textarea
              placeholder="Görüşlerinizi yazın..."
              rows="4"
              style={{ width: "100%", marginBottom: "10px" }}
          ></textarea>
                    {/*<Rating*/}
                    {/*    count={5}*/}
                    {/*    size={30}*/}
                    {/*    activeColor="#ffd700"*/}
                    {/*/>*/}
                </div>
            ),
            showCancelButton: true,
            confirmButtonText: "Gönder",
            cancelButtonText: "İptal",
            preConfirm: () => {
                // Burada textarea ve rating değerlerini alabilirsiniz
                const textareaValue = document.querySelector("textarea").value;
                const ratingValue = document.querySelectorAll("svg.active").length;
                return { textareaValue, ratingValue };
            },
        }).then((result) => {
            if (result.isConfirmed) {
                console.log(result.value); // textarea ve rating değerlerini burada kullanabilirsiniz
            }
        });
    };


    return (
        <div className={styles['commentsMain'] + '  container-xl '}>
            {/*<div className={"d-flex"}>*/}
            <h3 className={"area-header"}>Sizden Gelenler <i className={"area-header-line"}></i></h3>

            <div className={"d-flex justify-content-end"}>
                <button onClick={openMessageBox} className={"btn btn-sm btn-primary"}><FontAwesomeIcon className={"me-2"} icon={faCommentDots}/> Sende Gönder</button>
            </div>

            <div className={styles['commentsContainer'] + " flex-wrap"}>
                {comments.map((d, index) =>
                    <div key={index} className={styles['commentsCard'] + ' card shadow'}>
                        <div className=" d-flex flex-column">
                            <div className=" p-3">
                                <div className=" d-flex align-items-center">
                                    <div className="me-2">
                                        {
                                            d.profilePhotoBase64 === null && <FontAwesomeIcon size={"2xl"} icon={faCircleUser}/>
                                        }
                                        {
                                            d.profilePhotoBase64 !== null &&
                                            <img src={"data:image/jpeg;base64,"+d.profilePhotoBase64} alt={"..."}/>
                                        }
                                    </div>
                                    <div className="">
                                        <div className="d-flex flex-column justify-content-start ml-2">
                                            <span className="d-block font-weight-bold name">{d.userFirstName} {d.userLastName}</span>
                                            <div className="d-flex flex-row justify-content-start">
                                                {countCommentStar(d.star)}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="comment-text">{d.message}</p>
                                </div>
                            </div>
                        </div>
                    </div>)}

            </div>


        </div>

    );
}

export default CommentsComp;