
import Image from "next/image";
import React, { useRef, useState } from "react";

import searchIcon from "@/assets/general/search_icon.svg";
import { SearchIcon } from "lucide-react";

function SearchBar({
  className = "",
  id = "",
  value,
  placeholder,
  onChange,
  inputBg = "inputBg",
  textClassName="text-[12px] md:text-[14px] ",
}: any) {
  const ref = useRef<any>(null);

  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const isFloating = isFocused || value;

  const handleUploadClick = () => {
    if (ref?.current) {
      ref?.current?.focus();
    }
  };
  return (
    <div
      className={`flex flex-nowrap justify-between items-center bg-${inputBg} p-1 px-4 rounded-[10px] border-0 ${
        isFocused ? "outline-none ring-1 ring-black" : ""
      } ${className}`}
      onClick={handleUploadClick}
    >
      <input
        ref={ref}
        type="text"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`w-full border-none focus:outline-none bg-${inputBg}  px-0 py-0 ${textClassName}`}
      />
      <SearchIcon className="h-4 w-4"/>
    </div>
  );
}

export default SearchBar;
