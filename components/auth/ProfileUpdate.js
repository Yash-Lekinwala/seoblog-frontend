import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';
import { getCookie, updateUser } from '../../actions/auth';
import { getProfile, update } from '../../actions/user';
import { API } from '../../config';

const ProfileUpdate = () => {
    const [values, setValues] = useState({
        username: '',
        username_for_photo: '',
        name: '',
        email: '',
        password: '',
        about: '',
        error: false,
        success: false,
        loading: false,
        photo: '',
        userData: process.browser && new FormData()
    });

    const token = getCookie('token');
    const {username, username_for_photo, name, password, email, about, error, success, loading, photo, userData} = values;

    useEffect(() => {
        init();
        setValues({...values, userData: new FormData()})
    }, []);

    const init = () => {
        getProfile(token).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error});
            }
            else
            {
                setValues({
                    ...values, 
                    username: data.username, 
                    username_for_photo: data.username, 
                    name: data.name, 
                    email: data.email, 
                    about: data.about
                });
            }
        })
    }

    const handleChange  = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        // let userFormData = new FormData();
        userData.set(name, value);
        setValues({...values, [name]: value, userData, error: false, success: false});
    }

    const handleSubmit = e => {
        e.preventDefault();
        setValues({...values, loading: true});
        update(token, userData).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error, success: false, loading: false});
            }
            else
            {
                updateUser(data, () => {
                    setValues({
                        ...values,
                        username: data.username,
                        name: data.name,
                        email: data.email,
                        about: data.about,
                        success: true,
                        loading: false,
                        error: false
                    });
                })
            }
        })
    }

    const profileUpdateForm = () => (
        <form onSubmit={handleSubmit} className="row">
            <div className="col-md-12 mb-3">
                <label className="btn btn-outline-info">
                    Profile photo
                    <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                </label>
            </div>
            <div className="col-md-12 mb-3">
                <input type="text" value={username} className="form-control" placeholder="Type Your Username" onChange={handleChange('username')} />
            </div>
            <div className="col-md-12 mb-3">
                <input type="text" value={name} className="form-control" placeholder="Type Your Name" onChange={handleChange('name')} />
            </div>
            {/* <div className="col-md-12 mb-3">
                <input type="email" value={email} className="form-control" placeholder="Type Your Email" onChange={handleChange('email')} />
            </div> */}
            <div className="col-md-12 mb-3">
            <textarea className="form-control" rows="3" onChange={handleChange('about')} placeholder="Write something about you..." value={about}></textarea>
            </div>
            <div className="col-md-12 mb-3">
                <input type="password" value={password} className="form-control" placeholder="Type Your Password" onChange={handleChange('password')} />
            </div>
            <div>
                <button className="btn btn-primary">Submit</button>
            </div>
        </form>
    )

    const showError = () => (
        <div className={`alert alert-danger ${error ? '' : 'visually-hidden'}`}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className={`alert alert-success ${success ? '' : 'visually-hidden'}`}>
            Profile Updated
        </div>
    )

    const showLoading = () => (
        <div className={`alert alert-info ${loading ? '' : 'visually-hidden'}`}>
            loading...
        </div>
    )


    return (
        <Fragment>
            <div className="container">
                <div className="row">
                    <div className="col-md-4">
                        <img src={`${API}/user/photo/${username_for_photo}`} className="img img-fluid img-thumbnail" alt="User Profile" />
                    </div>
                    <div className="col-md-8">
                        {showError()}
                        {showSuccess()}
                        {showLoading()}
                        {profileUpdateForm()}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default ProfileUpdate;