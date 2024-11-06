import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { getItem, setWithExpiry } from "../components/functions";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";

const schema = Joi.object({
	email: Joi.string()
		.email({ tlds: { allow: false } })
		.required(),
	password: Joi.string().min(8).required(),
});

export default function Login() {
	const navigation = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	const getUserUrl = new URL("https://6653697c1c6af63f4674a111.mockapi.io/api/users");

	const loginUser = (id) => {
		setWithExpiry("user", id, 2592000000);
		navigation("/");
	};

	const onSubmit = (data) => {
		getUserUrl.searchParams.set("email", data.email);
		getUserUrl.searchParams.set("password", data.password);
		fetch(getUserUrl, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((response) => response.json())
			.then((response) => {
				if (response === "Not found") {
					alert("This email is not registered!");
				} else {
					loginUser(response[0].id);
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
			<Header title="Login" link="/register" linkText="Register" />
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
						Login
					</button>
				</form>
			</div>
			<div></div>
		</main>
	);
}
