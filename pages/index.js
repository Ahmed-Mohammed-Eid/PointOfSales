import React, { useState, useRef, useEffect } from "react";
import classes from "@/styles/login.module.scss";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";

// Imports
import Spinner from "@/components/Spinner/Spinner";
// Notifications
import { toast } from "react-toastify";
// Axios
import axios from "axios";

function Login() {
	// Router
	const router = useRouter();

	// States
	const [sending, setSending] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [rememberMe, setRememberMe] = useState(false);

	// Refs
	const userName_Ref = useRef();
	const password_Ref = useRef();

	// Load remembered username if exists
	useEffect(() => {
		const rememberedUser = localStorage.getItem("remembered_user");
		if (rememberedUser) {
			userName_Ref.current.value = rememberedUser;
			setRememberMe(true);
		}
	}, []);

	// Submit handler
	const submitHandler = async (e) => {
		// prevent Default
		e.preventDefault();
		// get the inputs value
		const userName = userName_Ref.current.value;
		const password = password_Ref.current.value;

		if (userName === "" || password === "") {
			toast.error("Please fill all the fields");
			return;
		}

		if (password.trim().length < 6) {
			toast.error("Password must be at least 6 characters");
			return;
		}

		// Handle remember me
		if (rememberMe) {
			localStorage.setItem("remembered_user", userName);
		} else {
			localStorage.removeItem("remembered_user");
		}

		// Change the state
		setSending(true);
		// Send Request
		await axios
			.post(`https://posapi.kportals.net/api/v1/login`, {
				username: userName,
				password: password,
			})
			.then((res) => {
				setSending(false);
				if (res.status === 200 && res.data.token) {
					// Data
					toast.success("Login Successful");
					localStorage.setItem("token", res.data.token);
					localStorage.setItem("role", res.data.role);
					localStorage.setItem("login_id", res.data.userId);
					localStorage.setItem("branch_id", res.data.branchId);
					localStorage.setItem("user_name", res.data.fullName);
					// Set the token at cookie
					document.cookie = `role=${res.data.role}`;
					document.cookie = `authenticated=${true}`;
					// check the role of the user to redirect him to the right page
					if (res.data.role === "admin") {
						router.push("/admin");
					} else if (res.data.role === "callcenter") {
						router.push("/callcenter");
					} else if (res.data.role === "cashier") {
						router.push("/callcenter");
					}
				}
			})
			.catch((err) => {
				setSending(false);
				toast.error(err.response?.data?.message || err.message);
			});
	};

	return (
		<>
			<Head>
				<title>Login</title>
				<meta name="description" content="Login page" />
			</Head>
			<section className={classes.Login}>
				<div className={classes.Login__container}>
					<div className={classes.Login__header}>
						<Image
							src="/pos_favicon.png"
							width={50}
							height={50}
							alt="logo"
							className={classes.Login__logo}
						/>
						<h2 className={classes.Login__title}>تسجيل الدخول</h2>
					</div>
					<form
						className={classes.Login__form}
						onSubmit={submitHandler}
					>
						<div className={classes.Login__input_container}>
							<label htmlFor="userName">
								اسم المستخدم: <span>*</span>
							</label>
							<div className={classes.Login__input_wrapper}>
								<input
									ref={userName_Ref}
									id="userName"
									type="text"
									placeholder="اسم المستخدم(A7med_2001)"
									className={classes.Login__input}
									autoComplete="username"
								/>
								<svg
									className={classes.Login__icon}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
								>
									<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
									<circle cx="12" cy="7" r="4"></circle>
								</svg>
							</div>
						</div>

						<div className={classes.Login__input_container}>
							<label htmlFor="password">
								كلمة المرور: <span>*</span>
							</label>
							<div className={classes.Login__input_wrapper}>
								<input
									ref={password_Ref}
									id="password"
									type={showPassword ? "text" : "password"}
									placeholder="كلمة المرور"
									className={classes.Login__input}
									autoComplete="current-password"
								/>
								<svg
									className={`${classes.Login__icon} ${classes.Login__icon_clickable}`}
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									onClick={() =>
										setShowPassword(!showPassword)
									}
								>
									{showPassword ? (
										<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24 M1 1l22 22" />
									) : (
										<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3z" />
									)}
								</svg>
							</div>
						</div>

						<div className={classes.Login__remember_me}>
							<label
								className={classes.Login__checkbox_container}
							>
								<input
									type="checkbox"
									checked={rememberMe}
									onChange={(e) =>
										setRememberMe(e.target.checked)
									}
								/>
								<span
									className={classes.Login__checkmark}
								></span>
								تذكرني
							</label>
						</div>

						<button
							type="submit"
							className={
								sending ? classes.Login__button_loading : ""
							}
						>
							{sending ? (
								<Spinner width={"2rem"} />
							) : (
								<>
									تسجيل الدخول
									<svg
										className={classes.Login__button_icon}
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3" />
									</svg>
								</>
							)}
						</button>
					</form>
				</div>
			</section>
		</>
	);
}

export default Login;

// Serverside function
export async function getServerSideProps(context) {
	// get the crole and authenticated from cookie
	const cookie = context.req.headers.cookie;
	// get the role and authenticated from cooki
	const role = cookie?.split(";")?.find((c) => c.trim().startsWith("role="));
	const authenticated = cookie
		?.split(";")
		?.find((c) => c.trim().startsWith("authenticated="));

	// continue if not authenticated || no role
	if (!authenticated || !role) {
		return {
			props: {},
		};
	}

	//  get the role and authenticated values
	const roleValue = role.split("=")[1];
	const authenticatedValue = authenticated.split("=")[1];

	// check and redirect to the right page
	if (authenticatedValue === "true") {
		if (roleValue === "admin") {
			return {
				redirect: {
					destination: "/admin",
					permanent: false,
				},
			};
		} else if (roleValue === "callcenter") {
			return {
				redirect: {
					destination: "/callcenter",
					permanent: false,
				},
			};
		} else if (roleValue === "cashier") {
			return {
				redirect: {
					destination: "/callcenter",
					permanent: false,
				},
			};
		} else {
			return {
				props: {},
			};
		}
	}
}
