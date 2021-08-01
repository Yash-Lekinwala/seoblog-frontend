import React, { Fragment, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';
import Link from 'next/link';
import NProgress from 'nprogress';

import {APP_NAME} from '../config';
import { isAuth, signout } from '../actions/auth';
import Router from 'next/router';
import Search from './blog/Search';

Router.onRouteChangeStart = url => NProgress.start();
Router.onRouteChangeComplete = url => NProgress.done();
Router.onRouteChangeError = url => NProgress.done();

const Header = (props) => {

    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <Fragment>
            <Navbar color="light" light expand="md">
            <Link href="/">
                <NavLink className="fw-bold">{APP_NAME}</NavLink>
            </Link>
            <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        <NavItem>
                            <Link href="/blogs">
                            <NavLink>
                                Blogs
                            </NavLink>
                            </Link>
                        </NavItem>  
                        <NavItem>
                            <Link href="/contact">
                            <NavLink>
                                Contact
                            </NavLink>
                            </Link>
                        </NavItem>  

                        {!isAuth() && 
                        <Fragment>
                            <NavItem>
                                <Link href="/signin">
                                    <NavLink>
                                        Sign In
                                    </NavLink>
                                </Link>
                            </NavItem>
                            <NavItem>
                                <Link href="/signup">
                                    <NavLink>
                                        Sign Up
                                    </NavLink>
                                </Link>
                            </NavItem>
                        </Fragment>}
                        
                        {isAuth() && isAuth().role === 0 && (
                        <NavItem>
                            <Link href="/user">
                            <NavLink>
                                {`${isAuth().name}'s Dashboard`}
                            </NavLink>
                            </Link>
                        </NavItem>               
                        )}                     
                        {isAuth() && isAuth().role === 1 && (
                        <NavItem>
                            <Link href="/admin">
                            <NavLink>
                                {`${isAuth().name}'s Dashboard`}
                            </NavLink>
                            </Link>
                        </NavItem>               
                        )}    
                        {isAuth() && (
                        <NavItem>
                            <NavLink style={{cursor: 'pointer'}} onClick={() => signout(() => Router.replace('/signin'))}>
                                Sign Out
                            </NavLink>
                        </NavItem>               
                        )}   
                        <NavItem>
                            <Link href="/user/crud/blog">
                            <NavLink className="btn btn-primary text-light">
                                Write A Blog
                            </NavLink>
                            </Link>
                        </NavItem>                  
                    </Nav>
                </Collapse>
            </Navbar>
            <Search />
        </Fragment>
    );
}

export default Header;