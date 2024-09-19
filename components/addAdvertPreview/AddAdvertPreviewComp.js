'use client'
import React, {useState} from 'react';
import styles from "./style.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAnglesRight, faArrowLeft,
    faBolt, faBuilding,
    faCalendarDays,
    faCheck, faEnvelope,
    faLocationDot,
    faMarsAndVenus,
    faPeopleGroup, faPhone, faShare
} from "@fortawesome/free-solid-svg-icons";
import {faClock} from "@fortawesome/free-solid-svg-icons/faClock";
import {useRouter, useSearchParams} from "next/navigation";
import ListingDetailComp from "@/components/listingDetail/listingDetailComp";
import {ApiGetRequest} from "@/services/admin";
import swal from "sweetalert2";
import CheckBox from "@/FormComponents/checbox/CheckBox";
import Link from "next/link";
import Swal from "sweetalert2";
import AddAdvertStepsComp from "@/components/addAdvertSteps/AddAdvertStepsComp";

function AddAdvertPreviewComp(props) {
    const searchParams = useSearchParams()
    const advertId = searchParams.get("id")
    if (advertId === null) {
        return (<div>Hata !!!</div>)
    }
    const router = useRouter()
    const [confirmRules, setConfirmRules] = useState(false)

    const approveAdvert = async () => {
        // @see: https://github.com/vercel/next.js/discussions/44149
        // const response = await AdminGetRequest("/Advertisement/UpdateStatus", `advertisementId=${advertId}&status=waiting_payment`)
        const response = await ApiGetRequest("/Advertisement/UpdateStatus", `advertisementId=${advertId}&status=waiting_payment_approve `)
        if (!response.errorMessage) {
            // await swal.fire({title:"Başarılı", text:"Başarıyla Güncellendi", icon:"success"})
            await swal.fire({
                position: "top-end",
                icon: "success",
                title: "Başarıyla Eklendi!",
                showConfirmButton: false,
                timer: 1000
            });
            router.push("/payment?id=" + advertId + "&paymentType=doping");
            router.refresh();
        }
    }

    const handleChangeCheckbox = (e) => {
        setConfirmRules(e.target.checked)
    }

    const openModal = async () => {
        const result = await Swal.fire({
            title: "<strong>İlan Oluşturma Kuralları</strong>",
            icon: "info",
            width: "80%",
            html: `   <div style="text-align:start;">

                <ol >
                    <li style="margin-bottom:5px;">Kullanıcıların Eskisehir.net İş İlanları kategorisinde 30 gün içerisinde bir adet ücretsiz ilan
                        paylaşma hakkı vardır. Üyenin ilk ilanını oluşturduğu andan itibaren 30 gün içerisinde vereceği
                        diğer iş ilanları yayın onayı beklenmeksizin ücrete tabi tutulur.
                    </li>
                     <li style="margin-bottom:5px;">Kullanıcılar Eskisehir.net üzerinden vereceği ilanlarda; birden fazla ilana yönelik içerik ve
                        başlık girişi yapamaz. Paylaşılan tüm ilanlar yalnızca tek bir kategori ve konu üzerine olmak
                        zorundadır. Aksi durumlarda ilanınız yayın onayı alamaz.
                    </li>
                    <li style="margin-bottom:5px;">İlan başlığı ve ilan açıklaması alanlarında yalnızca ilgili ilanın kapsamı dahilinde bilgiler
                        yer almalıdır. Söz konusu alanlara reklam içerikli yazı veya görsel ile herhangi bir link vs.
                        eklenemez.
                    </li>
                    <li style="margin-bottom:5px;">Yayınlanmak istenen ilanlarda kullanılan tüm görsel ve videolar doğrudan ilan konusu ile ilgili
                        olmalıdır.
                    </li>
                    <li style="margin-bottom:5px;">İlan veren üye doğru bilgiler paylaşmak ile yükümlüdür. İlanda yer alan bilgilerin hatalı veya
                        yanlış olması durumlarında tüm yasal sorumluluk ilan sahibine aittir.
                    </li>
                    
                    <li style="margin-bottom:5px;">Özel İlan ödemeleri banka hesabına havale/eft veya kredi kartı ile yapıldıktan ve ilan
                        koşullarına uygunluğu denetlendikten sonra yayınlanır.
                    </li>
                    <li style="margin-bottom:5px;">Özel ilanlar yayınlandıktan sonra ilan veren üye tarafından özel ilan süresi dolmadan silinmesi
                        veya ilan içerisinde yapılacak herhangi bir değişikliğe bağlı olarak ilan kurallarının ihlal
                        edilmesi durumlarında ücret iadesi yapılmaz.
                    </li>
                    <li style="margin-bottom:5px;">Özel ilanlar dışındaki hiçbir ilan görselinde farklı internet sitelerinin link ya da isimleri
                        yer alamaz.
                    </li>
                    <li style="margin-bottom:5px;">Sistem içerisindeki bir başka kullanıcıya ait ilan ilan görselleri veya kişisel bilgiler
                        kullanılamaz.
                    </li>
                    <li style="margin-bottom:5px;">Özel ilanlarda tanımlanan süre yalnızca ilgili ilan için geçerlidir. Söz konusu süre
                        dondurulamaz veya başka bir ilana ya da üyeye devredilemez.
                    </li>
                    <li style="margin-bottom:5px;">Aynı ilan birden fazla kez girilemez. Bir kez girilen ilan yayın süresi dolmadan silinir ve
                        tekrar aynısı girilirse; üyeye ait tüm ilanlar sıralamada en sonda gösterilir. Gerekli görüldüğü
                        takdirde üyenin tüm ilanları eskisehir.net tarafından silinebilir veya üyeliği geçici ya da
                        kalıcı olarak iptal edilebilir.
                    </li>
                    <li style="margin-bottom:5px;">İlan içeriğinde düzgün Türkçe kullanılarak açıklayıcı bilgiler paylaşılmalıdır. Ayrıca hakaret
                        küfür aşağılayıcı ya da küçük düşürücü ifadeler ve benzerlerinin yer aldığı veya toplumsal
                        ahlaki kurallara aykırı hiçbir ilan yayınlanmaz.
                    </li>
                    <li style="margin-bottom:5px;">İlan Veren” alanında üyeye ait telefon ve e-posta bilgileri gösterildiğinden “İlan Açıklama”
                        kısmında bu bilgilerin paylaşılmasına gerek yoktur. Kurumlar tarafından verilen ilanlarda ilgili
                        kurumun iletişim bilgileri “İlan Açıklama” alanında paylaşılabilir fakat internet sayfasına
                        ilişkin bilgiler –özel ilan değilse – verilemez.
                    </li>
                    <li style="margin-bottom:5px;">Verilen ilanlar 30 gün süre ile yayında kalır. Bu sürenin sonunda sistem tarafından otomatik
                        olarak silinir.
                    </li>
                   
                    <li style="margin-bottom:5px;">Emlak ve Vasıta kategorilerinde yer alacak tüm ilanlar mal sahibi tarafından veya mal sahibinin
                        onayı alınarak girilmelidir.
                    </li>
                    <li style="margin-bottom:5px;">Alışveriş kategorisinde yer alacak ilana konu olan tüm araç ürün eşya vs. girişleri mutlaka mal
                        sahibinin onayı alınarak yapılmalıdır.
                    </li>
                    <li style="margin-bottom:5px;">Satılan ya da kiralanan hiçbir ürün eşya araç konut vb. için temsili fiyat verilmemesi
                        gerekmektedir.
                    </li>
                    <li style="margin-bottom:5px;">İlan aktifliğini yitirdiği an üye tarafından sistemden kaldırılmalıdır. Satışı yapılan veya
                        kiralanan ürün eşya araç konut vb. ilanlarının kaldırılması tamamen üye sorumluluğundadır.
                    </li>
                </ol>
                <p style="color: #c00;  border:1px solid red; padding:13px" ><strong className={styles["note-strong"]}>Önemli Not</strong><br/>İlan Verme Kurallarına aykırı özel ilanlar silinir
                    ve ücret iadesi yapılmaz.<br/>İlan Verme Kuralları hem bireysel hem kurumsal üyelerimiz için
                    geçerlidir.<br/>İlan girişinde bulunan üye yukarıda belirtilen kuralları okuyup anladığını ve bu
                    kurallara uyacağını kabul ve taahhüt etmiş bulunur.</p>
        </div>`,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: 'Onayla',
            cancelButtonText: "Vazgeç",
        });

        if (result.isConfirmed) {
            setConfirmRules(true)
        } else {
            setConfirmRules(false)
        }
    }

    return (
        <div className={`${styles['']} mainContent container `}>
            <AddAdvertStepsComp count={4}/>

            <div>
                <h5 className={"mt-3 alert alert-primary"}>İlanınız ödeme aşamasını tamamladıktan sonra moderatör onayına
                    gönderilecektir</h5>
                <h5 className={"alert alert-primary"}>İlanınız onaylandıktan sonra size E-Posta ve SMS yoluyla bildirim
                    gelecektir.</h5>

                <div className={`${styles['addAdvertPreview']} d-flex mainContent container border p-2 shadow  rounded`}>
                    {/*<div className={"waterMark"}>*/}
                    {/*    ÖNİZLEME*/}
                    {/*</div>*/}

                    <ListingDetailComp advertId={advertId}/>

                </div>

                <div
                    className={"mt-3 mb-3 d-flex  align-items-end justify-content-start bg-white rounded shadow shadowHover p-3"}>
                    <div className={"flex-fill"}><Link href={"/advert/addAdvertProperty?id=" + advertId}
                                                       className={`${styles['']}  btn btn-secondary me-3 `}>
                        {/*<button onClick={() => addSocialMediaText()} className={`${styles['']} btn btn-success `}>*/}
                        <FontAwesomeIcon className={"me-2"} icon={faArrowLeft}/>Geri Dön
                    </Link></div>

                    <div className={"flex-fill d-flex flex-column align-item-center"}>
                        <div className={"my-2"}>
                            <CheckBox label={"İlan oluşturma kurallarını okudum."} name={"isActive"}
                                      value={confirmRules} onChange={() => openModal()}/>
                            {/*<Link href={"/"}>İlan verme kurallarını okudum.</Link>*/}
                            {/*<Link href={"/advertRules"} target={"_blank"} className={"text-underline text-primary"}>İlan*/}
                            {/*    oluşturma kurallarını okudum.</Link>*/}

                        </div>
                        <div>
                            <button onClick={() => approveAdvert()} className={`${styles['']} btn btn-success mt-2 `}
                                    disabled={!confirmRules}>
                                <FontAwesomeIcon className={"me-2"} icon={faAnglesRight}/>Ödeme Sayfasına Git
                            </button>
                        </div>

                    </div>


                </div>

            </div>
        </div>
    );
}

export default AddAdvertPreviewComp;
