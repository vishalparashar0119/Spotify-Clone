let currentSong = new Audio();

// fetch data for particular url
async function fetchData(url) {
      let response = await fetch(url);
      let songName = await response.text();

      let div = document.createElement("div");
      div.innerHTML = songName;


      return a = div.getElementsByTagName("a");

}


console.log("script is loaded");
// function for treending song  
async function getNamed(url) {

      let imageSongName = [];
      let a = await fetchData(url)


      // select the image anchor tag form the and its first child to get song name dynamically
      Array.from(a).forEach(element => {
            if (element.href.endsWith(".jfif")) {
                  imageSongName.push(element.firstChild.innerHTML.split("-")[0]);
            }
      });

      return imageSongName;
}
// function for get song artist name
async function getSongArtist(url) {

      let songArtist = [];
      let a = await fetchData(url)


      Array.from(a).forEach(element => {
            if (element.href.endsWith(".jfif")) {

                  songArtist.push(element.firstChild.innerHTML.split("-")[1].split(".")[0]);

            }
      });

      return songArtist;

}
// fuction for get trending song image 
async function getImages(url) {

      let image = [];
      let a = await fetchData(url)

      // select the image anchor tag form the div
      Array.from(a).forEach(element => {
            if (element.href.endsWith(".jfif")) {
                  image.push(element.href);

            }
      });

      return image;
}
// function for place multiple card
async function card(img, head, subHead, doc, artist = false) {
      let images = await img;
      let heading = await head;
      let subHeading = await subHead;
      let element = await doc;

      for (let j = 0; j < images.length; j++) {
            element.innerHTML = element.innerHTML + `<div class="card">
          <div data-song-name = "${heading[j]}" class="card-img">
            <img src="${images[j]}" alt="">
          </div>

          <h4>${heading[j]}</h4>
          <p>${artist ? "Artist" : subHeading[j]}</p>

          <div class="play-button  display-flex justify-content-center align-item-center">
              <img src="icons/playTriangle.svg" alt="" height="25" width="25">
          </div>
    </div>`
      }
}
// function for playing song mentioned on each card
function playSong(track, img, p) {
      let play = document.getElementById("pause-play").querySelector("img");
      play.src = "http://127.0.0.1:5500/icons/pause.svg"

      // let image = document.getElementById("first").querySelector("img");
      // image.src = img;

      // let sonng = document.getElementById("first").querySelector("h5");
      // sonng.innerHTML = `${track}`


      let first = document.getElementById("first");


      first.innerHTML = `<img src="${img}" alt="" width="55" height="55">
          <div>
            <h5>${track}</h5>
            <p>${p}</p>
          </div>`
      currentSong.src = `/trendingSongs/${track}.mp3`;
      currentSong.play();
}
// function to convert second to minuts

function formatTime(seconds) {
      if (isNaN(seconds) || seconds === undefined) return "00:00"; // Handle NaN values

      let minutes = Math.floor(seconds / 60);
      let remainingSeconds = Math.floor(seconds % 60);
  
      let formattedMinutes = String(minutes).padStart(2, '0');
      let formattedSeconds = String(remainingSeconds).padStart(2, '0');
  
      return `${formattedMinutes}:${formattedSeconds}`;
  }

async function main() {

      // function for trending section 
      let imagesSongs = await getImages("http://127.0.0.1:5500/trendingSongsImages/");
      let nameOfSong = await getNamed("http://127.0.0.1:5500/trendingSongsImages/");
      let songArtisName = await getSongArtist("http://127.0.0.1:5500/trendingSongsImages/");
      let trendingSection = document.querySelector(".trending-songs");
      card(imagesSongs, nameOfSong, songArtisName, trendingSection, false);

      // process for artist section
      let imagesArtist = await getImages("http://127.0.0.1:5500/artist/")
      let artistName = await getNamed("http://127.0.0.1:5500/artist/")
      let popularArtist = document.querySelector(".popular-artist");
      card(imagesArtist, artistName, songArtisName, popularArtist, true);

      //process for popular albums 
      let popularAlbumsImages = await getImages("http://127.0.0.1:5500/popularAlbum/");
      let popularAlbumName = await getNamed("http://127.0.0.1:5500/popularAlbum/");
      let popularAlbumArtistName = await getSongArtist("http://127.0.0.1:5500/popularAlbum/");
      let popularAlbum = document.querySelector(".popular-albums");
      card(popularAlbumsImages, popularAlbumName, popularAlbumArtistName, popularAlbum, false);


      // add event listner to all the card div so we can play the songs

      Array.from(document.querySelector(".trending-songs").getElementsByClassName("card")).forEach(element => {
            let h4 = element.querySelector("h4").innerHTML;
            let img = element.querySelector("img").src;
            let p = element.querySelector("p").innerHTML;
            element.addEventListener("click", () => {
                  playSong(h4, img, p);
                  document.querySelector(".media-player").classList.add("media-player-translateY")
            });
      });

      // function for play and pause current song 

      let play = document.getElementById("pause-play").querySelector("img");


      play.addEventListener("click", element => {
            if (currentSong.readyState != 0) {

                  if (currentSong.paused) {
                        currentSong.play();
                        element.target.src = "http://127.0.0.1:5500/icons/pause.svg"
                  } else {
                        currentSong.pause();
                        element.target.src = "http://127.0.0.1:5500/icons/playTriangle.svg"
                  }
            }

      });


      // function to listen time update for current song

      currentSong.addEventListener("timeupdate", () => {

            document.getElementById("current-time").innerHTML =`${formatTime(currentSong.currentTime)}`;
            document.getElementById("song-duration").innerHTML =`${formatTime(currentSong.duration)}`;
            document.querySelector(".seek-bar").style.width = (currentSong.currentTime/currentSong.duration)*100 + "%";
      })


      // add event listner to seek bar so we can seek the song

      document.querySelector(".seek-bar-main").addEventListener("click",(event)=>{
           // getBoundingClientRect() this function will tell us the total width of a box and where we cliced

           if(currentSong.readyState != 0){
           let percent = (event.offsetX/event.target.getBoundingClientRect().width)*100;
           document.querySelector(".seek-bar").style.width =  percent +"%";

           currentSong.currentTime = (currentSong.duration * percent)/100;
           }
      });

      // function for hamburger click menue

      document.querySelector(".ham-burger").addEventListener("click",()=>{
            document.querySelector(".ham-burger-slider").classList.add("ham-burger-click");
      })

      document.querySelector("#close-ham-burger").addEventListener("click",()=>{
            document.querySelector(".ham-burger-slider").classList.remove("ham-burger-click");
      })





}
main()