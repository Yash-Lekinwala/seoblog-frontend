import React, { Fragment, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {withRouter} from 'next/router';
import Layout from '../../components/Layout';
import {listBlogsWithCategoriesTags} from '../../actions/blog';
import Card from '../../components/blog/Card';
import {API, DOMAIN, APP_NAME} from '../../config';

const Blogs = ({blogs, categories, tags, totalBlogs, blogsLimit, blogSkip, router}) => {

    const [limit, setLimit] = useState(blogsLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalBlogs);
    const [loadedBlogs, setLoadedBlogs] = useState([]);

    const head = () => {
        return (
            <Head>
                <title>Blogs | {APP_NAME}</title>
                <meta name="description" content="important news and updates about daily lives." />
                <link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
                <meta property="og:title" content={`Latest news and updates | ${APP_NAME}`} />
                <meta name="og:description" content="important news and updates about daily lives." />
                <meta name="og:type" content="website" />
                <meta name="og:url" content={`${DOMAIN}${router.pathname}`} />
                <meta name="og:site_name" content={`${APP_NAME}`} />

                {/* <meta name="og:image" content={`${APP_NAME}`} />
                <meta name="og:image:secure_url" content={`${APP_NAME}`} />
                <meta name="og:image:type" content={`${APP_NAME}`} />
                <meta name="fb:app_id" content={`${APP_NAME}`} /> */}
            </Head>
        )
    }

    const loadMore = () => {
        let toSkip = skip + limit;
        listBlogsWithCategoriesTags(toSkip, limit).then(data => {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                setLoadedBlogs([...loadedBlogs, ...data.blogs]);
                setSize(data.size);
                setSkip(toSkip);
            }
        })
    }

    const laodMoreButton = () => {
        return (
            size > 0 && size >= limit && (
                <button onClick={loadMore} className="btn btn-outline-primary btn-lg">Load More</button>
            )
        )
    }

    const showLoadedBlogs = () => {
        return loadedBlogs.map((blog, i) => (
            <article key={i}>
                <Card blog={blog} />
            </article>
        ))
    }

    const showAllBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <article key={i}>
                    <Card blog={blog} />
                    <hr/>
                </article>
            );
        });
    }
    
    const showAllCategories = () => {
        return categories.map((c, i) => {
            return (
                <Link href={`/categories/${c.slug}`} key={i}>
                    <a className="btn btn-primary mx-1 mt-3">
                        {c.name}
                    </a>
                </Link>
            );
        });
    }
    
    const showAllTags = () => {
        return tags.map((t, i) => {
            return (
                <Link href={`/tags/${t.slug}`} key={i}>
                    <a className="btn btn-outline-primary mx-1 mt-3">
                        {t.name}
                    </a>
                </Link>
            );
        });
    }
    

    return (
        <Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid">
                        <header>
                            <div className="col-md-12 pt-3">
                                <h1 className="text-center">
                                    Programming Blogs & Tutorials
                                </h1>
                            </div>
                            <section>
                                <div className="pb-5 text-center">
                                    {showAllCategories()}
                                    <br/>
                                    {showAllTags()}
                                </div>
                            </section>
                        </header>
                    </div>
                    <div className="container-fluid">
                        {showAllBlogs()}
                    </div>
                    <div className="container-fluid">
                        {showLoadedBlogs()}
                    </div>
                    <div className="text-center px-5">
                        {laodMoreButton()}
                    </div>
                </main>
            </Layout>
        </Fragment>
    );
}

Blogs.getInitialProps = () => {
    let skip = 0;
    let limit = 1;
    return listBlogsWithCategoriesTags(skip, limit).then(data => {
        if(data.error)
        {
            console.log(data.error);
        }
        else
        {
            return {
                blogs: data.blogs, 
                categories: data.categories, 
                tags: data.tags,
                totalBlogs: data.size,
                blogsLimit: limit,
                blogSkip: skip
            };
        }
    })
}

export default withRouter(Blogs);