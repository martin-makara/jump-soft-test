import { NavLink, useNavigate } from "react-router-dom";
import IconLogout from "../assets/Icon-logout";

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
						<IconLogout />
					</button>
				)}
			</div>
		</header>
	);
}
