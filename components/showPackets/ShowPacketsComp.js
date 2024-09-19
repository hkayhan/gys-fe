'use client'
import React, {useEffect, useState} from 'react';
import styles from './ShowPackets.module.css'
import {ApiGetRequest, ApiPostRequest} from "@/services/admin";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import Swal from "sweetalert2";

function ShowPacketsComp(props) {
    const router = useRouter()
    const [packets, setPackets] = useState([])
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const advertId = searchParams.get("id")

    const getPackets = async () => {
        const response = await ApiGetRequest("/Package/GetPackageList")
        if (response.errorMessage === null) {
            setPackets(response.packageVMList)
        }

    }

    useEffect(() => {
        getPackets()
    }, [])

    const selectPacket = async (packetId) => {
        const response = await ApiPostRequest("/PackagePayment/Add", "", [{
            name: "PackageId", value: packetId
        }])

        if (response.errorMessage) {
            await Swal.fire({title:"Hata", text:response.errorMessage,icon:"error",denyButtonText:"Tamam"})
            return
        }


        // console.log(response)
        router.push("/payment?packetUid="+response.packagePayments.uid+"&paymentType=packet&id="+advertId+"&next="+pathname)
        router.refresh()
    }

    return (
        <div className={`${styles['']} container`}>
            <div className="row">
                {packets.map((p, index) =>
                    <div onClick={() => selectPacket(p.id)} key={index}
                         className={`${styles['packetItem']}  pointer col-12 col-sm-6 col-md-4 rounded`}>
                        <img className={`${styles['packetImage']} p-0 rounded shadowHover`}
                             src={p.imageBase64 ?"data:image/png;base64, " + p.imageBase64:"/images/no_image.jpg"}
                             alt=""/>
                    </div>)}

            </div>
        </div>

    );
}

export default ShowPacketsComp;