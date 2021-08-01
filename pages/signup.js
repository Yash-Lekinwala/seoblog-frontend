import Layout from '../components/Layout';
import SignupComponent from "../components/auth/SignupComponent";

const Signup = () => {

    return (
        <Layout>
            <h2 className="text-center py-4">Sign-Up</h2>
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <SignupComponent />
                </div>
            </div>
        </Layout>
    )
}

export default Signup;