"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SimpleMcpClient() {
	const [response, setResponse] = useState<string>("");
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState<string>("");

	const sendMessage = async () => {
		if (!message.trim()) return;

		setLoading(true);
		setResponse("");

		try {
			const res = await fetch("http://localhost:3001/api/mcp-test", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: message.trim(),
				}),
			});

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}

			toast.success("消息发送成功！");

			const result = await res.json();
			setResponse(typeof result === "string" ? result : JSON.stringify(result, null, 2));
		} catch (err) {
			setResponse(err instanceof Error ? err.message : "Unknown error");
		} finally {
			setLoading(false);
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			sendMessage();
		}
	};

	return (
		<div className="w-full max-w-2xl space-y-4">
			<div className="flex gap-2">
				<Input
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					onKeyDown={handleKeyPress}
					placeholder="输入消息..."
					disabled={loading}
					className="flex-1 border-gray-200 focus:border-gray-400"
				/>
				<Button
					onClick={sendMessage}
					disabled={loading || !message.trim()}
					className="bg-black text-white hover:bg-gray-800"
				>
					{loading ? <Loader2 className="animate-spin" /> : "发送"}
				</Button>
			</div>

			{response && <div className="whitespace-pre-wrap break-words text-gray-600 text-sm">{response}</div>}
		</div>
	);
}
