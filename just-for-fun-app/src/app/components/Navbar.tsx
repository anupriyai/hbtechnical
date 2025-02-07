"use client";
import Link from "next/link";
import { useState } from "react";

const Navbar = () => {
  return (
    <nav className="text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="font-inconsolata text-xl font-bold hover:text-gray-300">
          my k-drama hub!
        </Link>

        <div className="font-inconsolata flex space-x-6">
          <Link href="/reviews" className="hover:text-gray-300">my reviews</Link>
          <Link href="/wrapped" className="hover:text-gray-300">my shows: wrapped</Link>
          <Link href="/suggestions" className="hover:text-gray-300">your suggestions!</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
