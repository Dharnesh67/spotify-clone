console.log("lets write some javascript code");

async function getsongs() {
  let a = await fetch("http://127.0.0.1:5500/songs/");
  let response = await a.text();
  console.log(response);
  let div = document.createElement("div");
  div.innerHTML = response;
  let tds = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < tds.length; i++) {
    const element = tds[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}
async function main() {
  let song = await getsongs();
  console.log(song);
  var audio = new Audio(song[5]);
//    audio.play();
   audio.addEventListener("loadeddata", () => {
    let duration = audio.duration;
    console.log(duration)
  });
}
main();
