console.log('lets write javascript');
let currentsong = new Audio()
let songs;
let currentSong;
let currFolder;


function secondstoMinutesSeconds(seconds) {
    let mins = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    mins = String(mins).padStart(2, "0");
    secs = String(secs).padStart(2, "0");

    return `${mins}:${secs}`;
}



async function getSongs(folder) {
    // let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/`)
    let a = await fetch(`songs/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // 
  let song = decodeURIComponent(element.href)

            song = song.replaceAll("\\", "/")

            song = song.split("/").pop()

            songs.push(song)
        }
        

        

    }
    return songs
}


const playMusic = (track, pause = false) => {

    currentSong = track

    

    currentsong.src = `/songs/${currFolder}/` + track

    if (!pause) {
        currentsong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML =
        decodeURIComponent(track).replace(".mp3", "")

    document.querySelector(".songtime").innerHTML = "00:00/00:00"
}


async function displayAlbums() {

    console.log("displaying albums")

    let a = await fetch("/songs/")
    let response = await a.text()

    let div = document.createElement("div")
    div.innerHTML = response

    let anchors = div.getElementsByTagName("a")

    let cardcontainer = document.querySelector(".cardcontainer")

    let array = Array.from(anchors)

    for (let index = 0; index < array.length; index++) {

        const e = array[index]

        let href = e.href

        href = href.replaceAll("%5C", "/")
        href = href.replaceAll("\\", "/")

        console.log(href)

        if (href.includes("/songs/")) {

            let parts = href.split("/songs/")

            if (!parts[1]) continue

            let folder = parts[1].replaceAll("/", "")

            if (folder == "") continue

            console.log("FOLDER:", folder)

            try {

                let a = await fetch(`/songs/${folder}/info.json`)
                let response = await a.json()

                cardcontainer.innerHTML += `

                <div data-folder="${folder}" class="card">

                    <div class="play">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                        stroke-linejoin="round" />
                </svg>
                    </div>

                    <img src="/songs/${folder}/cover.jpg">

                    <h2>${response.title}</h2>

                    <p>${response.description}</p>

                </div>`

            }

            catch (error) {

                console.log("ERROR:", folder)

            }
        }
    }

    // card click
    Array.from(document.getElementsByClassName("card")).forEach(e => {

        e.addEventListener("click", async item => {

            currFolder = item.currentTarget.dataset.folder

            songs = await getSongs(currFolder)

            let songUL = document.querySelector(".songlist ul")

            songUL.innerHTML = ""

            for (const song of songs) {

                songUL.innerHTML += `

                <li>

                    <img class="invert" src="music.svg">

                    <div class="info">
                        <div class="songname">
                            ${decodeURIComponent(song).replace(".mp3", "")}
                        </div>

                        <div class="songartist">
                            Song Artist
                        </div>
                    </div>

                    <div class="playnow">
                        <span>Play Now</span>
                        <img class="invert" src="play.svg">
                    </div>

                </li>`
            }

            Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, index) => {

                e.addEventListener("click", () => {

                    playMusic(songs[index])

                })

            })

        })

    })

}








async function main() {
//Display all the albums on the page

 await displayAlbums()



    // get the list of all the songs
currFolder = "Happy"
songs = await getSongs(currFolder)
Array.from(document.getElementsByClassName("card")).forEach(e=>{

    e.addEventListener("click", async item=>{

        currFolder = item.currentTarget.dataset.folder

        songs = await getSongs(currFolder)

        let songUL = document.querySelector(".songlist ul")

        songUL.innerHTML = ""
    // playMusic(songs[0], true)
    // let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
<li>


                            <img class="invert"  src="music.svg" alt="">
                            <div class="info">
                                <div class="songname"> ${decodeURIComponent(song).replace(".mp3", "")} </div>
                                <div class="songartist">Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert"  src="play.svg" alt="">
                            </div>
                            
                        







</li>`;
        
    }

    

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((e, index) => {

    e.addEventListener("click", () => {

        playMusic(songs[index])

    })

})
})
})        /


    

    //Attach an event listener to play, next, and previous 

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "play.svg"
        }
    })

    //listen for time update event

    currentsong.addEventListener("timeupdate", () => {
        console.log(currentsong.currentTime, currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondstoMinutesSeconds(currentsong.currentTime)}/${secondstoMinutesSeconds(currentsong.duration)}`

        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";

    })


//add an eventlistener to seekbar
document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentsong.currentTime = ((currentsong.duration) * percent) / 100
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })
 //Add an event listener for close button
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })
//Add an event listener for next 
// next.addEventListener("click", () => {
// console.log("next clicked")
// console.log(currentsong);

//     let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

//     if ((index + 1) > length) {
//         playMusic(songs[index + 1])
//     }

// })
next.addEventListener("click", () => {

    let index = songs.indexOf(currentSong)

    if (index < songs.length - 1) {
        playMusic(songs[index + 1])
    }

})
//Add an event listener for previous 
previous.addEventListener("click", () => {

    let index = songs.indexOf(currentSong)

    if (index > 0) {
        playMusic(songs[index - 1])
    }

})
//Add an event to volume

document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
console.log(e, e.target, e.target.value)
currentsong.volume = parseInt(e.target.value)/100
})
let volume = document.querySelector(".volume")
let range = document.querySelector(".range")

function showRange(){
    range.style.display = "block"
    range.style.transiton = "all ease"
   
}

function hideRange(){
    range.style.display = "none"
    range.style.transiton = "all ease"
     
}
 
    
volume.addEventListener("mouseenter", showRange)
range.addEventListener("mouseenter", showRange)

volume.addEventListener("mouseleave", ()=>{
    setTimeout(()=>{
        if(!range.matches(":hover")){ 
            hideRange()
        }
    },3000)
})

range.addEventListener("mouseleave", hideRange)






// let volume = document.querySelector(".volume")
// let range = document.querySelector(".range")

// // hover show
// volume.addEventListener("mouseenter", ()=>{
//     range.classList.add("show")
// })

// // hover hide
// volume.addEventListener("mouseleave", ()=>{
//     range.classList.remove("show")
// })
volume.addEventListener("click", ()=>{
    range.classList.toggle("show")
// click toggle

})
    //play the first song
    // var audio = new Audio (songs[0]);
    // audio.play();

    //Add an event to mute
 document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })




}

main()