import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { getItem } from "../components/functions";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";

const schema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	username: Joi.string().alphanum().min(3).max(30).required(),
	password: Joi.string().min(8).required(),
});

export default function Register() {
	const navigation = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	const date = new Date();
	const getUserUrl = new URL("https://6653697c1c6af63f4674a111.mockapi.io/api/users");

	const registerUser = (data) => {
		fetch("https://6653697c1c6af63f4674a111.mockapi.io/api/users", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.catch((error) => console.error(error))
			.finally(() => {
				alert("You have successfully registered!");
				navigation("/login");
			});
	};

	const onSubmit = (data) => {
		data.createdAt = date.toLocaleString();
		getUserUrl.searchParams.set("mail", data.email);

		fetch(getUserUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				if (response === "Not found" || response.length === 0) {
					registerUser(data);
				} else {
					alert("This email is already registered!");
				}
			})
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		if (getItem("user")) {
			navigation("/");
		}
	}, []);

	return (
		<main className="d-flex flex-column vh-100 justify-content-between aling-items-center">
			<Header title="Register" link="/login" linkText="Login" />
			<div className="container d-flex justify-content-center">
				<form onSubmit={handleSubmit(onSubmit)}>
					<LabelForAuthForm
						errorName={errors.email}
						labelText="Email"
						inputType="email"
						placeholder="Email"
						name="email"
						func={register}
						icon={
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="svg-icon">
								<path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
								<path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
							</svg>
						}
						errorText="Please enter a valid email address"
					/>
					<LabelForAuthForm
						errorName={errors.username}
						labelText="Username"
						inputType="text"
						placeholder="Username"
						name="username"
						func={register}
						icon={
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="svg-icon">
								<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
							</svg>
						}
						errorText="Username must be at least 3 characters long"
					/>
					<LabelForAuthForm
						errorName={errors.password}
						labelText="Password"
						inputType="password"
						placeholder="Password"
						name="password"
						func={register}
						icon={
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className="svg-icon">
								<path
									fillRule="evenodd"
									d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
									clipRule="evenodd"
								/>
							</svg>
						}
						errorText="Password must be at least 8 characters long"
					/>
					<button className="btn w-100 custom-button" type="submit">
						Register
					</button>
				</form>
			</div>
			<div></div>
		</main>
	);
}
