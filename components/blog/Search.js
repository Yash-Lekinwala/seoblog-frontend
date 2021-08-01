import React, { useState } from 'react';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import {API} from '../../config';
import { listSearch } from '../../actions/blog';

const Search = () => {
    
    const [values, setValues] = useState({
        search: undefined,
        results: [],
        searched: false,
        message: ''
    });

    const {search, results, searched, message} = values;

    const searchSubmit = e => {
        e.preventDefault();
        listSearch({search}).then(data => {
            setValues({...values, results: data, searched: true, message:`${data.length} blogs found.`});
        })
    }

    const handleChange = e => {
        setValues({...values, search: e.target.value, searched: false, results: []});
    }

    const searchedBlogs = (results = []) => {
        return (
            <div className="jumbotron bg-white">
                {message && 
                <p className="text-muted font-italic">
                    {message}
                </p>}
                {results.map((blog, i) => {
                    return (
                        <div key={i}>
                            <Link href={`/blogs/${blog.slug}`}>
                                <a className="text-primary">{blog.title}</a>
                            </Link>
                        </div>
                    )
                })}
            </div>
        )
    }

    const searchForm = () => (
        <form onSubmit={searchSubmit}>
            <div className="row">
                <div className="col-md-8">
                    <div className="form-floating mb-3">
                        <input type="search" className="form-control" placeholder="Search Blogs" onChange={handleChange} />
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="d-grid">
                        <button className="btn btn-outline-primary" type="submit">Search</button>
                    </div>
                </div>
            </div>
        </form>
    )

    return (
        <div className="container-fluid">
            <div className="py-3">
                {searchForm()}
            </div>
            {searched && 
            <div>
                {searchedBlogs(results)}
            </div>}
        </div>
    )
}

export default Search;