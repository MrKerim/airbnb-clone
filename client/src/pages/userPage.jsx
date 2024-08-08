import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./placesPage";
import AccountNav from "../AccountNav";
import FavoritesPage from "./favoritesPage.jsx";
import Image from "../Image.jsx";

export default function UserPage() {
	const [user, setUser] = useState("");
	const [userPhotoUseState, setUserPhotoUseState] = useState([]);
	const [redirect, setRedirect] = useState(false);
	const { id } = useParams();
	const {
		ready,
		user: loggedInUser,
		setUser: setLoggedInUser,
	} = useContext(UserContext);

	useEffect(() => {
		axios.get(`/users/${id}`).then(({ data }) => {
			setUser(data);
		});
	}, []);

	useEffect(() => {
		if (loggedInUser?._id === user?._id) {
			setRedirect(true);
		}
	}, [loggedInUser, user]);

	useEffect(() => {
		if (user && user.profilePhoto !== undefined) {
			console.log("user.profiel photo", user.profilePhoto);
			setUserPhotoUseState([user.profilePhoto]);
		}
	}, [user]);

	if (redirect) {
		return <Navigate to="/account"></Navigate>;
	}

	return (
		<div>
			<div>
				<div className="w-full flex mt-20 justify-center">
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
			</div>
		</div>
	);
}
