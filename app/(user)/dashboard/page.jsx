"use client";
import React from "react";
import DevelopmentSvg from "./DevelopmentSvg";
import ImplementationSvg from "./ImplementationSvg";
import Link from "next/link";

export default function Dashboard() {
	const data = [
		{
			href: "/dashboard/development",
			title: "Development Capacity",
			Icon: DevelopmentSvg,
			description: "This is the development capacity section",
		},
		{
			href: "/dashboard/implementation",
			title: "Implementation Capacity",
			Icon: ImplementationSvg,
			description: "This is the implementation capacity section",
		},
	];
	return (
		<div>
			<div className="my-4">
				<div>
					<h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard </h1>
					<p className="text-gray-700">
						Select a capacity to view the details
					</p>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
					{data.map((item, index) => (
						<Link
							key={index}
							className="p-4 border border-gray-200 rounded-lg flex items-center space-x-4 bg-white cursor-pointer hover:text-blue-500"
							href={item.href}
						>
							<div className="flex flex-col space-x-2 ">
								<item.Icon height="400" />
								<hr className="my-4"/>
								<p href={item.href} className="text-blue-600 ">
									{item.title}
								</p>
								<p className="text-gray-700">{item.description}</p>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
}
