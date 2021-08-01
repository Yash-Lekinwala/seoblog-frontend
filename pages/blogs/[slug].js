import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {withRouter} from 'next/router';
import Layout from '../../components/Layout';
import {listRelated, singleBlog} from '../../actions/blog';
import {API, DOMAIN, APP_NAME} from '../../config';
import moment from 'moment';
import renderHTML from 'react-render-html';
import SmallCard from '../../components/blog/SmallCard';
import DisqusThread from '../../components/DisqusThread';

const SingleBlog = ({blog, router}) => {

    const [related, setRelated] = useState([]);

    const loadRelated = () => {
        listRelated({blog}).then(data => {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                setRelated(data);
            }
        })
    }

    useEffect(() => {
        loadRelated();
    }, []);

    const head = () => {
        return (
            <Head>
                <title>{blog.title} | {APP_NAME}</title>
                <meta name="description" content={blog.metaDesc} />
                <link rel="canonical" href={`${DOMAIN}/blogs/${router.pathname}`} />
                <meta property="og:title" content={`${blog.title} | ${APP_NAME}`} />
                <meta name="og:description" content={blog.metaDesc} />
                <meta name="og:type" content="website" />
                <meta name="og:url" content={`${DOMAIN}/blogs/${router.pathname}`} />
                <meta name="og:site_name" content={`${APP_NAME}`} />

                <meta name="og:image" content={`${API}/blog/photo/${blog.photo}`} />
                <meta name="og:image:secure_url" content={`${API}/blog/photo/${blog.photo}`} />
                <meta name="og:image:type" content="image/jpg" />
                {/* <meta name="fb:app_id" content={`${APP_NAME}`} /> */}
            </Head>
        )
    }

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

    const showRelated = () => {
        return related.map((blog, i) => (
            <div className="col-md-4" key={i}>
                <article>
                    <SmallCard blog={blog} />
                </article>
            </div>
        ))
    }

    const showComments = () => {
        return (
            <div>
                <DisqusThread id={blog._id} title={blog.title} path={`/blog/${blog.slug}`} />
            </div>
        )
    }

    return <Fragment>
        {head()}
        <Layout>
            <main>
                <article>
                    <div className="container-fluid">
                        <section>
                            <div className="row" style={{marginTop: '-30px'}}>
                                <img src={`${API}/blog/photo/${blog.slug}`} alt={blog.title} className="img img-fluid featured-image" />
                            </div>
                        </section>
                        <section>
                            <h1 className="display-2 pb-3 text-center fw-bold">{blog.title}</h1>
                        </section>
                    </div>
                    <div className="container">
                        <p className="lead my-3 mark">
                            Written by <Link href={`/profile/${blog.postedBy.username}`}>
                                <a>{blog.postedBy.username}</a>
                            </Link> | Published {moment(blog.updatedAt).fromNow()}
                        </p>
                        <div className="pb-3">
                            {showBlogCategories(blog)}
                            {showBlogTags(blog)}
                        </div>
                        <section>
                            <div className="col-md-12 lead">
                                {renderHTML(blog.body)}
                            </div>
                        </section>
                    </div>
                    <div className="container pb-5">
                        <h4 className="text-center py-5 h2">Related Blogs</h4>
                        <hr/>
                        <div className="row">
                            {showRelated()}
                        </div>
                    </div>
                    <div className="container py-5">
                        {showComments()}
                    </div>
                </article>
            </main>
        </Layout>
    </Fragment>
}

SingleBlog.getInitialProps = ({ query }) => {
    return singleBlog(query.slug).then(data => {
        if (data.error) {
            console.log(data.error);
        } else {
            return { blog: data, query };
        }
    });
};

export default withRouter(SingleBlog);