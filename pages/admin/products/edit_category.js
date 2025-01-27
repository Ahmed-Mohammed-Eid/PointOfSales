import React, { useState } from "react";
import classes from "@/styles/create_category.module.scss";
import { useRouter } from "next/router";
import Head from "next/head";
// Imports
import BackButton from "@/components/Admin/Dashboard/BackButton/BackButton";
import Spinner from "@/components/Spinner/Spinner";

// Redux
import { useSelector, useDispatch } from "react-redux";
import {
    categoryItemChanged,
    clearCategory,
} from "@/Redux/Reducers/AdminFormsEditReducer";
// Axios
import axios from "axios";
// Notifications
import { toast } from "react-toastify";

function Edit_Category({ id, name }) {
    // Router
    const router = useRouter();

    // State for loading
    const [loading, setLoading] = useState(false);

    // Redux
    const dispatch = useDispatch();
    const { categoryName } = useSelector((state) => state.AdminEdit.categories);

    // Submit handler
    const submitHandler = (e) => {
        // prevent Default
        e.preventDefault();
        // clear form
        dispatch(clearCategory());
        // set the loading state
        setLoading(true);
        // send the request
        axios
            .put(
                `https://posapi.kportals.net/api/v1/edit/category`,
                { categoryId: id, categoryName },
                {
                    headers: {
                        // set the headers with the Authorization
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                // set the loading state
                setLoading(false);
                // redirect to the products
                router.push("/admin/products");
                // clear the form
                dispatch(clearCategory());
            })
            .catch((err) => {
                // set the loading state
                setLoading(false);
                toast.error(err.response?.data?.message || err.message);
            });
    };

    return (
        <>
            <Head>
                <title>Edit Category</title>
                <meta name='description' content='Edit Category' />
            </Head>
            <section className={classes.createCategory}>
                <div className={classes.createCategory__container}>
                    <div className={classes.createCategory__header}>
                        <h2 className={classes.createCategory__title}>
                            تعديل قِسم
                            <span> ({name})</span>
                        </h2>
                        <BackButton
                            click={() => {
                                dispatch(clearCategory());
                                router.push("/admin/products");
                            }}
                        />
                    </div>
                    <form
                        className={classes.createCategory__form}
                        onSubmit={submitHandler}
                    >
                        <div
                            className={classes.createCategory__input_container}
                        >
                            <label htmlFor='categoryName'>
                                اسم القسم: <span>*</span>
                            </label>
                            <input
                                id='categoryName'
                                type='text'
                                placeholder='اسم القسم'
                                className={classes.createCategory__input}
                                value={categoryName}
                                autoComplete='off'
                                onChange={(e) => {
                                    dispatch(
                                        categoryItemChanged({
                                            value: e.target.value,
                                        })
                                    );
                                }}
                            />
                        </div>
                        <button type='submit'>
                            {loading ? <Spinner width='2rem' /> : "تعديل"}
                        </button>
                    </form>
                </div>
            </section>
        </>
    );
}

export default Edit_Category;

// Serverside function
export async function getServerSideProps(context) {
    const { id, name } = context.query;
    // get the crole and authenticated from cookie
    const cookie = context.req.headers.cookie;
    // get the role and authenticated from cooki
    const role = cookie?.split(";")?.find((c) => c.trim().startsWith("role="));
    const authenticated = cookie
        ?.split(";")
        ?.find((c) => c.trim().startsWith("authenticated="));

    // redirect if not authenticated || no role
    if (!authenticated || !role) {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }

    //  get the role and authenticated values
    const roleValue = role.split("=")[1];
    const authenticatedValue = authenticated.split("=")[1];

    // check and redirect to the right page
    if (authenticatedValue === "true" && roleValue === "admin") {
        return {
            props: {
                id,
                name,
            },
        };
    } else {
        return {
            redirect: {
                destination: "/",
                permanent: false,
            },
        };
    }
}
