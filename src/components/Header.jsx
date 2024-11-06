import { NavLink, useNavigate } from "react-router-dom";

export default function Header({ breadcrumbs, title, link, linkText, button }) {
	const navigation = useNavigate();

	const logout = () => {
		localStorage.removeItem("user");
		navigation("/login");
	};

	return (
		<header className="row justify-content-between aling-items-center pt-3 px-4">
			<div className="col-4 d-flex align-items-center">{breadcrumbs}</div>
			<h1 className="col-4 text-center fs-1">{title}</h1>
			<div className="col-4 text-end">
				{link && linkText && (
					<NavLink className="btn custom-button" to={link}>
						{linkText}
					</NavLink>
				)}
				{button && (
					<button type="button" className="btn custom-button" onClick={logout}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							fill="white"
							className="bi bi-box-arrow-right"
							viewBox="0 0 16 16"
						>
							<path
								fillRule="evenodd"
								d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"
							/>
							<path
								fillRule="evenodd"
								d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"
							/>
						</svg>
					</button>
				)}
			</div>
		</header>
	);
}
