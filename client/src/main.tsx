import React from "react";
import ReactDOM from "react-dom/client";
// import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./routes/HomePage.tsx";
import ErrorPage from "./routes/ErrorPage.tsx";
import DocksideDailySummary from "./routes/DocksideDailySummary.tsx";
import CellarReport from "./routes/CellarReport.tsx";
import TestingData from "./components/TestingData.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <HomePage />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/daily-summary/:date",
		element: <DocksideDailySummary />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/cellar-report/:cellarId",
		element: <CellarReport />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/testing-data",
		element: <TestingData />,
		errorElement: <ErrorPage />,
	},
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>
);
