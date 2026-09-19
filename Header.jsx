export default function Header({ title }) {
  return (
    <header className="bg-emerald-600 text-white p-4 shadow-md">
      <h1 className="text-xl font-bold">{title}</h1>
    </header>
  );
}