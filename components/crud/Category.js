import React, { Fragment, useEffect, useState } from 'react';
import { getCookie } from '../../actions/auth';
import { create, getCategories, removeCategory } from '../../actions/category';


const Category = () => {    
    const [values, setValues] = useState({
        name: '',
        error: false,
        success: false,
        categories: [],
        removed: false,
        reload: false
    });

    const {name, error, success, categories, removed, reload} = values;
    const token = getCookie('token');

    useEffect(() => {
        loadCategories();
    }, [reload]);

    const loadCategories = () => {
        getCategories().then(data => {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                setValues({...values, categories: data});
            }
        })
    }

    const showCategories = () => {
        return categories.map((category, index) => {
            return <button title="Double Click to Delete"
                onDoubleClick={() => deleteConfirm(category.slug)} 
                className="btn btn-outline-primary mx-1 mt-3" 
                key={index}>
                {category.name}
            </button>
        });
    }

    const deleteConfirm = (slug) => {
        let answer = window.confirm('Are you sure you want to delete this category?');
        if(answer)
        {
            deleteCategory(slug);
        }
    }

    const deleteCategory = slug => {
        removeCategory(slug, token).then(data => {
            if(data.error)
            {
                console.log(data.error);
            }
            else
            {
                setValues({...values, error: false, success: false, name: '', removed: !removed, reload: !reload});
            }
        })
    }

    const clickSubmit = (e) => {
        e.preventDefault();
        create({name}, token).then(data => {
            if(data.error)
            {
                setValues({...values, error: data.error, success: false});
            }
            else
            {
                setValues({...values, error: false, success: true, name: '', removed: removed, reload: !reload});
            }
        });
    }

    const handleChange = (e) => {
        setValues({...values, name: e.target.value, error: false, success: false, removed: ''});
    }

    const showSuccess = () => {
        if(success)
        {
            return <p className="text-success">Category is Created</p>
        }
    }

    const showError = () => {
        if(error)
        {
            return <p className="text-danger">Category already exist.</p>
        }
    }

    const showRemoved = () => {
        if(removed)
        {
            return <p className="text-danger">Category is removed.</p>
        }
    }

    const mouseMoveHandler = (e) => {
        setValues({...values, error: false, success: false, removed: ''})
    }

    const newCategoryForm = () => (
        <form onSubmit={clickSubmit}>
            <div className="form-floating mb-3">
                <input type="text" className="form-control" placeholder="Name" onChange={handleChange} value={name} required />
                <label>Name</label>
            </div>
            <button type="submit" className="btn btn-primary mb-3">Create</button>
        </form>
    );

    return <Fragment>
        {showSuccess()}
        {showError()}
        {showRemoved()}        
        <div onMouseMove={mouseMoveHandler}>
            {newCategoryForm()}
            {showCategories()}
        </div>
    </Fragment>
};

export default Category;