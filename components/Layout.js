import React, {Fragment} from "react";
import Header from './Header';

const Layout = ({children}) => {
    return (
        <Fragment>
            <Header />
                {children}
            <p>Footer</p>
        </Fragment>
    )
};

export default Layout;