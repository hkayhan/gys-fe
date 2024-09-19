import React from 'react';
import styles from './styles.module.css'
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Link from "next/link";

function SearchPersonalComp(props) {
    return (
        <div className={styles['searchPersonalMain'] + " container-xl"}>
            <div className="d-flex bg-white border  shadow shadowHoverp-2 rounded align-items-center">
                <div className={"w-50 d-flex justify-content-end"}>
                    <img src={"images/shutterstock_job_interview.jpg"}/>
                </div>

                <div className={"flex-fill p-3 m-auto"}>
                    <h4>SINAVA MI HAZILANIYORSUN?</h4>
                    <div>
                        Binlerce kişi sınava <strong>GYS</strong> ile hazırlandı.
<br/>
                        Hemen sende çalışmaya başla. Hedefine ulaş!
                    </div>
                    <br/>
                    <div> <Link href={"/advert/selectCategory"} className={"btn btn-success"}>Hemen Başla</Link></div>
                </div>

            </div>
        </div>
    );
}

export default SearchPersonalComp;