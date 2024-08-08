import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import axios from "axios";
import { Navigate } from "react-router-dom";

export default function BookingWidget({ place }) {
	const { user, setUser } = useContext(UserContext);
	const [enterDate, setEnterDate] = useState("");
	const [leaveDate, setLeaveDate] = useState("");
	const [guestsNumber, setGuestsNumber] = useState(1);
	const [serviceFee, setServiceFee] = useState(2500);
	const [pricePerGuest, setPricePerGuest] = useState(500);
	const [redirect, setRedirect] = useState(false);
	const [alreadyBooked, setAlreadyBooked] = useState(false);
	const [bookingInfo, setBookingInfo] = useState(null);
	const [bookingSuccessful, setBookingSuccessful] = useState(false);
	const [cancelBooking, setCancelBooking] = useState(false);

	useEffect(() => {
		if (user) {
			axios.get("/account/bookings").then(({ data }) => {
				data.map((booking, index) => {
					if (booking.place === place._id) {
						setAlreadyBooked(true);
						setBookingInfo(booking);
					}
				});
			});
		}
	}, []);

	useEffect(() => {
		const today = new Date().toISOString().split("T")[0];
		setEnterDate(today);
		const currentDate = new Date();
		currentDate.setDate(currentDate.getDate() + 5);
		setLeaveDate(currentDate.toISOString().split("T")[0]);
	}, []);

	function handleCancelBooking(ev) {
		axios
			.delete("/booking", { data: { bookingId: bookingInfo._id } })
			.then((res) => {
				console.log("Booking cancelled", res.data);
			});
		setAlreadyBooked(false);
		setBookingInfo(null);
	}

	if (cancelBooking) {
		return (
			<>
				<div className="  h-full">
					<div className=" sticky top-0  border-2 h-3/5 bg-gray-300  border-gray-200 p-7 rounded-2xl  shadow-[0_0_10px_10px_rgba(0,0,0,0.1)] ">
						<div>
							<div className="flex text-center">
								<h1 className="font-bold text-gray-600">
									You are about to cancel your booking, this action can not be
									undone are you sure?
								</h1>
							</div>

							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCancelBooking(false);
									handleCancelBooking(ev);
								}}
								className="bg-gray-500 w-full mt-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-gray-400 "
							>
								<h1 className="text-green-500 font-medium text-xl">
									Yes, I am sure
								</h1>
							</button>
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCancelBooking(false);
								}}
								className="bg-gray-500 w-full mt-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-gray-400 "
							>
								<h1 className="text-red-500 font-medium text-xl">
									No, take me back
								</h1>
							</button>
						</div>
					</div>
					<button
						onClick={(ev) => {
							alert("This feature is not available yet.");
						}}
						className="w-full flex justify-center gap-3 mt-10 underline"
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
								d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
							/>
						</svg>
						<h1 className="text-gray-600 font-bold">Report this</h1>
					</button>
				</div>
			</>
		);
	}

	function handleEnterDateChange(ev) {
		const selectedEnterDate = new Date(ev.target.value);
		const leaveDateObject = new Date(leaveDate);

		if (leaveDate && selectedEnterDate >= leaveDateObject) {
			console.log("Enter date cannot be after leave date.");
		} else {
			setEnterDate(ev.target.value);
		}
	}

	function handleLeaveDateChange(ev) {
		const selectedLeaveDate = new Date(ev.target.value);
		const enterDateObject = new Date(enterDate);

		if (enterDate && selectedLeaveDate <= enterDateObject) {
			console.log("Leave date cannot be before enter date.");
		} else {
			setLeaveDate(ev.target.value);
		}
	}

	function calculateDayDiff() {
		const enterDateObject = new Date(enterDate);
		const leaveDateObject = new Date(leaveDate);
		const dayDifference =
			(leaveDateObject - enterDateObject) / (1000 * 60 * 60 * 24);
		return dayDifference;
	}

	function handleReserveButton(ev) {
		if (!user) {
			setRedirect(true);
			return;
		}
		const data = {
			user: user._id,
			placeId: place._id,
			hostId: place.owner,
			guests: guestsNumber,
			enterDate: enterDate,
			leaveDate: leaveDate,
			nights: calculateDayDiff(),
			totalPrice:
				serviceFee +
				place.pricePerNight * calculateDayDiff() +
				(guestsNumber - 1) * pricePerGuest,
		};
		axios.post("/booking", { data }).then((res) => {
			console.log("Booking successful", res.data);
			setBookingSuccessful(true);
		});
	}

	if (redirect) {
		return <Navigate to="/login" />;
	}

	if (bookingSuccessful) {
		return <Navigate to="/account/bookings" />;
	}

	if (alreadyBooked) {
		return (
			<>
				<div className="  h-full">
					<div className=" sticky top-0  border-2 h-3/5   border-gray-200 p-7 rounded-2xl  shadow-[0_0_10px_10px_rgba(0,0,0,0.1)] ">
						<div>
							<div className="mt-5 flex justify-center mb-7 border-b-2 pb-2">
								<h1 className="text-lg font-bold ">
									You have already booked this place.
								</h1>
							</div>
							<div className="mt-5 flex justify-center">
								<h1 className="text-2xl font-bold text-gray-600">
									<span className="text-black">{bookingInfo?.enterDate}</span>{" "}
									&rarr;{" "}
									<span className="text-black">{bookingInfo?.leaveDate}</span>
								</h1>
							</div>
							<div className="pt-1 flex justify-center">
								<h1 className="text-2xl font-bold text-gray-600">
									<span className="text-black">{bookingInfo?.nights} </span>
									nights &{" "}
									<span className="text-black">{bookingInfo?.guests} </span>
									guests
								</h1>
							</div>

							<div className="border-b-2 pb-2">
								<div className="mt-5 flex justify-between p-2 ">
									<h1 className=" text-xl">
										{place.pricePerNight.toLocaleString("tr-TR")} ₺{" "}
										<span className="font-normal text-gray-500">
											{"x "}
											<span className=" text-black">
												{bookingInfo.nights.toString()}
											</span>
											{" gece"}
										</span>
									</h1>
									<h1 className=" text-xl">
										{(place.pricePerNight * bookingInfo.nights).toLocaleString(
											"tr-TR"
										)}{" "}
										₺{" "}
									</h1>
								</div>
								<div className="flex justify-between p-2">
									<h1 className="font-normal text-gray-500 text-xl">
										Service fee
									</h1>
									<h1 className=" text-xl">
										{serviceFee.toLocaleString("tr-TR")} ₺{" "}
									</h1>
								</div>
							</div>
							<div className="flex justify-between p-2 mt-3">
								<h1 className="font-normal text-gray-500 text-xl">
									Total Cost
								</h1>
								<h1 className=" text-2xl font-bold">
									{bookingInfo.totalPrice.toLocaleString("tr-TR")} ₺{" "}
								</h1>
							</div>
							<div className="pt-2 flex justify-center border-t-2">
								<h1 className="font-bold text-gray-500">
									Please contact the host for further detils
								</h1>
							</div>
							<div className="flex text-center">
								<h1 className="font-bold text-gray-500">
									You can cancel the booking anytime before the check-in date.
								</h1>
							</div>

							<button
								onClick={(ev) => {
									ev.preventDefault();
									setCancelBooking(true);
								}}
								className="bg-gray-500 w-full mt-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-gray-400 "
							>
								<h1 className="text-white font-medium text-xl">Cancel</h1>
							</button>
						</div>
					</div>
					<button
						onClick={(ev) => {
							alert("This feature is not available yet.");
						}}
						className="w-full flex justify-center gap-3 mt-10 underline"
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
								d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
							/>
						</svg>
						<h1 className="text-gray-600 font-bold">Report this</h1>
					</button>
				</div>
			</>
		);
	}

	return (
		<>
			<div className="  h-full">
				<div className=" sticky top-0  border-2 h-3/5   border-gray-200 p-7 rounded-2xl  shadow-[0_0_10px_10px_rgba(0,0,0,0.1)] ">
					<div>
						<h1 className="font-bold text-xl">
							{place.pricePerNight.toLocaleString("tr-TR")} ₺{" "}
							<span className="font-normal text-gray-500">gece</span>{" "}
						</h1>
						<div className="mt-5">
							<div className="flex justify-around">
								<label className="cursor-pointer border-l-2 border-t-2 rounded-tl-2xl border-gray-400 w-1/2 p-4 text-start">
									<h1 className="font-semibold">ENTER</h1>
									<input
										type="date"
										value={enterDate}
										onChange={(ev) => handleEnterDateChange(ev)}
									></input>
								</label>
								<label className="cursor-pointer border-r-2 border-t-2 border-l-2 rounded-tr-2xl border-gray-400 w-1/2 p-4 text-start">
									<h1 className="font-semibold">LEAVE</h1>
									<input
										type="date"
										value={leaveDate}
										onChange={(ev) => handleLeaveDateChange(ev)}
									></input>
								</label>
							</div>
							<label className="cursor-pointer flex justify-between border-2 rounded-br-2xl rounded-bl-2xl border-gray-400 w-full p-3 items-center text-start ">
								<div className="w-full">
									<h1 className="font-semibold">GUESTS NUMBER</h1>
									<input
										onChange={(ev) => setGuestsNumber(ev.target.value)}
										className="border-none"
										type="number"
										placeholder="1"
										min={1}
										max={place.maxGuests}
									></input>
								</div>
							</label>
						</div>
						<button
							onClick={(ev) => {
								handleReserveButton(ev);
							}}
							className="bg-primary w-full mt-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-hoverPrimary "
						>
							<h1 className="text-white font-medium text-xl">Reserve</h1>
						</button>
						<div className="border-b-2 pb-2">
							<div className="mt-5 flex justify-between p-2 ">
								<h1 className=" text-xl">
									{place.pricePerNight.toLocaleString("tr-TR")} ₺{" "}
									<span className="font-normal text-gray-500">
										{"x "}
										<span className=" text-black">
											{calculateDayDiff().toString()}
										</span>
										{" gece"}
									</span>
								</h1>
								<h1 className=" text-xl">
									{(place.pricePerNight * calculateDayDiff()).toLocaleString(
										"tr-TR"
									)}{" "}
									₺{" "}
								</h1>
							</div>
							<div className="flex justify-between p-2">
								<h1 className="font-normal text-gray-500 text-xl">
									Service fee
								</h1>
								<h1 className=" text-xl">
									{serviceFee.toLocaleString("tr-TR")} ₺{" "}
								</h1>
							</div>
						</div>
						<div className="flex justify-between p-2 mt-3">
							<h1 className="font-normal text-gray-500 text-xl">Total Cost</h1>
							<h1 className=" text-xl">
								{(
									serviceFee +
									place.pricePerNight * calculateDayDiff() +
									(guestsNumber - 1) * pricePerGuest
								).toLocaleString("tr-TR")}{" "}
								₺{" "}
							</h1>
						</div>
					</div>
				</div>
				<button
					onClick={(ev) => {
						alert("This feature is not available yet.");
					}}
					className="w-full flex justify-center gap-3 mt-10 underline"
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
							d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
						/>
					</svg>
					<h1 className="text-gray-600 font-bold">Report this</h1>
				</button>
			</div>
		</>
	);
}
