import React from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faWhatsapp, faTwitter, faFacebook, faInstagram, faXTwitter} from '@fortawesome/free-brands-svg-icons';
import ReactDOM from 'react-dom';
import {faCopy, faShare, faX} from "@fortawesome/free-solid-svg-icons";

const ShareAdvertComp = () => {
    const MySwal = withReactContent(Swal);
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

    const handleShareClick = () => {
        const shareContentWrapper = document.createElement('div');

        ReactDOM.render(
            <div style={{ display: 'flex', justifyContent: 'space-evenly', borderTop:"1px solid", padding:"25px" }}>
                <button className="share-btn text-success" id="whatsapp-share">
                    <FontAwesomeIcon icon={faWhatsapp} size="2x" />
                </button>
                <button className="share-btn " id="twitter-share">
                    <FontAwesomeIcon icon={faXTwitter} size="2x" />
                </button>
                <button className="share-btn text-primary" id="facebook-share">
                    <FontAwesomeIcon icon={faFacebook} size="2x" />
                </button>
                <button className="share-btn text-secondary" id="instagram-share">
                    <FontAwesomeIcon icon={faCopy} size="2x" />
                </button>
            </div>,
            shareContentWrapper
        );

        MySwal.fire({
            title: 'İlanı Paylaş',
            html: shareContentWrapper.innerHTML,
            showConfirmButton: false,
            didOpen: () => {
                document.getElementById('whatsapp-share').addEventListener('click', () => {
                    window.open(`https://wa.me/?text=${encodeURIComponent(currentUrl)}`, '_blank');
                });
                document.getElementById('twitter-share').addEventListener('click', () => {
                    window.open(`https://twitter.com/share?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(document.title)}`, '_blank');
                });
                document.getElementById('facebook-share').addEventListener('click', () => {
                    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
                });
                document.getElementById('instagram-share').addEventListener('click', () => {
                    navigator.clipboard.writeText(currentUrl).then(() => {
                        MySwal.fire('Link kopyalandı!', '', 'success');
                    });
                });
            }
        });
    };

    return (
        <div onClick={handleShareClick}>
           <FontAwesomeIcon icon={faShare} className={"me-0"}/> <span className={"d-none d-md-inline"}>Paylaş</span>
        </div>
    );
};

export default ShareAdvertComp;
