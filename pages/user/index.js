import Layout from '../../components/Layout';
import Link from 'next/link';
import Private from '../../components/auth/Private';

const UserIndex = () => {

    return (
        <Layout>
            <Private>
            <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 py-5">
                            <h2>User Dashboard</h2>
                        </div>
                        <div className="col-md-4">
                            <ul className="list-group">
                                <li className="list-group-item">
                                    <Link href="/user/update">
                                        <a>Profile</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/crud/blog">
                                        <a>Create Blog</a>
                                    </Link>
                                </li>
                                <li className="list-group-item">
                                    <Link href="/user/crud/blogs">
                                        <a>Blogs</a>
                                    </Link>
                                </li>
                            </ul>
                        </div>
                        <div className="col-md-8">

                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    )
}

export default UserIndex;