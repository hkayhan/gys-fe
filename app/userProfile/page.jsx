import React, {Suspense} from 'react';
import UserProfileCont from "@/containers/userProfile/userProfileCont";

function Page(props) {
    return (
        <div>
            <Suspense>
                <UserProfileCont/>

            </Suspense>
        </div>
    );
}

export default Page;