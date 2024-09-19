'use client'
import React, {useEffect, useState} from 'react';
import styles from './Settings.module.css'
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCancel, faSave, faXmark} from "@fortawesome/free-solid-svg-icons";
import VitrinComp from "@/components/settings/vitrin/VitrinComp";
import HighlightsComp from "@/components/settings/highlights/HighlightsComp";
import SupportersSettingComp from "@/components/settings/supporters/SupportersComp";
import HomepageImageComp from "@/components/settings/homepageImage/HomepageImageComp";

function SettingsComp(props) {

    return (
        <div className={`${styles['']} container mainContent shadow p-3 my-3 rounded bg-white`}>
            <Tabs>
                <TabList>
                    <Tab>Vitrin</Tab>
                    <Tab>Öne Çıkanlar</Tab>
                    <Tab>Referanslar</Tab>
                    <Tab>Anasayfa Resim</Tab>
                </TabList>

                <TabPanel>
                    <h4>Vitrin Bölüm Ayarları</h4>
                    <VitrinComp/>
                </TabPanel>

                <TabPanel>
                    <h4>Öne Çıkanlar Bölüm Ayarları</h4>
                    <HighlightsComp/>
                </TabPanel>

                <TabPanel>
                    <h4>Referans Bölüm Ayarları</h4>
                    <SupportersSettingComp/>
                </TabPanel>
                <TabPanel>
                    <h4>Anasayfa Resim Ayarları</h4>
                    <HomepageImageComp/>

                </TabPanel>
            </Tabs></div>

    );
}

export default SettingsComp;