import React from 'react';
import styles from './style.module.css'
import Link from "next/link";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import TopbarLinkComp from "@/components/topbarLink/TopbarLinkComp";
import SearchBarComp from "@/components/searchBar/SearchBarComp";

function HomePageLinks(props) {
    return (
        <div className={`${styles['homePageLinks']} homePageLinksClass`}>
            <div className={`${styles['']} container`}>

                <TopbarLinkComp/>

                <div className={`${styles['']} w-100 d-flex justify-content-end text-end`}>
                    <span className={`${styles['homePageMessage']} `}>Binlerce Kamu Personeli <span
                        className={'text-decoration-underline fst-italic '}>gys.com</span> İle Hazırlanıyor!</span>
                </div>

                <div className={styles["searchContainer"]}>
                   <SearchBarComp/>
                </div>

                <div className={styles['adLinkGroup']}>
                    {/*<Link href={'/listing?type=employee'} className={styles['link']}>*/}
                    <Link href={'/'} className={styles['link']}>
                        {/*<FontAwesomeIcon className={'me-1'} icon={faClipboardUser}  />*/}
                        YÖK</Link>
                    {/*<Link href={'/listing?type=real_estate'} className={styles['link']}>EMLAK</Link>*/}
                    <Link href={'/'} className={styles['link']}>ADALET BAKANLIĞI</Link>
                    {/*<Link href={'/listing?type=vehicle'} className={styles['link']}>VASITA</Link>*/}
                    <Link href={'/'} className={styles['link']}>SAĞLIK BAKANLIĞI</Link>
                </div>

                {/*<div className={styles['advertiseSearch']+" d-none d-md-flex"}>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Garson</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Tekniker</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Şoför</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Mühendis</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Eğitim</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Perakende</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Temizlik Görevlisi</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Forklift Operatörü</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Vasıfsız Eleman</Link>*/}
                {/*    <Link href={'/listing'} className={styles['link']}>Kaynakçı</Link>*/}


                {/*</div>*/}

            </div>


        </div>
    );
}

export default HomePageLinks;