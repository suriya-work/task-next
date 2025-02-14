"use client";
import { useState } from "react";

type BlogFormProps = {
  onSubmit: (data: {
    title: string;
    topic: string;
    keywords: string;
    tone: "professional" | "casual" | "informative";
    audience: string;
    length: "short" | "medium" | "long";
  }) => void;
};

const BlogForm: React.FC<BlogFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: "",
    topic: "",
    keywords: "",
    tone: "informative" as "professional" | "casual" | "informative",
    audience: "",
    length: "medium" as "short" | "medium" | "long",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputFields = [
    { label: "Title", name: "title", type: "text" },
    { label: "Blog Topic", name: "topic", type: "text" },
    { label: "Keywords", name: "keywords", type: "text" },
    { label: "Target Audience", name: "audience", type: "text" },
  ];

  const selectFields = [
    {
      label: "Tone",
      name: "tone",
      options: ["professional", "casual", "informative"],
    },
    {
      label: "Length",
      name: "length",
      options: ["short", "medium", "long"],
    },
  ];

  return (
    <form
      className="max-w-2xl mx-auto p-6 bg-dark-gray shadow-md rounded-lg"
      onSubmit={handleSubmit}
    >
      <h2 className="text-xl font-bold mb-4 text-white">Create a Blog</h2>

      {inputFields.map(({ label, name, type }) => (
        <label key={name} className="block mb-3 text-white">
          {label}:
          <input
            type={type}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="w-full p-2 border-gray-500 border-[1px] bg-transparent rounded-md focus:outline-none"
            required
          />
        </label>
      ))}

      {selectFields.map(({ label, name, options }) => (
        <label key={name} className="block mb-3 text-white">
          {label}:
          <select
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleChange}
            className="w-full p-2 border-gray-500 border-[1px] bg-transparent rounded-md focus:outline-none"
          >
            {options.map((option) => (
              <option key={option} value={option} className="bg-dark-gray">
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </option>
            ))}
          </select>
        </label>
      ))}

      <button
        type="submit"
        className="mt-4 p-2 bg-purple-600 text-white rounded-md w-full"
      >
        Generate Blog
      </button>
    </form>
  );
};

export default BlogForm;
