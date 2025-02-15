"use client";
import BlogForm from "@/components/blogForm";
import dynamic from "next/dynamic";
import { useState } from "react";

const MdEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function Home() {
  const [blogContent, setBlogContent] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleEditorChange = (value?: string) => {
    setBlogContent(value || "");
  };

  const handleGenerateBlog = async (formData: {
    title: string;
    topic: string;
    keywords: string;
    tone: "professional" | "casual" | "informative";
    audience: string;
    length: "short" | "medium" | "long";
  }) => {
    setLoading(true);
    setError("");
    setBlogContent("");

    try {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", "tpsg-qsDyCL4tJlu5QOptyAG5RxOfJ4rkYQI");
      myHeaders.append("Content-Type", "application/json");

      const requestBody = JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages: [
          {
            role: "system",
            content: "Generate a blog based on the given parameters.",
          },
          {
            role: "user",
            content: `Title: ${formData.title}\nTopic: ${formData.topic}\nKeywords: ${formData.keywords}\nTone: ${formData.tone}\nAudience: ${formData.audience}\nLength: ${formData.length}`,
          },
        ],
      });

      const response = await fetch(
        "https://api.metisai.ir/api/v1/wrapper/openai_chat_completion/chat/completions",
        {
          method: "POST",
          headers: myHeaders,
          body: requestBody,
          redirect: "follow",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const text = await response.text();
      if (!text) {
        throw new Error("Empty response body received");
      }

      const data = JSON.parse(text);

      if (!data || !data.choices || !data.choices[0]?.message?.content) {
        throw new Error("Unexpected API response structure");
      }

      setBlogContent(
        data.choices[0]?.message?.content || "No output received."
      );
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <BlogForm onSubmit={handleGenerateBlog} />

      {loading && <p className="mt-4 text-blue-500">Generating blog...</p>}

      {error && <p className="mt-4 text-red-500">{error}</p>}

      {blogContent && (
        <div className="mt-6 p-6 bg-transparent rounded shadow">
          <h2 className="text-xl font-bold text-purple-700 mb-2">
            Generated Blog:
          </h2>

          <MdEditor
            value={blogContent}
            onChange={handleEditorChange}
            height={400}
           
          />
        </div>
      )}

      {blogContent && (
        <div className="mt-6 p-6 bg-transparent text-white border border-purple-700 rounded-md rounded shadow">
          <div
            className="prose"
            dangerouslySetInnerHTML={{
              __html: blogContent,
            }}
          />
        </div>
      )}
    </div>
  );
}
