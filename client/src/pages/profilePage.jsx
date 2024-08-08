import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./placesPage";
import AccountNav from "../AccountNav";
import FavoritesPage from "./favoritesPage.jsx";
import Image from "../Image.jsx";

export default function ProfilePage() {
	const [redirect, setRedirect] = useState(null);
	const { ready, user, setUser } = useContext(UserContext);
	const [userPhotoUseState, setUserPhotoUseState] = useState([]);
	const [loadingPhoto, setLoadingPhoto] = useState(false);
	let { subpage } = useParams();

	useEffect(() => {
		if (user && user.profilePhoto !== undefined) {
			console.log("user.profiel photo", user.profilePhoto);
			setUserPhotoUseState([user.profilePhoto]);
		}
	}, [user]);

	if (subpage === undefined) subpage = "profile";

	if (!ready) {
		return <div>loading...</div>;
	}

	if (ready && !user && !redirect) {
		return <Navigate to={"/login"}></Navigate>;
	}

	async function logout() {
		await axios.post("/logout");
		setRedirect("/");
		setUser(null);
	}

	if (redirect) {
		return <Navigate to={redirect} />;
	}

	function changeProfilePhoto(ev) {
		setLoadingPhoto(true);
		const files = ev.target.files;
		const data = new FormData();

		for (let i = 0; i < files.length; i++) {
			data.append("photos", files[i]);
		}

		axios
			.post("/upload", data, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			})
			.then((res) => {
				console.log("res", res);
				const { data: filenames } = res;
				setUserPhotoUseState(filenames);
				console.log("filenames", filenames);
				console.log("usestate", userPhotoUseState);
				return filenames;
			})
			.then((filenames) => {
				// Update the user's profile photo with users id and photo name
				axios
					.put("/user-profile-photo", { profilePhoto: filenames })
					.then((res) => {
						setUser(res.data);
					});
				setLoadingPhoto(false);
			});
	}

	return (
		<div>
			{loadingPhoto && (
				<div className="fixed z-30 left-0 top-0 h-screen w-screen bg-black opacity-50">
					<h1 className="text-6xl text-white font-bold fixed top-1/2 left-1/2">
						. . .
					</h1>
				</div>
			)}
			<AccountNav />
			{subpage === "profile" && (
				<div>
					<div className="w-full flex justify-center">
						<div className="max-w-4xl border-2 flex justify-between border-gray-200 p-7 rounded-2xl  shadow-[0_0_10px_10px_rgba(0,0,0,0.1)] ">
							<div>
								<div className="flex text-center relative">
									{!userPhotoUseState[0] && (
										<div className=" bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 24 24"
												fill="currentColor"
												className="relative top-1 size-40"
											>
												<path
													fillRule="evenodd"
													d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
													clipRule="evenodd"
												/>
											</svg>
										</div>
									)}
									{userPhotoUseState[0] && (
										<div>
											<Image
												className="aspect-square rounded-full w-40 "
												src={userPhotoUseState[0]}
												alt="photo"
											></Image>
										</div>
									)}
									<label className="absolute bg-black bg-opacity-70 text-white p-2 rounded-full bottom-2 cursor-pointer right-2">
										<input
											type="file"
											className="hidden"
											onChange={(ev) => {
												changeProfilePhoto(ev);
											}}
										></input>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											strokeWidth={1.5}
											stroke="currentColor"
											className="size-5"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
											/>
										</svg>
									</label>
								</div>
							</div>
							<div className="border-l-2 ml-5">
								<h1 className="pt-5 pl-5 text-xl font-medium text-gray-500">
									Name:{" "}
									<span className="text-2xl text-black font-semibold">
										{user.name}
									</span>
								</h1>
								<h1 className="pt-5 pl-5 text-xl font-medium text-gray-500">
									Email:{" "}
									<span className="text-2xl text-black font-semibold">
										{user.email}
									</span>
								</h1>
							</div>
						</div>
					</div>
					<div className="w-full justify-center flex">
						<button
							onClick={logout}
							className="mt-10 bg-primary px-20 py-2 text-2xl text-white rounded-2xl hover:bg-hoverPrimary"
						>
							Logout
						</button>
					</div>
				</div>
			)}
			{subpage === "bookings" && <div>Bookings</div>}
			{subpage === "places" && <PlacesPage />}
			{subpage === "favorites" && <FavoritesPage />}
		</div>
	);
}
