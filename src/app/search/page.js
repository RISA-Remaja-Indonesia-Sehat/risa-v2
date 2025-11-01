"use client";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/app/components/ui/spinner";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchResults = async () => {
      const res = await fetch(
        `https://server-risa.vercel.app/api/article/search?query=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();
      setResults(data.data || []);
      setIsLoading(false);
    };

    fetchResults();
  }, [query]);

  return (
    <div className="p-6 my-12 max-w-4xl mx-auto">
      <h1 className="text-lg font-semibold">Hasil pencarian untuk: {query}</h1>
      <p className="text-gray-500 mb-4">{results.length} pencarian ditemukan</p>
      {isLoading ? (
        <Spinner className="size-6 text-pink-500 mx-auto my-6" />
      ) : results.length > 0 ? (
        <ul className="space-y-3">
          {results.map((item) => (
            <li key={item.id} className="pb-2">
              <Link href={`/article/${item.id}`}>
                <div className="flex gap-4 max-w-3xl mx-auto hover:bg-pink-50 transition-all duration-200 p-4 rounded-md cursor-pointer items-start md:items-center">
                  <div className="w-full max-w-[150px] aspect-square md:aspect-video overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.imageAlt}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-md font-medium text-pink-500">
                      {item.title}
                    </h2>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">Tidak ada hasil ditemukan.</p>
      )}
    </div>
  );
}
