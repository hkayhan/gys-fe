'use client'
import React, {useEffect} from 'react';
import Cookies from "universal-cookie";
import {useRouter} from "next/navigation";
import LoadingComp from "@/components/loading/LoadingComp";

function LogoutComp(props) {
    const router = useRouter()

    useEffect(() => {
            //console.log("cookie temizle");
            const cookies = new Cookies();
            console.log("token removed in logout comp");
            cookies.remove("token")
            router.push("/");
            router.refresh();


        }
    )

    return (
        <div><LoadingComp text={"Çıkış Yapılıyor"}/></div>
    );
}

export default LogoutComp;