import { Card } from './types';

export const CARD_DECK_PRESET: Card[] = [
  // 1. CHARACTER CARDS
  {
    id: 'char_detective',
    name: 'المحقق المحنك',
    nameEn: 'Veteran Detective',
    type: 'CHARACTER',
    rarity: 'RARE',
    description: 'اكشف دليلاً فورياً من الكومة أو انظر إلى دليل لدى لاعب آخر.',
    descriptionEn: 'Instantly reveal a clue from the deck or peek at another player’s clue.',
    icon: 'Search',
    chaosImpact: -5,
    cooperationImpact: 2,
    targetRequired: false,
    effectCode: 'REVEAL_NEW_CLUE'
  },
  {
    id: 'char_trickster',
    name: 'المخادع البارع',
    nameEn: 'The Trickster',
    type: 'CHARACTER',
    rarity: 'UNCOMMON',
    description: 'بدل بطاقة عشوائية من يدك مع بطاقة من يد لاعب مستهدف وزد الفوضى +10%.',
    descriptionEn: 'Swap a random card from your hand with a target player and add +10% Chaos.',
    icon: 'Masks',
    chaosImpact: 10,
    cooperationImpact: -1,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'SWAP_HAND_CARD'
  },
  {
    id: 'char_diplomat',
    name: 'الدبلوماسي الهادئ',
    nameEn: 'The Diplomat',
    type: 'CHARACTER',
    rarity: 'COMMON',
    description: 'اختر لاعباً؛ يمنح كل منكما نقطة تعاون للفريق وينخفض مؤشر الفوضى -15%.',
    descriptionEn: 'Pick a player: both gain a cooperation token and Chaos drops by 15%.',
    icon: 'Handshake',
    chaosImpact: -15,
    cooperationImpact: 2,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'DIPLOMACY_PEACE'
  },
  {
    id: 'char_clairvoyant',
    name: 'العرّافة الغامضة',
    nameEn: 'The Clairvoyant',
    type: 'CHARACTER',
    rarity: 'RARE',
    description: 'انظر لأعلى 3 بطاقات في الكومة وأعد ترتيبها كما تحب.',
    descriptionEn: 'Inspect the top 3 cards of the deck and rearrange them.',
    icon: 'Eye',
    chaosImpact: 0,
    cooperationImpact: 1,
    targetRequired: false,
    effectCode: 'PEEK_DECK'
  },
  {
    id: 'char_bodyguard',
    name: 'الحارس الأمين',
    nameEn: 'The Bodyguard',
    type: 'CHARACTER',
    rarity: 'UNCOMMON',
    description: 'احمِ لاعباً من تأثير بطاقات الفوضى والسرقة حتى دوره القادم.',
    descriptionEn: 'Shield a player from theft and negative chaos cards until their next turn.',
    icon: 'Shield',
    chaosImpact: -5,
    cooperationImpact: 2,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'PROTECT_PLAYER'
  },
  {
    id: 'char_merchant',
    name: 'التاجر الجشع',
    nameEn: 'The Merchant',
    type: 'CHARACTER',
    rarity: 'COMMON',
    description: 'اسحب بطاقتين إضافيتين وتبرع ببطاقة واحدة للاعب يختاره الفريق.',
    descriptionEn: 'Draw 2 extra cards and gift 1 card to a teammate.',
    icon: 'Coins',
    chaosImpact: 5,
    cooperationImpact: 1,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'MERCHANT_TRADE'
  },

  // 2. OBJECT CARDS
  {
    id: 'obj_mystery_bag',
    name: 'الحقيبة الغامضة',
    nameEn: 'The Mystery Bag',
    type: 'OBJECT',
    rarity: 'LEGENDARY',
    description: 'مرر الحقيبة الغامضة إلى لاعب آخر. من يحملها في نهاية الجولة ينال مكافأة كبرى!',
    descriptionEn: 'Pass the Mystery Bag to another player. Holder at round end scores big!',
    icon: 'Briefcase',
    chaosImpact: 5,
    cooperationImpact: 1,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'PASS_MYSTERY_BAG'
  },
  {
    id: 'obj_magnifier',
    name: 'المكبر السري',
    nameEn: 'Secret Magnifier',
    type: 'OBJECT',
    rarity: 'COMMON',
    description: 'افحص دليلاً موجوداً واكتشف هل هو دليل حقيقي أم مزيف.',
    descriptionEn: 'Examine an existing clue to reveal if it is TRUE or FALSE.',
    icon: 'Sparkles',
    chaosImpact: 0,
    cooperationImpact: 2,
    targetRequired: false,
    effectCode: 'VERIFY_CLUE'
  },
  {
    id: 'obj_smoke_capsule',
    name: 'قنبلة الدخان',
    nameEn: 'Smoke Capsule',
    type: 'OBJECT',
    rarity: 'UNCOMMON',
    description: 'تجاهل أي عقوبة حالية، واسحب بطاقة فورية وتخط دورك بسلام.',
    descriptionEn: 'Evade negative effects, draw a card immediately and end turn safely.',
    icon: 'CloudFog',
    chaosImpact: 5,
    cooperationImpact: 0,
    targetRequired: false,
    effectCode: 'SMOKE_EVADE'
  },
  {
    id: 'obj_golden_key',
    name: 'المفتاح الذهبي',
    nameEn: 'The Golden Key',
    type: 'OBJECT',
    rarity: 'RARE',
    description: 'يفتح خزنة الأسرار؛ احصل على 15 نقطة فورية وتقدم خطوة في المهمة الجماعية.',
    descriptionEn: 'Unlock secret chest: earn 15 instant points and advance the mission.',
    icon: 'Key',
    chaosImpact: -10,
    cooperationImpact: 3,
    targetRequired: false,
    effectCode: 'ADVANCE_MISSION_KEY'
  },
  {
    id: 'obj_truth_serum',
    name: 'مصل الحقيقة',
    nameEn: 'Truth Serum',
    type: 'OBJECT',
    rarity: 'RARE',
    description: 'يجبر لاعباً على كشف إحدى أوراقه في يده لجميع اللاعبين.',
    descriptionEn: 'Forces a target player to publicly reveal one random card from hand.',
    icon: 'FlaskConical',
    chaosImpact: 5,
    cooperationImpact: 2,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'FORCE_REVEAL_CARD'
  },

  // 3. EVENT CARDS
  {
    id: 'event_blackout',
    name: 'انقطاع مفاجئ للكهرباء',
    nameEn: 'Sudden Blackout',
    type: 'EVENT',
    rarity: 'UNCOMMON',
    description: 'يعم الظلام؛ يمرر كل لاعب بطاقة إلى جاره في اتجاه عقارب الساعة!',
    descriptionEn: 'Darkness falls: all players pass one card to their left neighbor!',
    icon: 'ZapOff',
    chaosImpact: 15,
    cooperationImpact: 0,
    targetRequired: false,
    effectCode: 'ROTATE_HANDS_ONE'
  },
  {
    id: 'event_sandstorm',
    name: 'العاصفة الرملية',
    nameEn: 'The Sandstorm',
    type: 'EVENT',
    rarity: 'COMMON',
    description: 'تخلط بطاقات الكومة وتزيد الفوضى +10% ويسحب الجميع بطاقة جديدة.',
    descriptionEn: 'Deck is reshuffled, +10% Chaos, and every player draws a fresh card.',
    icon: 'Wind',
    chaosImpact: 10,
    cooperationImpact: 1,
    targetRequired: false,
    effectCode: 'ALL_DRAW_AND_CHAOS'
  },
  {
    id: 'event_ceasefire',
    name: 'هدنة مؤقتة',
    nameEn: 'Ceasefire',
    type: 'EVENT',
    rarity: 'COMMON',
    description: 'تهدأ الأجواء فوراً، ينخفض مؤشر الفوضى -20% ويكسب الفريق وقت استراحة.',
    descriptionEn: 'Chaos drops by 20% immediately and the team regains composure.',
    icon: 'Feather',
    chaosImpact: -20,
    cooperationImpact: 2,
    targetRequired: false,
    effectCode: 'CALM_CHAOS'
  },
  {
    id: 'event_emergency_meeting',
    name: 'اجتماع طارئ',
    nameEn: 'Emergency Meeting',
    type: 'EVENT',
    rarity: 'RARE',
    description: 'يصوت جميع اللاعبين على تقديم أو تأخير دور لاعب محدد.',
    descriptionEn: 'Team holds a quick conference to grant an extra turn to the chosen player.',
    icon: 'Users',
    chaosImpact: -5,
    cooperationImpact: 3,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'GRANT_EXTRA_TURN'
  },

  // 4. ACTION CARDS
  {
    id: 'act_forced_swap',
    name: 'مقايضة إجبارية',
    nameEn: 'Forced Swap',
    type: 'ACTION',
    rarity: 'COMMON',
    description: 'اختر لاعباً وبدل بطاقة من يدك معه باختيارك.',
    descriptionEn: 'Pick a player and exchange one selected card with them.',
    icon: 'RefreshCw',
    chaosImpact: 5,
    cooperationImpact: 0,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'FORCE_TRADE'
  },
  {
    id: 'act_swift_steal',
    name: 'سرقة خاطفة',
    nameEn: 'Swift Theft',
    type: 'ACTION',
    rarity: 'UNCOMMON',
    description: 'اسحب بطاقة عشوائية من يد لاعب مستهدف وضعها في يدك.',
    descriptionEn: 'Snatch one random card from a target player’s hand.',
    icon: 'Hand',
    chaosImpact: 10,
    cooperationImpact: -1,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'STEAL_RANDOM_CARD'
  },
  {
    id: 'act_clutch_save',
    name: 'إنقاذ الموقف',
    nameEn: 'Clutch Save',
    type: 'ACTION',
    rarity: 'RARE',
    description: 'ألغِ الزيادة الأخيرة في مؤشر الفوضى وأضف تقدمين في المهمة الحالية.',
    descriptionEn: 'Cancel the latest Chaos spike and add +2 progress to the mission.',
    icon: 'HeartHandshake',
    chaosImpact: -15,
    cooperationImpact: 3,
    targetRequired: false,
    effectCode: 'SAVE_MISSION'
  },
  {
    id: 'act_double_trouble',
    name: 'الضربة المزدوجة',
    nameEn: 'Double Play',
    type: 'ACTION',
    rarity: 'UNCOMMON',
    description: 'يمكنك لعب بطاقة إضافية في نفس هذا الدور على الفور.',
    descriptionEn: 'Play an extra card on this turn immediately.',
    icon: 'Layers',
    chaosImpact: 5,
    cooperationImpact: 1,
    targetRequired: false,
    effectCode: 'EXTRA_PLAY'
  },
  {
    id: 'act_confiscate',
    name: 'مصادرة قانونية',
    nameEn: 'Confiscate',
    type: 'ACTION',
    rarity: 'UNCOMMON',
    description: 'خذ الحقيبة الغامضة أو قطعة أثرية من أي لاعب وضعها لديك.',
    descriptionEn: 'Take the Mystery Bag or active artifact from any player to yourself.',
    icon: 'Lock',
    chaosImpact: 5,
    cooperationImpact: 0,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'STEAL_BAG'
  },

  // 5. SECRET CARDS
  {
    id: 'sec_classified_file',
    name: 'ملف سري للغاية',
    nameEn: 'Classified Dossier',
    type: 'SECRET',
    rarity: 'RARE',
    description: 'يمنحك 20 نقطة إضافية في نهاية اللعبة إذا احتفظت به حتى النهاية.',
    descriptionEn: 'Grants you +20 secret bonus points if kept in hand at game end.',
    icon: 'FileText',
    chaosImpact: 0,
    cooperationImpact: 0,
    targetRequired: false,
    effectCode: 'BONUS_POINTS_END'
  },
  {
    id: 'sec_false_identity',
    name: 'هوية مستعارة',
    nameEn: 'False Identity',
    type: 'SECRET',
    rarity: 'UNCOMMON',
    description: 'احمِ نفسك من أي تفتيش أو تصويت، وعند اللعب بدل هدفك السري بهدف جديد.',
    descriptionEn: 'Immune to player searches; when played, re-roll your secret objective.',
    icon: 'VenetianMask',
    chaosImpact: 5,
    cooperationImpact: 0,
    targetRequired: false,
    effectCode: 'REROLL_SECRET_OBJ'
  },
  {
    id: 'sec_enigma_whisper',
    name: 'الهمس المريب',
    nameEn: 'Suspicious Whisper',
    type: 'SECRET',
    rarity: 'COMMON',
    description: 'أرسل رسالة سرية أو بطاقة مخفية للاعب واحد دون أن يعلم الآخرون.',
    descriptionEn: 'Secretly gift a card to one player without others knowing its content.',
    icon: 'MessageSquareShare',
    chaosImpact: 5,
    cooperationImpact: 1,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'SECRET_GIFT'
  },

  // 6. CHAOS CARDS
  {
    id: 'chaos_vortex',
    name: 'إعصار الفوضى',
    nameEn: 'Chaos Vortex',
    type: 'CHAOS',
    rarity: 'RARE',
    description: 'ارفع مؤشر الفوضى +25%! إذا وصلت الفوضى 100% يحدث انفجار الفوضى الكبير!',
    descriptionEn: 'Surge Chaos meter +25%! If it reaches 100%, trigger The Final Chaos!',
    icon: 'Flame',
    chaosImpact: 25,
    cooperationImpact: -2,
    targetRequired: false,
    effectCode: 'SURGE_CHAOS'
  },
  {
    id: 'chaos_wild_gamble',
    name: 'مقامرة عمياء',
    nameEn: 'Blind Gamble',
    type: 'CHAOS',
    rarity: 'UNCOMMON',
    description: 'ارمِ النرد السحري: إما +30 نقطة وتقدم بالمهمة، أو +30% فوضى وخسارة بطاقة!',
    descriptionEn: 'Roll the mystery dice: either +30 points & mission boost, or +30% Chaos!',
    icon: 'Dices',
    chaosImpact: 15,
    cooperationImpact: 0,
    targetRequired: false,
    effectCode: 'WILD_GAMBLE'
  },
  {
    id: 'chaos_roulette',
    name: 'الروليت العجيبة',
    nameEn: 'Wacky Roulette',
    type: 'CHAOS',
    rarity: 'COMMON',
    description: 'يسحب كل لاعب بطاقة فوضى عشوائية وتتغير اتجاهات الأدوار!',
    descriptionEn: 'Turn order reverses and a burst of wild effects triggers across players.',
    icon: 'Shuffle',
    chaosImpact: 15,
    cooperationImpact: -1,
    targetRequired: false,
    effectCode: 'REVERSE_ORDER_CHAOS'
  },
  {
    id: 'chaos_overload',
    name: 'الحمل الزائد',
    nameEn: 'Overload Pulse',
    type: 'CHAOS',
    rarity: 'COMMON',
    description: 'كل لاعب لديه أكثر من 4 بطاقات يجب عليه التخلص من بطاقة واحدة إلى الكومة.',
    descriptionEn: 'Every player holding more than 4 cards must discard one card.',
    icon: 'Bomb',
    chaosImpact: 10,
    cooperationImpact: 0,
    targetRequired: false,
    effectCode: 'DISCARD_OVERFLOW'
  },

  // 7. COOPERATION CARDS
  {
    id: 'coop_helping_hand',
    name: 'يد العون',
    nameEn: 'Helping Hand',
    type: 'COOPERATION',
    rarity: 'COMMON',
    description: 'امنح لاعباً آخر بطاقة مفيدة من يدك؛ يربح الفريق تقدمين في المهمة.',
    descriptionEn: 'Gift a useful card to a teammate; team earns +2 mission progress.',
    icon: 'HeartHandshake',
    chaosImpact: -10,
    cooperationImpact: 2,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'GIFT_AND_BOOST'
  },
  {
    id: 'coop_grand_pact',
    name: 'الميثاق الكبير',
    nameEn: 'The Grand Pact',
    type: 'COOPERATION',
    rarity: 'RARE',
    description: 'يمنح جميع اللاعبين 5 نقاط تعاون ويهبط مؤشر الفوضى -20%.',
    descriptionEn: 'Grants all players cooperation tokens and drops Chaos by 20%.',
    icon: 'Award',
    chaosImpact: -20,
    cooperationImpact: 4,
    targetRequired: false,
    effectCode: 'GRAND_PACT'
  },
  {
    id: 'coop_merge_clues',
    name: 'دمج الأدلة',
    nameEn: 'Synthesize Clues',
    type: 'COOPERATION',
    rarity: 'UNCOMMON',
    description: 'اجمع أدلتك مع أدلة لاعب آخر لتأكيد صحتها وحل جزء من اللغز.',
    descriptionEn: 'Combine clues with a teammate to confirm facts and score points.',
    icon: 'Puzzle',
    chaosImpact: -5,
    cooperationImpact: 3,
    targetRequired: true,
    targetType: 'PLAYER',
    effectCode: 'SYNTHESIZE_CLUES'
  },
  {
    id: 'coop_shared_shield',
    name: 'الدرع المشترك',
    nameEn: 'Shared Shield',
    type: 'COOPERATION',
    rarity: 'COMMON',
    description: 'يمنع زيادة الفوضى للدورين القادمين ويحمي الفريق من الخسارة السريعة.',
    descriptionEn: 'Locks Chaos meter for 2 turns, protecting the squad.',
    icon: 'ShieldCheck',
    chaosImpact: -10,
    cooperationImpact: 2,
    targetRequired: false,
    effectCode: 'SHIELD_TEAM'
  },

  // 8. CLUE CARDS
  {
    id: 'clue_fingerprint',
    name: 'أثر البصمات',
    nameEn: 'Fingerprint Clue',
    type: 'CLUE',
    rarity: 'COMMON',
    description: 'دليل جنائي تم العثور عليه قرب الحقيبة. (قد يكون حقيقياً أو مفبركاً)',
    descriptionEn: 'Forensic evidence found near the scene. (Might be authentic or forged)',
    icon: 'Fingerprint',
    chaosImpact: 0,
    cooperationImpact: 1,
    clueValue: true,
    clueHint: 'البصمات لا تتطابق مع حامل الحقيبة الأصلي.',
    targetRequired: false,
    effectCode: 'ADD_CLUE'
  },
  {
    id: 'clue_torn_letter',
    name: 'الرسالة الممزقة',
    nameEn: 'Torn Letter',
    type: 'CLUE',
    rarity: 'COMMON',
    description: 'جزء من وثيقة تكشف مكان المخبأ السري.',
    descriptionEn: 'Fragment of a document revealing coordinates.',
    icon: 'FileSpreadsheet',
    chaosImpact: 0,
    cooperationImpact: 1,
    clueValue: true,
    clueHint: 'الرمز السري يبدأ بالحرف الأول من اسم الفائز.',
    targetRequired: false,
    effectCode: 'ADD_CLUE'
  },
  {
    id: 'clue_hotel_key',
    name: 'مفتاح الغرفة 404',
    nameEn: 'Room 404 Key',
    type: 'CLUE',
    rarity: 'UNCOMMON',
    description: 'مفتاح قديم يقود إلى غرفة الغموض.',
    descriptionEn: 'Vintage key leading to the mystery suite.',
    icon: 'KeyRound',
    chaosImpact: -5,
    cooperationImpact: 2,
    clueValue: false, // False clue to challenge deduction
    clueHint: 'المفتاح لم يُستخدم منذ عشر سنوات (دليل مضلل)!',
    targetRequired: false,
    effectCode: 'ADD_CLUE'
  },
  {
    id: 'clue_audio_tape',
    name: 'التسجيل الصوتي',
    nameEn: 'Audio Tape',
    type: 'CLUE',
    rarity: 'RARE',
    description: 'تسجيل لمكالمة هاتفية تكشف نية أحد المشتبه بهم.',
    descriptionEn: 'Audio wiretap revealing the suspect’s intentions.',
    icon: 'CassetteTape',
    chaosImpact: 5,
    cooperationImpact: 2,
    clueValue: true,
    clueHint: 'صوت المتحدث يبدو هادئاً وواثقاً من نجاح المهمة.',
    targetRequired: false,
    effectCode: 'ADD_CLUE'
  },
  {
    id: 'clue_witness_testimony',
    name: 'شهادة الشاهد الغامض',
    nameEn: 'Witness Testimony',
    type: 'CLUE',
    rarity: 'UNCOMMON',
    description: 'شهادة من شاهد عيان تواجد في موقع الحدث.',
    descriptionEn: 'Eyewitness account from someone at the scene.',
    icon: 'UserCheck',
    chaosImpact: -5,
    cooperationImpact: 2,
    clueValue: true,
    clueHint: 'الشاهد رأى الحقيبة تُسلَّم قبل قليل لأحد اللاعبين.',
    targetRequired: false,
    effectCode: 'ADD_CLUE'
  },
  {
    id: 'clue_forged_stamp',
    name: 'الختم المزيف',
    nameEn: 'Forged Stamp',
    type: 'CLUE',
    rarity: 'COMMON',
    description: 'ختم رسمي يبدو مقلداً بدقة لإرباك التحقيق.',
    descriptionEn: 'An official stamp looking deceptively authentic.',
    icon: 'Stamp',
    chaosImpact: 10,
    cooperationImpact: 0,
    clueValue: false, // False clue
    clueHint: 'هذا الختم محاولة تضليل لصرف الأنظار!',
    targetRequired: false,
    effectCode: 'ADD_CLUE'
  }
];

export function createFreshDeck(): Card[] {
  // Multiply copies to create a full 45-55 card dynamic deck
  const deck: Card[] = [];
  let uid = 1;
  for (const template of CARD_DECK_PRESET) {
    const copies = template.rarity === 'COMMON' ? 3 : template.rarity === 'UNCOMMON' ? 2 : 1;
    for (let i = 0; i < copies; i++) {
      deck.push({
        ...template,
        id: `${template.id}_${uid++}`
      });
    }
  }
  return shuffleCards(deck);
}

export function shuffleCards<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
