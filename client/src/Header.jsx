import { useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import { Link } from "react-router-dom";
import Image from "./Image.jsx";

export default function Header() {
	const { user } = useContext(UserContext);
	const [showAbout, setShowAbout] = useState(false);

	return (
		<div>
			<div>
				{showAbout && (
					<div className="fixed top-0 left-0 w-screen h-screen z-10 bg-black bg-opacity-50">
						<div className="fixed right-1/4 w-1/2 top-1/4 h-1/2 sm:h-2/3 md:h-1/2 bg-gray-300 border-2 rounded-2xl p-10 z-20">
							<h1 className="text-center font-bold text-2xl">
								This website was created for educational purposes only. And
								mostly inspired by the following{" "}
								<a
									className="underline"
									href="https://youtu.be/MpQbwtSiZ7E?si=zEx6w2pV_tQT7cq3"
								>
									content video
								</a>{" "}
								. All rights and trademarks belong to their respective owners.
								<br></br>
								<br></br>Although this is not an original website, some of the
								code and design elements are my own work. You can view more of
								my projects on my .{""}
								<a
									className="underline text-primary"
									href="https://github.com/MrKerim"
								>
									GitHub profile
								</a>
							</h1>
							<button
								onClick={(ev) => {
									ev.preventDefault();
									setShowAbout(false);
								}}
								className="bg-gray-500 w-full mt-4 p-4 rounded-2xl transition-colors duration-300 hover:bg-gray-400 "
							>
								<h1 className="text-black font-medium text-xl">Close</h1>
							</button>
						</div>
					</div>
				)}
			</div>
			<header className=" flex justify-between items-center">
				<Link to={"/"} className="flex items-center gap-1 ">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="#F5385D"
						viewBox="0 0 448 512"
						className="size-9"
					>
						<path d="M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z" />
					</svg>
					<span className="font-bold text-2xl text-primary">airbnb</span>
				</Link>

				<div className="flex gap-3 items-center shadow-md shadow-gray-300  border border-gray-300 rounded-full py-2 px-4">
					<div>Anywhere</div>
					<div className="border-l h-7  border-gray-300"></div>
					<div>Anyweek</div>
					<div className="border-l h-7  border-gray-300"></div>
					<div>Add guest</div>
					<button className="bg-primary rounded-full p-1 text-white">
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
								d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
							/>
						</svg>
					</button>
				</div>
				<div className="flex gap-2 items-center border border-gray-300 rounded-full py-2 px-4">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="size-7"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
						/>
					</svg>
					<Link
						to={user ? "/account" : "./login"}
						className="flex text-center "
					>
						{!user?.profilePhoto && (
							<div className=" bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 24 24"
									fill="currentColor"
									className="relative top-1 size-10"
								>
									<path
										fillRule="evenodd"
										d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
										clipRule="evenodd"
									/>
								</svg>
							</div>
						)}
						{user?.profilePhoto && (
							<div>
								<Image
									className="aspect-square rounded-full w-10 "
									src={user.profilePhoto}
									alt="photo"
								></Image>
							</div>
						)}
						{!!user && (
							<div className="relative items-center left-2 p-1">
								{user.name}
							</div>
						)}
					</Link>
				</div>
			</header>
			<footer className="w-full p-3 fixed h-16 z-10 left-0 bottom-0 bg-black bg-opacity-80 flex text-center">
				<p className="text-white ">
					This website is a clone project created for educational purposes only.
					It is not an official Airbnb site, and no real transactions or
					bookings can be made here. All content is for demonstration purposes,
					and no commercial or other intentional purposes are intended. All
					rights and trademarks belong to their respective owners. Check{" "}
					<button
						className="text-primary underline"
						onClick={(ev) => {
							ev.preventDefault();
							setShowAbout(true);
						}}
					>
						About Page
					</button>
				</p>
			</footer>
		</div>
	);
}
