import * as React from "react";
import ReactPlayer from "react-player";
import "./videoPlayer.css";

export interface IAppProps {
  url: any;
  indexProp: any;
  activeIndexProp: any;
  playing: any;
  muted: any;
  autoNext: any;
  nextSlide: any;
  controls: any;
  jsonIndex: any;
}

export default function VideoPlayer(props: IAppProps) {
  const [playing, setPlaying] = React.useState(false);
  const [startPlay, setStartPlay] = React.useState(false);

  React.useEffect(() => {
    if (props.activeIndexProp == props.indexProp) {
      setPlaying(props.playing);
    } else {
      setPlaying(false);
    }
    console.log("index " + props.indexProp + " " + playing);
  }, [props.activeIndexProp, props.playing]);

  function onBufferEnd() {
    setStartPlay(true);
  }

  function onEnd() {
    if (props.autoNext) {
      props.nextSlide();
    }
  }

  return (
    <div className="player-wrapper">
      {!startPlay && props.playing && (
        <div className="load">
          <h1>loading</h1>
        </div>
      )}
      <ReactPlayer
        className="react-playertest"
        url={props.url}
        controls={props.controls}
        onBufferEnd={onBufferEnd}
        playing={playing}
        muted={props.muted}
        loop={!props.autoNext}
        playsinline={true}
        onEnded={onEnd}
        height="100%"
        width="100%"
      />
    </div>
  );
}
