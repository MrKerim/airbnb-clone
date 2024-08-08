import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	async function registerUser(ev) {
		ev.preventDefault();
		try {
			await axios.post("/register", {
				name,
				email,
				password,
			});
			alert("User registered");
		} catch (err) {
			alert("User already exist");
		}
	}
	return (
		<div className="mt-4 grow flex items-center justify-around">
			<div className="mb-64">
				<h1 className="text-4xl text-center mb-4">Sign Up</h1>
				<form className="max-w-md mx-auto" onSubmit={registerUser}>
					<input
						type="text"
						placeholder="Name Surname"
						value={name}
						onChange={(ev) => {
							setName(ev.target.value);
						}}
					/>
					<input
						type="email"
						placeholder="your@email.com"
						value={email}
						onChange={(ev) => setEmail(ev.target.value)}
					/>
					<input
						type="password"
						placeholder="password"
						value={password}
						onChange={(ev) => setPassword(ev.target.value)}
					/>
					<button className="primary ">Sign Up</button>
					<div className="text-center py-2 text-gray-500">
						Already have an account?{" "}
						<Link className="text-primary underline" to={"/login"}>
							Login here
						</Link>
					</div>
				</form>
			</div>
		</div>
	);
}
