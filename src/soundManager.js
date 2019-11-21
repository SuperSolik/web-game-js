export class SoundManager {
	constructor() {}

	play(name){
		let audio = document.createElement("audio");
		audio.src = `sounds/${name}.wav`;
		audio.volume = 0.5;
		audio.addEventListener("ended", function () {
			document.removeChild(this);
		});
		audio.play();
	}
}
