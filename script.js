console.log("lets write some javascript code");

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
      // console.log(element.href.split("/songs/")[1]);
      song.push(element.href.split(`/${folder}/`)[1]);
    }
  }
  return song;
}

const playmusic = (track, pause = false) => {
  // currentsong.src =
  // "songs/" + track.firstElementChild.innerHTML + "-" + track.lastElementChild.innerHTML;
  currentsong.src =`/${currfolder}/`+track.firstElementChild.innerHTML + "-" + track.lastElementChild.innerHTML;
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
async function main() {
  // get the list  of all songs  from the server
  song = await getsongs("songs");
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
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      console.log(e.querySelector(".info"));
      playmusic(e.querySelector(".info"));
    });
    //tell me how can i fix this bug
    //Uncaught (in promise) DOMException: Failed to load because no supported source was found
  });
  //  play the song when clicked
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
    // console.log(song);
    let index = song.indexOf(currentsong.src.split("/").slice(-1)[0])
    // console.log(index);
    if (index - 1 >= 0) {
      // console.log(song[index - 1]);
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
    if(document.querySelector(".range").style.display =="none"){
      document.querySelector(".range").style.display = "block";}
    else{
      document.querySelector(".range").style.display = "none";
    }
  });
  // add event to volume range
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    // console.log(e.target.value);
    currentsong.volume = parseInt(e.target.value) / 100;
  });
  
}
main();
// attach an event listener to playnow button
