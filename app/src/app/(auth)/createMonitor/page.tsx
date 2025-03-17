"use client";
import { useState } from "react";
import { toast } from "sonner";

export default function CreateMonitor() {
  const [formData, setFormData] = useState({
    department: "",
    subject: "",
    class: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await fetch("http://localhost:3000/api/desiredClass/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });
    const data = await result.json();
    if (data.message === "SUCESS") {
      toast.success("Monitoramento criado com sucesso");
    } else {
      toast.error(`Erro ao criar monitoramento: ${data.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white">
      <div className="w-full max-w-[900px] rounded-lg bg-white p-12 shadow-lg">
        {" "}
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          {" "}
          Criar Monitoramento
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          <div>
            <label
              htmlFor="department"
              className="mb-3 block text-lg text-gray-700"
            >
              {" "}
              Departamento
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 bg-white px-6 py-3 text-lg text-gray-800 focus:border-blue-900 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="subject"
              className="mb-3 block text-lg text-gray-700"
            >
              Disciplina
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 bg-white px-6 py-3 text-lg text-gray-800 focus:border-blue-900 focus:outline-none"
              required
            />
          </div>
          <div>
            <label
              htmlFor="className"
              className="mb-3 block text-lg text-gray-700"
            >
              Turma
            </label>
            <input
              type="text"
              id="className"
              name="className"
              value={formData.class}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 bg-white px-6 py-3 text-lg text-gray-800 focus:border-blue-900 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-900 px-6 py-3 text-lg font-bold text-white transition-colors duration-200 hover:bg-blue-800"
          >
            Criar Monitoramento
          </button>
        </form>
      </div>
    </div>
  );
}
