import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getItem } from "../components/functions";
import { useNavigate } from "react-router-dom";
import { joiResolver } from "@hookform/resolvers/joi";
import Joi from "joi";
import Header from "../components/Header";
import LabelForAuthForm from "../components/LabelForAuthForm";

const schema = Joi.object({
	title: Joi.string().required(),
});

export default function App() {
	const navigation = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: joiResolver(schema),
	});

	const [todos, setTodos] = useState([]);

	const url = `https://6653697c1c6af63f4674a111.mockapi.io/api/users/${getItem("user")}/todoLists`;

	const fetchTodos = () => {
		fetch(url)
			.then((response) => response.json())
			.then((responseData) => {
				setTodos(responseData);
			})
			.catch((error) => console.error(error));
	};

	const logout = () => {
		if (typeof window === "undefined") {
			return null;
		}
		localStorage.removeItem("user");
		navigation("/login");
	};

	const onSubmit = (data) => {
		const date = new Date();
		data.createdAt = date.toLocaleString();
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((responseData) => setTodos((prevTodos) => [...prevTodos, responseData]))
			.catch((error) => console.error(error));
	};

	const deleteTodo = (id) => {
		fetch(`${url}/${id}`, {
			method: "DELETE",
		})
			.then((response) => response.json())
			.then(() => setTodos(todos.filter((todo) => todo.id !== id)))
			.catch((error) => console.error(error));
	};

	useEffect(() => {
		getItem("user");
		if (!getItem("user")) {
			logout();
		}
	}, []);

	useEffect(() => {
		fetchTodos();
	}, []);

	return (
		<main className="d-flex flex-column">
			<Header
				breadcrumbs={
					<nav aria-label="breadcrumb">
						<ol className="breadcrumb">
							<li className="breadcrumb-item active" aria-current="page">
								Home
							</li>
						</ol>
					</nav>
				}
				title="Todo Lists"
				button={true}
			/>
			<div className="container">
				<div className="row justify-content-center mt-5">
					<div className="col-md-6">
						<table className="table table-hover">
							<thead>
								<tr className="custom-table-head">
									<th scope="col" className="bg-transparent fw-bold">
										#
									</th>
									<th scope="col" className="bg-transparent fw-bold">
										Name
									</th>
									<th scope="col" className="bg-transparent fw-bold">
										Created At
									</th>
									<th scope="col" className="bg-transparent">
										<button
											type="button"
											className="btn btn-primary float-end"
											data-bs-toggle="modal"
											data-bs-target="#todoListModal"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												width="20"
												height="20"
												fill="white"
												className="bi bi-plus-circle-fill"
												viewBox="0 0 16 16"
											>
												<path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
											</svg>
										</button>
									</th>
								</tr>
							</thead>
							<tbody>
								{todos.map(({ id, createdAt, title }) => (
									<tr className="custom-table-body" key={`key-${id}`}>
										<th scope="row" className="bg-transparent" onClick={() => navigation(`/todo-list/${id}`)}>
											{id}
										</th>
										<th
											className="bg-transparent text-truncate"
											style={{ maxWidth: "200px" }}
											onClick={() => navigation(`/todo-list/${id}`)}
										>
											{title}
										</th>
										<th className="bg-transparent" onClick={() => navigation(`/todo-list/${id}`)}>
											{createdAt}
										</th>
										<th className="bg-transparent">
											<button type="button" className="btn btn-danger float-end" onClick={() => deleteTodo(id)}>
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
										</th>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div
				className="modal fade"
				id="todoListModal"
				tabIndex="-1"
				aria-labelledby="todoListModalLabel"
				aria-hidden="true"
			>
				<div className="modal-dialog modal-dialog-centered">
					<div className="modal-content">
						<div className="modal-header">
							<h3 className="modal-title fw-bold fs-2 mb-3" id="todoListModalLabel">
								New todo list
							</h3>
							<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<form id="todoListForm" onSubmit={handleSubmit(onSubmit)}>
								<LabelForAuthForm
									errorName={errors.title}
									labelText="Title"
									inputType="text"
									placeholder="Todo list title"
									name="title"
									func={register}
									errorText="Title is required"
								/>
							</form>
						</div>
						<div className="modal-footer">
							<button form="todoListForm" type="submit" className="btn custom-button" data-bs-dismiss="modal">
								Add
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
