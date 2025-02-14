"use client";

import BlogForm from "@/components/blogForm";
import { useState } from "react";

export default function Home() {
  const [blogContent, setBlogContent] = useState(""); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

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
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate blog.");
      }

     
      setBlogContent(data.blog);
    } catch (err:any) {
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
        <div className="mt-6 p-6 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-bold">Generated Blog:</h2>
          <p>{blogContent}</p>
        </div>
      )}
    </div>
  );
}
