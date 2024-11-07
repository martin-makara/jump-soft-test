import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { getItem } from "../components/functions";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";
import IconMail from "../assets/Icon-mail";
import IconUser from "../assets/Icon-user";
import IconPassword from "../assets/Icon-password";

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
		<main className="d-flex flex-column vh-100 justify-content-between aling-items-center overflow-hidden">
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
						icon={<IconMail />}
						errorText="Please enter a valid email address"
					/>
					<LabelForAuthForm
						errorName={errors.username}
						labelText="Username"
						inputType="text"
						placeholder="Username"
						name="username"
						func={register}
						icon={<IconUser />}
						errorText="Username must be at least 3 characters long"
					/>
					<LabelForAuthForm
						errorName={errors.password}
						labelText="Password"
						inputType="password"
						placeholder="Password"
						name="password"
						func={register}
						icon={<IconPassword />}
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
