import React, { Fragment, useEffect, useState } from 'react';
import {isAuth, preSignup, signup} from '../../actions/auth';
import Router from 'next/router';

const SignupComponent = () => {

    const [values, setValues] = useState({
        name: '',
        email: '',
        password: '',
        error: '',
        loading: false,
        message: '',
        showForm: true
    });

    const {name, email, password, error, loading, message, showForm} = values;

    useEffect(() => {
        isAuth() && Router.push(`/`);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, loading: true, error: false});
        const user = {name, email, password}
        
        preSignup(user).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error})
            }
            else
            {
                setValues({...values, name: '', email: '', password: '', error: '',  loading: false, message: data.message, showForm: false});
            }
        })
        
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
    
    const signupForm = () => {
        return (
            <form onSubmit={handleSubmit} className="row">
                <div className="col-md-12 mb-3">
                    <input type="text" value={name} className="form-control" placeholder="Type Your Name" onChange={handleChange('name')} />
                </div>
                <div className="col-md-12 mb-3">
                    <input type="email" value={email} className="form-control" placeholder="Type Your Email" onChange={handleChange('email')} />
                </div>
                <div className="col-md-12 mb-3">
                    <input type="password" value={password} className="form-control" placeholder="Type Your Password" onChange={handleChange('password')} />
                </div>
                <div>
                    <button className="btn btn-primary">Sign Up</button>
                </div>
            </form>
        )
    }

    return (
        <Fragment>
            {showError()}
            {showLoading()}
            {showMessage()}
            {showForm && signupForm()}
        </Fragment>
    )
}

export default SignupComponent;