import axios from "axios";
import { useState } from "react";
import Image from "./Image";

export default function PhotosUploader({
	addedPhotos,
	onChange,
	setLoadingPhoto,
}) {
	const [photosLink, setPhotosLink] = useState("");

	async function addPhotoByLink(ev) {
		ev.preventDefault();
		setLoadingPhoto(true);
		try {
			const { data } = await axios.post("/upload-by-link", {
				link: photosLink,
			});

			onChange((prev) => [...prev, data.url]);
		} catch (err) {
			console.log(err);
		} finally {
			setLoadingPhoto(false);
		}

		setPhotosLink("");
	}

	function uploadPhoto(ev) {
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
				const { data: filenames } = res;
				onChange((prev) => [...prev, ...filenames]);
				setLoadingPhoto(false);
			});
	}

	function removePhoto(ev, filename) {
		ev.preventDefault();
		onChange((prev) => prev.filter((file) => file !== filename));
	}

	function selectAsMainPhoto(ev, filename) {
		ev.preventDefault();
		onChange((prev) => [filename, ...prev.filter((file) => file !== filename)]);
	}

	return (
		<>
			<div className="flex gap-0">
				<input
					value={photosLink}
					onChange={(e) => setPhotosLink(e.target.value)}
					className="!rounded-tr-none !rounded-br-none"
					type="text"
					placeholder="Add a photo by a link ...jpg"
				></input>
				<button
					onClick={addPhotoByLink}
					className="bg-gray-200 px-6 rounded-tr-2xl rounded-br-2xl relative cursor-pointer right-0 mt-2 mb-2 text-3xl  "
				>
					+
				</button>
			</div>
			<div className="mt-2 mb-10 gap-3 grid grid-cols-3 md:grid-col-4 lg:grid-cols-6">
				{addedPhotos.length > 0 &&
					addedPhotos.map((link, index) => (
						<div className="h-32 flex relative group" key={index}>
							{
								<Image
									className="cursor-pointer rounded-2xl w-full object-cover transition duration-300 hover:brightness-75"
									src={link}
									alt="photo"
									onClick={(e) => window.open(e.target.src, "_blank")}
								/>
							}
							<button
								onClick={(ev) => {
									removePhoto(ev, link);
								}}
								className="hidden group-hover:block absolute bg-black top-1 right-1 bg-opacity-60 rounded-full p-1 "
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={1.8}
									stroke="white"
									className="size-7"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M6 18 18 6M6 6l12 12"
									/>
								</svg>
							</button>
							<button
								onClick={(ev) => {
									selectAsMainPhoto(ev, link);
								}}
								className="hidden group-hover:block absolute bg-black top-1 left-1 bg-opacity-60 rounded-full p-1 "
							>
								{link === addedPhotos[0] && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="#FFDF00"
										className="size-7"
									>
										<path
											fillRule="evenodd"
											d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
											clipRule="evenodd"
										/>
									</svg>
								)}
								{link !== addedPhotos[0] && (
									<svg
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										strokeWidth={1.8}
										stroke="#FFDF00"
										className="size-7"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
										/>
									</svg>
								)}
							</button>
						</div>
					))}
				<label className="cursor-pointer border bg-transparent items-center py-8 h-32  rounded-2xl text-3xl text-gray-500 flex justify-center gap-2">
					<input type="file" className="hidden" onChange={uploadPhoto}></input>
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
							d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15"
						/>
					</svg>
					Upload
				</label>
			</div>
		</>
	);
}
