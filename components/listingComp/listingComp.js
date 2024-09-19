"use client"
import React from 'react';
import styles from './listingCompStyles.module.css'
import {
    faChartSimple,
    faEdit,
    faHeart,
    faHourglassHalf,
    faLocationDot, faRemove,
    faUsers
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";
import {useRouter} from "next/navigation";
import swal from "sweetalert2";
import {ApiGetRequest} from "@/services/admin";

// import {useSearchParams} from "next/navigation";

function ListingComp(props) {
    const router = useRouter()
    let {isOwner, adverts} = props
    // let isOwner=true
    let resultData = adverts



    function remainingDays(targetDate) {
        // Assume the target date is provided as a string (e.g., "2024-12-31")
        let currentDate = new Date(); // Current date and time
        let target = new Date(targetDate); // Target date

        // Calculate the difference between dates (in milliseconds)
        let difference = target.getTime() - currentDate.getTime();

        // Convert the difference to days and round up
        return Math.ceil(difference / (1000 * 3600 * 24));
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

    const removeAdvert = async (id) => {
        const swalResult = await swal.fire({
            title: "Dikkat",
            text: "İlanınız Yayından Kaldırılacak. Onaylıyor Musunuz?",
            icon: "warning",
            confirmButtonText: "Onayla",
            showCancelButton: true,
            cancelButtonText: "Vazgeç"
        })
        if (swalResult.isConfirmed) {
          const response = await ApiGetRequest("/Advertisement/UpdateStatus", `advertisementId=${id}&status=passive`)
            if (!response.errorMessage){
                await swal.fire({position:"top-end",
                    icon: "success",
                    title: "İlanınız Yayından Kaldırıldı!",
                    showConfirmButton: false,
                    timer: 1000})
                router.push("/myAdverts")
                router.refresh()
            }
        }
    }
    return (
        <div className={styles['listingMain'] + " container-xl-old mt-3"}>


            <div className={styles['listingItems']}>
                {resultData && resultData.length > 0 && resultData.map((d, index) =>
                    <div key={index}
                         className={styles['listingCard'] + "  card p-3 " + ((d.isHighlight === true || d.isShowcase === true) ? styles["listingCardBackground"] : "")}>

                        <div className={"flex-grow-1 me-2"}>
                            <Link target={"_blank"}
                                  href={`/ilan/detay/${d["advertisementTitle"].replace(" ", "-")}/${d.advertisementId}/?id=${d.advertisementId}`}>
                                <h6 className="card-title ">{d["advertisementTitle"]}-{d["companyName"]}</h6>
                                <div className={"text-muted fst-italic mb-2"}>

                                <span
                                    className={"ms-2"} title={"İlan Oluşturulma Tarihi"}>{d.advertisementCreatedAt} </span>
                                </div>
                            </Link>


                            {
                                isOwner &&
                                <div className={""}>
                                    <hr/>
                                    {
                                        d.statusValue === "Ödeme Bekliyor" ?
                                            <Link href={"/payment?id=" + d.advertisementId + "&paymentType=doping"}
                                                  title={"Başvuran Kişi Sayısı"}
                                                  className={`${styles['hoverRed']}  text-danger`}><FontAwesomeIcon
                                                icon={faChartSimple}/> {d.statusValue}</Link>
                                            :
                                            <span title={"İlan Durumu"}
                                                  className={`${styles['hoverRed']} `}>
                                        <FontAwesomeIcon
                                            icon={faChartSimple}/> {d.statusValue}</span>

                                    }


                                    {remainingDays(d.adEndDate) > 0 && <span title={"İlanın Kalan Gün Sayısı"}
                                                                             className={`${styles['hoverRed']} ms-4`}><FontAwesomeIcon
                                        icon={faHourglassHalf}/> {remainingDays(d.adEndDate)} Gün Kaldı</span>}
                                    <Link href={"/applicants?id=" + d.advertisementId} title={"Başvuran Kişi Sayısı"}
                                          className={`${styles['hoverRed']} ms-2 border-start ps-2`}><FontAwesomeIcon
                                        icon={faUsers}/> {d.applicantCount}</Link>

                                    <span title={"Favoriye Ekleyen Kişi Sayısı"}
                                          className={`${styles['hoverRed']} ms-2 border-start ps-2`}><FontAwesomeIcon
                                        icon={faHeart}/> {d.favoriteCount}</span>

                                    <Link href={"/advert/addAdvert?id=" + d.advertisementId} title={"İlanı Düzenle"}
                                          className={`${styles['hoverRed']} ms-2 border-start ps-2`}><FontAwesomeIcon
                                        icon={faEdit}/> İlanı Düzenle</Link>

                                    <span onClick={() => removeAdvert(d.advertisementId)}  className={`${styles['hoverRed']} ms-2 border-start ps-2`}><FontAwesomeIcon
                                        icon={faRemove} className={""}/> Yayından Kaldır</span>

                                </div>
                            }
                        </div>

                        <img width={80} height={80}
                             src={d.advertisementPhotoBase64 ? "data:image/jpeg;base64," + d.advertisementPhotoBase64 : "/images/logo.svg"}/>


                    </div>
                )}
            </div>


        </div>
    );
}

export default ListingComp;