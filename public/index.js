const musicListMP3 = [
    "./audios/Wesley's Theory.mp3",
    "./audios/Alright.mp3",
    "./audios/Just Wanna Rock.mp3",
    "./audios/500lbs.mp3",
    "./audios/Dark Thoughts.mp3",
    "./audios/Tic Tac Toe.mp3",
    "./audios/Ransom.mp3",
    "./audios/Lo Mein.mp3",
    "./audios/Trim.mp3",
    "./audios/Can’t Feel My Face.mp3",
    "./audios/São Paulo.mp3",
    "./audios/Timeless.mp3"
];

const songNames = [
    "Wesleys Theory",
    "Alright",
    "Just Wanna Rock",
    "500lbs",
    "Dark Thoughts",
    "Tic Tac Toe",
    "Ransom",
    "Lo Mein",
    "Trim",
    "Can't Feel My Face",
    "São Paulo",
    "Timeless"
];

const artistName = [
    "Kendrick Lamar",
    "Kendrick Lamar",
    "Lil Uzi Vert",
    "Lil Tecca",
    "Lil Tecca",
    "Lil Tecca",
    "Lil Tecca",
    "Lil Tecca",
    "Lil Uzi Vert",
    "Playboi Carti ft. Future",
    "The Weeknd",
    "The Weeknd"
];

const albumCovers = [
    "./assets/TPAB.avif",
    "./assets/TPAB.avif",
    "./assets/JWR.jpg",
    "./assets/500lbs.jpeg",
    "./assets/Dark Thoughts.avif",
    "./assets/Dopamine.png",
    "./assets/WLYT.jpeg", 
    "./assets/EA.jpeg", 
    "./assets/IAMMUSIC.png", 
    "./assets/ICFMF.jpeg", 
    "./assets/HUT.jpeg", 
    "./assets/HUT.jpeg"
];

//setting up variables
const changeSongName = document.getElementById("songName"); //h2 tag
const changeArtistName = document.getElementById("Artist"); //p tag
const changeAlbumCover = document.getElementById("albumCover"); //img tag

const seekBar = document.getElementById("seekBar");//input range bar
const currentTimeEl = document.getElementById("currentTime");//span
const durationEl = document.getElementById("duration");//span

const playPauseBtn = document.getElementById("playPauseButton"); //button 
const nextBtn = document.getElementById("nextButton");//button 
const prevBtn = document.getElementById("prevButton");//button

const volumeControl = document.getElementById("volumebar");

const addingQueue = document.getElementById("URLinput");//user enters url to extract audio 
const addingQueueButton = document.getElementById("submitBTN");//button when submitting link

let playQueue = [];//next songs
let historyStack = [];//for previous song
let currentSongIndex = -1;//starting index that gets added
let isPlaying = false;//for buttons
let audio = new Audio();
let wasPlayingBeforeSeek = false;//to pause song while scrolling bar
let firstPlay = true;//to stop song from automatically playing when page loads

//start of functions 

//algortihm to shuffly songs taken from quiz app project 
function shuffleSongs() {
  playQueue = songNames.map((_, i) => i);
  for (let i = playQueue.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [playQueue[i], playQueue[j]] = [playQueue[j], playQueue[i]];
  }
}

//goes through random queue made in previous function 
function getNextSongIndex() {
  if (playQueue.length === 0) {
    shuffleSongs();
  }
  //gets rid of first index in list queue
  return playQueue.shift();
}

//change info on screen and in storage
function loadSong(index) {
  changeSongName.textContent = songNames[index];
  changeArtistName.textContent = artistName[index];
  changeAlbumCover.src = albumCovers[index];
  audio.src = musicListMP3[index];
}

//stops song when it ends and loads info for next song
function loadNextRandomSong() {
  if (currentSongIndex !== -1) {
    historyStack.push(currentSongIndex);
  }
  if (firstPlay){
    currentSongIndex = getNextSongIndex();
    audio.pause();
    loadSong(currentSongIndex);
    firstPlay = false;
  } else{
    currentSongIndex = getNextSongIndex();
    audio.pause();
    loadSong(currentSongIndex);
    audio.play();
    playPauseBtn.textContent = "⏸️";
    isPlaying = true;
  }
}

