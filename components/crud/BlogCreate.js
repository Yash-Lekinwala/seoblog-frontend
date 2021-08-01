import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCategories} from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});
import '../../node_modules/react-quill/dist/quill.snow.css';
import { getCookie } from '../../actions/auth';
import { QuillFormats, QuillModules } from '../../helpers/quill';

const CreateBlog = ({router}) => {

    const blogFromLS = () => {
        if(typeof window === 'undefined')
        {
            return false;
        }

        if(localStorage.getItem('blog'))
        {
            return JSON.parse(localStorage.getItem('blog'));
        }
        else
        {
            return false;
        }
    } 

    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [checked, setChecked] = useState([]);
    const [checkedTag, setCheckedTag] = useState([]);
    const [body, setBody] = useState(blogFromLS());
    const [values, setValues] = useState({
        error: '',
        sizeError: '',
        success: '',
        formData: '',
        title: '',
        hidePublishButton: false
    });

    const {error, sizeError, success, formData, title, hidePublishButton} = values;
    const token = getCookie('token');

    useEffect(() => {
        setValues({...values, formData: new FormData()});
        initCategories();
        initTags();
    }, [router]);

    const initCategories = () => {
        getCategories().then((data) => {
            if(data.error)
            {
                setValues({...values, error: data.error});
            }
            else
            {
                setCategories(data);
            }
        })
    }

    const initTags = () => {
        getTags().then((data) => {
            if(data.error)
            {
                setValues({...values, error: data.error});
            }
            else
            {
                setTags(data);
            }
        })
    }

    const publishBlog = (e) => {
        e.preventDefault();
        createBlog(formData, token).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error})
            }
            else
            {
                setValues({...values, title: '', error: '', success: `A new blog titled ${data.title} is created.`});
                setBody('');
                setChecked([]);
                setCheckedTag([]);
            }
        })
    }

    const handleChange  = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value, formData, error: ''});
    }

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
        if(typeof window !== 'undefined')
        {
            localStorage.setItem('blog', JSON.stringify(e));
        }
    }

    const handleToggle = c => () => {
        setValues({...values, error: ''});
        const clickedCategory = checked.indexOf(c);
        const all = [...checked];
        if(clickedCategory === -1)
        {
            all.push(c);
        }
        else
        {
            all.splice(clickedCategory, 1);
        }
        setChecked(all);
        formData.set('categories', all);
    }

    const handleToggleTag = t => () => {
        setValues({...values, error: ''});
        const clickedTag = checkedTag.indexOf(t);
        const all = [...checkedTag];
        if(clickedTag === -1)
        {
            all.push(t);
        }
        else
        {
            all.splice(clickedTag, 1);
        }
        setCheckedTag(all);
        formData.set('tags', all);
    }

    const showCategories = () => {
        return (
            categories && categories.map((category, index) => (
                <li key={index}>
                    <label className="form-check-label">
                    <input onChange={handleToggle(category._id)} className="form-check-input me-2" type="checkbox" value="" />
                        {category.name}
                    </label>
                </li>
            ))
        )
    }

    const showTags = () => {
        return (
            tags && tags.map((tag, index) => (
                <li key={index}>
                    <label className="form-check-label">
                    <input onChange={handleToggleTag(tag._id)} className="form-check-input me-2" type="checkbox" value="" />
                        {tag.name}
                    </label>
                </li>
            ))
        )
    }

    const showError = () => (
        <div className={`alert alert-danger ${error ? '' : 'visually-hidden'}`}>
            {error}
        </div>
    )

    const showSuccess = () => (
        <div className={`alert alert-success ${success ? '' : 'visually-hidden'}`}>
            {success}
        </div>
    )

    const createBlogForm = () => {
        return (
            <form onSubmit={publishBlog}>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" placeholder="Title" onChange={handleChange('title')} value={title} required />
                    <label>Title</label>
                </div>
                <div className="form-floating mb-3">
                    <ReactQuill 
                        value={body}
                        modules={QuillModules} 
                        formats={QuillFormats} 
                        placeholder="write something amazing..."
                        onChange={handleBody} />
                </div>
                <button type="submit" className="btn btn-primary mb-3">Publish</button>
            </form>
        )
    }

    return <div className="container-fluid">
        <div className="row">
            <div className="col-md-8">
                {createBlogForm()}
                {showError()}
                {showSuccess()}
            </div>
            <div className="col-md-4">
                <div>
                    <h5>Featured Image</h5>
                    <hr/>
                    <small className="text-muted d-block">Max Size: 1mb</small>
                    <label className="btn btn-outline-info">
                        Upload Featured Image
                        <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
                    </label>
                </div>
                <div>
                    <h5>Categories</h5>
                    <hr/>
                    <ul className="list-unstyled overflow-auto" style={{maxHeight: '100px'}}>
                        {showCategories()}
                    </ul>
                </div>
                <div>
                    <h5>Tags</h5>
                    <hr/>
                    <ul className="list-unstyled overflow-auto" style={{maxHeight: '100px'}}>
                        {showTags()}
                    </ul>
                </div>
            </div>
        </div>
    </div>
}

export default withRouter(CreateBlog);