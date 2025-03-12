"use client";
import { useState } from "react";

export default function CreateMonitor() {
  const [formData, setFormData] = useState({
    department: "",
    subject: "",
    className: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        {/* Aumentado max-w-md para max-w-[900px] e p-8 para p-12 */}
        <h1 className="mb-8 text-center text-4xl font-bold text-gray-800">
          {" "}
          {/* Aumentado text-3xl para text-4xl e mb-6 para mb-8 */}
          Criar Monitoramento
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {" "}
          {/* Aumentado space-y-4 para space-y-6 */}
          <div>
            <label
              htmlFor="department"
              className="mb-3 block text-lg text-gray-700"
            >
              {" "}
              {/* Aumentado mb-2 para mb-3 e adicionado text-lg */}
              Departamento
            </label>
            <input
              type="text"
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 bg-white px-6 py-3 text-lg text-gray-800 focus:border-blue-900 focus:outline-none" /* Aumentado padding e texto */
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
              value={formData.className}
              onChange={handleChange}
              className="w-full rounded border border-gray-300 bg-white px-6 py-3 text-lg text-gray-800 focus:border-blue-900 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded bg-blue-900 px-6 py-3 text-lg font-bold text-white transition-colors duration-200 hover:bg-blue-800" /* Aumentado padding e texto */
          >
            Criar Monitoramento
          </button>
        </form>
      </div>
    </div>
  );
}
