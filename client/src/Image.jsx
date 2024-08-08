export default function Image({ src, ...rest }) {
	src = src.includes("https://") ? src : `http://localhost:4000/uploads/${src}`;
	return <img src={src} {...rest} alt="" />;
}
