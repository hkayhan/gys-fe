import React, {Suspense} from 'react';
import AddCategoryCont from "@/containers/addCategory/AddCategoryCont";

function Page(props) {
    return (
        <div>
            <Suspense>

                <AddCategoryCont/>
            </Suspense>

        </div>
    );
}

export default Page;