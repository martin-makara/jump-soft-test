import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getItem } from "../components/functions";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";

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
		<main className="d-flex flex-column">
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
												<option value="1">Active</option>
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
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="16"
													height="16"
													fill="white"
													className="bi bi-plus-circle-fill"
													viewBox="0 0 16 16"
												>
													<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
												</svg>
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
												{state === "0"
													? "Deadline: " + new Date(deadline).toLocaleString()
													: state === "1"
													? "Completed"
													: "Expired"}
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
														{state === "0" ? (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="20"
																height="20"
																fill="#00a96e"
																className="bi bi-check-circle"
																viewBox="0 0 16 16"
															>
																<path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
																<path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
															</svg>
														) : state === "1" ? (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="20"
																height="20"
																fill="white"
																className="bi bi-check-circle-fill"
																viewBox="0 0 16 16"
															>
																<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
															</svg>
														) : (
															<svg
																xmlns="http://www.w3.org/2000/svg"
																width="20"
																height="20"
																fill="white"
																className="bi bi-x-circle-fill"
																viewBox="0 0 16 16"
															>
																<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z" />
															</svg>
														)}
													</button>
													<button type="button" className="btn btn-danger" onClick={() => deleteTodo(id)}>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															width="20"
															height="20"
															fill="white"
															className="bi bi-trash-fill"
															viewBox="0 0 16 16"
														>
															<path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0" />
														</svg>
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
			<div id="alert" class="alert alert-warning position-absolute top-0 start-0 mt-4 ms-4 z-n1 opacity-0" role="alert">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					fill="currentColor"
					class="bi bi-exclamation-triangle"
					viewBox="0 0 16 16"
				>
					<path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.15.15 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.2.2 0 0 1-.054.06.1.1 0 0 1-.066.017H1.146a.1.1 0 0 1-.066-.017.2.2 0 0 1-.054-.06.18.18 0 0 1 .002-.183L7.884 2.073a.15.15 0 0 1 .054-.057m1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767z" />
					<path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
				</svg>
				Warning: Deadline is passed!
			</div>
		</main>
	);
}
