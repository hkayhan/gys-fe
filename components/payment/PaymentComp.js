'use client'
import React, {useEffect, useState} from 'react';
import styles from './Payment.module.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCancel,
    faCreditCard,
    faMoneyBill1Wave,
    faSave,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import {useRouter, useSearchParams} from "next/navigation";
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import Swal from "sweetalert2";
import swal from "sweetalert2";
import Link from "next/link";
import AddAdvertStepsComp from "@/components/addAdvertSteps/AddAdvertStepsComp";

function PaymentComp(props) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const paymentType = searchParams.get("paymentType")
    const advertId = searchParams.get("id")
    const packetUid = searchParams.get("packetUid")
    const nextUrl = searchParams.get("next")
    if (!paymentType) {
        return (<div>Hata!!!</div>)
    }

    const [selectedPaymentType, setSelectedPaymentType] = useState("")
    const [paymentList, setPaymentList] = useState([])
    const [paymentData, setPaymentData] = useState([])
    const [packetData, setPacketData] = useState([])
    const [referenceNumber, setReferenceNumber] = useState("")
    const [isLoading, setIsLoading] = useState(false)


    const getAdvertData = async () => {
        const response = await ApiGetRequest("/Payment/GetAdvertisementPayments", `advertisementId=${advertId}&status=waiting`)
        if (!response.errorMessage) {
            setPaymentList(response.paymentVMList)
            setPaymentData(response)
            if (response.totalAmount === 0) {
                await addDopingBankTransfer()
                // await swal.fire({title:"Onay Sürecinde",text:"İlanınız için gerekli adımları tamamladınız. Onay işlemleri tamamlandıktan sonra ilanınız yayına alınacaktır.Süreci E-posta bildirimleri ile takip edebilirsiniz.",icon:"success" })

                router.push("/myAdverts")
                router.refresh()
            }
        }
        //console.log(response);
    }

    const startPayment = async () => {
        let formDataArr = []
        let paymentUrl = ""

        if (paymentType === "doping") {
            paymentUrl = "/Iyzico/AdvertisementPayment"
            formDataArr.push({
                name: "advertisementId", value: advertId
            })
        } else if (paymentType === "packet") {
            paymentUrl = "/Iyzico/PackagePayment"
            formDataArr.push({
                name: "packageUId", value: packetUid
            })
        }


        const responseStart = await ApiPostRequest(paymentUrl, "", formDataArr)
        console.log(responseStart);
        if (responseStart.errorMessage) {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
            return
        }

        // window.open('https://sandbox-cpp.iyzipay.com?token=dfb473da-35cd-490d-abd0-10a222daa912&lang=tr', 'popUpWindow', 'height=600,width=800,left=10,top=10,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no,status=yes');

        // let url = "https://sandbox-cpp.iyzipay.com?token=dfb473da-35cd-490d-abd0-10a222daa912&lang=tr"
        let url = responseStart.checkoutFormUrl
        await Swal.fire({
            html: `<iframe src="${url}" width="100%" height="600px" style="border:0;"></iframe>`,
            showCloseButton: true,
            showConfirmButton: false,
            width: '80%',
            heightAuto: true,
        });

        if (paymentType === "doping") {
            router.push("/myAdverts")
            router.refresh()
        } else if (paymentType === "packet") {

            console.log("ödeme modalı kapandı")

            router.push(nextUrl + "?id=" + advertId)
            router.refresh()
        }

        // await     Swal.fire({
        //     title: 'Ödeme Sayfası',
        //     html: `<iframe id="payment-iframe" src="${url}" width="100%" height="400px" style="border:0;"></iframe>`,
        //     showCloseButton: true,
        //     showConfirmButton: false,
        //     width: '80%',
        //     heightAuto: false,
        //     didOpen: () => {
        //         const iframe = document.getElementById('payment-iframe');
        //         iframe.onload = () => {
        //             const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        //             const style = document.createElement('style');
        //             style.textContent = `
        //     body {
        //       background-color: lightgray;
        //     }
        //     .logo{
        //         height:26px;
        //         }
        //     /* Diğer CSS kuralları */
        //   `;
        //             iframeDocument.head.appendChild(style);
        //         };
        //     }
        // });

        /*const response = await AdminPostRequest("/Payment/GetAdvertisementPayments", `advertisementId=${advertId}&status=waiting`)
        if (response.errorMessage === null) {
            const advertisementPriceIds = [];

            response.paymentVMList.forEach(item => {
                advertisementPriceIds.push(item.advertisementPriceId);
            });


            handleSelectMultiple(advertisementPriceIds)
        }*/

    }

    const addBankTransfer = async () => {
        if (paymentType === "packet") {
            await addPacketBankTransfer()
        } else {
            await addDopingBankTransfer()
        }
    }

    const addPacketBankTransfer = async () => {
        //console.log("buırada 1");

        let formDataArray = []


        formDataArray.push({
            name: "uid",
            value: packetUid
        })

        formDataArray.push({
            name: "AdvertisementId",
            value: advertId
        })
        const response = await ApiPostRequest("/Payment/BuyPackagePaymentByUId", "", formDataArray)
        if (!response.errorMessage) {
            /*      await Swal.fire({
                      title: "Başarılı",
                      text: "Ödeme bilgileri başarıyla eklendi. Yönetici onayından sonra ilanınız yayına alınacaktır.",
                      icon: "success"
                  })*/
            await swal.fire({
                title: "Onay Sürecinde",
                // text:"İlanınız için gerekli adımları tamamladınız. Onay işlemleri tamamlandıktan sonra ilanınız yayına alınacaktır.Süreci E-posta bildirimleri ile takip edebilirsiniz.",
                html: "<p>Paket alım işlemini tamaladınız. <br/><br/>Onay işlemleri tamamlandıktan sonra paket içeriğinizi kullanabileceksiniz.<br/><br/>Süreci <strong>E-posta bildirimleri</strong> ile takip edebilirsiniz.</p>",
                confirmButtonText: "İlanlarım'a Git",
                icon: "success",
                denyButtonText:"Tamam"
            })

            router.push(nextUrl ?? "/myAdverts")
            router.refresh()
        }
    }
    const addDopingBankTransfer = async () => {
        //console.log("buırada 1");

        let formDataArray = []

        /*      if (referenceNumber === "") {
                  await Swal.fire({
                      title: "Hata",
                      text: "Referans Alanı Girilmelidir!",
                      icon: "error"
                  })
              }*/
        formDataArray.push({
            name: "ReferenceNumber",
            value: referenceNumber
        })

        formDataArray.push({
            name: "AdvertisementId",
            value: advertId
        })
        const response = await ApiPostRequest("/Payment/UpdatePaymentBankTransfer", "", formDataArray)
        if (!response.errorMessage) {
            /*      await Swal.fire({
                      title: "Başarılı",
                      text: "Ödeme bilgileri başarıyla eklendi. Yönetici onayından sonra ilanınız yayına alınacaktır.",
                      icon: "success"
                  })*/
            await swal.fire({
                title: "Onay Sürecinde",
                // text:"İlanınız için gerekli adımları tamamladınız. Onay işlemleri tamamlandıktan sonra ilanınız yayına alınacaktır.Süreci E-posta bildirimleri ile takip edebilirsiniz.",
                html: "<p>İlanınız için gerekli adımları tamamladınız. <br/><br/>Onay işlemleri tamamlandıktan sonra ilanınız yayına alınacaktır.<br/><br/>Süreci <strong>E-posta bildirimleri</strong> ile takip edebilirsiniz.</p>",
                confirmButtonText: "İlanlarım'a Git",
                icon: "success"
            })

            router.push("/myAdverts")
            router.refresh()
        }
    }
    const getPacketData = async () => {
        const response = await ApiPostRequest("/PackagePayment/GetPackageByPackagePaymentUId", `uid=${packetUid}`)
        if (!response.errorMessage) {
            setPacketData(response.package)
        } else {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
            return
        }
        setIsLoading(true)
    }

    useEffect(() => {
        if (paymentType === "doping") {
            getAdvertData()
        } else if (paymentType === "packet") {
            getPacketData()
        }
    }, [paymentType])


    return (
        <div className={`${styles['']} container  `}>
            <AddAdvertStepsComp count={5}/>
<div className={"mainContent bg-white rounded mt-3 mb-3 p-3 d-flex flex-column"}>
    {paymentType === "doping" &&
        <h4 className={"text-center"}><span
            className={"text-danger "}>{
            paymentList && paymentList.length > 0 && (paymentList[0].advertisementTitle + "(" + advertId + ")")
        } </span> başlıklı
            ilan için
            ödeme tutarı aşağıdadır.</h4>
    }

    {paymentType === "packet" &&
        <h4 className={"text-center"}><span
            className={"text-danger "}>Paket</span> ödeme tutarı aşağıdadır.</h4>
    }
    <hr/>
    <div className="d-flex justify-content-center">
        {paymentType === "doping" && <div className={"col-md-6 col-12"}>
            {paymentList && paymentList.map((p, index) =>
                <div className={"bg-light mt-1 p-2 rounded d-flex justify-content-between"} key={index}>
                    <div>
                        {p.priceType}
                    </div>
                    <div>
                        {
                            p.transferAmount
                        }₺
                    </div>
                </div>)}
            {paymentData &&
                <div className={"bg-light mt-1 p-2 rounded  border mt-3 shadow"}>

                    <div className={"d-flex flex-wrap  justify-content-between"}>
                        <div className={"fw-bold "}>
                            Toplam (KDV Dahil)
                        </div>
                        <div className={""}>
                            {
                                paymentData.totalAmount
                            }₺

                        </div>
                    </div>

                    <hr/>
                    <div className={"d-flex flex-wrap  justify-content-between"}>

                        <div className={"fw-bold "}>
                            Havale/EFT İndirimi
                        </div>
                        <div className={""}>
                            {
                                paymentData.totalDiscountedAmount
                            }₺

                        </div>
                    </div>
                </div>}
        </div>}

        {paymentType === "packet"
            &&
            <div className={"col-md-6 col-12"}>

                <div className={"bg-light mt-1 p-2 rounded  border mt-3 shadow"}>

                    <div className={"d-flex flex-wrap  justify-content-between"}>
                        <div className={"fw-bold "}>
                            Toplam (KDV Dahil)
                        </div>
                        <div className={""}>
                            {
                                packetData.price
                            }₺

                        </div>
                    </div>

                    <hr/>
                    <div className={"d-flex flex-wrap  justify-content-between"}>

                        <div className={"fw-bold "}>
                            Havale/EFT İndirimi
                        </div>
                        <div className={""}>
                            {
                                packetData.price * (100 - packetData.discountPercentage) / 100
                            }₺

                        </div>
                    </div>
                </div>
            </div>

        }

    </div>


    {/*<h6 className={"text-center mt-2"}>Ödenmesi gereken tutar : 300&#8378;</h6>*/}

    {
        selectedPaymentType === "" &&
        <div className={"m-auto"}>
            <h5 className={"text-center mb-2"}>Ödeme Yöntemini Seçin</h5>
            <div className={"d-flex justify-content-center "}>
                <button onClick={() => {
                    // setSelectedPaymentType("creditCard")
                    startPayment()
                }} className={"btn btn-primary me-3"}>
                    <FontAwesomeIcon className={"me-2"} icon={faCreditCard}/>
                    Kredi Kartı
                </button>
                <button onClick={() => setSelectedPaymentType("havale")} className={"btn btn-warning"}>
                    <FontAwesomeIcon className={"me-2"} icon={faMoneyBill1Wave}/>
                    Havale
                </button>

            </div>

        </div>
    }

    {
        selectedPaymentType === "havale" &&
        <div className={"text-center mt-4"}>
            <h6>Havale İçin Aşağıdaki Iban Numarısını Kullanabilirsiniz</h6>
            <h6 className={"fw-bold mt-3"}>TR11110000111100001111000</h6>

            {advertId > 0 && paymentType !== "packet" && <>
                <h6 className={"mt-4"}>Ödemeyi yaparken Açıklama kısmına ilan numranızı ekleyiniz.</h6>
                <h6 className={"mt-4"}>İlan numaranız <strong>{advertId}</strong></h6>
            </>}

            <h6 className={"mt-4"}>Ödemeyi tamamladıktan sonra aşağıdaki "Tamamladım" butonuna basarak ödeme
                işlemini tamamlamanız gerekmektedir.</h6>


            {/*<form action="" className={styles['']}>*/}
            {/*<label htmlFor="receiptNumber">Dekont Numarası </label>*/}
            {/*
                    <div>
                        <input type="text" placeholder={"Dekont Numarası"}
                               onChange={(e) => setReferenceNumber(e.target.value)}
                               value={referenceNumber}
                               name={"receiptNumber"}/>
                    </div>
*/}


            {/*</form>*/}
            <button onClick={() => setSelectedPaymentType("")} className={"btn btn-danger mt-3 me-3"}>
                <FontAwesomeIcon className={"me-2"} icon={faCancel}/> İptal
            </button>
            <button onClick={() => {

                addDopingBankTransfer()
            }} className={"btn btn-success mt-3"}><FontAwesomeIcon className={"me-2"}
                                                                   icon={faSave}/> Tamamladım
            </button>


        </div>

    }


    {/*{*/}
    {/*    selectedPaymentType === "creditCard" &&*/}
    {/*    <div className={"text-center mt-4 border rounded p-5"}>*/}
    {/*        <h6>Kart bilgilerine göre bu alan düzenlenecek</h6>*/}
    {/*        <button onClick={() => setSelectedPaymentType("")} className={"btn btn-danger mt-3 me-3"}>*/}
    {/*            <FontAwesomeIcon className={"me-2"} icon={faCancel}/> İptal*/}
    {/*        </button>*/}
    {/*        <button className={"btn btn-success mt-3"}><FontAwesomeIcon className={"me-2"}*/}
    {/*                                                                    icon={faSave}/> Kaydet*/}
    {/*        </button>*/}

    {/*    </div>*/}

    {/*}*/}

    {paymentType==="doping"&&<div><Link href={"/advert/addAdvertPreview?id=" + advertId}
                                        className={`${styles['']} btn btn-secondary me-3 `}>
        {/*<button onClick={() => addSocialMediaText()} className={`${styles['']} btn btn-success `}>*/}
        <FontAwesomeIcon className={"me-2"} icon={faArrowLeft}/>Geri Dön
    </Link></div>}
</div>

        </div>

    );
}

export default PaymentComp;