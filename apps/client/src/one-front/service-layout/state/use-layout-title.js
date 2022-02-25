import { useState } from "react";
import { useGetContext } from "@forrestjs/react-root";

export const useLayoutTitle = () => {
  const initialValue = useGetContext("one.layout.title");

  const [title, setTitle] = useState(initialValue);

  return {
    title,
    setTitle
  };
};
