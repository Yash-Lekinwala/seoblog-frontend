import Layout from '../../../components/Layout';
import Link from 'next/link';
import CreateBlog from '../../../components/crud/BlogCreate';
import Private from '../../../components/auth/Private';

const Blog = () => {

    return (
        <Layout>
            <Private>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12 py-5">
                            <h2>Create a new blog</h2>
                        </div>
                        <div className="col-md-12">
                            <CreateBlog />
                        </div>
                    </div>
                </div>
            </Private>
        </Layout>
    )
}

export default Blog;