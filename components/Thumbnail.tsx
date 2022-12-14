import { Movie } from "../typings";
import Image from "next/image";
import { movieState, modalState } from "../atoms/modalAtoms";
import { useRecoilState } from "recoil";
import { DocumentData } from "firebase/firestore";

interface Props {
    // When using Firebase
    // movie: Movie | DocumentData
    movie: Movie | DocumentData
}


function Thumbnail({ movie }: Props) {
  const [showModal, setShowModal] = useRecoilState(modalState);
  const [currentMovie, setCurrentMovie] = useRecoilState(movieState);

  return (
    <div className="relative h-28 min-w-[180px] cursor-pointer transition duration-200
    ease-out md:h-36 md:min-w-[26-px] md:hover:scale-105"
    onClick={() =>  {
      setCurrentMovie(movie);
      setShowModal(true);
    }}>
        <Image 
            src={`https://image.tmdb.org/t/p/w500${
                movie.backdrop_path || movie.poster_path
            }`} 
            alt={`${movie.title || movie.name || movie.original_name} poster image`}
            className="rounder-sm object-cover md:rounded"
            layout="fill" 
        />
    </div>
  )
}

export default Thumbnail