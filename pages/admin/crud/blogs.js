import Layout from '../../../components/Layout';
import Link from 'next/link';
import Admin from '../../../components/auth/Admin';
import ReadBlogs from '../../../components/crud/ReadBlogs';

const Blogs = () => {

    return (
        <Layout>
            <Admin>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 py-5">
                            <h2>Manage Blogs</h2>
                        </div>
                        <div className="col-md-12">
                            <ReadBlogs />
                        </div>
                    </div>
                </div>
            </Admin>
        </Layout>
    )
}

export default Blogs;