import Router from 'next/router';
import React, { Fragment, useEffect, useState } from 'react';
import {authenticate, isAuth, signin} from '../../actions/auth';
import Link from 'next/link';
import LoginGoogle from './LoginGoogle';

const SigninComponent = () => {

    const [values, setValues] = useState({
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const {email, password, error, loading, message, showForm} = values;

    useEffect(() => {
        isAuth() && Router.push(`/`);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading: true, error: false});
        const user = {email, password}
        
        signin(user).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error})
            }
            else
            {
                // save user token to cookie
                
                // save user info to local storage

                // authenticate user 
                authenticate(data, () => {
                    // Router.push(`/`);
                    if(isAuth() && isAuth().role === 1)
                        Router.push('/admin');
                    else
                        Router.push('/user');
                });
            }
        });        
    }

    const handleChange = name => (e) => {
        setValues({...values, error: false, [name]: e.target.value});
    }

    const showLoading = () => loading ? 
        <div class="d-flex justify-content-center">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div> : '';
    const showError = () => error ? <div class="alert alert-danger" role="alert">{error}</div> : '';
    const showMessage = () => message ? <div class="alert alert-success" role="alert">{message}</div> : '';
    
    const signinForm = () => {
        return (
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-12 mb-3">
                    <input type="email" value={email} className="form-control" placeholder="Type Your Email" onChange={handleChange('email')} />
                </div>
                <div className="col-md-12 mb-3">
                    <input type="password" value={password} className="form-control" placeholder="Type Your Password" onChange={handleChange('password')} />
                </div>
                <div>
                    <button className="btn btn-primary">Sign In</button>
                </div>
            </form>
        )
    }

    return (
        <Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            <LoginGoogle />
            {showForm && signinForm()}
            <br/>
            <Link href="/auth/password/forgot">
                <a className="btn btn-link">
                    Forgot Password?
                </a>
            </Link>
        </Fragment>
    )
}

export default SigninComponent;