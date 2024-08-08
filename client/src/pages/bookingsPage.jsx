import { Link } from "react-router-dom";
import AccountNav from "../AccountNav";
import { useEffect, useState } from "react";
import Image from "../Image.jsx";
import axios from "axios";
export default function BookingsPage() {
	const [bookings, setBookings] = useState([]);
	const [places, setPlaces] = useState([]);
	const [placeHosts, setPlaceHosts] = useState([]);

	useEffect(() => {
		axios
			.get("/account/bookings")
			.then(({ data }) => {
				setBookings(data);
				return data;
			})
			.then(async (data) => {
				const placeArray = [];
				const placeIds = data.map((booking) => booking.place);
				for (const placeId of placeIds) {
					const res = await axios.get("/places/" + placeId);
					placeArray.push(res.data);
				}
				setPlaces(placeArray);
				return data;
			})
			.then(async (data) => {
				const hostArray = [];
				const hostIds = data.map((place) => place.host);
				for (const hostId of hostIds) {
					const res = await axios.get("/users/" + hostId);
					hostArray.push(res.data);
				}
				setPlaceHosts(hostArray);
			});
	}, []);

	return (
		<div>
			<AccountNav />

			<div className="flex justify-center">
				<div className="mt-8">
					{places.length > 0 &&
						places.map((place, index) => (
							<Link
								key={index}
								to={"../place/" + place._id}
								className="max-w-4xl w-full mt-10 p-5 cursor-pointer bg-gray-100 flex gap-4  rounded-2xl "
							>
								<div className=" w-56 h-56  rounded-2xl m-5">
									{place.photos.length > 0 && (
										<div className="relative">
											<Image
												className=" aspect-square  rounded-2xl"
												src={place.photos[0]}
												alt="place"
											/>
											<div className=" rounded-full absolute -right-5 -bottom-5  ">
												{placeHosts[index]?.profilePhoto && (
													<Image
														className="aspect-square rounded-full w-24 border-8 border-gray-100  "
														src={placeHosts[index]?.profilePhoto}
														alt="photo"
													></Image>
												)}
											</div>
										</div>
									)}
								</div>
								<div className="grow-0 shrink">
									<div>
										<h2 className="font-bold text-xl pl-2 truncate mt-5">
											{place?.title}
										</h2>
										<h2 className="font-bold text-xl ml-2 text-gray-600 truncate">
											{place?.address}
										</h2>

										<div className="flex mt-4 border-t-2 pt-2">
											<div>
												<h1 className="text-lg font-bold text-gray-600">
													<span className="text-black">
														{bookings[index]?.nights}{" "}
													</span>
													nights &{" "}
													<span className="text-black">
														{bookings[index]?.guests}{" "}
													</span>
													guests
												</h1>
												<h1 className="text-lg font-bold text-gray-600">
													Check In:{" "}
													<span className="text-black">{place.checkIn} </span>
												</h1>
												<h1 className="text-lg font-bold text-gray-600">
													Check Out:{" "}
													<span className="text-black">{place.checkOut} </span>
												</h1>
											</div>
											<div className="ml-10 mt-3">
												<h1 className="text-lg font-bold text-gray-600">
													<span className="text-black">
														{bookings[index]?.enterDate}
													</span>{" "}
													&rarr;{" "}
													<span className="text-black">
														{bookings[index]?.leaveDate}
													</span>
												</h1>
												<div className="flex">
													<h1 className="text-lg font-bold text-gray-600">
														{" "}
														Total of:{" "}
														<span className="text-black">
															{bookings[index]?.totalPrice.toLocaleString(
																"tr-TR"
															)}{" "}
															₺{" "}
														</span>
													</h1>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Link>
						))}
				</div>
			</div>
		</div>
	);
}
