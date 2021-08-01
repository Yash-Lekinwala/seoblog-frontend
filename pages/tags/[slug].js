import React, { Fragment } from 'react';
import Head from 'next/head';
import Layout from '../../components/Layout';
import Card from '../../components/blog/Card';
import { singleTag } from '../../actions/tag';
import { APP_NAME, DOMAIN } from '../../config';

const Tag = ({tag, blogs, query}) => {

    const head = () => {
        return (
            <Head>
                <title>{tag.name} | {APP_NAME}</title>
                <meta name="description" content={tag.name} />
                <link rel="canonical" href={`${DOMAIN}/tags/${query.slug}`} />
                <meta property="og:title" content={`${tag.name} | ${APP_NAME}`} />
                <meta name="og:description" content={tag.name} />
                <meta name="og:type" content="website" />
                <meta name="og:url" content={`${DOMAIN}/tags/${query.slug}`} />
                <meta name="og:site_name" content={`${APP_NAME}`} />

                {/* <meta name="fb:app_id" content={`${APP_NAME}`} /> */}
            </Head>
        )
    }

    return (
        <Fragment>
            {head()}
            <Layout>
                <main>
                    <div className="container-fluid text-center">
                        <header>
                            <div className="row">
                                <div className="col-md-12 pt-3">
                                    <h1 className="display-4 fw-bold">
                                        {tag.name}
                                    </h1>
                                    {blogs.map((b, i) => (
                                        <div>
                                            <Card key={i} blog={b} />
                                            <hr/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </header>
                    </div>
                </main>
            </Layout>
        </Fragment>
    )
}

Tag.getInitialProps = ({query}) => {
    return singleTag(query.slug).then(data => {
        if(data.error)
        {
            console.log(data.error);
        }
        else
        {
            return {tag: data.tag, blogs: data.blogs, query};
        }
    })
}

export default Tag;