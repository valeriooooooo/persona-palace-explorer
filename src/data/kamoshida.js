// Kamoshida's Palace (Castle of Lust).
//
// The floor plans are simplified, hand-drawn schematics in a 1000x640 SVG
// space: they follow the flow of the real palace but are not traced from
// the game. Marker positions use the same coordinates.
//
// Shapes: `rect: [x, y, w, h]`, `kind` is 'room' (default), 'hall' or 'water'.
// Connectors: stairs/exits drawn as arrows that jump to another floor.

export const kamoshida = {
  id: 'kamoshida',
  name: "Kamoshida's Palace",
  subtitle: 'Castle of Lust',
  description:
    'The twisted desires of the volleyball coach, Suguru Kamoshida, have manifested into a distorted castle where he rules as king. Steal his heart and free the students he treats as his slaves.',
  ruler: 'Suguru Kamoshida',
  sin: 'Lust',
  location: 'Shujin Academy',
  keywords: ['Kamoshida', 'Shujin Academy', 'Castle'],
  treasure: 'Crown',
  deadline: '5/2',
  boss: 'Shadow Kamoshida',
  portrait: 'kamoshida/ruler.jpg',
  banner: 'kamoshida/castle.jpg',
  shadows: [
    { name: 'Pixie', arcana: 'Lovers' },
    { name: "Jack-o'-Lantern", arcana: 'Magician' },
    { name: 'Agathion', arcana: 'Chariot' },
    { name: 'Mandrake', arcana: 'Death' },
    { name: 'Bicorn', arcana: 'Hermit' },
    { name: 'Incubus', arcana: 'Devil' },
    { name: 'Kelpie', arcana: 'Strength' },
    { name: 'Silky', arcana: 'Priestess' },
    { name: 'Berith', arcana: 'Hierophant' },
    { name: 'Eligor', arcana: 'Emperor' },
  ],

  floors: [
    {
      id: 'tower',
      label: 'TOWER',
      name: 'Central Tower',
      shapes: [
        { rect: [420, 470, 160, 110], label: 'Tower Base' },
        { rect: [475, 290, 50, 180], kind: 'hall' },
        { rect: [300, 250, 175, 50], kind: 'hall' },
        { rect: [300, 120, 50, 130], kind: 'hall' },
        { rect: [350, 90, 300, 170], label: 'Throne Room' },
        { rect: [450, 30, 100, 60], label: 'Treasure' },
        { rect: [580, 380, 190, 50], kind: 'hall' },
        { rect: [650, 430, 140, 100], label: 'Safe Room' },
        { rect: [200, 380, 220, 50], kind: 'hall' },
        { rect: [140, 330, 120, 150], label: 'Gallery' },
      ],
      doors: [[492, 466, 16, 8], [645, 250, 8, 16], [486, 86, 28, 8]],
      connectors: [{ x: 500, y: 600, dir: 'down', to: '3f', label: '3F' }],
    },
    {
      id: '3f',
      label: '3F',
      name: 'Castle 3F',
      shapes: [
        { rect: [110, 390, 780, 50], kind: 'hall' },
        { rect: [110, 220, 190, 170], label: 'Royal Gallery' },
        { rect: [330, 240, 160, 150], label: 'Barracks' },
        { rect: [520, 250, 140, 140], label: 'Safe Room' },
        { rect: [700, 120, 60, 270], kind: 'hall' },
        { rect: [660, 60, 140, 60], label: 'Tower Bridge' },
        { rect: [110, 440, 50, 120], kind: 'hall' },
        { rect: [110, 500, 280, 110], label: 'Balcony' },
        { rect: [560, 440, 50, 70], kind: 'hall' },
        { rect: [500, 510, 200, 100], label: 'Storeroom' },
      ],
      doors: [[200, 386, 20, 8], [400, 386, 20, 8], [582, 386, 20, 8], [576, 506, 18, 8]],
      connectors: [
        { x: 925, y: 415, dir: 'right', to: '2f', label: '2F' },
        { x: 730, y: 30, dir: 'up', to: 'tower', label: 'TOWER' },
      ],
    },
    {
      id: '2f',
      label: '2F',
      name: 'Castle 2F',
      shapes: [
        { rect: [140, 290, 720, 50], kind: 'hall' },
        { rect: [140, 130, 210, 160], label: 'Gallery' },
        { rect: [420, 150, 160, 110], label: 'Safe Room' },
        { rect: [480, 260, 40, 30], kind: 'hall' },
        { rect: [650, 130, 210, 160], label: 'Chapel' },
        { rect: [140, 340, 230, 170], label: 'Library' },
        { rect: [450, 340, 100, 110], label: 'Grand Staircase' },
        { rect: [630, 340, 230, 170], label: 'Armory' },
        { rect: [860, 290, 70, 50], kind: 'hall' },
        { rect: [240, 510, 40, 80], kind: 'hall' },
        { rect: [180, 560, 160, 60], label: 'Study' },
      ],
      doors: [[236, 286, 20, 8], [736, 286, 20, 8], [236, 336, 20, 8], [736, 336, 20, 8], [251, 508, 18, 8]],
      connectors: [
        { x: 500, y: 480, dir: 'down', to: '1f', label: '1F' },
        { x: 960, y: 315, dir: 'right', to: '3f', label: '3F' },
      ],
    },
    {
      id: '1f',
      label: '1F',
      name: 'Castle 1F',
      shapes: [
        { rect: [420, 530, 160, 90], label: 'Castle Entrance' },
        { rect: [340, 290, 320, 240], label: 'Entrance Hall' },
        { rect: [460, 210, 80, 80] },
        { rect: [110, 380, 230, 50], kind: 'hall' },
        { rect: [110, 230, 170, 150], label: 'Dining Hall' },
        { rect: [110, 430, 60, 90] },
        { rect: [660, 380, 230, 50], kind: 'hall' },
        { rect: [720, 230, 170, 150], label: 'Guard Room' },
        { rect: [830, 430, 60, 90], kind: 'hall' },
        { rect: [620, 540, 130, 80], label: 'Safe Room' },
        { rect: [580, 565, 40, 30], kind: 'hall' },
        { rect: [360, 120, 280, 90], label: 'Courtyard' },
      ],
      doors: [[490, 526, 20, 8], [336, 395, 8, 20], [656, 395, 8, 20], [190, 376, 20, 8], [795, 376, 20, 8]],
      connectors: [
        { x: 140, y: 555, dir: 'down', to: 'b1f', label: 'B1F' },
        { x: 500, y: 238, dir: 'up', to: '2f', label: '2F' },
      ],
    },
    {
      id: 'b1f',
      label: 'B1F',
      name: 'Castle Dungeon',
      shapes: [
        { rect: [110, 300, 790, 50], kind: 'hall' },
        { rect: [140, 190, 80, 110], label: 'Cell' },
        { rect: [240, 190, 80, 110], label: 'Cell' },
        { rect: [340, 190, 80, 110], label: 'Cell' },
        { rect: [140, 350, 80, 110], label: 'Cell' },
        { rect: [240, 350, 80, 110], label: 'Cell' },
        { rect: [460, 90, 44, 460], kind: 'water' },
        { rect: [590, 140, 170, 160], label: 'Guard Post' },
        { rect: [580, 350, 200, 150], label: 'Training Hall' },
        { rect: [780, 190, 130, 110], label: 'Safe Room' },
        { rect: [50, 290, 60, 70], label: '' },
        { rect: [660, 500, 44, 80], kind: 'hall' },
        { rect: [600, 580, 170, 45], label: 'Drainage' },
      ],
      doors: [[170, 296, 20, 8], [270, 296, 20, 8], [370, 296, 20, 8], [170, 346, 20, 8], [270, 346, 20, 8], [665, 296, 20, 8], [670, 346, 20, 8], [835, 296, 20, 8]],
      connectors: [{ x: 70, y: 325, dir: 'up', to: '1f', label: '1F' }],
    },
  ],

  markers: [
    // --- B1F: Castle Dungeon ---
    {
      id: 'b1f-safe', type: 'safeRoom', floor: 'b1f', x: 845, y: 245,
      name: 'Dungeon Safe Room', location: 'Castle Dungeon',
      description: "A quiet room past the guard post. Morgana explains how safe rooms work: save your progress and travel back here instantly.",
    },
    {
      id: 'b1f-cells', type: 'puzzle', floor: 'b1f', x: 280, y: 240,
      name: 'The Prison Cells', location: 'Castle Dungeon',
      description: 'The cells where Joker and Ryuji were locked up on their first visit. Morgana is found behind bars here and helps you escape.',
    },
    {
      id: 'b1f-chest-1', type: 'chest', floor: 'b1f', x: 180, y: 405,
      name: 'Cell Chest', location: 'Castle Dungeon', reward: 'Medicine',
      description: 'A small chest tucked away in one of the lower cells.',
    },
    {
      id: 'b1f-chest-2', type: 'chest', floor: 'b1f', x: 685, y: 600,
      name: 'Drainage Chest', location: 'Castle Dungeon', reward: 'Revival Bead',
      description: 'Follow the water channel south to find this chest near the drain.',
    },
    {
      id: 'b1f-guard', type: 'shadow', floor: 'b1f', x: 675, y: 215,
      name: 'Guard Captain', location: 'Guard Post',
      description: 'The first real fight: a castle guard reveals its true form. Target weaknesses to knock enemies down and chain One Mores.',
    },
    {
      id: 'b1f-shadow', type: 'shadow', floor: 'b1f', x: 680, y: 425,
      name: 'Patrolling Knights', location: 'Training Hall',
      description: 'Armored castle guards patrol the training hall. Ambush them from cover for a first strike.',
    },

    // --- 1F ---
    {
      id: '1f-safe', type: 'safeRoom', floor: '1f', x: 685, y: 580,
      name: 'Infiltration Point', location: 'Castle Entrance',
      description: 'Reached through the air vent next to the main gate. This is where every infiltration of the castle begins.',
    },
    {
      id: '1f-hall', type: 'puzzle', floor: '1f', x: 500, y: 400,
      name: 'The Kamoshida Portrait', location: 'Entrance Hall',
      description: "A giant portrait of the king himself hangs over the hall. Guards swarm the room: stay in cover to slip past.",
    },
    {
      id: '1f-chest-dining', type: 'chest', floor: '1f', x: 195, y: 300,
      name: 'Dining Hall Chest', location: 'Dining Hall', reward: 'Snuff Soul',
      description: 'On the far side of the long banquet table.',
    },
    {
      id: '1f-chest-guard', type: 'chest', floor: '1f', x: 850, y: 300, locked: true,
      name: 'Locked Chest', location: 'Guard Room', reward: 'Equipment', requires: 'Lockpick',
      description: 'A locked chest. Craft Lockpicks after unlocking tool crafting to open it.',
    },
    {
      id: '1f-shadow', type: 'shadow', floor: '1f', x: 800, y: 405,
      name: 'Hall Guards', location: 'East Corridor',
      description: 'Pixie and Agathion often appear from the guards patrolling this corridor.',
    },
    {
      id: '1f-grapple', type: 'grapple', floor: '1f', x: 410, y: 160,
      name: 'Courtyard Grapple Point', location: 'Courtyard', requires: 'Grappling Hook (Royal)',
      description: 'Use the grappling hook to reach the upper balcony from the courtyard.',
    },

    // --- 2F ---
    {
      id: '2f-safe', type: 'safeRoom', floor: '2f', x: 500, y: 205,
      name: '2F Safe Room', location: 'Castle 2F',
      description: 'Right above the grand staircase. A good checkpoint before exploring the wings.',
    },
    {
      id: '2f-seed', type: 'willSeed', floor: '2f', x: 245, y: 210,
      name: 'Will Seed of Lust', location: 'Gallery (2F)', reward: 'Crystal of Lust (with all 3 seeds)',
      description: "A seed that embodies Kamoshida's distorted desires. Destroy it to recover SP and take a step toward the Crystal of Lust.",
      image: 'kamoshida/will-seed.jpg',
    },
    {
      id: '2f-library', type: 'puzzle', floor: '2f', x: 255, y: 425,
      name: 'Library Map', location: 'Library',
      description: 'A map of the castle is found in the library. Picking it up reveals the layout of the upper floors.',
    },
    {
      id: '2f-chapel', type: 'shadow', floor: '2f', x: 755, y: 210,
      name: 'Chapel Shadow', location: 'Chapel',
      description: "A stronger shadow waits in the chapel. Bring healing items and exploit its weakness.",
    },
    {
      id: '2f-chest-armory', type: 'chest', floor: '2f', x: 745, y: 425,
      name: 'Armory Chest', location: 'Armory', reward: 'Weapon',
      description: 'Stacks of weapons line the armory. The chest is in the back corner.',
    },
    {
      id: '2f-chest-study', type: 'chest', floor: '2f', x: 260, y: 590, locked: true,
      name: 'Locked Study Chest', location: 'Study', requires: 'Lockpick', reward: 'Accessory',
      description: 'A locked chest hidden in the small study below the library.',
    },

    // --- 3F ---
    {
      id: '3f-safe', type: 'safeRoom', floor: '3f', x: 590, y: 320,
      name: '3F Safe Room', location: 'Castle 3F',
      description: 'The last safe room before the bridge to the central tower.',
    },
    {
      id: '3f-seed', type: 'willSeed', floor: '3f', x: 250, y: 555,
      name: 'Will Seed of Lust', location: 'Balcony (3F)', requires: 'Grappling Hook (Royal)', reward: 'Crystal of Lust (with all 3 seeds)',
      description: 'Out on the balcony, reachable only with the grappling hook.',
      image: 'kamoshida/will-seed.jpg',
    },
    {
      id: '3f-grapple', type: 'grapple', floor: '3f', x: 135, y: 470,
      name: 'Balcony Grapple Point', location: 'Castle 3F', requires: 'Grappling Hook (Royal)',
      description: 'Swing across to the balcony with the Will Seed.',
    },
    {
      id: '3f-gallery', type: 'puzzle', floor: '3f', x: 205, y: 305,
      name: 'Royal Gallery Statues', location: 'Royal Gallery',
      description: 'Statues of the king line the gallery. Investigate them to open the way forward.',
    },
    {
      id: '3f-chest', type: 'chest', floor: '3f', x: 600, y: 560,
      name: 'Storeroom Chest', location: 'Storeroom', reward: 'Medicine x2',
      description: 'An easy-to-miss chest in the storeroom south of the corridor.',
    },
    {
      id: '3f-shadow', type: 'shadow', floor: '3f', x: 410, y: 315,
      name: 'Barracks Guards', location: 'Barracks',
      description: 'The barracks are full of patrolling guards. Kelpie and Incubus can appear here.',
    },

    // --- Central Tower ---
    {
      id: 'tower-safe', type: 'safeRoom', floor: 'tower', x: 720, y: 480,
      name: 'Tower Safe Room', location: 'Central Tower',
      description: 'The final safe room. Save here before the Treasure route is established.',
    },
    {
      id: 'tower-seed', type: 'willSeed', floor: 'tower', x: 200, y: 405,
      name: 'Will Seed of Lust', location: 'Tower Gallery', reward: 'Crystal of Lust (with all 3 seeds)',
      description: 'The last seed. Collect all three seeds in this Palace to form the Crystal of Lust.',
      image: 'kamoshida/will-seed.jpg',
    },
    {
      id: 'tower-boss', type: 'shadow', floor: 'tower', x: 500, y: 190,
      name: 'Shadow Kamoshida', location: 'Throne Room',
      description: 'The king of the castle. Once the calling card is sent, confront him here to steal his distorted desires.',
      image: 'kamoshida/boss.jpg',
    },
    {
      id: 'tower-treasure', type: 'treasure', floor: 'tower', x: 500, y: 60,
      name: 'The Crown', location: 'Treasure Room', requires: 'Calling Card',
      description: "The Treasure: the source of Kamoshida's distortion. It only takes shape after the calling card has been delivered.",
      image: 'kamoshida/treasure.jpg',
    },
    {
      id: 'tower-chest', type: 'chest', floor: 'tower', x: 500, y: 525,
      name: 'Tower Base Chest', location: 'Tower Base', reward: 'Revival Bead',
      description: 'At the foot of the tower stairs.',
    },
  ],
}
