import React, { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import Router, {withRouter} from 'next/router';
import { list, removeBlog } from '../../actions/blog';
import { getCookie, isAuth } from '../../actions/auth';
import moment from 'moment';

const ReadBlogs = ({username}) => {

    const [blogs, setBlogs] = useState([]);
    const [message, setMessage] = useState('');
    const token = getCookie('token');

    useEffect(() => {
        loadBlogs();
    }, []);

    const loadBlogs = () => {
        list(username).then(data => {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                setBlogs(data);
            }
        })
    }

    const deleteBlog = (slug) => {
        removeBlog(slug, token).then(data => {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                setMessage(data.message);
                loadBlogs();
            }
        });
    }

    const deleteConfirm = (slug) => {
        let answer = window.confirm('Are you sure you want to delete this blog?');
        if(answer)
        {
            deleteBlog(slug);
        }
    }

    const showUpdateButton = (blog) => {
        if(isAuth() && isAuth().role === 0)
        {
            return (
                <Link href={`/user/crud/${blog.slug}`}>
                    <a className="mx-2 btn btn-sm btn-info">Update</a>
                </Link>
            )
        }
        else if(isAuth() && isAuth().role === 1)
        {
            return (
                    <a href={`/admin/crud/${blog.slug}`} className="mx-2 btn btn-sm btn-info">Update</a>
            )
        }
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div key={i} className="pb-5">
                    <h3>{blog.title}</h3>
                    <p className="mark">Written By {blog.postedBy.name} | Published on {moment(blog.updatedAt).fromNow()}</p>
                    <button className="btn btn-sm btn-danger" onClick={() => deleteConfirm(blog.slug)}>Delete</button>
                    {showUpdateButton(blog)}
                </div>
            )
        })
    }

    return (
        <Fragment>
            <div className="row">
                <div className="col-md-12">
                    {message && <div className="alert alert-success">{message}</div>}
                    {showAllBlogs()}
                </div>
            </div>
        </Fragment>
    )
}

export default ReadBlogs;