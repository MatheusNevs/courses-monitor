"use client";
import { useState } from "react";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export default function CreateMonitor() {
  const [formData, setFormData] = useState({
    department: "",
    subject: "",
    class: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/desiredClass", formData);
      toast.success("Monitoramento criado com sucesso");
    } catch (e) {
      if (e instanceof AxiosError)
        toast.error(`Erro ao criar monitoramento: ${e.code}`);
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
            <label htmlFor="class" className="mb-3 block text-lg text-gray-700">
              Turma
            </label>
            <input
              type="text"
              id="class"
              name="class"
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
