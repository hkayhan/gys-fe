import React, {Suspense} from 'react';
import UserProfileActionsCont from "@/containers/userProfileActions/UserProfileActionsCont";

function Page(props) {
    return (
        <div>
            <Suspense>

                <UserProfileActionsCont/>

            </Suspense>
        </div>
    );
}

export default Page;