import { CheckIcon, HandThumbUpIcon, PlusIcon, SpeakerWaveIcon, SpeakerXMarkIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { TablePaginationActionsUnstyled } from "@mui/base";
import MuiModal from "@mui/material/Modal"
import { collection, deleteDoc, doc, DocumentData, onSnapshot, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { FaPlay } from "react-icons/fa";
import ReactPlayer from "react-player";
import { useRecoilState } from "recoil"
import { modalState, movieState } from "../atoms/modalAtoms"
import useAuth from "../hooks/useAuth";
import { db } from "../lib/firebase";
import { Movie, Element, Genre } from "../typings";

function Modal() {
    const [showModal, setShowModal] = useRecoilState(modalState);
    const [currentMovie, setCurrentMovie] = useRecoilState(movieState);
    const [trailer, setTrailer] = useState("");
    const [genres, setGenres] = useState<Genre[]>([])
    // change later 
    const [muted, setMuted] = useState(true);
    const [addedToList, setAddedToList] = useState(false);
    const { user } = useAuth();
    const [movies, setMovies] = useState<Movie[] | DocumentData[]>([]);

    const toastStyle = {
        background: "white",
        color: "black",
        fontWeight: "bold",
        fontSize: "16px",
        padding: "15px",
        borderRadius: "9999px",
        maxWidth: "1000px",
    }

    const handleClose = () => {
        setShowModal(false);
    }

    const handleList = async () => {
        if (addedToList) {
            await deleteDoc(doc(db, "customers", user!.uid, "myList", currentMovie?.id.toString()))

            toast(`${currentMovie?.title || currentMovie?.original_name} has been removed from My List`, {
                duration: 8000,
                style: toastStyle
            })
        }

        else {
            await setDoc(doc(db, "customers", user!.uid, "myList", currentMovie?.id.toString()!), 
            {...currentMovie})

            toast(`${currentMovie?.title || currentMovie?.original_name} has been added to My List`, {
                duration: 8000,
                style: toastStyle
            })
        }

        
    }

    useEffect(() => {
        if(!currentMovie) return;

        async function fetchMovie() {
            const data = await fetch(
                `https://api.themoviedb.org/3/${
                currentMovie?.media_type === 'tv' ? 'tv' : 'movie'
                }/${currentMovie?.id}?api_key=${
                process.env.NEXT_PUBLIC_API_KEY
                }&language=en-US&append_to_response=videos`
            ).then((response) => response.json())

            if (data?.videos) {
                const index = data.videos.results.findIndex((element: Element) => element.type === "Trailer");
                setTrailer(data.videos?.results[index]?.key);
            }
            if (data?.genres) {
                setGenres(data.genres)
            }
        }
        fetchMovie()

    }, [currentMovie])

    // Get all the movies in the user's list from db
    useEffect(() => {
        if (user) {
          return onSnapshot(
            collection(db, 'customers', user.uid, 'myList'),
            (snapshot) => setMovies(snapshot.docs)
          )
        }
      }, [db, currentMovie?.id])

      // check if the movie is already in the user's list
      useEffect(
        () =>
          setAddedToList(
            movies.findIndex((result) => result.data().id === currentMovie?.id) !== -1
          ),
        [movies]
      )

  return (
    <MuiModal open={showModal} onClose={handleClose} className="fixed !top-7 left-0 right-0 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide">
        <>
            <Toaster position="bottom-center" />
            <button onClick={handleClose} className="modal-button absolute right-5 top-5 !z-40
            h-9 w-9 border-none bg-[#181818] hover:bg-[#181818]">
                <XMarkIcon className="h-6 w-6" />
            </button>

            <div className="relative pt-[56.25%]">
                <ReactPlayer
                    url={`https://www.youtube.com/watch?v=${trailer}`}
                    width="100%"
                    height="100%"
                    style={{ position: "absolute", top: "0", left: "0"}}
                    playing
                    muted={muted}
                />
                <div className="absolute bottom-10 flex w-full items-center justify-between">
                    <div className="flex space-x-2">
                        <button className="flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold text-black transition hover:bg-[#e6e6e6]">
                            <FaPlay className="h-7 w-7 text-black"></FaPlay>
                            Play
                        </button>

                        <button className="modal-button"
                        onClick={handleList}>
                            {addedToList ? (
                                <CheckIcon className="h-7 w-7" />
                            ) : (
                                <PlusIcon className="h-7 w-7" />
                            )}
                        </button>

                        <button className="modal-button">
                            <HandThumbUpIcon className="h-7 w-7" />
                        </button>
                    </div>
                    <button onClick={() => setMuted(!muted)}>
                        {muted ? (
                            <SpeakerXMarkIcon className="h-6 w-6" />) : ( 
                            <SpeakerWaveIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>
            </div>

            <div className="flex space-x-16 rounded-b-md bg-[#181818] px-10 py-8">
                <div className="space-y-6 text-lg">
                    <div className="flex items-center space-x-2 text-sm">
                        <p className="font-semibold text-green-400">{currentMovie?.vote_average * 10}% Match</p>
                        <p className="font-light">{currentMovie?.release_date || currentMovie?.first_air_date}</p>
                        <div className="flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs">HD</div>
                    </div>
                    <div className="flex flex-col gap-x-10 gap-y-4 font-light md:flex-row">
                        <p className="w-5/6">{currentMovie?.overview}</p>
                        <div className="flex flex-col space-y-3 text-sm">
                            <div className="">
                                <span className="text-[gray]">Genres: </span>
                                {genres.map((genre) => genre.name).join(", ")}
                            </div>
                            <div>
                                <span className="text-[gray]">Original language: </span>
                                {currentMovie?.original_language}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    </MuiModal>
  )
}

export default Modal