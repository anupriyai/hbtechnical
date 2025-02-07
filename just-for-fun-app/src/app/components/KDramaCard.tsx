import Link from "next/link";

interface KDramaCardProps {
  id: string;
  title: string;
  imageUrl: string;
  genres: string;
  year: string;
  review: string;
}

const KDramaCard: React.FC<KDramaCardProps> = ({ id, title, imageUrl, genres, year, review }) => {
  return (
    <Link href={`/reviews/${id}`} passHref>
      <div className="font-inconsolata bg-white/80 backdrop-blur-xl border border-gray-700/50 rounded-lg shadow-lgbg-white shadow-md rounded-lg p-4 cursor-pointer transition-transform transform hover:scale-105">
        <img
          src={imageUrl || "https://via.placeholder.com/300"}
          alt={title}
          className="rounded-md w-full h-48 object-cover"
        />
        <h2 className="text-xl font-semibold mt-2 bg-gradient-to-r from-[#162f6e] via-[#533d99] to-[#1b2b54] inline-block text-transparent bg-clip-text">
          {title}
        </h2>
        <p className="text-gray-600">Genre: {genres}</p>
        <p className="text-gray-500 text-sm">Year: {year}</p>
        <div className="relative mt-2 text-gray-700 overflow-hidden line-clamp-2">
          <p className="relative z-10">{review}</p>
          <div className="absolute bottom-0 left-0 w-full h-6"></div>
        </div>
      </div>
    </Link>
  );
};

export default KDramaCard;
