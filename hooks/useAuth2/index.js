'use client'
import { useState, useEffect } from 'react';
import Cookies from "universal-cookie";
import {verifyJwtToken} from "@/libs/auth";

const UseApiWithJwt = () => {
    const [auth, setAuth] = useState(null);

    useEffect(() => {

        // //console.log("run UseApiWithJwt 1");
        // //console.log(url);
        // //console.log(jwtToken);
        const getVerifiedToken = async () => {
          const cookies = new Cookies();
          const token = cookies.get("token") ?? null;
          const verifiedToken = await verifyJwtToken(token);
          console.log("verifiedToken?.props?.data :",verifiedToken);
          // console.log();
            if (verifiedToken == null){
                console.log("cookie temizle in getVerifiedToken");
                cookies.remove("token2")

            }
          setAuth(verifiedToken);
        };

        getVerifiedToken()
        // const fetchData = async () => {
        //     try {
        //         const response = await fetch(url, {
        //             method: 'GET',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 Authorization: `Bearer ${jwtToken}`,
        //             },
        //         });
        //
        //         if (!response.ok) {
        //             throw new Error('Failed to fetch data');
        //         }
        //
        //         const result = await response.json();
        //         setData(result);
        //     } catch (err) {
        //         setError(err.message);
        //     }
        // };

        // fetchData();
    }, []);

    return { auth };
};

export default UseApiWithJwt;
