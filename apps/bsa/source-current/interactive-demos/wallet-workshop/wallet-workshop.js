/**
 * Wallet Workshop - Interactive Bitcoin Wallet Education
 * Step-by-step journey: Entropy → Seed → Private Keys → Public Keys → Addresses
 * Inspired by learnmeabitcoin.com methodology
 */

class WalletWorkshop {
  constructor() {
    console.log('  → Creating WalletWorkshop instance...');
    this.currentStep = 0;
    this.entropy = '';
    this.seedPhrase = [];
    this.masterKey = '';
    this.privateKeys = [];
    this.publicKeys = [];
    this.addresses = [];

    // Difficulty settings
    this.difficulty = 'guided'; // guided, interactive, challenge, expert
    console.log('  → Properties initialized');

    // BIP39 wordlist (expanded for better randomness)
    this.wordlist = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid',
      'acoustic', 'acquire', 'across', 'act', 'action', 'actor', 'actress', 'actual',
      'adapt', 'add', 'addict', 'address', 'adjust', 'admit', 'adult', 'advance',
      'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
      'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album',
      'alcohol', 'alert', 'alien', 'all', 'alley', 'allow', 'almost', 'alone',
      'alpha', 'already', 'also', 'alter', 'always', 'amateur', 'amazing', 'among',
      'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger', 'angle', 'angry',
      'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
      'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april',
      'arch', 'arctic', 'area', 'arena', 'argue', 'arm', 'armed', 'armor',
      'army', 'around', 'arrange', 'arrest', 'arrive', 'arrow', 'art', 'artefact',
      'artist', 'artwork', 'ask', 'aspect', 'assault', 'asset', 'assist', 'assume',
      'asthma', 'athlete', 'atom', 'attack', 'attend', 'attitude', 'attract', 'auction',
      'author', 'auto', 'autumn', 'average', 'avocado', 'avoid', 'awake', 'aware',
      'away', 'awesome', 'awful', 'awkward', 'axis', 'baby', 'bachelor', 'bacon',
      'badge', 'bag', 'balance', 'balcony', 'ball', 'bamboo', 'banana', 'banner',
      'bar', 'barely', 'bargain', 'barrel', 'base', 'basic', 'basket', 'battle',
      'beach', 'bean', 'beauty', 'because', 'become', 'beef', 'before', 'begin',
      'behave', 'behind', 'believe', 'below', 'belt', 'bench', 'benefit', 'best',
      'betray', 'better', 'between', 'beyond', 'bicycle', 'bid', 'bike', 'bind',
      'bird', 'birth', 'bitter', 'black', 'blade', 'blame', 'blanket', 'blast',
      'bleak', 'bless', 'blind', 'blood', 'blossom', 'blouse', 'blue', 'blur',
      'blush', 'board', 'boat', 'body', 'boil', 'bomb', 'bone', 'bonus',
      'book', 'boost', 'border', 'boring', 'borrow', 'boss', 'bottom', 'bounce',
      'box', 'boy', 'bracket', 'brain', 'brand', 'brass', 'brave', 'bread',
      'breeze', 'brick', 'bridge', 'brief', 'bright', 'bring', 'brisk', 'broccoli',
      'broken', 'bronze', 'broom', 'brother', 'brown', 'brush', 'bubble', 'buddy',
      'budget', 'buffalo', 'build', 'bulb', 'bulk', 'bullet', 'bundle', 'bunker',
      'burden', 'burger', 'burst', 'bus', 'business', 'busy', 'butter', 'buyer',
      'buzz', 'cabbage', 'cabin', 'cable', 'cactus', 'cage', 'cake', 'call',
      'calm', 'camera', 'camp', 'can', 'canal', 'cancel', 'candy', 'cannon',
      'canoe', 'canvas', 'canyon', 'capable', 'capital', 'captain', 'car', 'carbon',
      'card', 'cargo', 'carpet', 'carry', 'cart', 'case', 'cash', 'casino',
      'castle', 'casual', 'cat', 'catalog', 'catch', 'category', 'cattle', 'caught',
      'cause', 'caution', 'cave', 'ceiling', 'celery', 'cement', 'census', 'century',
      'cereal', 'certain', 'chair', 'chalk', 'champion', 'change', 'chaos', 'chapter',
      'charge', 'chase', 'chat', 'cheap', 'check', 'cheese', 'chef', 'cherry',
      'chest', 'chicken', 'chief', 'child', 'chimney', 'choice', 'choose', 'chronic',
      'chuckle', 'chunk', 'churn', 'cigar', 'cinnamon', 'circle', 'citizen', 'city',
      'civil', 'claim', 'clap', 'clarify', 'claw', 'clay', 'clean', 'clerk',
      'clever', 'click', 'client', 'cliff', 'climb', 'clinic', 'clip', 'clock',
      'clog', 'close', 'cloth', 'cloud', 'clown', 'club', 'clump', 'cluster',
      'clutch', 'coach', 'coast', 'coconut', 'code', 'coffee', 'coil', 'coin',
      'collect', 'color', 'column', 'combine', 'come', 'comfort', 'comic', 'common',
      'company', 'concert', 'conduct', 'confirm', 'congress', 'connect', 'consider', 'control',
      'convince', 'cook', 'cool', 'copper', 'copy', 'coral', 'core', 'corn',
      'correct', 'cost', 'cotton', 'couch', 'country', 'couple', 'course', 'cousin',
      'cover', 'coyote', 'crack', 'cradle', 'craft', 'cram', 'crane', 'crash',
      'crater', 'crawl', 'crazy', 'cream', 'credit', 'creek', 'crew', 'cricket',
      'crime', 'crisp', 'critic', 'crop', 'cross', 'crouch', 'crowd', 'crucial',
      'cruel', 'cruise', 'crumble', 'crunch', 'crush', 'cry', 'crystal', 'cube',
      'culture', 'cup', 'cupboard', 'curious', 'current', 'curtain', 'curve', 'cushion',
      'custom', 'cute', 'cycle', 'dad', 'damage', 'damp', 'dance', 'danger',
      'daring', 'dash', 'daughter', 'dawn', 'day', 'deal', 'debate', 'debris',
      'decade', 'december', 'decide', 'decline', 'decorate', 'decrease', 'deer', 'defense',
      'define', 'defy', 'degree', 'delay', 'deliver', 'demand', 'demise', 'denial',
      'dentist', 'deny', 'depart', 'depend', 'deposit', 'depth', 'deputy', 'derive',
      'describe', 'desert', 'design', 'desk', 'despair', 'destroy', 'detail', 'detect',
      'develop', 'device', 'devote', 'diagram', 'dial', 'diamond', 'diary', 'dice',
      'diesel', 'diet', 'differ', 'digital', 'dignity', 'dilemma', 'dinner', 'dinosaur',
      'direct', 'dirt', 'disagree', 'discover', 'disease', 'dish', 'dismiss', 'disorder',
      'display', 'distance', 'divert', 'divide', 'divorce', 'dizzy', 'doctor', 'document',
      'dog', 'doll', 'dolphin', 'domain', 'donate', 'donkey', 'donor', 'door',
      'dose', 'double', 'dove', 'draft', 'dragon', 'drama', 'drastic', 'draw',
      'dream', 'dress', 'drift', 'drill', 'drink', 'drip', 'drive', 'drop',
      'drum', 'dry', 'duck', 'dumb', 'dune', 'during', 'dust', 'dutch',
      'duty', 'dwarf', 'dynamic', 'eager', 'eagle', 'early', 'earn', 'earth',
      'easily', 'east', 'easy', 'echo', 'ecology', 'economy', 'edge', 'edit',
      'educate', 'effort', 'egg', 'eight', 'either', 'elbow', 'elder', 'electric',
      'elegant', 'element', 'elephant', 'elevator', 'elite', 'else', 'embark', 'embody',
      'embrace', 'emerge', 'emotion', 'employ', 'empower', 'empty', 'enable', 'enact',
      'end', 'endless', 'endorse', 'enemy', 'energy', 'enforce', 'engage', 'engine',
      'enhance', 'enjoy', 'enlist', 'enough', 'enrich', 'enroll', 'ensure', 'enter',
      'entire', 'entry', 'envelope', 'episode', 'equal', 'equip', 'era', 'erase',
      'erode', 'erosion', 'error', 'erupt', 'escape', 'essay', 'essence', 'estate',
      'eternal', 'ethics', 'evidence', 'evil', 'evoke', 'evolve', 'exact', 'example',
      'excess', 'exchange', 'excite', 'exclude', 'excuse', 'execute', 'exercise', 'exhaust',
      'exhibit', 'exile', 'exist', 'exit', 'exotic', 'expand', 'expect', 'expire',
      'explain', 'expose', 'express', 'extend', 'extra', 'eye', 'eyebrow', 'fabric',
      'face', 'faculty', 'fade', 'faint', 'faith', 'fall', 'false', 'fame',
      'family', 'famous', 'fan', 'fancy', 'fantasy', 'farm', 'fashion', 'fat',
      'fatal', 'father', 'fatigue', 'fault', 'favorite', 'feature', 'february', 'federal',
      'fee', 'feed', 'feel', 'female', 'fence', 'festival', 'fetch', 'fever',
      'few', 'fiber', 'fiction', 'field', 'figure', 'file', 'film', 'filter',
      'final', 'find', 'fine', 'finger', 'finish', 'fire', 'firm', 'first',
      'fiscal', 'fish', 'fit', 'fitness', 'fix', 'flag', 'flame', 'flash',
      'flat', 'flavor', 'flee', 'flight', 'flip', 'float', 'flock', 'floor',
      'flower', 'fluid', 'flush', 'fly', 'foam', 'focus', 'fog', 'foil',
      'fold', 'follow', 'food', 'foot', 'force', 'forest', 'forget', 'fork',
      'fortune', 'forum', 'forward', 'fossil', 'foster', 'found', 'fox', 'fragile',
      'frame', 'frequent', 'fresh', 'friend', 'fringe', 'frog', 'front', 'frost',
      'frown', 'frozen', 'fruit', 'fuel', 'fun', 'funny', 'furnace', 'fury',
      'future', 'gadget', 'gain', 'galaxy', 'gallery', 'game', 'gap', 'garage',
      'garbage', 'garden', 'garlic', 'garment', 'gas', 'gasp', 'gate', 'gather',
      'gauge', 'gaze', 'general', 'genius', 'genre', 'gentle', 'genuine', 'gesture',
      'ghost', 'giant', 'gift', 'giggle', 'ginger', 'giraffe', 'girl', 'give',
      'glad', 'glance', 'glare', 'glass', 'glide', 'glimpse', 'globe', 'gloom',
      'glory', 'glove', 'glow', 'glue', 'goat', 'goddess', 'gold', 'good',
      'goose', 'gorilla', 'gospel', 'gossip', 'govern', 'gown', 'grab', 'grace',
      'grain', 'grant', 'grape', 'grass', 'gravity', 'great', 'green', 'grid',
      'grief', 'grit', 'grocery', 'group', 'grow', 'grunt', 'guard', 'guess',
      'guide', 'guilt', 'guitar', 'gun', 'gym', 'habit', 'hair', 'half',
      'hammer', 'hamster', 'hand', 'happy', 'harbor', 'hard', 'harsh', 'harvest',
      'hat', 'have', 'hawk', 'hazard', 'head', 'health', 'heart', 'heavy',
      'hedgehog', 'height', 'hello', 'helmet', 'help', 'hen', 'hero', 'hidden',
      'high', 'hill', 'hint', 'hip', 'hire', 'history', 'hobby', 'hockey',
      'hold', 'hole', 'holiday', 'hollow', 'home', 'honey', 'hood', 'hope',
      'horn', 'horror', 'horse', 'hospital', 'host', 'hotel', 'hour', 'hover',
      'hub', 'huge', 'human', 'humble', 'humor', 'hundred', 'hungry', 'hunt',
      'hurdle', 'hurry', 'hurt', 'husband', 'hybrid', 'ice', 'icon', 'idea',
      'identify', 'idle', 'ignore', 'ill', 'illegal', 'illness', 'image', 'imitate',
      'immense', 'immune', 'impact', 'impose', 'improve', 'impulse', 'inch', 'include',
      'income', 'increase', 'index', 'indicate', 'indoor', 'industry', 'infant', 'inflict',
      'inform', 'inhale', 'inherit', 'initial', 'inject', 'injury', 'inmate', 'inner',
      'innocent', 'input', 'inquiry', 'insane', 'insect', 'inside', 'inspire', 'install',
      'intact', 'interest', 'into', 'invest', 'invite', 'involve', 'iron', 'island',
      'isolate', 'issue', 'item', 'ivory', 'jacket', 'jaguar', 'jar', 'jazz',
      'jealous', 'jeans', 'jelly', 'jewel', 'job', 'join', 'joke', 'journey',
      'joy', 'judge', 'juice', 'jump', 'jungle', 'junior', 'junk', 'just',
      'kangaroo', 'keen', 'keep', 'ketchup', 'key', 'kick', 'kid', 'kidney',
      'kind', 'kingdom', 'kiss', 'kit', 'kitchen', 'kite', 'kitten', 'kiwi',
      'knee', 'knife', 'knock', 'know', 'lab', 'label', 'labor', 'ladder',
      'lady', 'lake', 'lamp', 'language', 'laptop', 'large', 'later', 'latin',
      'laugh', 'laundry', 'lava', 'law', 'lawn', 'lawsuit', 'layer', 'lazy',
      'leader', 'leaf', 'learn', 'leave', 'lecture', 'left', 'leg', 'legal',
      'legend', 'leisure', 'lemon', 'lend', 'length', 'lens', 'leopard', 'lesson',
      'letter', 'level', 'liar', 'liberty', 'library', 'license', 'life', 'lift',
      'light', 'like', 'limb', 'limit', 'link', 'lion', 'liquid', 'list',
      'little', 'live', 'lizard', 'load', 'loan', 'lobster', 'local', 'lock',
      'logic', 'lonely', 'long', 'loop', 'lottery', 'loud', 'lounge', 'love',
      'loyal', 'lucky', 'luggage', 'lumber', 'lunar', 'lunch', 'luxury', 'lyrics',
      'machine', 'mad', 'magic', 'magnet', 'maid', 'mail', 'main', 'major',
      'make', 'mammal', 'man', 'manage', 'mandate', 'mango', 'mansion', 'manual',
      'maple', 'marble', 'march', 'margin', 'marine', 'market', 'marriage', 'mask',
      'mass', 'master', 'match', 'material', 'math', 'matrix', 'matter', 'maximum',
      'maze', 'meadow', 'mean', 'measure', 'meat', 'mechanic', 'medal', 'media',
      'melody', 'melt', 'member', 'memory', 'mention', 'menu', 'mercy', 'merge',
      'merit', 'merry', 'mesh', 'message', 'metal', 'method', 'middle', 'midnight',
      'milk', 'million', 'mimic', 'mind', 'minimum', 'minor', 'minute', 'miracle',
      'mirror', 'misery', 'miss', 'mistake', 'mix', 'mixed', 'mixture', 'mobile',
      'model', 'modify', 'mom', 'moment', 'monitor', 'monkey', 'monster', 'month',
      'moon', 'moral', 'more', 'morning', 'mosquito', 'mother', 'motion', 'motor',
      'mountain', 'mouse', 'move', 'movie', 'much', 'muffin', 'mule', 'multiply',
      'muscle', 'museum', 'mushroom', 'music', 'must', 'mutual', 'myself', 'mystery',
      'myth', 'naive', 'name', 'napkin', 'narrow', 'nasty', 'nation', 'nature',
      'near', 'neck', 'need', 'negative', 'neglect', 'neither', 'nephew', 'nerve',
      'nest', 'net', 'network', 'neutral', 'never', 'news', 'next', 'nice',
      'night', 'noble', 'noise', 'nominee', 'noodle', 'normal', 'north', 'nose',
      'notable', 'note', 'nothing', 'notice', 'novel', 'now', 'nuclear', 'number',
      'nurse', 'nut', 'oak', 'obey', 'object', 'oblige', 'obscure', 'observe',
      'obtain', 'obvious', 'occur', 'ocean', 'october', 'odor', 'off', 'offer',
      'office', 'often', 'oil', 'okay', 'old', 'olive', 'olympic', 'omit',
      'once', 'one', 'onion', 'online', 'only', 'open', 'opera', 'opinion',
      'oppose', 'option', 'orange', 'orbit', 'orchard', 'order', 'ordinary', 'organ',
      'orient', 'original', 'orphan', 'ostrich', 'other', 'outdoor', 'outer', 'output',
      'outside', 'oval', 'oven', 'over', 'own', 'owner', 'oxygen', 'oyster',
      'ozone', 'pact', 'paddle', 'page', 'pair', 'palace', 'palm', 'panda',
      'panel', 'panic', 'panther', 'paper', 'parade', 'parent', 'park', 'parrot',
      'party', 'pass', 'patch', 'path', 'patient', 'patrol', 'pattern', 'pause',
      'pave', 'payment', 'peace', 'peanut', 'pear', 'peasant', 'pelican', 'pen',
      'penalty', 'pencil', 'people', 'pepper', 'perfect', 'permit', 'person', 'pet',
      'phone', 'photo', 'phrase', 'physical', 'piano', 'picnic', 'picture', 'piece',
      'pig', 'pigeon', 'pill', 'pilot', 'pink', 'pioneer', 'pipe', 'pistol',
      'pitch', 'pizza', 'place', 'planet', 'plastic', 'plate', 'play', 'please',
      'pledge', 'pluck', 'plug', 'plunge', 'poem', 'poet', 'point', 'polar',
      'pole', 'police', 'pond', 'pony', 'pool', 'popular', 'portion', 'position',
      'possible', 'post', 'potato', 'pottery', 'poverty', 'powder', 'power', 'practice',
      'praise', 'predict', 'prefer', 'prepare', 'present', 'pretty', 'prevent', 'price',
      'pride', 'primary', 'print', 'priority', 'prison', 'private', 'prize', 'problem',
      'process', 'produce', 'profit', 'program', 'project', 'promote', 'proof', 'property',
      'prosper', 'protect', 'proud', 'provide', 'public', 'pudding', 'pull', 'pulp',
      'pulse', 'pumpkin', 'punch', 'pupil', 'puppy', 'purchase', 'purity', 'purpose',
      'purse', 'push', 'put', 'puzzle', 'pyramid', 'quality', 'quantum', 'quarter',
      'question', 'quick', 'quit', 'quiz', 'quote', 'rabbit', 'raccoon', 'race',
      'rack', 'radar', 'radio', 'rail', 'rain', 'raise', 'rally', 'ramp',
      'ranch', 'random', 'range', 'rapid', 'rare', 'rate', 'rather', 'raven',
      'raw', 'razor', 'ready', 'real', 'reason', 'rebel', 'rebuild', 'recall',
      'receive', 'recipe', 'record', 'recycle', 'reduce', 'reflect', 'reform', 'refuse',
      'region', 'regret', 'regular', 'reject', 'relax', 'release', 'relief', 'rely',
      'remain', 'remember', 'remind', 'remove', 'render', 'renew', 'rent', 'reopen',
      'repair', 'repeat', 'replace', 'report', 'require', 'rescue', 'resemble', 'resist',
      'resource', 'response', 'result', 'retire', 'retreat', 'return', 'reunion', 'reveal',
      'review', 'reward', 'rhythm', 'rib', 'ribbon', 'rice', 'rich', 'ride',
      'ridge', 'rifle', 'right', 'rigid', 'ring', 'riot', 'ripple', 'risk',
      'ritual', 'rival', 'river', 'road', 'roast', 'robot', 'robust', 'rocket',
      'romance', 'roof', 'rookie', 'room', 'rose', 'rotate', 'rough', 'round',
      'route', 'royal', 'rubber', 'rude', 'rug', 'rule', 'run', 'runway',
      'rural', 'sad', 'saddle', 'sadness', 'safe', 'sail', 'salad', 'salmon',
      'salon', 'salt', 'salute', 'same', 'sample', 'sand', 'satisfy', 'satoshi',
      'sauce', 'sausage', 'save', 'say', 'scale', 'scan', 'scare', 'scatter',
      'scene', 'scheme', 'school', 'science', 'scissors', 'scorpion', 'scout', 'scrap',
      'screen', 'script', 'scrub', 'sea', 'search', 'season', 'seat', 'second',
      'secret', 'section', 'security', 'seed', 'seek', 'segment', 'select', 'sell',
      'seminar', 'senior', 'sense', 'sentence', 'series', 'service', 'session', 'settle',
      'setup', 'seven', 'shadow', 'shaft', 'shallow', 'share', 'shed', 'shell',
      'sheriff', 'shield', 'shift', 'shine', 'ship', 'shiver', 'shock', 'shoe',
      'shoot', 'shop', 'short', 'shoulder', 'shove', 'shrimp', 'shrug', 'shuffle',
      'shy', 'sibling', 'sick', 'side', 'siege', 'sight', 'sign', 'silent',
      'silk', 'silly', 'silver', 'similar', 'simple', 'since', 'sing', 'siren',
      'sister', 'situate', 'six', 'size', 'skate', 'sketch', 'ski', 'skill',
      'skin', 'skirt', 'skull', 'slab', 'slam', 'sleep', 'slender', 'slice',
      'slide', 'slight', 'slim', 'slogan', 'slot', 'slow', 'slush', 'small',
      'smart', 'smile', 'smoke', 'smooth', 'snack', 'snake', 'snap', 'sniff',
      'snow', 'soap', 'soccer', 'social', 'sock', 'soda', 'soft', 'solar',
      'soldier', 'solid', 'solution', 'solve', 'someone', 'song', 'soon', 'sorry',
      'sort', 'soul', 'sound', 'soup', 'source', 'south', 'space', 'spare',
      'spatial', 'spawn', 'speak', 'special', 'speed', 'spell', 'spend', 'sphere',
      'spice', 'spider', 'spike', 'spin', 'spirit', 'split', 'spoil', 'sponsor',
      'spoon', 'sport', 'spot', 'spray', 'spread', 'spring', 'spy', 'square',
      'squeeze', 'squirrel', 'stable', 'stadium', 'staff', 'stage', 'stairs', 'stamp',
      'stand', 'start', 'state', 'stay', 'steak', 'steel', 'stem', 'step',
      'stereo', 'stick', 'still', 'sting', 'stock', 'stomach', 'stone', 'stool',
      'story', 'stove', 'strategy', 'street', 'strike', 'strong', 'struggle', 'student',
      'stuff', 'stumble', 'style', 'subject', 'submit', 'subway', 'success', 'such',
      'sudden', 'suffer', 'sugar', 'suggest', 'suit', 'summer', 'sun', 'sunny',
      'sunset', 'super', 'supply', 'supreme', 'sure', 'surface', 'surge', 'surprise',
      'surround', 'survey', 'suspect', 'sustain', 'swallow', 'swamp', 'swap', 'swarm',
      'sway', 'swear', 'sweet', 'swift', 'swim', 'swing', 'switch', 'sword',
      'symbol', 'symptom', 'syrup', 'system', 'table', 'tackle', 'tag', 'tail',
      'talent', 'talk', 'tank', 'tape', 'target', 'task', 'taste', 'tattoo',
      'taxi', 'teach', 'team', 'tell', 'ten', 'tenant', 'tennis', 'tent',
      'term', 'test', 'text', 'thank', 'that', 'theme', 'then', 'theory',
      'there', 'they', 'thing', 'this', 'thought', 'three', 'thrive', 'throw',
      'thumb', 'thunder', 'ticket', 'tide', 'tiger', 'tilt', 'timber', 'time',
      'tiny', 'tip', 'tired', 'tissue', 'title', 'toast', 'tobacco', 'today',
      'toddler', 'toe', 'together', 'toilet', 'token', 'tomato', 'tomorrow', 'tone',
      'tongue', 'tonight', 'tool', 'tooth', 'top', 'topic', 'topple', 'torch',
      'tornado', 'tortoise', 'toss', 'total', 'tourist', 'toward', 'tower', 'town',
      'toy', 'track', 'trade', 'traffic', 'tragic', 'train', 'transfer', 'trap',
      'trash', 'travel', 'tray', 'treat', 'tree', 'trend', 'trial', 'tribe',
      'trick', 'trigger', 'trim', 'trip', 'trophy', 'trouble', 'truck', 'true',
      'truly', 'trumpet', 'trust', 'truth', 'try', 'tube', 'tuition', 'tumble',
      'tuna', 'tunnel', 'turkey', 'turn', 'turtle', 'twelve', 'twenty', 'twice',
      'twin', 'twist', 'two', 'type', 'typical', 'ugly', 'umbrella', 'unable',
      'unaware', 'uncle', 'uncover', 'under', 'undo', 'unfair', 'unfold', 'unhappy',
      'uniform', 'unique', 'unit', 'universe', 'unknown', 'unlock', 'until', 'unusual',
      'unveil', 'update', 'upgrade', 'uphold', 'upon', 'upper', 'upset', 'urban',
      'urge', 'usage', 'use', 'used', 'useful', 'useless', 'usual', 'utility',
      'vacant', 'vacuum', 'vague', 'valid', 'valley', 'valve', 'van', 'vanish',
      'vapor', 'various', 'vast', 'vault', 'vehicle', 'velvet', 'vendor', 'venture',
      'venue', 'verb', 'verify', 'version', 'very', 'vessel', 'veteran', 'viable',
      'vibrant', 'vicious', 'victory', 'video', 'view', 'village', 'vintage', 'violin',
      'virtual', 'virus', 'visa', 'visit', 'visual', 'vital', 'vivid', 'vocal',
      'voice', 'void', 'volcano', 'volume', 'vote', 'voyage', 'wage', 'wagon',
      'wait', 'walk', 'wall', 'walnut', 'want', 'warfare', 'warm', 'warrior',
      'wash', 'wasp', 'waste', 'water', 'wave', 'way', 'wealth', 'weapon',
      'wear', 'weasel', 'weather', 'web', 'wedding', 'weekend', 'weird', 'welcome',
      'west', 'wet', 'whale', 'what', 'wheat', 'wheel', 'when', 'where',
      'whip', 'whisper', 'wide', 'width', 'wife', 'wild', 'will', 'win',
      'window', 'wine', 'wing', 'wink', 'winner', 'winter', 'wire', 'wisdom',
      'wise', 'wish', 'witness', 'wolf', 'woman', 'wonder', 'wood', 'wool',
      'word', 'work', 'world', 'worry', 'worth', 'wrap', 'wreck', 'wrestle',
      'wrist', 'write', 'wrong', 'yard', 'year', 'yellow', 'you', 'young',
      'youth', 'zebra', 'zero', 'zone', 'zoo'
    ];

