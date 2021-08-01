import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import renderHTML from 'react-render-html';
import {API} from '../../config';

const Card = ({blog}) => {

    const showBlogCategories = blog => (
        blog.categories.map((c, i) => (
            <Link key={i} href={`/categories/${c.slug}`}>
                <a className="btn btn-outline-primary mx-1 mt-3">{c.name}</a>
            </Link>
        ))
    )

    const showBlogTags = blog => (
        blog.tags.map((t, i) => (
            <Link key={i} href={`/tags/${t.slug}`}>
                <a className="btn btn-outline-info mx-1 mt-3">{t.name}</a>
            </Link>
        ))
    )

    return (
        <div className="lead pb-4">
            <header>
                <Link href={`/blogs/${blog.slug}`}>
                    <a className="text-decoration-none"><h2 className="fw-bold py-3">{blog.title}</h2></a>
                </Link>
            </header>
            <section>
                <p className="mark ml-1 pt-2 pb-2">
                    Written by <Link href={`/profile/${blog.postedBy.username}`}>
                                <a>{blog.postedBy.username}</a>
                            </Link> | Published {moment(blog.updatedAt).fromNow()}
                </p>
            </section>
            <section>
                <div className="pb-3">
                    {showBlogCategories(blog)}
                    {showBlogTags(blog)}
                </div>
            </section>
            <div className="row">
                <div className="col-md-4">
                    <section>
                        <img className="img-fluid img" style={{maxHeight:'150px', width: 'auto'}} alt={blog.title} src={`${API}/blog/photo/${blog.slug}`} />
                    </section>
                </div>
                <div className="col-md-8">
                    <section>
                        {renderHTML(blog.excerpt)}
                        <Link href={`/blogs/${blog.slug}`}>
                            <a className="btn btn-primary my-2">Read More</a>
                        </Link>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default Card;