let currentsong = new Audio();
let song;
let currfolder;
async function getsongs(folder) {
  let a = await fetch(`${folder}`);
  currfolder = folder;
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let tds = div.getElementsByTagName("a");
  song = [];
  for (let i = 0; i < tds.length; i++) {
    const element = tds[i];
    if (element.href.endsWith(".mp3")) {
      song.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
  songul.innerHTML = "";
  for (const s of song) {
    songul.innerHTML =
      songul.innerHTML +
      ` <li>
    <img class="mus"  src="img/music.svg" alt="">
    <div class="info">
       <div>${s.replaceAll("%20", " ").split("-")[0]}</div>
       <div>${s.replaceAll("%20", " ").split("-")[1]}</div>
    </div>
    <img class="playnow" src="img/play.svg" alt=""></li>`;
  }
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      playmusic(e.querySelector(".info"));
    });
    //tell me how can i fix this bug
    //Uncaught (in promise) DOMException: Failed to load because no supported source was found
  });
  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "img/pause.svg";
    } else {
      currentsong.pause();
      play.src = "img/play.svg";
    }
  });
  return song;
}

const playmusic = (track, pause = false) => {
  currentsong.src =
  `/${currfolder}/` + encodeURIComponent(track.firstElementChild.innerHTML) + "-" + encodeURIComponent(track.lastElementChild.innerHTML); 
  if (!pause) {
    currentsong.play();
  }
  play.src = "img/pause.svg";

  let songInfoElement = document.querySelector(".songinfo");
  if (songInfoElement) {
    songInfoElement.innerHTML =
      decodeURI(track.firstElementChild.innerHTML) +
      "-" +
      decodeURI(track.lastElementChild.innerHTML);
  }

  let songTimeElement = document.querySelector(".songtime");
  if (songTimeElement) {
    songTimeElement.innerHTML = "00:00";
  }

  let durationElement = document.querySelector(".duration");
  if (durationElement) {
    durationElement.innerHTML = "00:00";
  }
};

async function displayalbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let albums = [];
  Array.from(anchors).forEach((e) => {
   if(e.href.includes("/songs")){
    albums.push(e.href.split("/").slice(-2)[1]);
   }
  }
  );
  console.log(albums);
}
async function main() {
  // get the list  of all songs  from the server
  song = await getsongs("songs/yt");
  displayalbums();
  function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const minutesString = String(minutes).padStart(2, "0");
    const secondsString = String(remainingSeconds).padStart(2, "0");

    return `${minutesString}:${secondsString}`;
  }

  currentsong.addEventListener("timeupdate", () => {
    let csong = currentsong.currentTime;
    let sec = Math.floor(csong % 60);
    let min = Math.floor(csong / 60);
    if (sec < 10) {
      sec = "0" + sec;
    }
    if (min < 10) {
      min = "0" + min;
    }
    document.querySelector(".songtime").innerHTML = ` ${
      min + ":" + sec
    } / ${convertSecondsToMinutesAndSeconds(currentsong.duration)}`;
    // document.querySelector(".duration").innerHTML = "Duration  "+convertSecondsToMinutesAndSeconds(
    //   currentsong.duration
    // );
    document.querySelector(".progress").style.width = (csong / currentsong.duration) * 100 + "%";
  });

  // listen for click on progress bar
  let p = document.querySelector(".seekbar").addEventListener("click", (e) => {
    let width = document.querySelector(".seekbar").offsetWidth;
    let clickX = e.offsetX;
    document.querySelector(".progress").style.width = clickX + "px";
    let duration = currentsong.duration;
    currentsong.currentTime = (clickX / width) * duration;
  });

  // add an event listener to the hamburger button
  document.querySelector(".ham").addEventListener("click", () => {
    document.querySelector(".left").style.left = 0;
    document.querySelector(".right").style.filter = "blur(5px)";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-100%";
    document.querySelector(".right").style.filter = "blur(0px)";
  });

  document.querySelector(".previous").addEventListener("click", () => {
    let index = song.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playmusic(song[index - 1], true);
    }
  });

  // write the eventlistener for the next button
  document.querySelector(".nextsong").addEventListener("click", () => {
    let index = song.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < song.length) {
      playmusic(song[index + 1], true);
    }
  });

  document.querySelector(".volume").addEventListener("click", () => {
    if (document.querySelector(".range").style.display == "none") {
      document.querySelector(".range").style.display = "block";
    } else {
      document.querySelector(".range").style.display = "none";
    }
  });
  // add event to volume range
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value) / 100;
    });
  // load the library when card is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      song = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}
main();
// attach an event listener to playnow button
