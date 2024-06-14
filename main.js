const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playList = $(".playlist");

const playBtn = $(".btn-toggle-play");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const player = $(".player");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");

const range = $("#progress");
const rangeAfter = window.getComputedStyle(range, "::after");

const app = {
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Click Pow Get Down",
            singer: "Raftaar x Fortnite",
            path: "Songs/tomp3.cc - vào hạ  SUNI HẠ LINH  Hương Mùa Hè show tập 1.mp3",
            image: "https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg",
        },
        {
            name: "Tu Phir Se Aana",
            singer: "Raftaar x Salim Merchant x Karma",
            path: "Songs/tomp3.cc - Vietsub  Pinyin Váy Cưới Của Em Giống Như Bông Tuyết  Lý Phát Phát  你的婚纱像雪花  李发发.mp3",
            image: "https://thanhnien.mediacdn.vn/Uploaded/caotung/2022_08_07/ca-si-mono-2225.jpg",
        },
        {
            name: "Naachne Ka Shaunq",
            singer: "Raftaar x Brobha V",
            path: "Songs/tomp3.cc - vào hạ  SUNI HẠ LINH  Hương Mùa Hè show tập 1.mp3",
            image: "https://i.ytimg.com/vi/QvswgfLDuPg/maxresdefault.jpg",
        },
        {
            name: "Mantoiyat",
            singer: "Raftaar x Nawazuddin Siddiqui",
            path: "Songs/tomp3.cc - Vietsub  Pinyin Váy Cưới Của Em Giống Như Bông Tuyết  Lý Phát Phát  你的婚纱像雪花  李发发.mp3",
            image: "https://a10.gaanacdn.com/images/song/39/24225939/crop_480x480_1536749130.jpg",
        },
        {
            name: "Aage Chal",
            singer: "Raftaar",
            path: "Songs/tomp3.cc - vào hạ  SUNI HẠ LINH  Hương Mùa Hè show tập 1.mp3",
            image: "https://a10.gaanacdn.com/images/albums/72/3019572/crop_480x480_3019572.jpg",
        },
        {
            name: "Damn",
            singer: "Raftaar x kr$na",
            path: "Songs/tomp3.cc - Vietsub  Pinyin Váy Cưới Của Em Giống Như Bông Tuyết  Lý Phát Phát  你的婚纱像雪花  李发发.mp3",
            image: "https://image.baophapluat.vn/w840/Uploaded/2024/hfobhvwbucqaow/2022_11_12/truc-nhan-6080.jpg",
        },
        {
            name: "Feeling You",
            singer: "Raftaar x Harjas",
            path: "Songs/tomp3.cc - vào hạ  SUNI HẠ LINH  Hương Mùa Hè show tập 1.mp3",
            image: "https://a10.gaanacdn.com/gn_img/albums/YoEWlabzXB/oEWlj5gYKz/size_xxl_1586752323.webp",
        },
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return `<div class="song ${
                index === this.currentIndex ? "active" : ""
            }" data-index="${index}">
                    <div
                        class="thumb"
                        style="
                            background-image: url('${song.image}');
                        "
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`;
        });
        $(".playlist").innerHTML = htmls.join("");
        // songList = $$(".song");
    },

    handleEvents: function () {
        const cdWidth = cd.offsetWidth;

        //Xử lý CD quay/dừng
        const cdAnimate = cdThumb.animate(
            //animate trả về đối tượng
            [
                {
                    transform: "rotate(360deg)",
                },
            ],
            {
                duration: 10000,
                iterations: Infinity,
            }
        );

        cdAnimate.pause();

        //khi cuộn
        document.onscroll = function () {
            const windowScrollY = window.scrollY;

            const newCdWidth = cdWidth - windowScrollY;
            cd.style.width = cdWidth >= windowScrollY ? newCdWidth + "px" : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        };

        //khi nhấn nút play/pause
        playBtn.onclick = function () {
            if (player.classList.contains("playing")) {
                cdAnimate.pause();
                audio.pause();
                player.classList.remove("playing");
            } else {
                cdAnimate.play();
                audio.play();
                player.classList.add("playing");
            }
        };

        //Khi thời lượng thay đổi
        audio.ontimeupdate = function () {
            const rangePercent =
                audio.currentTime === 0
                    ? 0
                    : (audio.currentTime / audio.duration) * 100;
            range.value = rangePercent;
            //Nơi mà slidethumb đã chạy qua sẽ đổi thành màu hồng
            range.style.setProperty("--after-width", `${range.value}%`); //set biến có giá trị range.value trong css

            //Kiểm tra bài hát end hay chưa, nếu end thì nextSong được gọi
            if (audio.ended) {
                app.nextSong();
                audio.play();
                app.render();
            }
        };

        //khi tua audio
        range.onchange = function () {
            const audioTime = (range.value / 100) * audio.duration;
            audio.currentTime = audioTime;
        };

        //Khi nhấn nút next
        nextBtn.onclick = function () {
            app.nextSong();
            app.render();
            audio.play();
            cdAnimate.play();
            player.classList.add("playing");
        };

        //Khi nhấn nút previous
        prevBtn.onclick = function () {
            app.previousSong();
            app.render();
            audio.play();
            cdAnimate.play();
            player.classList.add("playing");
        };

        //Khi bật/tắt Random
        randomBtn.onclick = function () {
            app.isRandom = !app.isRandom;
            randomBtn.classList.toggle("active", app.isRandom);
        };

        //Khi bật/tắt repeat
        repeatBtn.onclick = function () {
            app.isRepeat = !app.isRepeat;
            repeatBtn.classList.toggle("active", app.isRepeat);
            if (app.isRepeat) {
                audio.loop = true;
            } else {
                audio.loop = false;
            }
        };

        // Khi click vào bài hát
        playList.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");

            //khi click vào một bài khác mà không phải nút option
            if (songNode && !e.target.closest(".option")) {
                app.currentIndex = songNode.dataset.index;
                $(".song.active").classList.remove("active");
                songNode.classList.add("active");
                app.loadCurrentSong();
                audio.play();
                player.classList.add("playing");
                cdAnimate.play();
            }

            //Khi click nút option(của bài hiện tại hoặc bài khác)
            if (e.target.closest(".option")) {
                console.log(e.target);
            }
        };
    },

    //Phát bài tiếp theo
    nextSong: function () {
        if (this.isRandom) {
            //Kiểm tra xem có đang ở chế độ random hay không
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentIndex++;
        }

        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },

    //Phát bài trước
    previousSong: function () {
        if (this.isRandom) {
            //Kiểm tra xem có đang ở chế độ random hay không
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } else {
            this.currentIndex--;
        }

        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },

    //Đưa bài hát dựa trên currentIndex vào source audio
    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
    },

    //Hàm định nghĩa các thuộc tính(hiện tại chỉ có 1 thuộc tính:v)
    defineProperties: function () {
        //định nghĩa một thuộc tính trong app:
        // currentSong: songs[currentIndex]
        Object.defineProperty(this, "currentSong", {
            get: function () {
                return this.songs[this.currentIndex];
            },
        });
    },

    //Active bài hát hiện tại
    activeCurrentSong: function () {},

    start: function () {
        this.handleEvents();
        //định nghĩa các thuộc tính cho this (app)
        this.defineProperties();
        this.loadCurrentSong();
        this.render();
    },
};

app.start();
