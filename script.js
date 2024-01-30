console.log("lets write some javascript code");

let currentsong = new Audio();

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let tds = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < tds.length; i++) {
    const element = tds[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split("/songs/")[1]);
    }
  }
  return songs;
}
const playmusic = (song, pause = false) => {
  currentsong.src =
    "songs/" + song.firstElementChild.innerHTML + "-" + song.lastElementChild.innerHTML;
  if (!pause) {
    currentsong.play();
  }
  play.src = "img/pause.svg";
  
  let songInfoElement = document.querySelector(".songinfo");
  if (songInfoElement) {
    songInfoElement.innerHTML =
      decodeURI(song.firstElementChild.innerHTML) + "-" + decodeURI(song.lastElementChild.innerHTML);
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

async function main() {
  // get the list  of all songs  from the server
  let song = await getsongs();
  // playmusic(song[0], true);
  //  show all songs in the playlist
  let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0];
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

  let playnow = document.getElementsByClassName("playnow");

  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playmusic(e.querySelector(".info"));
    });
    //tell me how can i fix this bug
    //Uncaught (in promise) DOMException: Failed to load because no supported source was found
  });
  //  play the song when clicked
}
main();
// attach an event listener to playnow button
play.addEventListener("click", () => {
  if (currentsong.paused) {
    currentsong.play();
    play.src = "img/pause.svg";
  } else {
    currentsong.pause();
    play.src = "img/play.svg";
  }
});

// listen for time update event

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
  document.querySelector(".progress").style.width =(csong / currentsong.duration) * 100 + "%";
});

// listen for click on progress bar
let p = document.querySelector(".seekbar").addEventListener("click", (e) => {
  let width = document.querySelector(".seekbar").offsetWidth;
  let clickX = e.offsetX;
  document.querySelector(".progress").style.width =clickX + "px";
  let duration = currentsong.duration;
  currentsong.currentTime = (clickX / width) * duration;
});


// add an event listener to the hamburger button
document.querySelector(".ham").addEventListener("click", () => {
  document.querySelector(".left").style.left=0;
  document.querySelector(".right").style.filter="blur(5px)";
});
document.querySelector(".close").addEventListener("click", () => {
  document.querySelector(".left").style.left="-100%";
  document.querySelector(".right").style.filter="blur(0px)";
});