    this.steps = [
      { id: 'entropy', title: 'Generate Entropy', icon: '🎲' },
      { id: 'seed', title: 'Create Seed Phrase', icon: '🌱' },
      { id: 'private', title: 'Derive Private Keys', icon: '🔐' },
      { id: 'public', title: 'Generate Public Keys', icon: '🔓' },
      { id: 'address', title: 'Create Addresses', icon: '📬' }
    ];

    console.log('  → Calling init()...');
    this.init();
    console.log('  → WalletWorkshop constructor complete');
  }

  init() {
    console.log('  → init() started');
    this.renderWorkshop();
    console.log('  → renderWorkshop() complete');
    this.attachEventListeners();
    console.log('  → attachEventListeners() complete');
  }

  renderWorkshop() {
    console.log('  → renderWorkshop() called');
    const container = document.getElementById('wallet-workshop-container');
    if (!container) {
      console.error('  ❌ Container not found!');
      return;
    }
    console.log('  → Container found:', container);

    container.innerHTML = `
      <div class="wallet-workshop">
        <!-- Difficulty Selector -->
        <div class="difficulty-selector">
          <h3>Choose Your Learning Mode</h3>
          <div class="difficulty-buttons">
            <button class="difficulty-btn active" data-difficulty="guided">
              🎓 Guided
              <small>Step-by-step with explanations</small>
            </button>
            <button class="difficulty-btn" data-difficulty="interactive">
              🔧 Interactive
              <small>Hands-on with manual inputs</small>
            </button>
            <button class="difficulty-btn" data-difficulty="challenge">
              🏆 Challenge
              <small>Quiz questions between steps</small>
            </button>
            <button class="difficulty-btn" data-difficulty="expert">
              ⚡ Expert
              <small>Full control and customization</small>
            </button>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="progress-container">
          <div class="progress-steps">
            ${this.steps.map((step, idx) => `
              <div class="progress-step ${idx === 0 ? 'active' : ''}" data-step="${idx}">
                <div class="step-icon">${step.icon}</div>
                <div class="step-title">${step.title}</div>
                <div class="step-number">${idx + 1}</div>
              </div>
            `).join('<div class="progress-connector"></div>')}
          </div>
        </div>

        <!-- Step Content -->
        <div class="step-content" id="step-content">
          ${this.renderStep(0)}
        </div>

        <!-- Navigation -->
        <div class="step-navigation">
          <button class="nav-btn" id="prev-btn" disabled>
            ← Previous
          </button>
          <button class="nav-btn primary" id="next-btn">
            Next Step →
          </button>
        </div>
      </div>
    `;

    this.addStyles();
  }

  renderStep(stepIndex) {
    const step = this.steps[stepIndex];

    switch(step.id) {
      case 'entropy':
        return this.renderEntropyStep();
      case 'seed':
        return this.renderSeedStep();
      case 'private':
        return this.renderPrivateKeyStep();
      case 'public':
        return this.renderPublicKeyStep();
      case 'address':
        return this.renderAddressStep();
      default:
        return '';
    }
  }

  renderEntropyStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🎲 Step 1: Generate Entropy (Randomness)</h2>
          <p class="step-subtitle">Everything starts with a random number. The more random, the more secure!</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 What is Entropy?</h3>
          <p>Entropy is randomness. Your wallet's security depends on generating a truly random number that nobody can guess.</p>

          <div class="security-comparison">
            <div class="security-bad">
              <strong>❌ Bad Entropy</strong>
              <div class="example">12345678 (predictable)</div>
              <small>Easy to guess = Insecure</small>
            </div>
            <div class="security-good">
              <strong>✅ Good Entropy</strong>
              <div class="example">8f3c2d9a... (random)</div>
              <small>Impossible to guess = Secure</small>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Generate Your Entropy</h3>
          <p>We need 256 bits (32 bytes) of randomness. Choose the path that matches how you’d like to experience it.</p>

          <div class="entropy-mode-toggle" role="tablist" aria-label="Entropy generation modes">
            <button class="toggle-btn active" data-mode="dice" role="tab" aria-selected="true">
              <span class="toggle-icon">🎲</span>
              <span>Roll Dice</span>
            </button>
            <button class="toggle-btn" data-mode="rng" role="tab" aria-selected="false">
              <span class="toggle-icon">⚡</span>
              <span>Visual RNG Demo</span>
            </button>
          </div>

          <div class="entropy-panels">
            <div class="entropy-panel" id="dice-panel" role="tabpanel" aria-hidden="false">
              <div class="entropy-generator">
                <div class="dice-roller">
                  <button class="dice-btn" id="roll-dice">
                    <div class="dice">🎲</div>
                    <div>Roll Dice</div>
                  </button>
                  <div class="roll-counter">
                    <div class="progress-bar">
                      <div class="progress-fill" id="entropy-progress" style="width: 0%"></div>
                    </div>
                    <div class="progress-text">
                      <span id="entropy-bits">0</span> / 256 bits collected
                    </div>
                  </div>
                </div>

                <div class="entropy-display">
                  <h4>Binary Entropy</h4>
                  <div class="binary-output" id="binary-entropy">
                    Click dice to generate random bits...
                  </div>
                </div>

                <div class="entropy-hex" id="entropy-hex-display" style="display: none;">
                  <h4>Hexadecimal Representation</h4>
                  <code id="hex-entropy"></code>
                  <small>This 64-character hex string is your 256-bit entropy</small>
                </div>
              </div>
            </div>

            <div class="entropy-panel hidden" id="rng-panel" role="tabpanel" aria-hidden="true">
              <div class="coin-flip-demo">
                <div class="demo-header">
                  <h3>🪙 The Coin Flip Challenge</h3>
                  <p class="demo-subtitle">256 coin flips = Your Bitcoin private key. Can you recreate someone else's combination?</p>
                </div>

                <div class="socratic-intro">
                  <h4>🤔 Before You Start, Think:</h4>
                  <div class="question-box">
                    <p><strong>If you flip a coin 256 times, how many possible outcomes exist?</strong></p>
                    <button class="mini-reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
                      Reveal Answer
                    </button>
                    <div class="mini-answer" style="display: none;">
                      <p>2<sup>256</sup> = 115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,936</p>
                      <p>That's more combinations than atoms in the observable universe!</p>
                    </div>
                  </div>
                </div>

                <div class="coin-grid-controls">
                  <button class="flip-btn" id="flip-random">
                    🎲 Flip Random Coin
                  </button>
                  <button class="flip-btn" id="flip-all">
                    ⚡ Flip All 256 Coins
                  </button>
                  <button class="flip-btn secondary" id="reset-coins">
                    🔄 Reset All
                  </button>
                </div>

                <div class="coin-stats">
                  <div class="stat-item">
                    <span class="stat-label">Heads (1):</span>
                    <span class="stat-value" id="heads-count">0</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Tails (0):</span>
                    <span class="stat-value" id="tails-count">0</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-label">Progress:</span>
                    <span class="stat-value" id="flip-progress">0/256</span>
                  </div>
                </div>

                <div class="coin-grid" id="coin-grid">
                  <!-- 256 coins will be generated here -->
                </div>

                <div class="entropy-output">
                  <h4>Your 256-bit Number (Hex)</h4>
                  <div class="hex-output" id="coin-hex">
                    Click coins to generate your unique 256-bit number...
                  </div>
                  <small class="output-note">Each coin represents 1 bit. 256 bits = 64 hexadecimal characters.</small>
                </div>

                <div class="collision-challenge">
                  <h4>💡 The Impossibility Challenge</h4>
                  <p><strong>Try to recreate this exact combination:</strong></p>
                  <div class="target-combo" id="target-combo">
                    Generate your first combination to see the challenge!
                  </div>
                  <button class="challenge-btn" id="new-challenge">
                    🎯 New Challenge Combination
                  </button>
                  <div class="challenge-result" id="challenge-result" style="display: none;">
                    <p class="result-text"></p>
                  </div>
                  <div class="probability-insight">
                    <p><strong>Why is this impossible?</strong></p>
                    <p>Even if every person on Earth (8 billion) tried one combination per second, it would take <strong>longer than the age of the universe</strong> (13.8 billion years) to find a match. This is how Bitcoin secures your money—through mathematical impossibility of guessing.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>Why do we need 256 bits of randomness?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p>256 bits gives us 2^256 possible combinations - that's more than atoms in the observable universe!
            Even if every computer on Earth tried a billion combinations per second, it would take longer than
            the age of the universe to guess your key.</p>
            <p><strong>Security by numbers:</strong> The chance of someone guessing your key is approximately 1 in
            115,792,089,237,316,195,423,570,985,008,687,907,853,269,984,665,640,564,039,457,584,007,913,129,639,936</p>
          </div>
        </div>
      </div>
    `;
  }

  renderSeedStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🌱 Step 2: Create Seed Phrase (BIP39)</h2>
          <p class="step-subtitle">Convert binary entropy into human-readable words</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 Why Use Words Instead of Numbers?</h3>
          <div class="comparison-grid">
            <div class="comparison-item">
              <strong>🔢 Raw Entropy</strong>
              <code style="font-size: 0.7rem; word-break: break-all;">
                ${this.entropy || '8f3c2d9a1b5e7c4f6a8d2e9b3c7f1a4d'}
              </code>
              <p>❌ Hard to write down<br>❌ Easy to make mistakes<br>❌ Not user-friendly</p>
            </div>
            <div class="comparison-item">
              <strong>📝 Seed Phrase</strong>
              <div style="margin: 0.5rem 0;">
                <span class="seed-word-chip">abandon</span>
                <span class="seed-word-chip">ability</span>
                <span class="seed-word-chip">able</span>
                <span class="seed-word-chip">about</span>
                ...
              </div>
              <p>✅ Easy to write down<br>✅ Has checksum<br>✅ Standard (BIP39)</p>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Your BIP39 Seed Phrase</h3>

          <div class="seed-conversion-visual">
            <div class="conversion-step">
              <div class="conv-label">Entropy (256 bits)</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">Add Checksum (8 bits)</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">Split into 11-bit chunks (24 chunks)</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">Map to BIP39 Wordlist</div>
              <div class="conv-arrow">↓</div>
            </div>
            <div class="conversion-step">
              <div class="conv-label">12 or 24 Words</div>
            </div>
          </div>

          <div class="seed-phrase-container">
            <div class="seed-options">
              <label>
                <input type="radio" name="seed-length" value="12" checked>
                12 words (128-bit entropy)
              </label>
              <label>
                <input type="radio" name="seed-length" value="24">
                24 words (256-bit entropy) - More secure
              </label>
            </div>

            <div class="seed-words-grid" id="seed-words-display">
              ${this.generateSeedWords(12).map((word, idx) => `
                <div class="seed-word-item">
                  <span class="word-number">${idx + 1}</span>
                  <span class="word-text">${word}</span>
                </div>
              `).join('')}
            </div>

            <div class="seed-actions">
              <button class="action-btn" id="regenerate-seed">
                🔄 Generate New Seed
              </button>
              <button class="action-btn" id="copy-seed">
                📋 Copy Seed Phrase
              </button>
            </div>
          </div>
        </div>

        <div class="warning-box">
          <h4>⚠️ Critical Security Warning</h4>
          <ul>
            <li>🔒 <strong>Never share</strong> your seed phrase with anyone</li>
            <li>📝 <strong>Write it down</strong> on paper, don't store digitally</li>
            <li>🏦 <strong>Store securely</strong> in a safe place (fireproof safe, safety deposit box)</li>
            <li>✅ <strong>Verify the order</strong> - word order matters!</li>
            <li>💀 <strong>Losing it = Losing Bitcoin</strong> - No recovery possible</li>
          </ul>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>What's the purpose of the checksum in BIP39?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p>The checksum helps detect errors when writing down or entering your seed phrase. If you make a mistake
            (like writing "abandon" instead of "ability"), the checksum will be invalid and wallets will reject it.</p>
            <p><strong>How it works:</strong> The last word of a 12-word seed phrase encodes both the final bits of
            entropy AND a checksum of all previous words. This makes it statistically impossible to accidentally create
            a valid but wrong seed phrase.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderPrivateKeyStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🔐 Step 3: Derive Private Keys (HD Wallets)</h2>
          <p class="step-subtitle">One seed → Infinite keys using hierarchical deterministic (HD) derivation</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 What is HD Key Derivation?</h3>
          <p>Your seed phrase can generate an unlimited number of private keys using a mathematical process called
          hierarchical deterministic (HD) derivation. This means you only need to backup ONE seed phrase!</p>
        </div>

        <div class="interactive-section">
          <h3>HD Derivation Tree</h3>

          <div class="derivation-tree">
            <div class="tree-level">
              <div class="tree-node master">
                <div class="node-icon">🌱</div>
                <div class="node-label">Seed Phrase</div>
                <div class="node-value">${this.seedPhrase.slice(0, 3).join(' ')}...</div>
              </div>
            </div>

            <div class="tree-arrow">↓ PBKDF2 + HMAC-SHA512</div>

            <div class="tree-level">
              <div class="tree-node">
                <div class="node-icon">🔑</div>
                <div class="node-label">Master Private Key</div>
                <div class="node-value">xprv9s21ZrQH...</div>
              </div>
            </div>

            <div class="tree-arrow">↓ Derivation Path: m/84'/0'/0'</div>

            <div class="tree-level multi">
              <div class="tree-node child">
                <div class="node-label">Account 0</div>
                <div class="node-path">m/84'/0'/0'/0/0</div>
              </div>
              <div class="tree-node child">
                <div class="node-label">Account 1</div>
                <div class="node-path">m/84'/0'/0'/0/1</div>
              </div>
              <div class="tree-node child">
                <div class="node-label">Account 2</div>
                <div class="node-path">m/84'/0'/0'/0/2</div>
              </div>
              <div class="tree-node child more">
                <div class="node-label">...</div>
                <div class="node-path">Infinite keys!</div>
              </div>
            </div>
          </div>

          <div class="derivation-path-selector">
            <h4>Choose Derivation Path</h4>
            <select id="derivation-standard" class="path-select">
              <option value="m/84'/0'/0'/0/0">m/84'/0'/0'/0/0 - Native SegWit (BIP84) ✅ Recommended</option>
              <option value="m/49'/0'/0'/0/0">m/49'/0'/0'/0/0 - Nested SegWit (BIP49)</option>
              <option value="m/44'/0'/0'/0/0">m/44'/0'/0'/0/0 - Legacy (BIP44)</option>
              <option value="custom">Custom Path (Expert Mode)</option>
            </select>

            <div class="path-explanation" id="path-explanation">
              <strong>Native SegWit (BIP84):</strong> Modern standard. Lowest fees, best privacy, full SegWit benefits.
              Creates addresses starting with "bc1q..."
            </div>
          </div>

          <div class="private-key-display">
            <h4>Your First Private Key</h4>
            <div class="key-container">
              <div class="key-format">
                <strong>Hex Format:</strong>
                <code id="private-key-hex">Loading...</code>
              </div>
              <div class="key-format">
                <strong>WIF Format:</strong>
                <code id="private-key-wif">Loading...</code>
              </div>
              <small>WIF = Wallet Import Format (includes network prefix and checksum)</small>
            </div>
          </div>
        </div>

        <div class="security-note">
          <h4>🛡️ Security Note</h4>
          <p>Your private key is like the password to your Bitcoin. Anyone with this key can spend your Bitcoin!</p>
          <ul>
            <li>✅ Generated mathematically from your seed</li>
            <li>✅ Never transmitted over the internet</li>
            <li>✅ Stays in your wallet software/hardware</li>
            <li>❌ Never share with anyone, ever!</li>
          </ul>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>Why use hierarchical derivation instead of generating random private keys?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p><strong>Backup simplicity:</strong> You only need to backup ONE seed phrase to recover ALL your private keys and addresses.</p>
            <p><strong>Deterministic:</strong> The same seed will always generate the same keys in the same order, making recovery reliable.</p>
            <p><strong>Privacy:</strong> You can generate a new address for every transaction while backing up only one seed.</p>
            <p><strong>Organization:</strong> You can create separate accounts for different purposes (savings, spending, business) all from one seed.</p>
          </div>
        </div>
      </div>
    `;
  }

  renderPublicKeyStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>🔓 Step 4: Generate Public Keys</h2>
          <p class="step-subtitle">One-way transformation: Private Key → Public Key using Elliptic Curve Cryptography</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 Elliptic Curve Magic</h3>
          <p>Bitcoin uses a special mathematical function that's easy to compute in one direction but impossible to reverse!</p>

          <div class="ecc-visual">
            <div class="ecc-equation">
              <div class="eq-part">
                <strong>Private Key</strong><br>
                <small>(256-bit number)</small>
              </div>
              <div class="eq-arrow">
                <span class="arrow-symbol">→</span>
                <small>Elliptic Curve<br>Multiplication</small>
              </div>
              <div class="eq-part">
                <strong>Public Key</strong><br>
                <small>(Point on curve)</small>
              </div>
            </div>

            <div class="one-way-demo">
              <div class="direction forward">
                <strong>✅ Easy</strong>
                <div>Private → Public</div>
                <small>Computationally simple</small>
              </div>
              <div class="direction backward">
                <strong>❌ Impossible</strong>
                <div>Public → Private</div>
                <small>Would take billions of years</small>
              </div>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Interactive Curve Visualization</h3>

          <div class="curve-container">
            <svg id="ecc-curve" width="100%" height="300" viewBox="0 0 500 300">
              <!-- Simplified elliptic curve visualization -->
              <defs>
                <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" style="stop-color:#f7931a;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#ff6b00;stop-opacity:1" />
                </linearGradient>
              </defs>

              <!-- Curve path -->
              <path d="M 50 250 Q 150 50, 250 150 T 450 250"
                    stroke="url(#curveGradient)"
                    stroke-width="3"
                    fill="none"/>

              <!-- Generator point G -->
              <circle cx="150" cy="100" r="6" fill="#4CAF50"/>
              <text x="150" y="85" text-anchor="middle" fill="#4CAF50" font-size="12">G (generator)</text>

              <!-- Public key point -->
              <circle cx="350" cy="200" r="6" fill="#2196F3" id="pubkey-point"/>
              <text x="350" y="220" text-anchor="middle" fill="#2196F3" font-size="12">Public Key</text>

              <!-- Equation -->
              <text x="250" y="280" text-anchor="middle" fill="#fff" font-size="14">
                Public Key = Private Key × G
              </text>
            </svg>

            <div class="curve-explanation">
              <p><strong>Bitcoin uses the secp256k1 curve</strong></p>
              <p>Your public key is a point on this curve, calculated by multiplying
              the generator point G by your private key.</p>
            </div>
          </div>

          <div class="pubkey-formats">
            <h4>Public Key Formats</h4>

            <div class="format-selector">
              <label>
                <input type="radio" name="pubkey-format" value="uncompressed">
                Uncompressed (65 bytes)
              </label>
              <label>
                <input type="radio" name="pubkey-format" value="compressed" checked>
                Compressed (33 bytes) ✅ Recommended
              </label>
            </div>

            <div class="pubkey-display">
              <div class="key-breakdown">
                <div class="breakdown-part">
                  <strong>Prefix:</strong>
                  <code>02</code>
                  <small>Even Y-coordinate</small>
                </div>
                <div class="breakdown-part full">
                  <strong>X-coordinate:</strong>
                  <code id="pubkey-x">a3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1</code>
                </div>
              </div>

              <div class="format-comparison">
                <div class="format-option">
                  <strong>Uncompressed (04 + X + Y):</strong>
                  <small>04a3b5c7...X-coordinate...Y-coordinate... (130 hex chars)</small>
                  <p>❌ Larger, slower, not recommended</p>
                </div>
                <div class="format-option">
                  <strong>Compressed (02/03 + X):</strong>
                  <small>02a3b5c7...X-coordinate... (66 hex chars)</small>
                  <p>✅ Smaller, faster, modern standard</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="socratic-question">
          <h4>🤔 Socratic Question</h4>
          <p><strong>Why can we drop the Y-coordinate in compressed format?</strong></p>
          <button class="reveal-btn" onclick="this.nextElementSibling.style.display='block'; this.style.display='none';">
            Reveal Answer
          </button>
          <div class="answer" style="display: none;">
            <p>The elliptic curve equation is: y² = x³ + 7</p>
            <p>For any X-coordinate, there are only TWO possible Y-coordinates (one positive, one negative).
            We can indicate which one by using a prefix:</p>
            <ul>
              <li><strong>02:</strong> Even Y-coordinate</li>
              <li><strong>03:</strong> Odd Y-coordinate</li>
            </ul>
            <p>This saves 32 bytes while preserving all necessary information!</p>
          </div>
        </div>
      </div>
    `;
  }

  renderAddressStep() {
    return `
      <div class="step-panel">
        <div class="step-header">
          <h2>📬 Step 5: Create Bitcoin Addresses</h2>
          <p class="step-subtitle">Your public identity on the Bitcoin network - safe to share!</p>
        </div>

        <div class="concept-explanation">
          <h3>💡 From Public Key to Address</h3>
          <p>Bitcoin addresses are derived from public keys through multiple hashing functions for security and error detection.</p>

          <div class="address-derivation-flow">
            <div class="flow-step">
              <div class="step-box">Public Key</div>
              <div class="step-arrow">↓ SHA-256</div>
            </div>
            <div class="flow-step">
              <div class="step-box">Hash</div>
              <div class="step-arrow">↓ RIPEMD-160</div>
            </div>
            <div class="flow-step">
              <div class="step-box">Hash160</div>
              <div class="step-arrow">↓ Add prefix</div>
            </div>
            <div class="flow-step">
              <div class="step-box">Versioned payload</div>
              <div class="step-arrow">↓ Checksum</div>
            </div>
            <div class="flow-step">
              <div class="step-box">With checksum</div>
              <div class="step-arrow">↓ Base58/Bech32</div>
            </div>
            <div class="flow-step">
              <div class="step-box final">Address ✅</div>
            </div>
          </div>
        </div>

        <div class="interactive-section">
          <h3>Choose Your Address Type</h3>

          <div class="address-types">
            <div class="address-type-card" data-type="segwit">
              <div class="card-header">
                <h4>Native SegWit (Bech32)</h4>
                <span class="recommended-badge">✅ Recommended</span>
              </div>
              <div class="card-body">
                <div class="address-example">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</div>
                <ul class="benefits">
                  <li>✅ Lowest transaction fees (~40% cheaper)</li>
                  <li>✅ Enhanced error detection</li>
                  <li>✅ Case-insensitive (easier to type)</li>
                  <li>✅ Future-proof</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> bc1q<br>
                  <strong>Standard:</strong> BIP173<br>
                  <strong>Encoding:</strong> Bech32
                </div>
              </div>
            </div>

            <div class="address-type-card" data-type="taproot">
              <div class="card-header">
                <h4>Taproot (Bech32m)</h4>
                <span class="new-badge">🆕 Latest</span>
              </div>
              <div class="card-body">
                <div class="address-example">bc1pxwww0ct9ue7e8tdnlmug5m2tamfn7q06sahstg39ys4c9f3340qqxrdu9k</div>
                <ul class="benefits">
                  <li>✅ Maximum privacy</li>
                  <li>✅ Advanced scripting</li>
                  <li>✅ Schnorr signatures</li>
                  <li>✅ Multi-sig looks like single-sig</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> bc1p<br>
                  <strong>Standard:</strong> BIP341<br>
                  <strong>Encoding:</strong> Bech32m
                </div>
              </div>
            </div>

            <div class="address-type-card legacy" data-type="p2sh">
              <div class="card-header">
                <h4>P2SH (Nested SegWit)</h4>
                <span class="compatible-badge">Compatible</span>
              </div>
              <div class="card-body">
                <div class="address-example">3J98t1WpEZ73CNmYviecrnyiWrnqRhWNLy</div>
                <ul class="benefits">
                  <li>✅ Compatible with older wallets</li>
                  <li>✅ Multi-signature support</li>
                  <li>⚠️ Higher fees than native SegWit</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> 3<br>
                  <strong>Standard:</strong> BIP16<br>
                  <strong>Encoding:</strong> Base58Check
                </div>
              </div>
            </div>

            <div class="address-type-card legacy" data-type="legacy">
              <div class="card-header">
                <h4>Legacy (P2PKH)</h4>
                <span class="old-badge">⚠️ Legacy</span>
              </div>
              <div class="card-body">
                <div class="address-example">1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa</div>
                <ul class="benefits">
                  <li>✅ Maximum compatibility</li>
                  <li>❌ Highest fees</li>
                  <li>❌ No SegWit benefits</li>
                  <li>❌ Not recommended for new wallets</li>
                </ul>
                <div class="tech-details">
                  <strong>Starts with:</strong> 1<br>
                  <strong>Standard:</strong> Original Bitcoin<br>
                  <strong>Encoding:</strong> Base58Check
                </div>
              </div>
            </div>
          </div>

          <div class="address-generator">
            <h4>Your Generated Address</h4>
            <select id="address-type-select" class="address-select">
              <option value="segwit" selected>Native SegWit (bc1q...) ✅</option>
              <option value="taproot">Taproot (bc1p...)</option>
              <option value="p2sh">P2SH (3...)</option>
              <option value="legacy">Legacy (1...)</option>
            </select>

            <div class="generated-address">
              <div class="address-output">
                <code id="final-address">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</code>
              </div>
              <div class="address-actions">
                <button class="action-btn" id="copy-address">📋 Copy Address</button>
                <button class="action-btn" id="show-qr">📱 Show QR Code</button>
                <button class="action-btn" id="verify-address">✓ Verify Address</button>
              </div>
            </div>

            <div class="qr-container" id="qr-container" style="display: none;">
              <canvas id="address-qr"></canvas>
              <p>Scan this QR code to receive Bitcoin at this address</p>
            </div>
          </div>
        </div>

        <div class="success-summary">
          <h3>🎉 Congratulations! You've Created a Bitcoin Wallet!</h3>
          <div class="summary-grid">
            <div class="summary-item">
              <div class="summary-icon">🎲</div>
              <div class="summary-label">Entropy</div>
              <div class="summary-value">256 bits of randomness</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">🌱</div>
              <div class="summary-label">Seed Phrase</div>
              <div class="summary-value">${this.seedPhrase.length} words</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">🔐</div>
              <div class="summary-label">Private Key</div>
              <div class="summary-value">Derived securely</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">🔓</div>
              <div class="summary-label">Public Key</div>
              <div class="summary-value">From elliptic curve</div>
            </div>
            <div class="summary-item">
              <div class="summary-icon">📬</div>
              <div class="summary-label">Address</div>
              <div class="summary-value">Ready to receive!</div>
            </div>
          </div>
        </div>

        <div class="next-steps">
          <h4>🎯 What You've Learned</h4>
          <ul class="learned-list">
            <li>✅ How random entropy becomes a secure wallet</li>
            <li>✅ Why seed phrases are the backup standard</li>
            <li>✅ How hierarchical deterministic derivation works</li>
            <li>✅ The mathematics behind public key cryptography</li>
            <li>✅ Different Bitcoin address formats and their tradeoffs</li>
          </ul>

          <h4>📚 Next Steps</h4>
          <ul class="next-list">
            <li>🔒 Practice securing your seed phrase (never online!)</li>
            <li>💸 Try the Transaction Builder to send Bitcoin</li>
            <li>🔗 Explore the UTXO Visualizer</li>
            <li>⚡ Learn about Lightning Network</li>
          </ul>
        </div>
      </div>
    `;
  }

  generateSeedWords(count) {
    // Use cryptographically secure random generation
    const words = [];
    
    if (window.crypto && window.crypto.getRandomValues) {
      // Generate cryptographically secure random words
      const randomValues = new Uint32Array(count);
      window.crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < count; i++) {
        const randomIndex = randomValues[i] % this.wordlist.length;
        words.push(this.wordlist[randomIndex]);
      }
    } else {
      // Fallback for non-browser environments
      console.warn('Web Crypto API not available, using Math.random() fallback');
      for (let i = 0; i < count; i++) {
        words.push(this.wordlist[Math.floor(Math.random() * this.wordlist.length)]);
      }
    }
    
    this.seedPhrase = words;
    return words;
  }

  attachEventListeners() {
    // Difficulty selection
    document.querySelectorAll('.difficulty-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        this.difficulty = e.target.dataset.difficulty;
      });
    });

    // Navigation
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousStep());
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextStep());
    }

    // Step-specific listeners
    this.attachStepListeners();
  }

  attachStepListeners() {
    // Entropy mode toggle
    const entropyModeButtons = document.querySelectorAll('.entropy-mode-toggle .toggle-btn');
    if (entropyModeButtons.length) {
      const panels = {
        dice: document.getElementById('dice-panel'),
        rng: document.getElementById('rng-panel')
      };

      entropyModeButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.dataset.mode;
          entropyModeButtons.forEach((control) => {
            const isActive = control === btn;
            control.classList.toggle('active', isActive);
            control.setAttribute('aria-selected', String(isActive));
          });

          Object.entries(panels).forEach(([key, panel]) => {
            if (!panel) return;
            const isVisible = key === mode;
            panel.classList.toggle('hidden', !isVisible);
            panel.setAttribute('aria-hidden', String(!isVisible));
          });

          // Initialize coin grid when switching to RNG panel
          if (mode === 'rng' && !this.coinGridInitialized) {
            this.initializeCoinGrid();
          }
        });
      });
    }

    // Entropy generation
    const rollDice = document.getElementById('roll-dice');
    if (rollDice) {
      rollDice.addEventListener('click', () => this.rollDice());
    }

    // Coin flip demo
    const flipRandom = document.getElementById('flip-random');
    if (flipRandom) {
      flipRandom.addEventListener('click', () => this.flipRandomCoin());
    }

    const flipAll = document.getElementById('flip-all');
    if (flipAll) {
      flipAll.addEventListener('click', () => this.flipAllCoins());
    }

    const resetCoins = document.getElementById('reset-coins');
    if (resetCoins) {
      resetCoins.addEventListener('click', () => this.resetCoins());
    }

    const newChallenge = document.getElementById('new-challenge');
    if (newChallenge) {
      newChallenge.addEventListener('click', () => this.generateNewChallenge());
    }

    // Seed regeneration
    const regenSeed = document.getElementById('regenerate-seed');
    if (regenSeed) {
      regenSeed.addEventListener('click', () => this.regenerateSeed());
    }

    // Address copying
    const copyAddress = document.getElementById('copy-address');
    if (copyAddress) {
      copyAddress.addEventListener('click', () => this.copyAddress());
    }
  }

  initializeCoinGrid() {
    const grid = document.getElementById('coin-grid');
    if (!grid || this.coinGridInitialized) return;

    this.coins = new Array(256).fill(null);
    this.targetCombo = null;

    for (let i = 0; i < 256; i++) {
      const coin = document.createElement('div');
      coin.className = 'coin unflipped';
      coin.dataset.index = i;
      coin.innerHTML = '<span class="coin-face">?</span>';

      coin.addEventListener('click', () => {
        if (this.coins[i] === null) {
          this.coins[i] = Math.random() > 0.5 ? 1 : 0;
        } else {
          this.coins[i] = 1 - this.coins[i];
        }
        this.updateCoin(coin, this.coins[i]);
        this.updateCoinStats();
      });

      grid.appendChild(coin);
    }

    this.coinGridInitialized = true;
  }

  updateCoin(coinElement, value) {
    coinElement.classList.remove('unflipped', 'heads', 'tails');
    if (value === 1) {
      coinElement.classList.add('heads');
      coinElement.innerHTML = '<span class="coin-face">1</span>';
    } else if (value === 0) {
      coinElement.classList.add('tails');
      coinElement.innerHTML = '<span class="coin-face">0</span>';
    } else {
      coinElement.classList.add('unflipped');
      coinElement.innerHTML = '<span class="coin-face">?</span>';
    }
  }

  flipRandomCoin() {
    if (!this.coins) return;

    const unflippedIndices = this.coins
      .map((val, idx) => val === null ? idx : null)
      .filter(idx => idx !== null);

    if (unflippedIndices.length === 0) return;

    const randomIndex = unflippedIndices[Math.floor(Math.random() * unflippedIndices.length)];
    this.coins[randomIndex] = Math.random() > 0.5 ? 1 : 0;

    const coinElement = document.querySelector(`[data-index="${randomIndex}"]`);
    this.updateCoin(coinElement, this.coins[randomIndex]);
    this.updateCoinStats();
  }

  flipAllCoins() {
    if (!this.coins) return;

    if (window.crypto && window.crypto.getRandomValues) {
      // Use cryptographically secure random
      const randomValues = new Uint8Array(256);
      window.crypto.getRandomValues(randomValues);
      
      for (let i = 0; i < 256; i++) {
        this.coins[i] = (randomValues[i] % 2) === 0 ? 0 : 1;
        const coinElement = document.querySelector(`[data-index="${i}"]`);
        this.updateCoin(coinElement, this.coins[i]);
      }
    } else {
      // Fallback
      for (let i = 0; i < 256; i++) {
        this.coins[i] = Math.random() > 0.5 ? 1 : 0;
        const coinElement = document.querySelector(`[data-index="${i}"]`);
        this.updateCoin(coinElement, this.coins[i]);
      }
    }

    this.updateCoinStats();
  }

  resetCoins() {
    if (!this.coins) return;

    for (let i = 0; i < 256; i++) {
      this.coins[i] = null;
      const coinElement = document.querySelector(`[data-index="${i}"]`);
      this.updateCoin(coinElement, null);
    }

    this.updateCoinStats();
  }

  updateCoinStats() {
    if (!this.coins) return;

    const heads = this.coins.filter(v => v === 1).length;
    const tails = this.coins.filter(v => v === 0).length;
    const total = heads + tails;

    document.getElementById('heads-count').textContent = heads;
    document.getElementById('tails-count').textContent = tails;
    document.getElementById('flip-progress').textContent = `${total}/256`;

    // Update hex output
    const hexOutput = document.getElementById('coin-hex');
    if (total === 256) {
      const binaryString = this.coins.join('');
      const hexString = this.binaryToHex(binaryString);
      hexOutput.textContent = hexString;
      hexOutput.classList.add('complete');

      // Check if matches target
      if (this.targetCombo && hexString === this.targetCombo) {
        const resultDiv = document.getElementById('challenge-result');
        resultDiv.style.display = 'block';
        resultDiv.querySelector('.result-text').innerHTML =
          '🎉 <strong>IMPOSSIBLE!</strong> You actually matched the target! This is astronomically unlikely. Either you\'re the luckiest person alive or you memorized the pattern!';
      }
    } else if (total > 0) {
      const binaryString = this.coins.map(v => v === null ? '0' : v).join('');
      hexOutput.textContent = this.binaryToHex(binaryString) + ' (incomplete)';
      hexOutput.classList.remove('complete');
    } else {
      hexOutput.textContent = 'Click coins to generate your unique 256-bit number...';
      hexOutput.classList.remove('complete');
    }
  }

  generateNewChallenge() {
    let challengeCoins;
    if (window.crypto && window.crypto.getRandomValues) {
      // Use cryptographically secure random
      const randomValues = new Uint8Array(256);
      window.crypto.getRandomValues(randomValues);
      challengeCoins = Array.from(randomValues).map(v => (v % 2) === 0 ? 0 : 1);
    } else {
      challengeCoins = new Array(256).fill(0).map(() => Math.random() > 0.5 ? 1 : 0);
    }
    const binaryString = challengeCoins.join('');
    this.targetCombo = this.binaryToHex(binaryString);

    const targetDiv = document.getElementById('target-combo');
    targetDiv.textContent = this.targetCombo;
    targetDiv.classList.add('active-challenge');

    const resultDiv = document.getElementById('challenge-result');
    resultDiv.style.display = 'none';
  }

  binaryToHex(binary) {
    let hex = '';
    for (let i = 0; i < binary.length; i += 4) {
      const chunk = binary.substr(i, 4);
      hex += parseInt(chunk, 2).toString(16);
    }
    return hex.padStart(64, '0');
  }

  rollDice() {
    // Use cryptographically secure random bit generation
    let bit;
    if (window.crypto && window.crypto.getRandomValues) {
      const randomValue = new Uint8Array(1);
      window.crypto.getRandomValues(randomValue);
      bit = (randomValue[0] % 2) === 0 ? '0' : '1';
    } else {
      bit = Math.random() > 0.5 ? '1' : '0';
    }
    this.entropy += bit;

    const bitsCollected = this.entropy.length;
    const progress = (bitsCollected / 256) * 100;

    document.getElementById('entropy-bits').textContent = bitsCollected;
    document.getElementById('entropy-progress').style.width = `${progress}%`;

    const binaryDisplay = document.getElementById('binary-entropy');
    if (binaryDisplay) {
      binaryDisplay.textContent = this.entropy.match(/.{1,8}/g)?.join(' ') || this.entropy;
    }

    if (bitsCollected >= 256) {
      // Convert to hex
      const hex = parseInt(this.entropy, 2).toString(16).padStart(64, '0');
      document.getElementById('hex-entropy').textContent = hex;
      document.getElementById('entropy-hex-display').style.display = 'block';

      // Enable next button
      document.getElementById('next-btn').disabled = false;
    }
  }

  regenerateSeed() {
    const length = parseInt(document.querySelector('input[name="seed-length"]:checked').value);
    const words = this.generateSeedWords(length);

    const display = document.getElementById('seed-words-display');
    display.innerHTML = words.map((word, idx) => `
      <div class="seed-word-item">
        <span class="word-number">${idx + 1}</span>
        <span class="word-text">${word}</span>
      </div>
    `).join('');
  }

  copyAddress() {
    const address = document.getElementById('final-address').textContent;
    navigator.clipboard.writeText(address);

    const btn = document.getElementById('copy-address');
    btn.textContent = '✓ Copied!';
    setTimeout(() => {
      btn.textContent = '📋 Copy Address';
    }, 2000);
  }

  nextStep() {
    if (this.currentStep < this.steps.length - 1) {
      this.currentStep++;
      this.updateStep();
    }
  }

  previousStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      this.updateStep();
    }
  }

  updateStep() {
    // Update progress bar
    document.querySelectorAll('.progress-step').forEach((step, idx) => {
      step.classList.toggle('active', idx === this.currentStep);
      step.classList.toggle('completed', idx < this.currentStep);
    });

    // Update content
    document.getElementById('step-content').innerHTML = this.renderStep(this.currentStep);

    // Update navigation buttons
    document.getElementById('prev-btn').disabled = this.currentStep === 0;
    document.getElementById('next-btn').textContent =
      this.currentStep === this.steps.length - 1 ? 'Complete Workshop' : 'Next Step →';

    // Reattach listeners for new content
    this.attachStepListeners();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addStyles() {
    if (document.getElementById('wallet-workshop-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'wallet-workshop-styles';
    styles.textContent = `
      .wallet-workshop {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
      }

      .difficulty-selector {
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border-radius: 12px;
        padding: 2rem;
        margin-bottom: 2rem;
        border: 1px solid rgba(247, 147, 26, 0.2);
      }

      .difficulty-selector h3 {
        text-align: center;
        color: #f7931a;
        margin-bottom: 1.5rem;
      }

      .difficulty-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 1rem;
      }

      .difficulty-btn {
        background: rgba(255, 255, 255, 0.05);
        border: 2px solid rgba(247, 147, 26, 0.3);
        border-radius: 8px;
        padding: 1rem;
        cursor: pointer;
        transition: all 0.3s ease;
        color: #fff;
        font-size: 1rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
      }

      .difficulty-btn:hover {
        border-color: #f7931a;
        transform: translateY(-2px);
      }

      .difficulty-btn.active {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border-color: #f7931a;
      }

      .difficulty-btn small {
        font-size: 0.85rem;
        opacity: 0.8;
      }

      .progress-container {
        margin: 3rem 0;
      }

      .progress-steps {
        display: flex;
        align-items: center;
        justify-content: space-between;
        position: relative;
      }

      .progress-step {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        position: relative;
        z-index: 2;
      }

      .step-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        border: 3px solid rgba(247, 147, 26, 0.3);
        transition: all 0.3s ease;
      }

      .progress-step.active .step-icon {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border-color: #f7931a;
        box-shadow: 0 0 20px rgba(247, 147, 26, 0.5);
      }

      .progress-step.completed .step-icon {
        background: #4CAF50;
        border-color: #4CAF50;
      }

      .step-title {
        font-size: 0.9rem;
        text-align: center;
        color: #999;
      }

      .progress-step.active .step-title {
        color: #f7931a;
        font-weight: 600;
      }

      .step-number {
        position: absolute;
        top: 0;
        right: 0;
        background: #f7931a;
        color: white;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .progress-connector {
        flex: 1;
        height: 3px;
        background: rgba(247, 147, 26, 0.2);
        margin: 0 -1rem;
        position: relative;
        top: -30px;
        z-index: 1;
      }

      .step-panel {
        background: linear-gradient(135deg, #1a1a1a, #2a2a2a);
        border-radius: 12px;
        padding: 2rem;
        margin: 2rem 0;
        border: 1px solid rgba(247, 147, 26, 0.2);
      }

      .step-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .step-header h2 {
        color: #f7931a;
        margin-bottom: 0.5rem;
      }

      .step-subtitle {
        color: #999;
        font-size: 1.1rem;
      }

      .concept-explanation {
        background: rgba(33, 150, 243, 0.1);
        border-left: 4px solid #2196F3;
        padding: 1.5rem;
        margin: 2rem 0;
        border-radius: 8px;
      }

      .concept-explanation h3 {
        color: #2196F3;
        margin-bottom: 1rem;
      }

      .security-comparison {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-top: 1rem;
      }

      .security-bad, .security-good {
        padding: 1rem;
        border-radius: 8px;
        text-align: center;
      }

      .security-bad {
        background: rgba(244, 67, 54, 0.1);
        border: 2px solid #F44336;
      }

      .security-good {
        background: rgba(76, 175, 80, 0.1);
        border: 2px solid #4CAF50;
      }

      .example {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.5rem;
        margin: 0.5rem 0;
        border-radius: 4px;
      }

      .interactive-section {
        margin: 2rem 0;
      }

      .interactive-section h3 {
        color: #f7931a;
        margin-bottom: 1rem;
      }

      .entropy-mode-toggle {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
        margin-bottom: 1.5rem;
      }

      .toggle-btn {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem 1.5rem;
        border-radius: 999px;
        border: 1px solid rgba(247, 147, 26, 0.4);
        background: rgba(255, 255, 255, 0.05);
        color: #fff;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .toggle-btn:hover {
        border-color: #f7931a;
        transform: translateY(-1px);
      }

      .toggle-btn.active {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        color: #1a1a1a;
        box-shadow: 0 10px 25px rgba(247, 147, 26, 0.35);
      }

      .toggle-icon {
        font-size: 1.4rem;
        line-height: 1;
      }

      .entropy-panels {
        display: grid;
        gap: 1.5rem;
      }

      .entropy-panel {
        background: rgba(0, 0, 0, 0.25);
        border: 1px solid rgba(247, 147, 26, 0.25);
        border-radius: 12px;
        padding: 1.5rem;
      }

      .entropy-panel .entropy-generator {
        background: rgba(0, 0, 0, 0.25);
        padding: 2rem;
        border-radius: 8px;
      }

      .hidden {
        display: none !important;
      }

      .entropy-rng {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .iframe-wrapper {
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 100%;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(63, 69, 81, 0.16);
      }

      .iframe-wrapper iframe {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: none;
      }

      .iframe-attrib {
        text-align: center;
        font-size: 0.9rem;
        color: #bbb;
      }

      .iframe-attrib a {
        color: #f7931a;
        text-decoration: none;
      }

      .iframe-attrib a:hover {
        text-decoration: underline;
      }

      .rng-tip {
        text-align: center;
        font-size: 0.95rem;
        color: #999;
      }

      /* Coin Flip Demo Styles */
      .coin-flip-demo {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .demo-header {
        text-align: center;
        margin-bottom: 1rem;
      }

      .demo-header h3 {
        color: #f7931a;
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
      }

      .demo-subtitle {
        color: #bbb;
        font-size: 1rem;
      }

      .socratic-intro {
        background: rgba(156, 39, 176, 0.1);
        border-left: 4px solid #9C27B0;
        padding: 1.25rem;
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .socratic-intro h4 {
        color: #9C27B0;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
      }

      .question-box {
        background: rgba(0, 0, 0, 0.3);
        padding: 1rem;
        border-radius: 6px;
      }

      .mini-reveal-btn {
        background: #9C27B0;
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 0.75rem;
        transition: all 0.3s ease;
        font-size: 0.9rem;
      }

      .mini-reveal-btn:hover {
        background: #7B1FA2;
        transform: translateY(-1px);
      }

      .mini-answer {
        margin-top: 0.75rem;
        padding: 0.75rem;
        background: rgba(156, 39, 176, 0.05);
        border-radius: 6px;
        font-size: 0.95rem;
      }

      .coin-grid-controls {
        display: flex;
        gap: 0.75rem;
        flex-wrap: wrap;
        justify-content: center;
        margin-bottom: 1rem;
      }

      .flip-btn {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        color: white;
        border: none;
        padding: 0.85rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
      }

      .flip-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(247, 147, 26, 0.4);
      }

      .flip-btn.secondary {
        background: rgba(255, 255, 255, 0.1);
        border: 2px solid rgba(247, 147, 26, 0.4);
      }

      .flip-btn.secondary:hover {
        background: rgba(255, 255, 255, 0.15);
        border-color: #f7931a;
      }

      .coin-stats {
        display: flex;
        justify-content: center;
        gap: 2rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .stat-item {
        text-align: center;
      }

      .stat-label {
        display: block;
        font-size: 0.9rem;
        color: #999;
        margin-bottom: 0.25rem;
      }

      .stat-value {
        display: block;
        font-size: 1.5rem;
        font-weight: 700;
        color: #f7931a;
      }

      .coin-grid {
        display: grid;
        grid-template-columns: repeat(16, 1fr);
        gap: 0.4rem;
        padding: 1rem;
        background: rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        margin-bottom: 1rem;
      }

      .coin {
        aspect-ratio: 1;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 2px solid transparent;
        font-weight: 700;
        font-size: 0.8rem;
      }

      .coin.unflipped {
        background: rgba(255, 255, 255, 0.1);
        color: #666;
        border-color: rgba(255, 255, 255, 0.2);
      }

      .coin.unflipped:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: #f7931a;
        transform: scale(1.1);
      }

      .coin.heads {
        background: linear-gradient(135deg, #4CAF50, #8BC34A);
        color: white;
        border-color: #4CAF50;
        animation: flipIn 0.3s ease;
      }

      .coin.tails {
        background: linear-gradient(135deg, #F44336, #FF6B6B);
        color: white;
        border-color: #F44336;
        animation: flipIn 0.3s ease;
      }

      .coin.heads:hover, .coin.tails:hover {
        transform: scale(1.15);
        box-shadow: 0 0 15px rgba(247, 147, 26, 0.5);
      }

      @keyframes flipIn {
        0% {
          transform: rotateY(90deg) scale(0.5);
          opacity: 0;
        }
        100% {
          transform: rotateY(0deg) scale(1);
          opacity: 1;
        }
      }

      .coin-face {
        display: block;
      }

      .entropy-output {
        background: rgba(0, 0, 0, 0.3);
        padding: 1.25rem;
        border-radius: 8px;
        border: 2px solid rgba(247, 147, 26, 0.3);
        margin-bottom: 1rem;
      }

      .entropy-output h4 {
        color: #f7931a;
        margin-bottom: 0.75rem;
        font-size: 1.1rem;
      }

      .hex-output {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 6px;
        word-break: break-all;
        color: #999;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
        min-height: 3rem;
        display: flex;
        align-items: center;
      }

      .hex-output.complete {
        color: #4CAF50;
        border: 2px solid #4CAF50;
        animation: glow 1.5s ease-in-out infinite;
      }

      @keyframes glow {
        0%, 100% {
          box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
        }
        50% {
          box-shadow: 0 0 20px rgba(76, 175, 80, 0.6);
        }
      }

      .output-note {
        display: block;
        font-size: 0.85rem;
        color: #777;
        margin-top: 0.5rem;
      }

      .collision-challenge {
        background: linear-gradient(135deg, rgba(33, 150, 243, 0.1), rgba(33, 150, 243, 0.05));
        border: 2px solid #2196F3;
        padding: 1.5rem;
        border-radius: 8px;
      }

      .collision-challenge h4 {
        color: #2196F3;
        margin-bottom: 1rem;
        font-size: 1.2rem;
      }

      .target-combo {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.4);
        padding: 1rem;
        border-radius: 6px;
        word-break: break-all;
        color: #2196F3;
        font-size: 0.9rem;
        margin: 1rem 0;
        border: 2px dashed rgba(33, 150, 243, 0.5);
      }

      .target-combo.active-challenge {
        border-style: solid;
        animation: pulse-border 2s ease-in-out infinite;
      }

      @keyframes pulse-border {
        0%, 100% {
          border-color: #2196F3;
        }
        50% {
          border-color: rgba(33, 150, 243, 0.3);
        }
      }

      .challenge-btn {
        background: #2196F3;
        color: white;
        border: none;
        padding: 0.85rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        font-size: 1rem;
        transition: all 0.3s ease;
        margin: 1rem 0;
      }

      .challenge-btn:hover {
        background: #1976D2;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(33, 150, 243, 0.4);
      }

      .challenge-result {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(76, 175, 80, 0.2);
        border: 2px solid #4CAF50;
        border-radius: 8px;
      }

      .result-text {
        color: #4CAF50;
        font-weight: 600;
        margin: 0;
      }

      .probability-insight {
        margin-top: 1.5rem;
        padding: 1rem;
        background: rgba(156, 39, 176, 0.1);
        border-left: 4px solid #9C27B0;
        border-radius: 6px;
      }

      .probability-insight p {
        margin-bottom: 0.75rem;
      }

      .probability-insight p:last-child {
        margin-bottom: 0;
      }

      @media (min-width: 768px) {
        .iframe-wrapper {
          padding-top: 56.25%;
        }
      }

      @media (max-width: 1024px) {
        .coin-grid {
          gap: 0.3rem;
        }

        .coin {
          font-size: 0.7rem;
        }
      }

      @media (max-width: 640px) {
        .coin-grid {
          gap: 0.25rem;
          padding: 0.5rem;
        }

        .coin {
          font-size: 0.6rem;
        }

        .coin-stats {
          flex-direction: column;
          gap: 0.75rem;
        }

        .flip-btn {
          width: 100%;
        }
      }

      .entropy-generator {
        background: rgba(0, 0, 0, 0.3);
        padding: 2rem;
        border-radius: 8px;
      }

      .dice-roller {
        text-align: center;
        margin-bottom: 2rem;
      }

      .dice-btn {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border: none;
        padding: 1.5rem 3rem;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1.2rem;
        color: white;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .dice-btn:hover {
        transform: scale(1.05);
        box-shadow: 0 10px 30px rgba(247, 147, 26, 0.4);
      }

      .dice {
        font-size: 3rem;
        margin-bottom: 0.5rem;
      }

      .roll-counter {
        margin-top: 1.5rem;
      }

      .progress-bar {
        width: 100%;
        height: 30px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 15px;
        overflow: hidden;
        margin-bottom: 0.5rem;
      }

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #4CAF50, #8BC34A);
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        color: #f7931a;
        font-size: 1.1rem;
        font-weight: 600;
      }

      .entropy-display, .entropy-hex {
        margin-top: 1.5rem;
      }

      .binary-output, #hex-entropy {
        font-family: monospace;
        background: rgba(0, 0, 0, 0.5);
        padding: 1rem;
        border-radius: 8px;
        word-break: break-all;
        color: #4CAF50;
        font-size: 0.9rem;
      }

      .socratic-question {
        background: rgba(156, 39, 176, 0.1);
        border-left: 4px solid #9C27B0;
        padding: 1.5rem;
        margin: 2rem 0;
        border-radius: 8px;
      }

      .socratic-question h4 {
        color: #9C27B0;
        margin-bottom: 1rem;
      }

      .reveal-btn {
        background: #9C27B0;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        margin-top: 1rem;
        transition: all 0.3s ease;
      }

      .reveal-btn:hover {
        background: #7B1FA2;
        transform: translateY(-2px);
      }

      .answer {
        margin-top: 1rem;
        padding: 1rem;
        background: rgba(156, 39, 176, 0.05);
        border-radius: 8px;
      }

      .seed-words-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
        margin: 1.5rem 0;
      }

      .seed-word-item {
        background: rgba(0, 0, 0, 0.3);
        border: 2px solid #f7931a;
        border-radius: 8px;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .word-number {
        background: #f7931a;
        color: white;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 0.9rem;
      }

      .word-text {
        color: #f7931a;
        font-weight: 600;
        font-size: 1.1rem;
      }

      .warning-box {
        background: rgba(244, 67, 54, 0.1);
        border: 2px solid #F44336;
        border-radius: 8px;
        padding: 1.5rem;
        margin: 2rem 0;
      }

      .warning-box h4 {
        color: #F44336;
        margin-bottom: 1rem;
      }

      .warning-box ul {
        list-style: none;
        padding: 0;
      }

      .warning-box li {
        padding: 0.5rem 0;
        border-bottom: 1px solid rgba(244, 67, 54, 0.2);
      }

      .warning-box li:last-child {
        border-bottom: none;
      }

      .step-navigation {
        display: flex;
        justify-content: space-between;
        margin-top: 2rem;
        gap: 1rem;
      }

      .nav-btn {
        padding: 1rem 2rem;
        border: 2px solid rgba(247, 147, 26, 0.3);
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .nav-btn:hover:not(:disabled) {
        border-color: #f7931a;
        transform: translateY(-2px);
      }

      .nav-btn:disabled {
        opacity: 0.3;
        cursor: not-allowed;
      }

      .nav-btn.primary {
        background: linear-gradient(135deg, #f7931a, #ff6b00);
        border-color: #f7931a;
      }

      @media (max-width: 768px) {
        .difficulty-buttons {
          grid-template-columns: 1fr;
        }

        .progress-steps {
          flex-direction: column;
        }

        .progress-connector {
          display: none;
        }

        .security-comparison {
          grid-template-columns: 1fr;
        }
      }
    `;
    document.head.appendChild(styles);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('🔐 Wallet Workshop: DOM ready, initializing...');
    try {
      const workshop = new WalletWorkshop();
      console.log('✅ Wallet Workshop: Initialized successfully');
      window.walletWorkshop = workshop; // Make it globally accessible for debugging
    } catch (error) {
      console.error('❌ Wallet Workshop: Initialization failed:', error);
      const container = document.getElementById('wallet-workshop-container');
      if (container) {
        container.innerHTML = `
          <div style="background: rgba(244, 67, 54, 0.2); border: 2px solid #f44336; padding: 2rem; border-radius: 10px; margin: 2rem 0;">
            <h2 style="color: #f44336; margin-bottom: 1rem;">⚠️ Wallet Workshop Failed to Load</h2>
            <p style="margin-bottom: 1rem;">There was an error initializing the wallet workshop:</p>
            <pre style="background: rgba(0, 0, 0, 0.5); padding: 1rem; border-radius: 6px; overflow-x: auto;">${error.message}\n\n${error.stack}</pre>
            <p style="margin-top: 1rem;">Please refresh the page or check the browser console for more details.</p>
          </div>
        `;
      }
    }
  });
} else {
  console.log('🔐 Wallet Workshop: DOM already ready, initializing...');
  try {
    const workshop = new WalletWorkshop();
    console.log('✅ Wallet Workshop: Initialized successfully');
    window.walletWorkshop = workshop; // Make it globally accessible for debugging
  } catch (error) {
    console.error('❌ Wallet Workshop: Initialization failed:', error);
    const container = document.getElementById('wallet-workshop-container');
    if (container) {
      container.innerHTML = `
        <div style="background: rgba(244, 67, 54, 0.2); border: 2px solid #f44336; padding: 2rem; border-radius: 10px; margin: 2rem 0;">
          <h2 style="color: #f44336; margin-bottom: 1rem;">⚠️ Wallet Workshop Failed to Load</h2>
          <p style="margin-bottom: 1rem;">There was an error initializing the wallet workshop:</p>
          <pre style="background: rgba(0, 0, 0, 0.5); padding: 1rem; border-radius: 6px; overflow-x: auto;">${error.message}\n\n${error.stack}</pre>
          <p style="margin-top: 1rem;">Please refresh the page or check the browser console for more details.</p>
        </div>
      `;
    }
  }
}
