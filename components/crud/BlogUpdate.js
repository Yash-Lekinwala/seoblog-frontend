import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {getCategories} from '../../actions/category';
import { getTags } from '../../actions/tag';
import { singleBlog, updateBlog } from '../../actions/blog';

const ReactQuill = dynamic(() => import('react-quill'), {ssr: false});
import '../../node_modules/react-quill/dist/quill.snow.css';
import { getCookie, isAuth } from '../../actions/auth';
import { QuillFormats, QuillModules } from '../../helpers/quill';
import { API } from '../../config';

const BlogUpdate = ({router}) => {

    const [body, setBody] = useState('');
    const [values, setValues] = useState({
        error: '',
        success: '',
        formData: '',
        title: '',
    });
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [checked, setChecked] = useState([]);
    const [checkedTag, setCheckedTag] = useState([]);

    const {error, success, formData, title} = values;
    const token = getCookie('token');

    useEffect(() => {
        setValues({...values, formData: new FormData()})
        initBlog();
        initCategories();
        initTags();
    }, [router]);

    const initBlog = () => {
        if(router.query.slug)
        {
            singleBlog(router.query.slug).then(data => {
                if(data.error)
                {
                    console.log(data.error);
                }
                else
                {
                    setValues({...values, title: data.title});
                    setBody(data.body);
                    setCategoriesArray(data.categories);
                    setTagsArray(data.tags);
                }
            })
        }
    }

    const setCategoriesArray = blogCategories => {
        let ca = [];
        blogCategories.map((c, i) => {
            ca.push(c._id);
        });
        setChecked(ca);
    }

    const setTagsArray = blogTags => {
        let ta = [];
        blogTags.map((t, i) => {
            ta.push(t._id);
        });
        setCheckedTag(ta);
    }

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
    
    const handleChange  = name => e => {
        const value = name === 'photo' ? e.target.files[0] : e.target.value;
        formData.set(name, value);
        setValues({...values, [name]: value, formData, error: ''});
    }

    const handleBody = e => {
        setBody(e);
        formData.set('body', e);
    }

    const editBlog = (e) => {
        e.preventDefault();
        updateBlog(formData, token, router.query.slug).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error});
            }
            else
            {
                setValues({...values, title: '', success: `Blog titled ${data.title} is updated`});
                if(isAuth() && isAuth().role === 1)
                {
                    Router.replace(`/admin/crud/${router.query.slug}`);
                }
                else if(isAuth() && isAuth().role === 0)
                {
                    Router.replace(`/user/crud/${router.query.slug}`);
                }
            }
        })
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
                    <input onChange={handleToggle(category._id)} checked={findOutCategory(category._id)} className="form-check-input me-2" type="checkbox" value="" />
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
                    <input onChange={handleToggleTag(tag._id)} checked={findOutTag(tag._id)} className="form-check-input me-2" type="checkbox" value="" />
                        {tag.name}
                    </label>
                </li>
            ))
        )
    }

    const findOutCategory = c => {
        const result = checked.indexOf(c)
        return result !== -1 ? true : false;
    }

    const findOutTag = t => {
        const result = checkedTag.indexOf(t)
        return result !== -1 ? true : false;
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

    const updateBlogForm = () => {
        return (
            <form onSubmit={editBlog}>
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
                <button type="submit" className="btn btn-primary mb-3">Update</button>
            </form>
        )
    }


    return <div className="container-fluid">
        <div className="row">
            <div className="col-md-8">
                {updateBlogForm()}
                {showError()}
                {showSuccess()}
                {body && <img src={`${API}/blog/photo/${router.query.slug}`} alt={title} className="w-100" />}
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

export default withRouter(BlogUpdate);