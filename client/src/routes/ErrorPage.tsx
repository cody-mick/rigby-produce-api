import { useRouteError } from "react-router-dom";

const ErrorPage = () => {
	const error = useRouteError();
	console.error(error);

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				{/* @ts-ignore */}
				<i>{error.statusText || error.message}</i>
			</p>
			<p>This is from React Router</p>
		</div>
	);
};

export default ErrorPage;
