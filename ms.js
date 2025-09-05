const audio=document.getElementById("audio");
const playbtn=document.getElementById("play");
const prevbtn=document.getElementById("prev");
const nextbtn=document.getElementById("next");
const progress=document.getElementById("progress");
const volume=document.getElementById("volume");
const artist=document.getElementById("song-artist");
const title=document.getElementById("song-title");

const songs=[
    {
        name:"rs.mp3",
        title:"End of Beginning x Missing out",
        artist:"Djo",
    },
    {
        name:"Kaun_Tujhe.mp3",
        title:"Kaun Tujhe",
        artist:"Palak Muchhal",
    },
    {
        name:"O_Saathi).mp3",
        title:"O Saathi",
        artist:"Atif Aslaam & Manoj Bajpayee",
    },
    {
        name:"Maula_Mere_Maula.mp3",
        title:"Maula Mere",
        artist:"Mithoon & Roopkumar Rathod"
    }
    
];

const playlistContainer=document.getElementById("playlist");
let currentSpeed = 1; 
let songIndex=0;
let playbackMode="auto";


songs.forEach((song,index)=>{
    const li=document.createElement("li");
    li.textContent=`${song.title}- ${song.artist}`;
    li.onclick= () =>{
        loadSong(index);
        playSong();
        highlightCurrent(index);
    };
    playlistContainer.appendChild(li);
});



function loadSong(index)
{
    const song=songs[index];
    audio.src=`Songs/${song.name}`;
    title.textContent=song.title;
    artist.textContent=song.artist;
    songIndex=index;
    audio.playbackRate = currentSpeed;
    localStorage.setItem("lastSongIndex", index);
    playSong();
}

function playSong()
{
    audio.play();
    playbtn.textContent="⏸️";
}

function pauseSong()
{
    audio.pause();
    playbtn.textContent="▶️";
}

function highlightCurrent(index){
    const items=document.querySelector("#playlist li");
    items.forEach((li,i)=> {
        li.classList.toggle("active",i===index0);
    });
}

playbtn.addEventListener("click",()=>{
    if(audio.paused){
        playSong();
    }else{
        pauseSong();
    }
});

prevbtn.addEventListener("click",()=>{
    songIndex=(songIndex-1 + songs.length) % songs.length;
    loadSong(songIndex);
});

nextbtn.addEventListener("click",()=>{
    songIndex=(songIndex + 1) % songs.length;
    loadSong(songIndex);
});

audio.addEventListener("timeupdate",()=>{
    if(audio.duration){
    progress.value=(audio.currentTime / audio.duration) * 100;
    document.getElementById("current-time").textContent=formatTime(audio.currentTime);
    document.getElementById("total-duration").textContent=formatTime(audio.duration);
    }
});

audio.addEventListener("ended", () => {
    if (playbackMode === "auto") {
      songIndex = (songIndex + 1) % songs.length;
      loadSong(songIndex);
    } else if (playbackMode === "shuffle") {
      let nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === songIndex);
      songIndex = nextIndex;
      loadSong(songIndex);
    }
  });


  function toggleMode() {
    if (playbackMode === "auto") {
      playbackMode = "shuffle";
    } else if (playbackMode === "shuffle") {
      playbackMode = "manual";
    } else {
      playbackMode = "auto";
    }
  
    document.getElementById("mode-btn").textContent = "Mode: " + capitalize(playbackMode);
    localStorage.setItem("playbackMode", playbackMode);
  }
  
  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  
progress.addEventListener("input",()=>{
    audio.currentTime=(progress.value / 100) * audio.duration ;
});

volume.addEventListener("input",()=>{
    audio.volume=volume.value;
});

window.onload= () => {
    const savedSpeed = localStorage.getItem("playbackSpeed");
  if (savedSpeed !== null) {
    currentSpeed = parseFloat(savedSpeed);
    setSpeed(currentSpeed);
  } else {
    setSpeed(1.0); 
  }

  const savedIndex = localStorage.getItem("lastSongIndex");
  if (savedIndex !== null) {
    songIndex = parseInt(savedIndex);
  }

  const savedMode = localStorage.getItem("playbackMode");
    if (savedMode) {
        playbackMode = savedMode;
        document.getElementById("mode-btn").textContent = "Mode: " + capitalize(playbackMode);
    }
    loadSong(songIndex);
    highlightCurrent(songIndex);
    volume.value=0.5;
    audio.volume=0.5;
};

function formatTime(timeInSeconds){
    const minutes=Math.floor(timeInSeconds/60);
    const seconds=Math.floor(timeInSeconds%60);
    return `${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`;
}

function setSpeed(rate) {
  currentSpeed = rate; 
  audio.playbackRate = currentSpeed;
  localStorage.setItem("playbackSpeed", rate);

  const allButtons = document.querySelectorAll('.speed-controls button');
  allButtons.forEach(btn => btn.classList.remove('active-speed'));

  const selectedButton = [...allButtons].find(btn =>
    btn.textContent.includes(`${rate}x`)
  );
  if (selectedButton) selectedButton.classList.add('active-speed');

  if (rate !== 1.0) {
    document.getElementById('normal-btn').disabled = false;
  }
  }
  