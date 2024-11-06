import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import TodoList from "./pages/todoList";
import Login from "./pages/login";
import Register from "./pages/register";
import "./App.css";

function App() {
	return (
		<>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/todo-list/:id" element={<TodoList />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
			</Routes>
		</>
	);
}

export default App;
