"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [text, setText] = useState("");
  const phrases = [
    "romance, thriller, or fantasy—i've seen them all (except for historical)!",
    "always down to binge-watch the latest!",
    "i have a love-hate relationship with love triangles",
    "netflix keeps asking, 'are you still watching?' of course i am.",
    "k-dramas are my escape from reality!",
    "my world changed in 2018",
    "pls give me more recs"
  ];
  
  useEffect(() => {
    let i = 0, j = 0;
    let currentPhrase = "", isDeleting = false;

    const typeEffect = setInterval(() => {
      if (i < phrases.length) {
        if (!isDeleting) {
          currentPhrase = phrases[i].slice(0, j + 1);
          j++;
        } else {
          currentPhrase = phrases[i].slice(0, j - 1);
          j--;
        }

        setText(currentPhrase);

        if (!isDeleting && j === phrases[i].length) {
          setTimeout(() => (isDeleting = true), 1000);
        } else if (isDeleting && j === 0) {
          isDeleting = false;
          i = (i + 1) % phrases.length;
        }
      }
    }, 100);

    return () => clearInterval(typeEffect);
  }, []);

  return (
    <div className="font-inconsolata flex flex-col items-center justify-center h-screen text-white text-center p-6">
      <h1 className="text-5xl font-bold mb-4">hello! i'm anupriya</h1>
      <p className="text-lg max-w-xl">
        even when i'm busy with school, i always find time to watch tv shows—especially k-dramas! 💕
      </p>

      {/* Buttons for navigation */}
      <div className="mt-6 flex space-x-4">
        <Link href="/reviews">
          <button className="bg-indigo-300 hover:bg-indigo-400 text-indigo-500 font-semibold py-2 px-6 rounded-lg transition-all">
            ⭐ my ratings
          </button>
        </Link>

        <Link href="/wrapped">
          <button className="bg-indigo-300 hover:bg-indigo-400 text-indigo-500 font-semibold py-2 px-6 rounded-lg transition-all">
            🎬 my wrapped
          </button>
        </Link>
      </div>
      <p className="text-2xl font-semibold mt-8 text-indigo-400">{text}</p>
    </div>
  );
}
