import React, { useState } from 'react';
import Layout from '../../../../components/Layout';
import { resetPassword } from '../../../../actions/auth';
import {withRouter} from 'next/router';

const ResetPassword = ({router}) => {
    const [values, setValues] = useState({
        newPassword: '',
        error: '',
        message: '',
        showForm: true
    });

    const {newPassword, error, message, showForm} = values;

    const handleSubmit = e => {
        e.preventDefault();
        resetPassword({
            newPassword, 
            resetPasswordLink: router.query.id
        }).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error, showForm: false, newPassword: ''});
            }
            else
            {
                setValues({...values, message: data.message, showForm: false, newPassword: '', error: false});
            }
        })
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

    const resetPasswordForm = () => {
        return (
            <div className="container">
                <form onSubmit={handleSubmit}>
                    <div className="form-floating mb-3">
                        <input type="password" 
                        className="form-control" 
                        placeholder="Type New Password" 
                        onChange={e => setValues({...values, newPassword: e.target.value})}
                        value={newPassword} 
                        required />
                        <label>Email</label>
                    </div>
                    <button type="submit" className="btn btn-primary mb-3">Change Password</button>
                </form>
            </div>
        )
    }

    return (
        <Layout>
            <div className="container-fluid">
                <h2>Reset Password</h2>
                <hr/>
                {showError()}
                {showSuccess()}
                {showForm && resetPasswordForm()}
            </div>
        </Layout>
    )
    
}

export default withRouter(ResetPassword);
