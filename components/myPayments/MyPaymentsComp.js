import React from 'react';
import styles from './MyPayments.module.css'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAddressCard} from "@fortawesome/free-solid-svg-icons";

function MyPaymentsComp(props) {

    return (
        <div className={`${styles['']} container mainContent mt-3`}>
            <h4>Ödemeleriniz</h4>
            {/*<h6 className={"fst-italic"}>Bu alanda alanda yalnızca aktif ilanlr gözükmektedir.</h6>*/}
            <hr/>
            <br/>
            <table className=" table table-striped text-center">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">İlan Adı</th>
                    <th scope="col">Ödeme Tarihi</th>
                    <th scope="col">Tutar</th>
                </tr>
                </thead>
                <tbody>
                <tr >
                    <th scope="row">1</th>
                    <td>Kaynakçı Aranıyor</td>
                    <td>22/11/2023</td>
                    <td>300₺</td>
                </tr>
                <tr >
                    <th scope="row">2</th>
                    <td>Garson Aranıyor</td>
                    <td>22/11/2023</td>
                    <td>500₺</td>
                </tr>
                <tr >
                    <th scope="row">3</th>
                    <td>Sekreter Aranıyor</td>
                    <td>22/11/2023</td>
                    <td>450₺</td>
                </tr>
                </tbody>
            </table>
        </div>

    );
}

export default MyPaymentsComp;