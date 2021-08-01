import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import {emailContactForm} from '../../actions/form';

const ContactForm = ({authorEmail}) => {
    const [values, setValues] = useState({
        message: '',
        name: '',
        email: '',
        sent: false,
        buttonText: 'Send Message',
        success: false,
        error: false  
    });

    const {message, error, success, name, email, sent, buttonText} = values;

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({...values, buttonText: 'Sending...'});
        emailContactForm({authorEmail, name, email, message}).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error});
            }
            else
            {
                setValues({...values, sent: true, name: '', email: '', message: '', buttonText: 'Sent', success: data.success});
            }
        });
    };

    const handleChange  = name => e => {
        setValues({...values, [name]: e.target.value, error: false, success: false, buttonText: 'Send Message'});
    };

    const contactForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" placeholder="Name" onChange={handleChange('name')} value={name} required />
                    <label>Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" placeholder="Email" onChange={handleChange('email')} value={email} required />
                    <label>Email</label>
                </div>
                <div className="form-floating mb-3">
                    <textarea className="form-control h-100" placeholder="Type Your Message" onChange={handleChange('message')} value={message} required></textarea>
                    <label>Message</label>
                </div>
                <button type="submit" className="btn btn-primary mb-3">{buttonText}</button>
            </form>
        )
    }
    
    const showError = () => (
        <div className={`alert alert-danger ${error ? '' : 'visually-hidden'}`}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className={`alert alert-success ${success ? '' : 'visually-hidden'}`}>
            Thank You for Contacting Us.
        </div>
    )

    return (
        <Fragment>
            {showError()}
            {showSuccess()}
            {contactForm()}
        </Fragment>
    )
}

export default ContactForm;