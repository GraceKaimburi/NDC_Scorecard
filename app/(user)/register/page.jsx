"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useFetch from "@/hooks/useFetch";
import { isResponseOk } from "@/utils/is-response-ok";
import { comprehensiveCountries } from "@/data/countries";
import { AxiosError } from "axios";

const Register = () => {
	const { openAPI } = useFetch();
	const [formData, setFormData] = useState({
		first_name: "",
		last_name: "",
		email: "",
		country_name: "",
		affiliation: "",
		password: "",
		confirmPassword: "",
	});
	const [otp, setOtp] = useState("");
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [showOtpInput, setShowOtpInput] = useState(false);

	const router = useRouter();

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const {
			first_name,
			last_name,
			email,
			country_name,
			affiliation,
			password,
			confirmPassword,
		} = formData;

		// Front-end validation
		if (!first_name || !last_name || !email || !password || !confirmPassword) {
			setError("All fields marked * are required.");
			return;
		}
		if (password.length < 6) {
			setError("Password must be at least 6 characters.");
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		setError("");
		setIsLoading(true);

		try {
			// Send registration request
			const response = await openAPI.post("/auth/register/", {
				first_name,
				last_name,
				email,
				country_name,
				affiliation,
				password,
			});

			const data = response.data;

			if (isResponseOk(response)) {
				setSuccess("Registration initiated! Please check your email for OTP.");
				setShowOtpInput(true);
			} else if (response.status === 400) {
				// Check for "account already exists" error
				if (
					data.detail &&
					data.detail.toLowerCase().includes("already exists")
				) {
					setError("An account with this email already exists. Please log in.");
				} else {
					setError(data.detail || "Registration failed. Please try again.");
				}
			} else {
				setError("An unexpected error occurred. Please try again.");
			}
		} catch (err) {
			if (err instanceof AxiosError) {
				setError(
					err.response?.data?.detail ||
						"Failed to connect to the server. Please try again later."
				);
				return;
			} else {
				setError("Failed to connect to the server. Please try again later.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		if (!otp) {
			setError("Please enter the OTP sent to your email.");
			return;
		}

		const verificationData = {
			email: formData.email,
			otp: otp,
		};

		setIsLoading(true);
		setError("");

		try {
			const response = await openAPI.post(
				"/auth/verify_otp/",
				verificationData
			);

			const data = response.data;

			if (isResponseOk(response)) {
				setSuccess("Registration Successful.");
				router.push("/login");
			} else {
				setError(data.detail || "Failed to verify OTP. Please try again.");
			}
		} catch (err) {
			setError("Failed to verify OTP. Please try again.");
		} finally {
			setIsLoading(false);
		}
	};

	const handleOtpChange = (e) => {
		setOtp(e.target.value);
	};

	return (
		<div className="flex items-center justify-center min-h-[70vh] bg-gray-100 px-4 py-16">
			<div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
				<h1 className="text-2xl font-semibold text-center text-gray-700">
					{showOtpInput ? "Verify Email" : "Registration Form"}
				</h1>

				{error && (
					<div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
						{error}
					</div>
				)}
				{success && (
					<div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
						{success}
					</div>
				)}

				{!showOtpInput ? (
					<form onSubmit={handleSubmit} className="flex flex-col space-y-4">
						<div>
							<label htmlFor="first_name" className="block text-gray-600 mb-1">
								First Name: *
							</label>
							<input
								type="text"
								name="first_name"
								id="first_name"
								value={formData.first_name}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div>
							<label htmlFor="last_name" className="block text-gray-600 mb-1">
								Last Name: *
							</label>
							<input
								type="text"
								name="last_name"
								id="last_name"
								value={formData.last_name}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div>
							<label htmlFor="email" className="block text-gray-600 mb-1">
								Email: *
							</label>
							<input
								type="email"
								name="email"
								id="email"
								value={formData.email}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="country_name"
								className="block text-gray-600 mb-1"
							>
								Country Name: *
							</label>
							<select
								name="country_name"
								id="country_name"
								value={formData.country_name}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							>
								<option value="">Select a Country</option>
								{comprehensiveCountries.map((country, index) => (
									<option key={index} value={country}>
										{country}
									</option>
								))}
							</select>
						</div>

						<div>
							<label htmlFor="affiliation" className="block text-gray-600 mb-1">
								Affiliation: *
							</label>
							<input
								type="text"
								name="affiliation"
								id="affiliation"
								value={formData.affiliation}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div>
							<label htmlFor="password" className="block text-gray-600 mb-1">
								Password: *
							</label>
							<input
								type="password"
								name="password"
								id="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>

						<div>
							<label
								htmlFor="confirmPassword"
								className="block text-gray-600 mb-1"
							>
								Confirm Password: *
							</label>
							<input
								type="password"
								name="confirmPassword"
								id="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full ${
								isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
							} text-white p-2 rounded-md transition`}
						>
							{isLoading ? "Registering..." : "Register"}
						</button>
					</form>
				) : (
					<form onSubmit={handleVerifyOtp} className="flex flex-col space-y-4">
						<div>
							<label htmlFor="email" className="block text-gray-600 mb-1">
								Email:
							</label>
							<input
								type="email"
								id="email"
								value={formData.email}
								readOnly
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
							/>
						</div>
						<div>
							<label htmlFor="otp" className="block text-gray-600 mb-1">
								Enter OTP sent to your email:
							</label>
							<input
								type="text"
								id="otp"
								value={otp}
								onChange={handleOtpChange}
								placeholder="Enter OTP"
								className="w-full border-2 border-gray-300 p-2 rounded-md focus:outline-none focus:border-blue-500"
								required
							/>
						</div>

						<button
							type="submit"
							disabled={isLoading}
							className={`w-full ${
								isLoading ? "bg-blue-300" : "bg-blue-500 hover:bg-blue-600"
							} text-white p-2 rounded-md transition`}
						>
							{isLoading ? "Verifying..." : "Verify OTP"}
						</button>
					</form>
				)}

				<p className="text-center text-gray-500 text-sm">
					Already have an account?{" "}
					<a href="/login" className="text-blue-500 hover:underline">
						Log In
					</a>
				</p>
			</div>
		</div>
	);
};

export default Register;
