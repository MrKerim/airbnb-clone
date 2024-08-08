import axios from "axios";
import { useEffect, useContext, useState } from "react";
import { UserContext } from "../UserContext.jsx";
import { Link, useParams, Navigate } from "react-router-dom";
import BookingWidget from "../BookingWidget.jsx";
import Image from "../Image.jsx";

export default function PlacePage() {
	const { user, setUser } = useContext(UserContext);
	const { id } = useParams();
	const [place, setPlace] = useState(null);
	const [houseOwner, setHouseOwner] = useState(null);
	const [redirect, setRedirect] = useState(false);
	const [showAllPhotos, setShowAllPhotos] = useState(false);
	const [currentPhoto, setCurrentPhoto] = useState(0);

	useEffect(() => {
		if (!id) {
			return;
		}
		axios.get("/places/" + id).then(({ data }) => {
			setPlace(data);
		});
	}, [id]);

	useEffect(() => {
		if (!place) {
			return;
		}
		axios.get("/users/" + place.owner).then(({ data }) => {
			setHouseOwner(data);
		});
	}, [place]);

	if (!place || !houseOwner) {
		return <div>Loading...</div>;
	}

	if (showAllPhotos) {
		return (
			<div className="fixed top-0 left-0 bg-black min-w-full min-h-screen">
				<div className="flex  justify-center">
					<button
						onClick={() => setShowAllPhotos(false)}
						className=" flex gap-1 text-white text-2xl rounded-2xl absolute top-10 left-10 px-6 py-3 hover:bg-gray-600"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={2}
							stroke="currentColor"
							className="size-8"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M6 18 18 6M6 6l12 12"
							/>
						</svg>
						<span>Close</span>
					</button>
					<h1 className="mt-10 p-3 text-2xl text-white">
						{currentPhoto + 1} / {place?.photos.length}
					</h1>
				</div>
				<div className=" w-screen h-screen flex text-white justify-center mt-10 py-10">
					<button
						onClick={() => {
							if (currentPhoto > 0) setCurrentPhoto(currentPhoto - 1);
						}}
						className=" absolute top-1/2 left-10 p-5 rounded-full border-2 hover:bg-gray-700 duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
							/>
						</svg>
					</button>
					<Image
						className=" rounded-2xl mb-40 "
						src={"" + place.photos[currentPhoto]}
						alt="place"
					/>
					<button
						onClick={() => {
							if (currentPhoto < place.photos.length - 1)
								setCurrentPhoto(currentPhoto + 1);
						}}
						className=" absolute top-1/2 right-10 p-5 rounded-full border-2 hover:bg-gray-700 duration-200"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.5}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
							/>
						</svg>
					</button>
				</div>
			</div>
		);
	}

	function addToFavorites(ev) {
		ev.preventDefault();

		if (!user) {
			setRedirect(true);
			return;
		}

		if (!user.favoritePlaces?.includes(place._id)) {
			axios.put("/user/favorites", { placeId: place._id }).then((res) => {
				const { data } = res;
				setUser(data);
			});
		} else {
			axios
				.delete("/user/favorites", { data: { placeId: place._id } })
				.then((res) => {
					const { data } = res;
					setUser(data);
				})
				.catch((error) => {
					console.error("Error deleting favorite:", error);
				});
		}
	}

	function shareTheUrl(ev) {
		ev.preventDefault();
		navigator.clipboard.writeText(window.location.href);
		alert("URL copied to clipboard");
	}

	if (redirect) {
		return <Navigate to="/login" />;
	}

	return (
		<div>
			<div className="border-t-2 mt-5">
				<div className="flex justify-between  p-5 ml-5 mr-5 items-center ">
					<h1 className="font-medium text-3xl">{place.title}</h1>
					<div className="flex gap-5">
						<button
							onClick={(ev) => {
								shareTheUrl(ev);
							}}
							className="flex gap-1 justify-center underline font-medium"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={1.5}
								stroke="currentColor"
								className="size-7"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
								/>
							</svg>
							<span>Share</span>
						</button>
						<button
							onClick={(ev) => {
								addToFavorites(ev);
							}}
							className="flex gap-1 justify-center underline font-medium "
						>
							{!user?.favoritePlaces?.includes(place._id) && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-7"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
									/>
								</svg>
							)}
							{user?.favoritePlaces?.includes(place._id) && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="red"
									className="size-7"
								>
									<path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
								</svg>
							)}
							<span>Favorite</span>
						</button>
					</div>
				</div>
				<div className="flex mt-4 ml-10 mr-10 gap-2 relative">
					<div className="w-1/2">
						{place.photos.length > 0 && (
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCurrentPhoto(0);
									setShowAllPhotos(true);
								}}
								className="hover:brightness-75"
							>
								<Image
									className="object-cover w-full h-full  rounded-tl-2xl rounded-bl-2xl aspect-square"
									src={place.photos[0]}
									alt="place"
								/>
							</button>
						)}
					</div>
					<div className="w-1/2 grid grid-cols-2 mb-2 gap-2">
						{place.photos.length > 1 && (
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCurrentPhoto(1);
									setShowAllPhotos(true);
								}}
								className="hover:brightness-75"
							>
								<Image
									className="object-cover aspect-square"
									src={place.photos[1]}
									alt="place"
								/>
							</button>
						)}
						{place.photos.length > 2 && (
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCurrentPhoto(2);
									setShowAllPhotos(true);
								}}
								className="hover:brightness-75"
							>
								<Image
									className="object-cover  rounded-tr-2xl aspect-square"
									src={place.photos[2]}
									alt="place"
								/>
							</button>
						)}
						{place.photos.length > 3 && (
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCurrentPhoto(3);
									setShowAllPhotos(true);
								}}
								className="hover:brightness-75"
							>
								<Image
									className="object-cover  aspect-square"
									src={place.photos[3]}
									alt="place"
								/>
							</button>
						)}
						{place.photos.length > 4 && (
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCurrentPhoto(4);
									setShowAllPhotos(true);
								}}
								className="hover:brightness-75"
							>
								<Image
									className="object-cover   rounded-br-2xl aspect-square"
									src={place.photos[4]}
									alt="place"
								/>
							</button>
						)}
					</div>
					<button
						onClick={(ev) => {
							ev.preventDefault();
							setShowAllPhotos(true);
						}}
						className="bg-white border-2 border-black rounded-xl absolute flex gap-2 py-2 px-4 text-lg font-medium items-center shadow-md right-5 bottom-5 hover:bg-gray-100 "
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							strokeWidth={1.6}
							stroke="currentColor"
							className="size-6"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
							/>
						</svg>

						<h1>Show all photos</h1>
					</button>
				</div>
			</div>
			<div className="mt-10 ml-10 mr-10 flex  sm:block md:block lg:flex h-full">
				<div className=" w-2/3 mr-20 h-full ">
					<div className=" border-b-2 pb-5 font-normal text-3xl">
						<h1>{place.address}</h1>
						<h1 className="text-lg text-gray-600 ">
							&middot; {place.maxGuests} Guests &middot;
						</h1>
					</div>
					<Link
						to={"/user/" + houseOwner._id}
						className="flex mt-5 items-center border-b-2 pb-5"
					>
						{!houseOwner.profilePhoto && (
							<div className=" bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="relative top-1 size-20"
								>
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						)}
						{houseOwner.profilePhoto && (
							<div>
								<Image
									className="aspect-square rounded-full w-20 "
									src={`${houseOwner.profilePhoto}`}
									alt="photo"
								></Image>
							</div>
						)}

						<h1 className="ml-3 text-gray-600 text-lg">
							{"Host: "}
							<span className="font-normal text-black text-lg">
								{houseOwner.name}
							</span>
						</h1>
					</Link>
					<div className="border-b-2 pb-5 pt-2">
						<h1 className="font-medium text-2xl mt-5 mb-5 text-start">
							&middot; What does this place offers to you?
						</h1>
						{place.perks.includes("wifi") && (
							<label className=" p-5 flex gap-4 justify-start ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.8}
									stroke="currentColor"
									className="size-8"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 0 1 1.06 0Z"
									/>
								</svg>
								<span className="font-medium text-gray-500 text-xl">
									Has wifi
								</span>
							</label>
						)}
						{place.perks.includes("pets") && (
							<label className=" p-5 flex gap-4 justify-start ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="2em"
									height="2em"
									viewBox="0 0 512 512"
								>
									<path
										fill="black"
										d="M382.825 304.576a131.562 131.562 0 0 0-253.65 0l-18.248 66.15A80 80 0 0 0 188.046 472h135.908a80 80 0 0 0 77.119-101.274Zm-20.682 116.5A47.638 47.638 0 0 1 323.954 440H188.046a48 48 0 0 1-46.272-60.765l18.248-66.149a99.563 99.563 0 0 1 191.956 0l18.248 66.149a47.636 47.636 0 0 1-8.083 41.845ZM146.1 230.31c2.784-17.4-.908-36.027-10.4-52.463s-23.78-28.947-40.237-35.236c-17.624-6.731-35.6-5.659-50.634 3.017c-29.887 17.256-37.752 59.785-17.529 94.805c9.489 16.436 23.778 28.95 40.235 35.236a64.058 64.058 0 0 0 22.863 4.371a55.133 55.133 0 0 0 27.771-7.389c15.025-8.677 24.945-23.714 27.931-42.341m-31.6-5.058c-1.43 8.929-5.81 15.92-12.333 19.686S87.4 249 78.95 245.775c-9.613-3.671-18.115-11.251-23.941-21.342c-11.2-19.4-8.538-42.8 5.82-51.092a23.483 23.483 0 0 1 11.847-3.058a31.951 31.951 0 0 1 11.368 2.217c9.613 3.673 18.115 11.252 23.941 21.343s8.139 21.248 6.515 31.409m35.066-61.235c11.362 9.083 24.337 13.813 37.458 13.812a54.965 54.965 0 0 0 11.689-1.261c33.723-7.331 54.17-45.443 45.58-84.958c-4.03-18.546-13.828-34.817-27.588-45.818c-14.735-11.78-32.189-16.239-49.147-12.551c-33.722 7.33-54.169 45.442-45.58 84.957c4.031 18.547 13.829 34.818 27.588 45.819m24.788-99.506a22.258 22.258 0 0 1 4.732-.5c5.948 0 12.066 2.327 17.637 6.781c8.037 6.425 13.826 16.234 16.3 27.621c4.76 21.895-4.906 43.368-21.107 46.89c-7.361 1.6-15.305-.628-22.367-6.275c-8.037-6.426-13.826-16.235-16.3-27.621c-4.761-21.901 4.905-43.374 21.105-46.896m292.817 81.117c-15.028-8.676-33.013-9.748-50.634-3.017c-16.457 6.287-30.746 18.8-40.235 35.236s-13.182 35.067-10.4 52.463c2.982 18.627 12.9 33.664 27.931 42.341a55.123 55.123 0 0 0 27.771 7.389a64.054 64.054 0 0 0 22.863-4.371c16.457-6.286 30.746-18.8 40.235-35.236c20.221-35.02 12.356-77.549-17.531-94.805m-10.18 78.805c-5.826 10.091-14.328 17.671-23.941 21.342c-8.446 3.228-16.692 2.931-23.215-.837s-10.9-10.757-12.333-19.686c-1.626-10.161.686-21.314 6.513-31.4s14.328-17.67 23.941-21.343a31.955 31.955 0 0 1 11.368-2.221a23.483 23.483 0 0 1 11.847 3.058c14.358 8.285 17.023 31.682 5.82 51.087m-143.704-47.865a54.965 54.965 0 0 0 11.689 1.261c13.12 0 26.1-4.729 37.458-13.812c13.759-11 23.557-27.272 27.588-45.818c8.589-39.515-11.858-77.627-45.58-84.957c-16.957-3.686-34.412.77-49.147 12.551c-13.76 11-23.558 27.272-27.588 45.817c-8.59 39.515 11.857 77.627 45.58 84.958m-14.31-78.16c2.474-11.387 8.263-21.2 16.3-27.621c5.572-4.454 11.689-6.781 17.637-6.781a22.258 22.258 0 0 1 4.732.5c16.2 3.522 25.866 25 21.107 46.89c-2.476 11.387-8.265 21.2-16.3 27.622c-7.061 5.646-15 7.874-22.367 6.275c-16.203-3.517-25.869-24.993-21.109-46.885"
									/>
								</svg>
								<span className="font-medium text-gray-500 text-xl">
									Pets allowed
								</span>
							</label>
						)}
						{place.perks.includes("parking") && (
							<label className=" p-5 flex gap-4 justify-start ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.5}
									stroke="currentColor"
									className="size-8"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
									/>
								</svg>
								<span className="font-medium text-gray-500 text-xl">
									Parking spot
								</span>
							</label>
						)}
						{place.perks.includes("air") && (
							<label className=" p-5 flex gap-4 justify-start ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="2em"
									height="2em"
									fill="currentColor"
									className="bi bi-wind"
									viewBox="0 0 16 16"
								>
									<path d="M12.5 2A2.5 2.5 0 0 0 10 4.5a.5.5 0 0 1-1 0A3.5 3.5 0 1 1 12.5 8H.5a.5.5 0 0 1 0-1h12a2.5 2.5 0 0 0 0-5m-7 1a1 1 0 0 0-1 1 .5.5 0 0 1-1 0 2 2 0 1 1 2 2h-5a.5.5 0 0 1 0-1h5a1 1 0 0 0 0-2M0 9.5A.5.5 0 0 1 .5 9h10.042a3 3 0 1 1-3 3 .5.5 0 0 1 1 0 2 2 0 1 0 2-2H.5a.5.5 0 0 1-.5-.5" />
								</svg>
								<span className="font-medium text-gray-500 text-xl">
									Air conditioning
								</span>
							</label>
						)}
						{place.perks.includes("tv") && (
							<label className=" p-5 flex gap-4 justify-start ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.6}
									stroke="currentColor"
									className="size-8"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
									/>
								</svg>
								<span className="font-medium text-gray-500 text-xl">
									Has TV
								</span>
							</label>
						)}
						{place.perks.includes("kitchen") && (
							<label className=" p-5 flex gap-4 justify-start ">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									xmlnsXlink="http://www.w3.org/1999/xlink"
									width="2em"
									height="2em"
									viewBox="0 0 24 24"
									version="1.1"
								>
									<g
										stroke="none"
										strokeWidth="1"
										fill="none"
										fillRule="evenodd"
									>
										<rect x="0" y="0" width="24" height="24" />
										<path
											d="M3.98842709,3.05999994 L11.0594949,10.1310678 L8.23106778,12.9594949 L3.98842709,8.71685419 C2.42632992,7.15475703 2.42632992,4.62209711 3.98842709,3.05999994 Z"
											fill="#000000"
										/>
										<path
											d="M17.7539614,3.90710683 L14.8885998,7.40921548 C14.7088587,7.62889898 14.7248259,7.94903916 14.9255342,8.14974752 C15.1262426,8.35045587 15.4463828,8.36642306 15.6660663,8.18668201 L19.1681749,5.32132039 L19.8752817,6.02842717 L17.0099201,9.53053582 C16.830179,9.75021933 16.8461462,10.0703595 17.0468546,10.2710679 C17.2475629,10.4717762 17.5677031,10.4877434 17.7873866,10.3080024 L21.2894953,7.44264073 L21.9966021,8.14974752 L18.8146215,11.331728 C17.4477865,12.6985631 15.2317091,12.6985631 13.8648741,11.331728 C12.4980391,9.96489301 12.4980391,7.74881558 13.8648741,6.38198056 L17.0468546,3.20000005 L17.7539614,3.90710683 Z"
											fill="#000000"
										/>
										<path
											d="M11.0753788,13.9246212 C11.4715437,14.3207861 11.4876245,14.9579589 11.1119478,15.3736034 L6.14184561,20.8724683 C5.61370242,21.4567999 4.71186338,21.5023497 4.12753173,20.9742065 C4.10973311,20.9581194 4.09234327,20.9415857 4.0753788,20.9246212 C3.51843234,20.3676747 3.51843234,19.4646861 4.0753788,18.9077397 C4.09234327,18.8907752 4.10973311,18.8742415 4.12753173,18.8581544 L9.62639662,13.8880522 C10.0420411,13.5123755 10.6792139,13.5284563 11.0753788,13.9246212 Z"
											fill="#000000"
											opacity="0.3"
										/>
										<path
											d="M13.0754022,13.9246212 C13.4715671,13.5284563 14.1087399,13.5123755 14.5243844,13.8880522 L20.0232493,18.8581544 C20.0410479,18.8742415 20.0584377,18.8907752 20.0754022,18.9077397 C20.6323487,19.4646861 20.6323487,20.3676747 20.0754022,20.9246212 C20.0584377,20.9415857 20.0410479,20.9581194 20.0232493,20.9742065 C19.4389176,21.5023497 18.5370786,21.4567999 18.0089354,20.8724683 L13.0388332,15.3736034 C12.6631565,14.9579589 12.6792373,14.3207861 13.0754022,13.9246212 Z"
											fill="#000000"
											opacity="0.3"
										/>
									</g>
								</svg>
								<span className="font-medium text-gray-500 text-xl">
									Has kitchen
								</span>
							</label>
						)}
					</div>
					<div className="border-b-2 pb-8  m-2">
						<h1 className="font-medium text-2xl mt-5 mb-5 text-start">
							&middot; About this place?
						</h1>
						<p className="text-lg text-gray-600 ">{place.description}</p>
					</div>
					<div className="border-b-2 pb-8  m-2">
						<h1 className="font-medium text-2xl mt-5 mb-5 text-start">
							&middot; Extra Information
						</h1>
						<p className="text-lg text-gray-600 ">{place.extraInfo}</p>
					</div>
					<div className="border-b-2 pb-8  m-2">
						<h1 className="font-medium text-2xl mt-5 mb-5 text-start">
							&middot; Things to know
						</h1>
						<p className="text-lg text-gray-600 ">
							Check in after{" "}
							<span className="text-black font-medium">{place.checkIn}</span>
						</p>
						<p className="text-lg text-gray-600 ">
							Check out before{" "}
							<span className="text-black font-medium">{place.checkOut}</span>
						</p>
						<p className="text-lg text-gray-600 ">
							<span className="text-black font-medium">{place.maxGuests}</span>{" "}
							guests maximum
						</p>
					</div>
				</div>
				<div className="w-1/3 h-full sm:w-2/3 md:w-2/3 lg:w-1/3 sticky top-20">
					<BookingWidget place={place} />
				</div>
			</div>
		</div>
	);
}
