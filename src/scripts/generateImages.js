const fetch = require('node-fetch');
const { storage } = require('../firebase-config.js');
const { ref, uploadBytes, deleteObject, listAll } = require('firebase/storage');


const LIMEWIRE_API_KEY = 'lmwr_sk_PbNFnbMnHi_zeRx9nrCknUKW2fPIInnvzPv8gY9Tf0ghGh0o'; 

// Subjects and styles arrays
const subjects = [
    "a hotdog doing a handstand", "a flying saucer abducting a cow", 
    "a kitten juggling balls of yarn", "a robot dancing the tango", 
    "a rubber duck on a pirate ship", "a toaster shooting lasers", 
    "a unicorn painting a rainbow", "a cityscape made of jelly beans", 
    "an island floating in the sky", "a knight skateboarding through a castle", 
    "a dinosaur riding a tricycle", "an astronaut exploring a candy planet", 
    "a detective solving a case with a ghost partner", 
    "a dragon hosting a tea party", "a ship sailing through the clouds", 
    "a forest where the trees whisper secrets", "a wizard brewing a potion in a cozy cabin", 
    "a robot playing a grand piano", "a mansion where paintings come to life", 
    "a snowman in a tropical paradise", "a fox playing a saxophone under a streetlamp", 
    "a penguin sipping hot cocoa in a cozy café", "a mermaid singing to the moon", 
    "an airship drifting through the stars", "a superhero baking cookies", 
    "a monster hiding under a child's bed", "a fairy tending a garden of glowing flowers", 
    "a ninja flipping pancakes in a diner", "a cowboy lassoing a shooting star", 
    "a surfer catching waves of lava", "a dragon navigating the subway", 
    "a detective following clues in a rain-soaked city", "a samurai meditating in a snow-covered forest", 
    "a cat with glowing eyes guarding a treasure", "a penguin floating through space in a bubble", 
    "a talking tree telling stories to woodland creatures", "a robot sheriff in a wild west town", 
    "a knight battling a shadowy dragon", "a vampire hosting a spooky dinner party", 
    "a clown performing in a haunted house", "a witch brewing potions under a full moon", 
    "a group of zombies forming a band", "a ghost ship sailing through a stormy sea", 
    "a robot uprising in a futuristic city", "a magician pulling a rabbit out of a hat", 
    "a detective solving a mystery in a foggy alley", "a cat wearing a high-tech suit of armor", 
    "a dog leading a team of superheroes", "a bear riding a unicycle through the circus", 
    "a giraffe flying a kite from a hot air balloon", "a panda exploring a bamboo labyrinth", 
    "a hamburger playing a guitar", "a lion conducting an orchestra of jungle animals", 
    "a parrot delivering a secret message", "a squirrel discovering a hidden treasure", 
    "a dolphin leaping through a ring of fire", "a raccoon sailing a leaf boat", 
    "a bunny solving a mystery in a spooky mansion", "a snail winning the race against time", 
    "a slice of pizza with a personality", "a cloud shaped like a giant bunny floating above a carnival", 
    "a cupcake taking a stroll down the street", "a rainbow walking through the park", 
    "the moon sharing secrets with the stars", "a fish riding a unicycle through the city", 
    "a cactus traveling through the desert in a spaceship", "a teapot exploring a mystical land", 
    "a strawberry superhero saving the day", "a pineapple lounging in a hammock on a beach", 
    "a cloud raining candy over a parade", "a flower singing a lullaby to the sun", 
    "a mountain with a giant mustache watching over the valley", 
    "a tree with a door leading to another world", "a river made of chocolate flowing through the countryside", 
    "a hot air balloon filled with playful kittens", "a snowman trying to stay cool in the jungle", 
    "a squirrel building sandcastles at the beach", "a pumpkin skating on roller blades through the forest", 
    "a whale floating gracefully above the clouds", "a jellyfish lighting the way with a glowing lantern", 
    "a starfish catching a wave on a surfboard", "a koala gliding through the air on a zipline", 
    "a beehive made entirely of candy canes", "an elephant covered in rainbow-colored paint", 
    "a flamingo bouncing on a pogo stick", "a turtle zooming through space with a jetpack", 
    "a peacock proudly showing off its feathers in a grand library", 
    "a butterfly fluttering among the stars in the night sky", 
    "a cat curiously floating in a bubble above the city"
];