//gets song from history list and lets you play it when 
function playPrevSong() {
  if (historyStack.length === 0) return;
  const prevIndex = historyStack.pop();//remove most recently added item of history list
  if (currentSongIndex !== -1) {
    playQueue.unshift(currentSongIndex);//adds current song to first elements of queue 
  }
  //then goes to previous song played
  currentSongIndex = prevIndex;
  audio.pause();
  loadSong(currentSongIndex);
  audio.play();
  playPauseBtn.textContent = "⏸️";
  isPlaying = true;
}

//changed how the button looks based off if the user clicked it to pause or play 
function togglePlayPause() {
  if (isPlaying) {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  } else {
    audio.play().catch(() => {});
    playPauseBtn.textContent = "⏸️";
  }
  isPlaying = !isPlaying;
}

//changed how the time is displayed on screen 
function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${min}:${sec}`;
}

//sets up time when the page is first loaded or song is first loaded 
audio.addEventListener("loadedmetadata", () => {
  seekBar.max = Math.floor(audio.duration);
  durationEl.textContent = formatTime(audio.duration);
});

//gets time and formats it using previous funtion formatTime
audio.addEventListener("timeupdate", () => {
  seekBar.value = Math.floor(audio.currentTime);
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

//changed audio time based off bar 
seekBar.addEventListener("input", () => {
  audio.currentTime = seekBar.value;
});

//pauses the audio when someone is scrolling with the bar
seekBar.addEventListener("mousedown", () => {
  if (isPlaying) {
    audio.pause();
    wasPlayingBeforeSeek = true;
  } else {
    wasPlayingBeforeSeek = false;
  }
});

//changes time value once the user stops holding down mouse
seekBar.addEventListener("mouseup", () => {
  audio.currentTime = seekBar.value;
  if (wasPlayingBeforeSeek) {
    audio.play().catch(() => {});
  }
});

//samething as the other eventlistener but this just lets you click to a certain time and go to it 
seekBar.addEventListener("touchstart", () => {
  if (isPlaying) {
    audio.pause();
    wasPlayingBeforeSeek = true;
  } else {
    wasPlayingBeforeSeek = false;
  }
});


seekBar.addEventListener("touchend", () => {
  audio.currentTime = seekBar.value;
  if (wasPlayingBeforeSeek) {
    audio.play().catch(() => {});
  }
});

volumeControl.addEventListener("input", ()=>{
  let volume = volumeControl.value;
  audio.volume = volume/100;
  if (wasPlayingBeforeSeek) {
    audio.play().catch(() => {});
  }
})

//grabbing from server
addingQueueButton.addEventListener("click", function (event) {
  const enteredURL = addingQueue.value.trim();
  if (!enteredURL) return;
  addingQueue.value = "";

  fetch("http://localhost:3000/api/add-song", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url: enteredURL }),
  })
  .then((res) => res.json())
  .then((data) => {
    if (!data.filename) {
      console.error("No filename received from server", data);
      return;
    }
    const filename = data.filename;
    const author = data.author;

    const songTitle = filename.replace(".mp3", "").replaceAll("_", " ");
    if (!songNames.includes(songTitle)) {
      musicListMP3.push(`./audios/${filename}`);
      songNames.push(songTitle);
      artistName.push(author);
      albumCovers.push("./assets/defaultcover.jpeg");
      playQueue.push(musicListMP3.length - 1);

      console.log("Added to queue:", filename);
    } else {
      console.log("Song already exists, not adding duplicate:", filename);
    }
  })
  .catch((err) => console.error("Error adding song:", err));
});




//adding button function 
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", loadNextRandomSong);
prevBtn.addEventListener("click", playPrevSong);

//when song finishes go to next song 
audio.addEventListener("ended", loadNextRandomSong);
//shuffle song queue from list 
shuffleSongs();
//loads song first and next songs 
loadNextRandomSong();

