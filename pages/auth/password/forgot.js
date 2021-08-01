import React, { useState } from 'react';
import Layout from '../../../components/Layout';
import { forgotPassword } from '../../../actions/auth';

const ForgotPassword = () => {
    const [values, setValues] = useState({
        email: '',
        message: '',
        error: '',
        showForm: true
    });

    const {email, message, error, showForm} = values;

    const handleChange = name => e => {
        setValues({...values, message: '', error: '', [name]: e.target.value});
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, message: '', error: ''});
        forgotPassword({email}).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error})
            }
            else
            {
                setValues({...values, message: data.message, email: '', showForm: false});
            }
        });
    }
    
    const showError = () => (
        <div className={`alert alert-danger ${error ? '' : 'visually-hidden'}`}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className={`alert alert-success ${message ? '' : 'visually-hidden'}`}>
            {message}
        </div>
    )

    const passwordForgotForm = () => (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" placeholder="Enter Your Email" onChange={handleChange('email')} value={email} required />
                    <label>Email</label>
                </div>
                <button type="submit" className="btn btn-primary mb-3">Send password reset link</button>
            </form>
        </div>
    )

    return (
        <Layout>
            <div className="container">
                <h2>Forgot Password</h2>
                <hr/>
                {showError()}
                {showSuccess()}
                {showForm && passwordForgotForm()}
            </div>
        </Layout>
    )
}

export default ForgotPassword;