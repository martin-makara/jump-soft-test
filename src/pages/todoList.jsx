import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getItem } from "../components/functions";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";
import IconAdd from "../assets/Icon-add";
import IconCheck from "../assets/Icon-check";
import IconCheckFill from "../assets/Icon-check-fill";
import IconX from "../assets/Icon-x";
import IconDelete from "../assets/Icon-delete";
import IconAlert from "../assets/Icon-alert";

const schema = Joi.object({
	title: Joi.string().required(),
	description: Joi.string().allow(""),
	deadline: Joi.date().iso().greater("now").required(),
});

export default function Todolist() {
	const navigation = useNavigate();
	const { id } = useParams();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	const [todoItems, setTodoItems] = useState([]);
	const [tmpTodoItems, setTmpTodoItems] = useState([]);

	const url = `https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getItem(`user`)}/todoLists/${id}`;

	const fetchTodoItems = () => {
		fetch(`${url}/todoItems`)
			.then((response) => response.json())
			.then((responseData) => {
				for (let i = 0; i < responseData.length; i++) {
					if (responseData[i].state === "0" && new Date(responseData[i].deadline).getTime() < new Date().getTime()) {
						doneTodo(responseData[i].id, "2");
					}
				}
				setTodoItems(responseData);
				setTmpTodoItems(responseData);
			})
			.catch((error) => console.error(error));
	};

	const onSubmit = (data) => {
		const date = new Date();
		data.createdAt = date.toLocaleString();
		data.state = "0";

		fetch(`${url}/todoItems`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then(() => fetchTodoItems())
			.catch((error) => console.error(error));
	};

	const doneTodo = (id, state) => {
		fetchTodoItems();
		fetch(`${url}/todoItems/${id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ state: state }),
		})
			.then((response) => response.json())
			.then(() => fetchTodoItems())
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id) => {
		fetch(`${url}/todoItems/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then(() => fetchTodoItems())
			.catch((error) => console.error(error));
	};

	const showAll = () => {
		setTmpTodoItems(todoItems);
	};

	const showActive = () => setTmpTodoItems(todoItems.filter((item) => item.state === "0"));

	const showCompleted = () => setTmpTodoItems(todoItems.filter((item) => item.state === "1"));

	const showExpired = () => setTmpTodoItems(todoItems.filter((item) => item.state === "2"));

	useEffect(() => {
		getItem("user");
		if (!getItem("user")) {
			navigation("/login");
		} else {
			fetchTodoItems();
		}
	}, []);

	return (
		<main className="d-flex flex-column overflow-hidden">
			<Header
				breadcrumbs={
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item">
								<NavLink to="/">Home</NavLink>
							</li>
							<li className="breadcrumb-item active" aria-current="page">
								Todo list {id}
							</li>
						</ol>
					</nav>
				}
				title={`Todo List ${id}`}
				button={true}
			/>

			<div className="container">
				<div className="row justify-content-center mt-5">
					<div className="col">
						<form onSubmit={handleSubmit(onSubmit)} className="w-100 mt-2">
							<table className="w-100 table table-hover">
								<thead>
									<tr className="custom-table-head">
										<th scope="col" className="bg-transparent fw-bold">
											#
										</th>
										<th scope="col" className="bg-transparent fw-bold">
											Name
										</th>
										<th scope="col" className="bg-transparent fw-bold">
											Description
										</th>
										<th scope="col" className="bg-transparent fw-bold">
											State
										</th>
										<th scope="col" className="d-flex justify-content-between align-items-center bg-transparent">
											<input
												className="form-control bg-transparent p-2 custom-input"
												type="text"
												placeholder="Search title"
												onChange={(e) => {
													const searchValue = e.target.value.toLowerCase();
													const filteredItems = todoItems.filter((item) =>
														item.title.toLowerCase().includes(searchValue)
													);
													setTmpTodoItems(filteredItems);
												}}
											/>
											<select
												defaultValue={0}
												className="form-select"
												onChange={(e) => {
													const value = e.target.value;
													if (value === "1") showActive();
													else if (value === "2") showCompleted();
													else if (value === "3") showExpired();
													else showAll();
												}}
											>
												<option value="0">Show all</option>
												<option value="1">In progress</option>
												<option value="2">Completed</option>
												<option value="3">Expired</option>
											</select>
										</th>
									</tr>
								</thead>
								<tbody>
									<tr className="custom-table-head">
										<th scope="col" className="bg-transparent"></th>
										<th scope="col" className="bg-transparent">
											<LabelForAuthForm
												errorName={errors.title}
												labelText="Title"
												inputType="text"
												placeholder="Todo item title"
												name="title"
												func={register}
												errorText="Title is required"
											/>
										</th>
										<th scope="col" className="bg-transparent">
											<LabelForAuthForm
												labelText="Description"
												inputType="text"
												placeholder="Description"
												name="description"
												func={register}
											/>
										</th>
										<th scope="col" className="bg-transparent">
											<LabelForAuthForm
												errorName={errors.deadline}
												labelText="Deadline"
												inputType="datetime-local"
												placeholder="Deadline"
												name="deadline"
												func={register}
												errorText="Please enter a valid deadline"
											/>
										</th>
										<th scope="col" className="bg-transparent">
											<button type="submit" className="btn btn-primary float-end">
												<IconAdd />
											</button>
										</th>
									</tr>
									{tmpTodoItems.map(({ id, title, description, deadline, state }) => (
										<tr className="custom-table-body" key={"key" + id}>
											<th scope="row" className="bg-transparent">
												{id}
											</th>
											<th className="bg-transparent">{title}</th>
											<th className="bg-transparent">{description}</th>
											<th className="bg-transparent">
												{state === "0" ? "In progress" : state === "1" ? "Completed" : "Expired"}
												<br />
												{"Deadline: " + new Date(deadline).toLocaleString()}
											</th>
											<th className="bg-transparent">
												<div className="float-end">
													<button
														type="button"
														id="doneBtn"
														className={
															"btn me-2" +
															(state === "0" ? " btn-outline-success" : "") +
															(state === "1" ? " btn-success" : "") +
															(state === "2" ? " btn-warning" : "")
														}
														onClick={
															Number(new Date(deadline).getTime()) < Number(new Date().getTime())
																? () => {
																		const alertElement = document.getElementById("alert");
																		if (alertElement) {
																			alertElement.classList.remove("opacity-0");
																			alertElement.classList.add("z-3", "opacity-100");
																			setTimeout(() => alertElement.classList.remove("opacity-100"), 2000);
																			setTimeout(() => alertElement.classList.add("z-n1", "opacity-0"), 2000);
																		}
																  }
																: () => doneTodo(id, state === "0" ? "1" : "0")
														}
													>
														{state === "0" ? <IconCheck /> : state === "1" ? <IconCheckFill /> : <IconX />}
													</button>
													<button type="button" className="btn btn-danger" onClick={() => deleteTodo(id)}>
														<IconDelete />
													</button>
												</div>
											</th>
										</tr>
									))}
								</tbody>
							</table>
						</form>
					</div>
				</div>
			</div>
			<div
				id="alert"
				className="alert alert-warning position-absolute top-0 start-0 mt-4 ms-4 z-n1 opacity-0"
				role="alert"
			>
				<IconAlert />
				Warning: Deadline is passed!
			</div>
		</main>
	);
}
