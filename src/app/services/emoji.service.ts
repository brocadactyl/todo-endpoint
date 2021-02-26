import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  constructor() {
  }

  getRandomEmojis(): string {
    let final = '';
    const minNum = 1;
    const maxNum = 3;
    const numOfEmojis = Math.floor(Math.random() * maxNum + minNum);
    const emojiList = {
      1: '😃',
      2: '🎊',
      3: '🎉',
      4: '👏',
      5: '👍',
      6: '💎',
      7: '🙌'
    };

    const sameOrDiff = Math.random();
    if (sameOrDiff < 0.33) {
      // Random emojis
      for (let i = 0; i < numOfEmojis; i++) {
        const rnd = Math.floor(Math.random() * (Object.keys(emojiList).length) + 1);
        final += emojiList[rnd];
      }
    } else {
      // Same emojis
      const rnd = Math.floor(Math.random() * (Object.keys(emojiList).length) + 1);
      for (let i = 0; i < numOfEmojis; i++) {
        final += emojiList[rnd];
      }
    }
    return final;
  }
}
