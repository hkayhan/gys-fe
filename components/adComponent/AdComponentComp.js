'use client'
import React, {useEffect} from 'react';
import styles from './AdComponent.module.css'

const AdComponent = ({ adScript, adType }) => {
    console.log(adScript);
    console.log(adType);
    useEffect(() => {
        let script;

        if (adType === 'adm') {
            script = document.createElement('script');
            script.src = 'https://static.cdn.admatic.com.tr/showad/showad.min.js';
            script.async = true;
        } else if (adType === 'adsense') {
            script = document.createElement('script');
            script.async = true;
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

            script.onload = () => {
                try {
                    (window.adsbygoogle = window.adsbygoogle || []).push({});
                } catch (e) {
                    console.error('AdSense script loading error:', e);
                }
            };
        }

        document.body.appendChild(script);

        return () => {
            if (script) {
                document.body.removeChild(script);
            }
        };
    }, [adType]);

    useEffect(() => {
        if (adType === 'adsense' && window.adsbygoogle) {
            try {
                window.adsbygoogle.push({});
            } catch (e) {
                console.error('AdSense script execution error:', e);
            }
        }
    }, [adScript, adType]);

    return <div dangerouslySetInnerHTML={{ __html: adScript }} />;
};
export default AdComponent;