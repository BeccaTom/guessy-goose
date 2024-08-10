// src/utils/imageUtils.ts

export function generateProfilePic(username: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 100;
  
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#607d8b'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    ctx!.fillStyle = color;
    ctx!.fillRect(0, 0, canvas.width, canvas.height);
  
    ctx!.fillStyle = '#FFFFFF';
    ctx!.font = 'bold 50px Arial';
    ctx!.textAlign = 'center';
    ctx!.textBaseline = 'middle';
    ctx!.fillText(username.charAt(0).toUpperCase(), canvas.width / 2, canvas.height / 2);
  
    return canvas.toDataURL();
  }
  