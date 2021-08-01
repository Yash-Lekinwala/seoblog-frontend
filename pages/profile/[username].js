import React, { Fragment } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { userPublicProfile } from '../../actions/user';
import {API, DOMAIN, APP_NAME} from '../../config';
import moment from 'moment';
import ContactForm from '../../components/form/ContactForm';

const UserProfile = ({user, blogs, query}) => {

    const showUserBlogs = () => {
        return blogs.map((blog, i) => {
            return (
                <div key={i} className="my-4">
                    <Link href={`/blogs/${blog.slug}`}>
                        <a className="lead">
                            {blog.title}
                        </a>
                    </Link>
                </div>
            )
        })
    }

    const head = () => {
        return (
            <Head>
                <title>{user.name} | {APP_NAME}</title>
                <meta name="description" content={`Blogs by ${user.username}`} />
                <link rel="canonical" href={`${DOMAIN}/profile/${query.username}`} />
                <meta property="og:title" content={`${user.name} | ${APP_NAME}`} />
                <meta name="og:description" content={`Blogs by ${user.name}`} />
                <meta name="og:type" content="website" />
                <meta name="og:url" content={`${DOMAIN}/profile/${query.username}`} />
                <meta name="og:site_name" content={`${APP_NAME}`} />

                {/* <meta name="og:image" content={`${API}/blog/photo/${blog.photo}`} />
                <meta name="og:image:secure_url" content={`${API}/blog/photo/${blog.photo}`} />
                <meta name="og:image:type" content="image/jpg" /> */}
                {/* <meta name="fb:app_id" content={`${APP_NAME}`} /> */}
            </Head>
        )
    }


    return (
        <Fragment>
            {head()}
            <Layout>
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h5>{user.name}</h5>
                                            <p className="text-muted">Joined {moment(user.createdAt).fromNow()}</p>
                                        </div>
                                        <div className="col-md-4">
                                            <img src={`${API}/user/photo/${user.username}`} className="img img-fluid img-thumbnail" alt="User Profile" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary p-4">
                                        Recent blogs by {user.name}
                                    </h5>
                                    {showUserBlogs()}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title bg-primary p-4">
                                        Message {user.name}
                                    </h5>
                                    <ContactForm authorEmail={user.email} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </Fragment>
    )
}

UserProfile.getInitialProps = ({query}) => {
    return userPublicProfile(query.username).then(data => {
        if(data.error)
        {
            console.log(data.error);
        }
        else
        {
            return {user: data.user, blogs: data.blogs, query};
        }
    })
}

export default UserProfile;