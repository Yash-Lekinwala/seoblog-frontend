import React, { useEffect, useState } from 'react';
import Layout from '../../../../components/Layout';
import { signup } from '../../../../actions/auth';
import {withRouter} from 'next/router';
import jwt from 'jsonwebtoken';

const ActivateAccount = ({router}) => {
    const [values, setValues] = useState({
        name: '',
        token: '',
        error: '',
        loading: false,
        success: false,
        showButton: true
    });

    const {name, token, error, loading, success, showButton} = values;

    useEffect(() => {
        let token = router.query.id;
        if(token)
        {
            const {name} = jwt.decode(token);
            setValues({...values, name, token});
        }
    }, [router]);

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, loading: true, error: false});
        signup({token}).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error, loading: false, showButton: false});
            }
            else
            {
                setValues({...values, loading: false, success: true, showButton: false});
            }
        })
    }

    const showLoading = () => (
        <div className={`alert alert-info ${loading ? '' : 'visually-hidden'}`}>
            loading...
        </div>
    )
    
    const showError = () => (
        <div className={`alert alert-danger ${error ? '' : 'visually-hidden'}`}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className={`alert alert-success ${success ? '' : 'visually-hidden'}`}>
            Your account has been activated. Please Sign In.
        </div>
    )

    return (
        <Layout>
            <div className="container">
                <h3>Hey {name}, ready to activate your account?</h3>
                {showLoading()}
                {showError()}
                {showSuccess()}
                {showButton && <button className="btn btn-outline-primary" onClick={handleSubmit}>Activate Account</button>}
            </div>
        </Layout>
    )
}

export default withRouter(ActivateAccount);