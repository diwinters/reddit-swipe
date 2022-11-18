import * as React from "react";

// Core modules imports are same as usual
import { Keyboard, Mousewheel, Navigation, Pagination, Virtual } from "swiper";
// Direct React component imports
import { Swiper, SwiperSlide } from "../../../node_modules/swiper/react";
import SwiperClass from "../../../node_modules/swiper/types/swiper-class";

// Styles must use direct files imports
import "../../../node_modules/swiper/swiper.scss"; // core Swiper
import "../../../node_modules/swiper/modules/navigation/navigation.scss"; // Navigation module
import "../../../node_modules/swiper/modules/pagination/pagination.scss"; // Pagination module

import "./SwipeSystem.css";
import VideoPlayer from "../video-player/videoPlayer";
import { Button, FormControlLabel, FormGroup, Switch } from "@mui/material";

import DraggableDialog from "../draggable-dialog/draggable-dialog";

import test_data from "./cache_test.json";

import subredditsJSON from "./subreddits.json";

import { useEffect } from "react";

export interface IAppProps {}

export function SwipeSystem(props: IAppProps) {
  class SlideElement {
    jsonIndex: number;
    jsx: JSX.Element;

    constructor(jsonIndex: number, jsx: JSX.Element) {
      this.jsonIndex = jsonIndex;
      this.jsx = jsx;
    }
  }

  const elFill: JSX.Element[] = [];

  const slideElements: any = [];

  const [activeIndex, setActiveIndex] = React.useState(0);
  const [setStore, setSetStore] = React.useState<Set<number>>();
  const set = new Set<number>();

  const [mainSwiper, setMainSwiper] = React.useState<SwiperClass>();

  const [playing, setPlaying] = React.useState(true);
  const [muted, setMute] = React.useState(true);
  const [autoNext, setAutoNext] = React.useState(false);
  const [controls, setControls] = React.useState(false);
  const [hd, setHd] = React.useState(false);
  const [useCache, SetUseCache] = React.useState(false);

  const [subreddits, setSubreddits] = React.useState<string[]>([]);

  const [openSubredditConfig, setOpenSubredditConfig] = React.useState(false);

  const [jsonData, setJsonData] = React.useState<any[]>([]);

  function onChange(swiper: any) {
    setActiveIndex(swiper.activeIndex);
    console.log("active index: " + swiper.activeIndex);
  }

  function nextSlide() {
    if (mainSwiper) {
      mainSwiper.slideNext();
    }
  }

  useEffect(() => {
    setSubreddits(subredditsJSON);
  }, []);

  useEffect(() => {
    setActiveIndex(0);
    class Data {
      post_hint: any;
      media: any;
      domain: any;
      url: any;
      subreddit_name_prefixed: any;
      title: any;
      permalink: any;
    }

    class jsonEntry {
      data: Data;

      constructor() {
        this.data = new Data();
      }
    }

    const fetchData = async () => {
      let arr: any[] = [];

      const set = new Set<number>();

      setSetStore(set);

      if (subreddits.length > 0) {
        for (const element of subreddits) {
          if (element == "") {
            continue;
          }
          console.log(element);
          const response = await fetch(
            "https://www.reddit.com/" + element + ".json?limit=25",
            {
              method: "GET",
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (response.status >= 400 && response.status < 600) {
            continue;
          }
          let responseJson = await response.json();
          let data = responseJson.data.children;

          data.forEach((el: any) => {
            const {
              post_hint,
              media,
              domain,
              url,
              subreddit_name_prefixed,
              title,
              permalink,
            } = el.data;
            const new_element = new jsonEntry();
            new_element.data.post_hint = post_hint;
            new_element.data.media = media;
            new_element.data.domain = domain;
            new_element.data.url = url;
            new_element.data.subreddit_name_prefixed = subreddit_name_prefixed;
            new_element.data.title = title;
            new_element.data.permalink = permalink;

            arr.push(new_element);
          });
        }
      }

      console.log(arr);
      setJsonData(arr);
    };

    //fetchData();
    if (useCache) {
      setJsonData(test_data);
    } else {
      fetchData();
    }
  }, [subreddits, useCache]);

  useEffect(() => {
    while (set.size < jsonData.length) {
      set.add(Math.floor(Math.random() * jsonData.length));
    }

    setSetStore(set);
  }, [jsonData]);

  if (!setStore || setStore.size == 0) {
    return <h1>Loading Data</h1>;
  }

  let i = 0;

  for (let val of setStore) {
    let jsonIndex = val;
    let jsx;
    if (i + 1 < activeIndex) {
      jsx = <h1>never</h1>;
    } else {
      if (jsonData[val].data.post_hint === "rich:video") {
        // Decode iframe html
        var htmlDoc = new DOMParser().parseFromString(
          (jsonData[val] as any)?.data?.media?.oembed?.html,
          "text/html"
        );
        // Create iframe
        var htmlDoc = new DOMParser().parseFromString(
          htmlDoc.documentElement.textContent as string,
          "text/html"
        );
        jsx = (
          <iframe
            src={htmlDoc.getElementsByTagName("iframe")[0].src}
            frameBorder="0"
            scrolling="no"
            width="100%"
            height="100%"
          ></iframe>
        );
      } else if (
        jsonData[val].data.post_hint === "link" &&
        jsonData[val]?.data?.domain === "i.imgur.com"
      ) {
        let url = jsonData[val]?.data?.url;
        url = url.replace(".gifv", ".mp4");
        jsx = (
          <VideoPlayer
            url={url}
            activeIndexProp={activeIndex}
            indexProp={i}
            playing={playing}
            muted={muted}
            autoNext={autoNext}
            nextSlide={nextSlide}
            controls={controls}
            jsonIndex={val}
          ></VideoPlayer>
        );
      } else if (jsonData[val].data.post_hint === "hosted:video") {
        jsx = (
          <VideoPlayer
            url={
              hd
                ? null
                : (jsonData[val] as any)?.data?.media?.reddit_video
                    ?.fallback_url
            }
            activeIndexProp={activeIndex}
            indexProp={i}
            playing={playing}
            muted={muted}
            autoNext={autoNext}
            nextSlide={nextSlide}
            controls={controls}
            jsonIndex={val}
          ></VideoPlayer>
        );
      } else if (jsonData[val].data.post_hint === "image") {
        jsx = (
          <div className="img-div">
            <img src={jsonData[val].data.url} alt="Image" />
          </div>
        );
      } else {
        jsx = (
          <div className="img-div">
            <img src="./././public/ad.png">
          </div>
        );
      }
    }
    if (i > activeIndex + 10) {
      break;
    }

    const slideElement = new SlideElement(jsonIndex, jsx);
    slideElements.push(slideElement);
    i++;
  }

  let jsonInfo = jsonData[slideElements[activeIndex].jsonIndex].data;
  let post_link = "http://reddit.com" + jsonInfo.permalink;

  return (
    <>
      <DraggableDialog
        subreddits={subreddits}
        setSubreddits={setSubreddits}
        openSubredditConfig={openSubredditConfig}
        setOpenSubredditConfig={setOpenSubredditConfig}
      ></DraggableDialog>


<div className="testl label">


{<a href={post_link}>{jsonInfo.title}</a>}
</div>



      <Swiper
        modules={[Virtual, Mousewheel, Keyboard]}
        slidesPerView={1}
        virtual
        direction={"vertical"}
        mousewheel
        keyboard={{
          enabled: true,
          pageUpDown: true,
        }}
        onActiveIndexChange={onChange}
        onSwiper={setMainSwiper}
      >
        {slideElements.map((slideContent: any, index: any) => (
          <SwiperSlide key={index} virtualIndex={index}>
            {slideContent.jsx}{" "}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}
