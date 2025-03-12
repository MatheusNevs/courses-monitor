import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mt-48 min-h-screen bg-white">
      <div className="text-center">
        <h2 className="mb-6 text-7xl font-bold text-[#1a365d]">
          Monitoramento de Vagas UnB
        </h2>
        <p className="mx-auto mb-12 max-w-2xl text-2xl text-[#1a365d]/90">
          Monitoramos sua vaga desejada e te avisamos, sem que você tenha que
          ficar no computador o tempo todo
        </p>
        <Link
          href="/createMonitor"
          className="inline-block rounded-md bg-[#1a365d] px-12 py-3 text-2xl font-medium text-white transition-colors hover:bg-[#1a365d]/90"
        >
          Começar Agora
        </Link>
      </div>
    </div>
  );
}
