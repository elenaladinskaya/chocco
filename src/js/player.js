(function () {
  const playerContainer = document.querySelector('.player');
  const playerWrapper = document.querySelector('.player__wrapper');
  const video = document.querySelector('.player__video');
  const playerStart = document.querySelector('.player__controls-start');
  const playerPaused = document.querySelector('.player__paused');
  const progressBar = document.querySelector('.player__playback-line');
  const playerVideoCircle = document.querySelector('.player__playback-circle');
  const playerVolumeIcon = document.querySelector('.player__mute');
  const playerVolumeBar = document.querySelector('.player__volume-line');
  const playerVolumeCircle = document.querySelector('.player__volume-circle');

  let startVolume = 0;
  let currentVolume;

  // Запуск

  const handleStart = () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  playerStart.addEventListener('click', handleStart);
  playerPaused.addEventListener('click', handleStart);
  playerWrapper.addEventListener('click', handleStart);

  // Изменение иконки плей/пауза

  video.onplay = () => {
    togglePlayer();
  }

  video.onpause = () => {
    togglePlayer("pause");
  }

  const togglePlayer = (action = "start") => {
    if (action === "start") {
      playerContainer.classList.add("active");
    } else {
      playerContainer.classList.remove("active");
    }
  }

  // Изменение звука

  const changeVolume = (e) => {
    const currentTarget = e.currentTarget;
    const left = currentTarget.getBoundingClientRect().left; // получить значение левого угла элемента
    const soundBarWidth = parseInt(getComputedStyle(currentTarget).width);
    const newPosition = e.pageX - left;
    const percentValue = (newPosition / soundBarWidth) * 100;

    video.volume = percentValue / 100;
    playerVolumeCircle.style.left = `${percentValue}%`;


    if (video.volume > 0) {
      playerContainer.classList.remove('muted');
    }
  }

  const toggleSound = () => {
    playerContainer.classList.toggle('muted');

    if (video.volume === 0) {
      // Unmuted video
      video.volume = currentVolume;
      playerVolumeCircle.style.left = `${currentVolume * 100}%`;
    } else {
      // Muted video
      currentVolume = video.volume;
      video.volume = startVolume;
      playerVolumeCircle.style.left = `${startVolume}%`;
    }
  }

  playerVolumeIcon.addEventListener('click', toggleSound);
  playerVolumeBar.addEventListener('click', changeVolume);

  // Управление продолжительностью

  const handleDuration = (e) => {
    const barSize = parseInt(getComputedStyle(progressBar).width);
    const circleWidth = parseInt(getComputedStyle(playerVideoCircle).width);
    const offsetX = e.offsetX;

    const newSize = offsetX + circleWidth / 2;
    const newTime = (newSize * video.duration) / barSize;
    video.currentTime = newTime;
  }

  const updateTime = () => {
    const lineBar = video.currentTime / video.duration;
    playerVideoCircle.style.left = `${lineBar * 100}%`;

    if (video.ended) {
      video.currentTime = 0;
    }
  }

  progressBar.addEventListener('click', handleDuration);
  video.addEventListener('timeupdate', updateTime);
})()