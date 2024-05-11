

const PLAYER_STORAGE_KEY = 'F8_PLAYER';

const heading = document.querySelector('header h2');
const cdThumb = document.querySelector('.cd-thumb');
const audio = document.querySelector("#audio");
const cd = document.querySelector(".cd");
const playButton = document.querySelector(".btn-toggle-play");
const player = document.querySelector(".player");
const progress = document.querySelector(".progress");
const nextButton = document.querySelector(".btn-next")
const prevButton = document.querySelector(".btn-prev");
const randomButton = document.querySelector(".btn-random");
const repeatButton = document.querySelector(".btn-repeat");
const playlist = document.querySelector(".playlist");
const volume = document.querySelector("#volumeSlider");


const app = {
    currentIndex : 0,
    isPlaying : false ,
    isRandom : false,
    isRepeat:false,
    config : JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    song : [
          {
            name: "Hãy trao cho anh",
            singer: "Sơn Tùng MTP - SnoopDogs",
            path: "./mp3/HayTraoChoAnh-SonTungMTPSnoopDogg-6010660.mp3",
            image:
              "https://photo-resize-zmp3.zmdcdn.me/w600_r1x1_jpeg/cover/b/a/2/d/ba2dc0a1c982fa0b1fca5ed2530fe7a9.jpg"
          },
          {
            name: "Lạc Trôi",
            singer: "Sơn Tùng MTP",
            path:
              "./mp3/LacTroi-SonTungMTP-4725907.mp3",
            image: "https://avatar-ex-swe.nixcdn.com/song/2024/03/15/4/c/b/d/1710498461112.jpg"
          },
          {
            name: "Khuôn mặt đáng thương",
            singer: "Sơn Tùng MTP",
            path: "./mp3/KhuonMatDangThuong-SonTungMTP-3823635.mp3",
            image:
              "https://avatar-ex-swe.nixcdn.com/song/2024/03/15/4/c/b/d/1710499494829.jpg"
          },
          {
            name: "Chạy Ngay đi",
            singer: "Sơn Tùng MTP",
            path: "./mp3/ChayNgayDi-SonTungMTP-5468704.mp3",
            image:
              "https://avatar-ex-swe.nixcdn.com/song/2018/05/12/e/8/6/f/1526059033533.jpg"
          },
          {
            name: "Buông đôi tay nhau ra",
            singer: "Sơn Tùng MTP x Harjas",
            path: "./mp3/BuongDoiTayNhauRa-SonTungMTP-4184408 (1).mp3",
            image:
              "https://avatar-ex-swe.nixcdn.com/song/2024/03/15/4/c/b/d/1710499494829.jpg"
          },
          {
            name: "Ấn nút nhớ thả giấc mơ",
            singer: "Sơn Tùng MTP x Harjas",
            path: "./mp3/AnNutNhoThaGiacMo-SonTungMTP-4009536 (1).mp3",
            image:
              "https://avatar-ex-swe.nixcdn.com/song/2024/03/15/4/c/b/d/1710499494829.jpg"
          } , {
            name: "Chúng ta của hiện tại",
            singer: "Sơn Tùng MTP x Harjas",
            path: "./mp3/ChungTaCuaHienTaiThienHiXHighFrequencyRemix-SonTungMTP-6893159.mp3",
            image:
              "https://avatar-nct.nixcdn.com/song/2022/12/30/5/0/0/6/1672388636484.jpg"
          } , {
            name: "Như ngày hôm qua",
            singer: "Sơn Tùng MTP x Harjas",
            path: "./mp3/NhuNgayHomQuaUpgrade-SonTungMTP-4282962 (1).mp3",
            image:
              "https://avatar-ex-swe.nixcdn.com/song/2024/03/15/4/c/b/d/1710499494829.jpg"
          } , {
            name: "Nơi này có anh",
            singer: "Sơn Tùng MTP x Harjas",
            path: "./mp3/NoiNayCoAnh-SonTungMTP-4772041 (1).mp3",
            image:
              "https://avatar-nct.nixcdn.com/song/2024/03/15/4/c/b/d/1710498649541.jpg"
          } , {
            name: "Tiến lên Việt Nam ơi",
            singer: "Sơn Tùng MTP x Harjas",
            path: "./mp3/TienLenVietNamOi-SonTungMTP-4003040 (1).mp3",
            image:
              "https://avatar-nct.nixcdn.com/song/2024/03/15/4/c/b/d/1710499543091.jpg"
          }  
    ] , 
    setConfig : function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY , JSON.stringify(this.config));
    },
    render: function() {
        // console.log(123);
        const htmls = this.song.map ( (song , index) => {
            return `
                    <div class="song ${index === this.currentIndex ? 'active ' : ""}" data-index = ${index}>
                        <div class="thumb" 
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                             <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                             <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },
    defineProperties : function() {
        Object.defineProperty(this,"currentSong" ,{
            get : function() {
                return this.song[this.currentIndex];
            }
        });
    },
    handleEvents : function () {
        const _this = this ;
        const cdWidth = cd.offsetWidth ;

        // xử lý cd quay theo bai hat và dừng
       const cdThumbAnimate =  cdThumb.animate([ // thằng animate này thì nó được sử dụng để điều chỉnh các chuyển động 
            {transform : 'rotate(360deg)'}
        ] , {
            duration: 20000, // thời gian là 10s
            iterations:Infinity, // lần lặp là vô hạn
        })
        cdThumbAnimate.pause();
        // xu ly phong to thu nho cd
        document.onscroll = function() {
            
            const scrollTop = window.scrollY || document.documentElement.scrollTop ;

            const newCdWidth = cdWidth - scrollTop ;
            cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0 ; // thêm dòng này bởi khi mà kéo nhanh quá thì cdWidth nó sẽ về âm thì sẽ không ẩn hẳn được cái cd đi
            cd.style.opacity = newCdWidth / cdWidth ;
        }

        // xu ly kh click play

        playButton.onclick = function() {
            if (_this.isPlaying){
                audio.pause() ;
            }
            else{
                audio.play() ;
            }
        }
        // khi song duoc play
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add("playing");
            cdThumbAnimate.play();
        }
        // khi song bi pause
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove("playing");
            cdThumbAnimate.pause() ;
        }
        // khi tien do bai hat thay doi
        audio.ontimeupdate = () => {
            // console.log(audio.currentTime / audio.duration * 100) ;
            if ( audio.duration){
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100) ;
                progress.value = progressPercent;
            }
        }
        // xu ly khi tua bai hat
        progress.oninput = (e) => { // chỗ này mà dùng onchange thì nó sẽ bị khựng
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime ;
        }

        // khi next bai hat
        nextButton.onclick = () => {
            if ( _this.isRandom){
                _this.randomSong();
            }
            else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        // xu ly khi quay ve bai hat truoc
        prevButton.onclick = () => {
             if (_this.isRandom){
                _this.randomSong();
            }
            else{
                _this.prevSong();
            }
            
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // xu ly su kien khi an nut random
        randomButton.onclick = () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomButton.classList.toggle("active",_this.isRandom);
        }

        // xu ly next song khi audio ended
        audio.onended = function(){
            if ( _this.isRepeat){
               audio.play();
            }
            else{
                nextButton.click();
            }
        }
        // xu ly lap lai mot bai hat khi ended
        repeatButton.onclick = function (){
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat' , _this.isRepeat);
            repeatButton.classList.toggle("active",_this.isRepeat);
        }


        // lang nghe click vao playlist
        playlist.onclick = function(e) { 
            // xu ly khi click vao song
            const songNode = e.target.closest('.song:not(.active)');
            if ( songNode || e.target.closest(".option")){
                // console.log(e.target);
                if (songNode){
                    // console.log(songNode.dataset.index); // ~ songNode.getAtribute("data-index");
                    _this.currentIndex = Number(songNode.dataset.index); // luc chua gan thi currentIndex la so , va khi gan gia tri nhu nay no chuyen thanh ky tu , => can ep lai kieu
                    _this.loadCurrentSong();
                    audio.play();
                    _this.render();
                }
                if (e.target.closest(".option")){

                }          
            }
        }
        // xu ly khi keo volumn thi am thanh sẽ tăng giảm theo
        volume.addEventListener("input" , function(e) {
            const valueVolume = e.target.value / 100;
            audio.volume = valueVolume;
        })
    },
    loadCurrentSong : function (){ 
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path ;
        this.setConfig("currentIndex" , this.currentIndex);
    } ,
    loadConfig : function() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        this.currentIndex = this.config.currentIndex; // thêm dòng này để mà khi load lại trang wed thì vẫn có bài hát mình chọn trước đó
    }
    ,
    nextSong : function () {
        this.currentIndex ++;
        if ( this.currentIndex >= this.song.length){
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong : function() {
        this.currentIndex--;
        if ( this.currentIndex < 0){
            this.currentIndex = this.song.length - 1;
        }
        this.loadCurrentSong();
    },
    randomSong: function(){
        let newIndex = 0;
        do {
            newIndex = Math.floor(Math.random() * this.song.length);
        }
        while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    scrollToActiveSong : function () {
        setTimeout(() => {
            document.querySelector('.song.active').scrollIntoView({
                behavior:"smooth", // hành động sẽ xảy ra mượt mà
                block:'end', // đảm bảo phần tử được cuộn vào cuối phần tử chứa nó
                inline:"nearest" // đảm bảo rằng phần tử được cuộn vào vị trí mà nó là gần nhất so với lề trái hoặc lề phải của phần tử chứa nó
            });
        },250);
    },
    start : function() {

        // gán cấu hình từ congig vào ứng dụng
        this.loadConfig();
        // định nghĩa các thuộc tính cho object
        this.defineProperties() ;
        // xử lý các dom event
        this.handleEvents() ;
        // tai thong tin bai hay dau tien vao Ui khi chay dung dung
        this.loadCurrentSong() ;
        // render playlist
        this.render();

        // hiển thị trạng thái ban đầu của 2 button repeat và random
        randomButton.classList.toggle("active",this.isRandom);
        repeatButton.classList.toggle("active",this.isRepeat);
    }
}
app.start();