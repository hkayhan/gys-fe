import React, {Suspense} from 'react';
import ApproveMailCont from "@/containers/approveMail/ApproveMailCont";

function Page(props) {
    return (
        <div>
            <Suspense>

                <ApproveMailCont/>
            </Suspense>

        </div>
    );
}

export default Page;