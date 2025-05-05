"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/polar";

export default function ConfirmationPage() {
	const searchParams = useSearchParams();
	const checkoutId = searchParams.get("checkout_id");
	const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

	useEffect(() => {
		if (!checkoutId) {
			setStatus("error");
			return;
		}

		const checkStatus = async () => {
			try {
				const checkout = await api.checkouts.get({ id: checkoutId });
				if (checkout.status === "succeeded") {
					setStatus("success");
				}
			} catch (error) {
				console.error("Error checking checkout status:", error);
				setStatus("error");
			}
		};

		checkStatus();
	}, [checkoutId]);

	if (status === "loading") {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
					<p className="text-gray-600">Please wait while we confirm your payment.</p>
				</div>
			</div>
		);
	}

	if (status === "error") {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold mb-4 text-red-600">Something went wrong</h1>
					<p className="text-gray-600 mb-4">We couldn't confirm your payment status.</p>
					<a href="/" className="text-blue-600 hover:underline">Return to homepage</a>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-screen items-center justify-center">
			<div className="text-center">
				<h1 className="text-2xl font-bold mb-4 text-green-600">Payment Successful!</h1>
				<p className="text-gray-600 mb-4">Thank you for your purchase.</p>
				<a href="/" className="text-blue-600 hover:underline">Return to homepage</a>
			</div>
		</div>
	);
}