import Link from "next/link";

type GameCardProps = {
  id: string;
  title: string;
  description: string;
  icon: string;
  style: string;
};

export default function GameCard({
  id,
  title,
  description,
  icon,
  style,
}: GameCardProps) {
  return (
    <Link
      href={`/games/${id}`}
      className={`
        h-56
        rounded-3xl
        bg-gradient-to-br
        ${style}
        border
        flex
        flex-col
        items-center
        justify-center
        p-6
        transition-all
        duration-300
        hover:scale-105
        hover:shadow-lg
      `}
    >
      <div className="text-6xl">
        {icon}
      </div>

      <h3 className="mt-5 text-xl font-bold text-slate-700">
        {title}
      </h3>

      <p className="mt-3 text-center text-sm text-slate-500 leading-6">
        {description}
      </p>
    </Link>
  );
}