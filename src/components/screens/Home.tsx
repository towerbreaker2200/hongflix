import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useQuery } from "react-query";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovies, IGetMoiveResult } from "../../api";
import { makeImagePath } from "../../utils";
import useWindowDimensions from "../useWindowDimensions";

const Wrapper = styled.div`
  background: black;
  overflow-x: hidden;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;

const OverView = styled.p`
  font-size: 30px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -150px;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 5px;
  position: absolute;
  width: 100%;
`;

const Box = styled(motion.div)`
  background-color: black;
  height: 170px;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const Poster = styled(motion.img)`
  width: 100%;
  object-fit: cover;
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  text-align: center;
  font-size: 16px;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const OverLay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;

const BigTitle = styled.h2`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  top: -80px;
  font-size: 46px;
  position: relative;
`;

const BigOverview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  position: relative;
  top: -80px;
`;

const boxVariant = {
  normal: {
    scale: 1,
  },
  hover: {
    height: 210,
    y: -50,
    scale: 1.3,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const infoVariant = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

const offset = 6;

function Home() {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoiveResult>(
    ["movies", "nowPlaying"],
    getMovies
  );
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const width = useWindowDimensions();
  const onboxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };
  const onOveralyClick = () => {
    navigate(-1);
  };
  const clickedMovie =
    movieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +movieMatch.params.movieId!);
  console.log(clickedMovie);
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgphoto={makeImagePath(data?.results[0].backdrop_path || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <OverView>{data?.results[0].overview}</OverView>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                initial={{ x: width }}
                animate={{ x: 0 }}
                exit={{ x: -width }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
              >
                {data?.results
                  .slice(1)
                  .slice(offset * index, offset * index + offset)
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      variants={boxVariant}
                      whileHover="hover"
                      initial="normal"
                      transition={{ type: "tween" }}
                      key={movie.id}
                      onClick={() => onboxClicked(movie.id)}
                    >
                      <Poster
                        src={makeImagePath(
                          movie.backdrop_path || movie.poster_path,
                          "w300"
                        )}
                        alt={movie.id + ""}
                      />
                      <Info variants={infoVariant}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {movieMatch ? (
              <>
                <OverLay
                  onClick={onOveralyClick}
                  animate={{ opacity: 1 }}
                ></OverLay>
                <BigMovie
                  style={{ top: scrollY.get() + 60 }}
                  layoutId={movieMatch.params.movieId}
                >
                  {clickedMovie && (
                    <>
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            clickedMovie.backdrop_path,
                            "w500"
                          )})`,
                        }}
                      />
                      <BigTitle>{clickedMovie.title}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </>
                  )}
                </BigMovie>
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
