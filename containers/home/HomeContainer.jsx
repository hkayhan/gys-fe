// import logo from 'public/images/logo.svg'
// import Image from "next/image";
import Topbar from "@/components/topbar/TopbarComponent";
import AdvertisementHorizontal from "@/components/advertisementHorizontal/AdHorzComp";
import HomePageLinks from "@/components/homePageLinks/HomePageLinkComp";
import ShowCaseComponent from "@/components/showCase/showCaseComp";
import Supporters from "@/components/supporters";
import Statistics from "@/components/statistics";
import CommentsComp from "@/components/comments/CommentsComp";
import ShowCaseSmallComponent from "@/components/showCaseSmall/showCaseSmallComp";
import ContactUsComp from "@/components/contactUS/contactUsComp";
import SearchPersonalComp from "@/components/searchPersonal/searhPersonal";
import {ApiGetRequest} from "@/services/admin";
import AdvertisementVerticalComp from "@/components/advertisementVertical/AdvertisementVerticalComp";

/*const getShowCaseData = async () => {
    // const response = await AdminGetRequest("/MainPageSetting/GetByType?type=showcase")
    // const response = await fetch('https://esknet.asystee.com/api/MainPageSetting/GetByType?type=showcase', {cache: 'no-cache'})
    const data = await AdminGetRequest("/MainPageSetting/GetByTypeForMainPage","type=showcase")

    // const data =await response.json()

    // console.log("--------------------- type=showcase");
    // console.log(data.mainPageSettingVMList);
    // console.log("--------------------- type=showcase");
    return data.mainPageSettingVMList?? []

}*/
/*
const getHighlights = async () => {
    const response = await AdminGetRequest("/MainPageSetting/GetByTypeForMainPage?type=highlights")
    return response.mainPageSettingVMList ?? []

}*/

const getReferences = async () => {
    const response = await ApiGetRequest("/MainPageSetting/GetByType?type=references")
    return response.mainPageSettingVMList?? []

}

async function HomeContainer(props) {

    // const showCaseDataPromise = getShowCaseData()
    // const highlightsPromise = getHighlights()
    const referencesPromise = getReferences()

/*
    const [showCaseData, highlights, references] = await Promise.all(
        [showCaseDataPromise, highlightsPromise, referencesPromise]
    )
*/

    console.log("--------------------- type=showcase");
    // console.log(highlights);
    console.log("--------------------- type=showcase");

    // //console.log(showCaseData);
    // //console.log(highlights);
    // //console.log(references);

    return (
        <section>
            {/*<Topbar/>*/}
            <HomePageLinks/>
            {/*<AdvertisementHorizontal location={"top"}/>*/}

           <div className="d-flex">
               <div className="col-lg-2 ">
                   {/*<AdvertisementVerticalComp location={"home-left-vertical"}/>*/}
               </div>
               <div className={"col-12 col-lg-8"}>
                   {/*<ShowCaseComponent data={"showCaseData"}/>*/}
                   {/*<ShowCaseComponent data={data.result.slice(0, 12)}/>*/}
                   {/*<ShowCaseSmallComponent data={"highlights"}/>*/}
                   {/*<Supporters data={[]}/>*/}
                   {/*<CommentsComp/>*/}
                   <Statistics/>
                   {/*<ContactUsComp/>*/}
                   <SearchPersonalComp/>

               </div>
               <div className="col-lg-2 ">
                   {/*<AdvertisementVerticalComp location={"home-right-vertical"}/>*/}
               </div>
           </div>


            <br/>
        </section>

    );
}

export default HomeContainer;