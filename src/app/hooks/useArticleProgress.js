import { useEffect } from "react";
import useMissions from "../store/useMissions";
import useStickers from "../store/useStickers";

export default function useArticleProgress() {
  const { trackArticleRead } = useMissions();
  const { addStickers } = useStickers();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;

      console.log("Scroll percentage:", scrollPercentage); // Debug log

      if (scrollPercentage >= 90) {
        console.log("Scroll 90%, calling trackArticleRead");
        trackArticleRead(addStickers); // Pastikan ini dipanggil
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [trackArticleRead, addStickers]);
}