const styles = [
    "in the style of Van Gogh", "as an oil painting", "in watercolor", 
    "as a Renaissance painting", "in the style of Monet", "as a classical portrait", 
    "in the style of Rembrandt", "as an impressionist painting", 
    "in the style of Cezanne", "as a baroque painting", 
    "in the style of a traditional Chinese painting", "as a pastel drawing", 
    "in the style of the Hudson River School", "as a Romantic landscape painting", 
    "in the style of Georgia O'Keeffe", "as a fresco", 
    "in the style of Japanese woodblock prints", "as a realistic oil painting", 
    "in the style of a 19th-century European painting", "as a Gothic painting", 
    "in the style of Frida Kahlo", "as an abstract expressionist painting", 
    "in the style of a Renaissance fresco", "as a photorealistic painting", 
    "in the style of Edward Hopper", "as a 20th-century modern painting", 
    "in the style of an ancient cave drawing", "as a pre-Raphaelite painting", 
    "in the style of a Rococo painting", "as a plein-air painting", 
    "in the style of John Singer Sargent", "as a still life painting", 
    "in the style of an Art Nouveau poster", "as a pastoral landscape", 
    "in the style of a Dutch Golden Age painting", "as a classical still life", 
    "in the style of the Ashcan School", "as a traditional Japanese ink wash painting", 
    "in the style of Winslow Homer", "as a surrealist painting", 
    "in the style of Gustav Klimt", "as a neoclassical painting", 
    "in the style of Norman Rockwell", "as a Cubist painting", 
    "in the style of the Harlem Renaissance", "as a Fauvist painting", 
    "in the style of a traditional Russian icon", "as a post-impressionist painting", 
    "in the style of Marc Chagall", "as a landscape by Claude Lorrain", 
    "in the style of Edgar Degas", "as a 19th-century American landscape painting", 
    "in the style of Andrew Wyeth", "as a gothic illuminated manuscript", 
    "in the style of a Romantic portrait", "as an Art Deco painting", 
    "in the style of Diego Rivera", "as a Renaissance altarpiece", 
    "in the style of a 20th-century realist painting", "as a Symbolist painting", 
    "in the style of a pastoral scene by Corot", "as a Pointillist painting", 
    "in the style of John Constable", "as a landscape by Turner", 
    "in the style of Henri Rousseau", "as a Bauhaus painting"
];


// Generate a random prompt
function generatePrompt() {
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const style = styles[Math.floor(Math.random() * styles.length)];
    return `${subject} ${style}`;
}

let i = 0
while (i < 30) {
    console.log(generatePrompt());
    i++
}

// // Delete the oldest images
// async function deleteOldImages() {
//     const storageRef = ref(storage, 'cards/');
//     const fileList = await listAll(storageRef);
//     const files = fileList.items;

//     files.sort((a, b) => a.name.localeCompare(b.name));

//     for (let i = 0; i < 10 && i < files.length; i++) {
//         await deleteObject(files[i]);
//         console.log(`Deleted: ${files[i].name}`);
//     }
// }

// // Generate and upload images
// async function generateAndUploadImages() {
//     for (let i = 0; i < 10; i++) {
//         const prompt = generatePrompt();
//         console.log(`Generating image ${i + 1} with prompt: "${prompt}"`);

//         try {
//             // Step 1: Request image generation
//             const response = await fetch(
//                 `https://api.limewire.com/api/image/generation`,
//                 {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                         'X-Api-Version': 'v1',
//                         Accept: 'application/json',
//                         Authorization: `Bearer ${LIMEWIRE_API_KEY}`
//                     },
//                     body: JSON.stringify({
//                         prompt: prompt,
//                         aspect_ratio: '1:1'
//                     })
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(`Error generating image: ${data.message || 'Unknown error'}`);
//             }

//             const statusUrl = data.self;

//             // Step 2: Poll the status URL until the image generation is complete
//             let imageUrl = null;
//             for (let attempts = 0; attempts < 10; attempts++) {
//                 const statusResponse = await fetch(statusUrl, {
//                     headers: {
//                         'X-Api-Version': 'v1',
//                         Authorization: `Bearer ${LIMEWIRE_API_KEY}`,
//                     },
//                 });

//                 const statusData = await statusResponse.json();

//                 if (statusData.status === 'COMPLETED') {
//                     imageUrl = statusData.data[0].url; // Assuming the image URL is in data[0].url
//                     break;
//                 } else if (statusData.status === 'FAILED') {
//                     throw new Error(`Image generation failed: ${statusData.failure_reason}`);
//                 }

//                 // Wait a bit before trying again
//                 await new Promise(res => setTimeout(res, 5000));
//             }

//             if (!imageUrl) {
//                 throw new Error('Image generation did not complete in time');
//             }

//             // Step 3: Download and upload the image
//             const imageResponse = await fetch(imageUrl);
//             const imageBuffer = await imageResponse.buffer();

//             const imageName = `image_${Date.now()}_${i}.png`;
//             const storageRef = ref(storage, `cards/${imageName}`);
//             await uploadBytes(storageRef, imageBuffer);
//             console.log(`Uploaded: ${storageRef.fullPath}`);

//         } catch (error) {
//             console.error(`Error generating or uploading image for prompt "${prompt}":`, error.message);
//         }
//     }
// }

// generateAndUploadImages();