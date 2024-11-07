import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import { getItem, setWithExpiry } from "../components/functions";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";
import IconMail from "../assets/Icon-mail";
import IconPassword from "../assets/Icon-password";

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
		<main className="d-flex flex-column vh-100 justify-content-between aling-items-center overflow-hidden">
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
						icon={<IconMail />}
						errorText="Please enter a valid email address"
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
						Login
					</button>
				</form>
			</div>
			<div></div>
		</main>
	);
}
