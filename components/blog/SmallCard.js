import React from 'react';
import Link from 'next/link';
import moment from 'moment';
import renderHTML from 'react-render-html';
import {API} from '../../config';

const SmallCard = ({blog}) => {

    return (
        <div className="card">
            <section>
                <Link href={`/blogs/${blog.slug}`}>
                    <a>
                        <img className="img-fluid img" alt={blog.title} src={`${API}/blog/photo/${blog.slug}`} />
                    </a>
                </Link>
            </section>
            <div className="card-body">
                <section>
                    <Link href={`/blogs/${blog.slug}`}>
                        <h5 className="card-title">{blog.title}</h5>
                    </Link>
                    <p className="card-text">{renderHTML(blog.excerpt)}</p>
                </section>
            </div>
            <div className="card-body">
                <div>
                    Written by <Link href={`/profile/${blog.postedBy.username}`}>
                                <a>{blog.postedBy.username}</a>
                            </Link> | 
                    Published {moment(blog.updatedAt).fromNow()}
                </div>
            </div>
        </div>        
    )
}

export default SmallCard;