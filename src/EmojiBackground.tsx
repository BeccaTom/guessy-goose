import React, { useEffect } from 'react';
import './EmojiBackground.css';

const EmojiBackground: React.FC = () => {
  const maxEmojis = 100; // Set the maximum number of emojis allowed on the screen

  useEffect(() => {
    const emojis = ['❔', '🥸', '🤨', '🖼️', '🦜', '🕺', '🎨', '🪿', '🦄', '🫶', '🪼', '🦋', '🦞', '🍄', '💫', '🫧', '🐸', '🍻'];
    const emojiContainer = document.getElementById('emoji-rain-container');

    const createEmoji = () => {
      if (emojiContainer && emojiContainer.children.length < maxEmojis) {
        const emojiElement = document.createElement('span');
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        emojiElement.textContent = emoji;
        emojiElement.classList.add('falling-emoji');

        const size = Math.random() * 8 + 2 + 'rem';
        emojiElement.style.fontSize = size;
        emojiElement.style.left = Math.random() * 100 + 'vw';
        const duration = Math.random() * 8 + 12 + 's';
        emojiElement.style.animationDuration = duration;

        emojiContainer.appendChild(emojiElement);

        emojiElement.addEventListener('animationend', () => {
          emojiElement.remove();
        });
      } else if (emojiContainer && emojiContainer.children.length >= maxEmojis) {
        // Remove the oldest emoji when the limit is reached
        emojiContainer.removeChild(emojiContainer.firstChild!);
      }
    };

    const interval = setInterval(createEmoji, 300);

    return () => clearInterval(interval);
  }, []);

  return <div id="emoji-rain-container" className="emoji-background"></div>;
};

export default EmojiBackground;
