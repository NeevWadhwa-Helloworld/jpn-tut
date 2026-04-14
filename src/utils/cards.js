/**
 * cards.js — Nihongo Navi Card Data
 * Each card: { id, type, level, jp, furi, romaji, en, pos, example: { jp, en }, tags }
 */

const CARDS = {

  vocab: [
    // N5
    { id:'v001', type:'vocab', level:'N5', jp:'食べる', furi:'たべる', romaji:'taberu',  en:'to eat',    pos:'verb (る)', example:{ jp:'ご飯を食べる', en:'eat a meal' }, tags:['food','action'] },
    { id:'v002', type:'vocab', level:'N5', jp:'飲む',   furi:'のむ',   romaji:'nomu',   en:'to drink',  pos:'verb (う)', example:{ jp:'水を飲む', en:'drink water' }, tags:['food','action'] },
    { id:'v003', type:'vocab', level:'N5', jp:'見る',   furi:'みる',   romaji:'miru',   en:'to see/watch', pos:'verb (る)', example:{ jp:'映画を見る', en:'watch a movie' }, tags:['action'] },
    { id:'v004', type:'vocab', level:'N5', jp:'行く',   furi:'いく',   romaji:'iku',    en:'to go',     pos:'verb (う)', example:{ jp:'学校に行く', en:'go to school' }, tags:['movement'] },
    { id:'v005', type:'vocab', level:'N5', jp:'来る',   furi:'くる',   romaji:'kuru',   en:'to come',   pos:'verb (irr)', example:{ jp:'友達が来る', en:'a friend comes' }, tags:['movement'] },
    { id:'v006', type:'vocab', level:'N5', jp:'猫',     furi:'ねこ',   romaji:'neko',   en:'cat',       pos:'noun', example:{ jp:'可愛い猫', en:'a cute cat' }, tags:['animal'] },
    { id:'v007', type:'vocab', level:'N5', jp:'犬',     furi:'いぬ',   romaji:'inu',    en:'dog',       pos:'noun', example:{ jp:'犬と散歩する', en:'walk with a dog' }, tags:['animal'] },
    { id:'v008', type:'vocab', level:'N5', jp:'学校',   furi:'がっこう', romaji:'gakkou', en:'school',   pos:'noun', example:{ jp:'学校に通う', en:'attend school' }, tags:['place'] },
    { id:'v009', type:'vocab', level:'N5', jp:'電車',   furi:'でんしゃ', romaji:'densha', en:'train',    pos:'noun', example:{ jp:'電車に乗る', en:'ride the train' }, tags:['transport'] },
    { id:'v010', type:'vocab', level:'N5', jp:'友達',   furi:'ともだち', romaji:'tomodachi', en:'friend', pos:'noun', example:{ jp:'友達と話す', en:'talk with a friend' }, tags:['people'] },
    { id:'v011', type:'vocab', level:'N5', jp:'大きい', furi:'おおきい', romaji:'ookii',  en:'big, large', pos:'adj (い)', example:{ jp:'大きい家', en:'a big house' }, tags:['size'] },
    { id:'v012', type:'vocab', level:'N5', jp:'小さい', furi:'ちいさい', romaji:'chiisai', en:'small, little', pos:'adj (い)', example:{ jp:'小さい子供', en:'a small child' }, tags:['size'] },
    { id:'v013', type:'vocab', level:'N5', jp:'赤い',   furi:'あかい',  romaji:'akai',   en:'red',       pos:'adj (い)', example:{ jp:'赤いバラ', en:'red rose' }, tags:['color'] },
    { id:'v014', type:'vocab', level:'N5', jp:'白い',   furi:'しろい',  romaji:'shiroi', en:'white',     pos:'adj (い)', example:{ jp:'白い雪', en:'white snow' }, tags:['color'] },
    // N4
    { id:'v015', type:'vocab', level:'N4', jp:'集める', furi:'あつめる', romaji:'atsumeru', en:'to collect', pos:'verb (る)', example:{ jp:'切手を集める', en:'collect stamps' }, tags:['action'] },
    { id:'v016', type:'vocab', level:'N4', jp:'決める', furi:'きめる',  romaji:'kimeru', en:'to decide',  pos:'verb (る)', example:{ jp:'場所を決める', en:'decide a place' }, tags:['action'] },
    { id:'v017', type:'vocab', level:'N4', jp:'気持ち', furi:'きもち',  romaji:'kimochi', en:'feeling, mood', pos:'noun', example:{ jp:'気持ちを伝える', en:'convey one\'s feelings' }, tags:['emotion'] },
    { id:'v018', type:'vocab', level:'N4', jp:'生活',   furi:'せいかつ', romaji:'seikatsu', en:'daily life', pos:'noun', example:{ jp:'便利な生活', en:'convenient lifestyle' }, tags:['life'] },
    { id:'v019', type:'vocab', level:'N4', jp:'経験',   furi:'けいけん', romaji:'keiken', en:'experience', pos:'noun', example:{ jp:'貴重な経験', en:'valuable experience' }, tags:['abstract'] },
    { id:'v020', type:'vocab', level:'N4', jp:'安全',   furi:'あんぜん', romaji:'anzen',  en:'safe, safety', pos:'noun/adj', example:{ jp:'安全な場所', en:'a safe place' }, tags:['safety'] },
    // N3
    { id:'v021', type:'vocab', level:'N3', jp:'遠慮',   furi:'えんりょ', romaji:'enryo', en:'reserve, restraint', pos:'noun', example:{ jp:'遠慮なく言う', en:'say without reserve' }, tags:['social'] },
    { id:'v022', type:'vocab', level:'N3', jp:'機会',   furi:'きかい',  romaji:'kikai',  en:'opportunity', pos:'noun', example:{ jp:'機会を生かす', en:'make the most of an opportunity' }, tags:['abstract'] },
  ],

  kanji: [
    { id:'k001', type:'kanji', level:'N5', jp:'山', furi:'やま/さん', romaji:'yama/san', en:'mountain', pos:'kanji', example:{ jp:'富士山', en:'Mt. Fuji' }, tags:['nature'] },
    { id:'k002', type:'kanji', level:'N5', jp:'川', furi:'かわ/せん', romaji:'kawa/sen', en:'river', pos:'kanji', example:{ jp:'川を渡る', en:'cross a river' }, tags:['nature'] },
    { id:'k003', type:'kanji', level:'N5', jp:'木', furi:'き/もく', romaji:'ki/moku', en:'tree, wood', pos:'kanji', example:{ jp:'公園の木', en:'park tree' }, tags:['nature'] },
    { id:'k004', type:'kanji', level:'N5', jp:'火', furi:'ひ/か', romaji:'hi/ka', en:'fire', pos:'kanji', example:{ jp:'火曜日', en:'Tuesday' }, tags:['element'] },
    { id:'k005', type:'kanji', level:'N5', jp:'水', furi:'みず/すい', romaji:'mizu/sui', en:'water', pos:'kanji', example:{ jp:'水曜日', en:'Wednesday' }, tags:['element'] },
    { id:'k006', type:'kanji', level:'N5', jp:'金', furi:'きん/かね', romaji:'kin/kane', en:'gold, money', pos:'kanji', example:{ jp:'お金', en:'money' }, tags:['element','finance'] },
    { id:'k007', type:'kanji', level:'N5', jp:'土', furi:'つち/ど', romaji:'tsuchi/do', en:'earth, soil', pos:'kanji', example:{ jp:'土曜日', en:'Saturday' }, tags:['element'] },
    { id:'k008', type:'kanji', level:'N5', jp:'日', furi:'ひ/にち', romaji:'hi/nichi', en:'sun, day', pos:'kanji', example:{ jp:'日本', en:'Japan' }, tags:['time'] },
    { id:'k009', type:'kanji', level:'N5', jp:'月', furi:'つき/げつ', romaji:'tsuki/getsu', en:'moon, month', pos:'kanji', example:{ jp:'今月', en:'this month' }, tags:['time'] },
    { id:'k010', type:'kanji', level:'N5', jp:'人', furi:'ひと/じん', romaji:'hito/jin', en:'person', pos:'kanji', example:{ jp:'日本人', en:'Japanese person' }, tags:['people'] },
    // N4 kanji
    { id:'k011', type:'kanji', level:'N4', jp:'明', furi:'あか/めい', romaji:'aka/mei', en:'bright, clear', pos:'kanji', example:{ jp:'明るい', en:'bright, cheerful' }, tags:['light'] },
    { id:'k012', type:'kanji', level:'N4', jp:'暗', furi:'くら/あん', romaji:'kura/an', en:'dark', pos:'kanji', example:{ jp:'暗い部屋', en:'a dark room' }, tags:['light'] },
    { id:'k013', type:'kanji', level:'N4', jp:'強', furi:'つよ/きょう', romaji:'tsuyo/kyou', en:'strong', pos:'kanji', example:{ jp:'強い人', en:'a strong person' }, tags:['character'] },
    { id:'k014', type:'kanji', level:'N4', jp:'弱', furi:'よわ/じゃく', romaji:'yowa/jaku', en:'weak', pos:'kanji', example:{ jp:'弱い風', en:'a weak wind' }, tags:['character'] },
  ],

  grammar: [
    { id:'g001', type:'grammar', level:'N5', jp:'〜は〜です', furi:'', romaji:'~wa ~desu', en:'[topic] is [noun/adj]', pos:'grammar', example:{ jp:'私は学生です', en:'I am a student' }, tags:['basic'] },
    { id:'g002', type:'grammar', level:'N5', jp:'〜が〜', furi:'', romaji:'~ga~', en:'Subject marker', pos:'grammar', example:{ jp:'猫が好きです', en:'I like cats' }, tags:['particles'] },
    { id:'g003', type:'grammar', level:'N5', jp:'〜に行く', furi:'〜にいく', romaji:'~ni iku', en:'go to [place]', pos:'grammar', example:{ jp:'東京に行く', en:'go to Tokyo' }, tags:['movement'] },
    { id:'g004', type:'grammar', level:'N4', jp:'〜ている', furi:'〜ている', romaji:'~te iru', en:'currently doing / is in state of', pos:'grammar', example:{ jp:'本を読んでいる', en:'(I) am reading a book' }, tags:['aspect'] },
    { id:'g005', type:'grammar', level:'N4', jp:'〜ために', furi:'〜ために', romaji:'~tame ni', en:'in order to, for the purpose of', pos:'grammar', example:{ jp:'合格するために勉強する', en:'study in order to pass' }, tags:['purpose'] },
    { id:'g006', type:'grammar', level:'N4', jp:'〜なければならない', furi:'', romaji:'~nakereba naranai', en:'must do, have to', pos:'grammar', example:{ jp:'行かなければならない', en:'(I) have to go' }, tags:['obligation'] },
    { id:'g007', type:'grammar', level:'N3', jp:'〜によって', furi:'〜によって', romaji:'~ni yotte', en:'depending on, due to, by means of', pos:'grammar', example:{ jp:'状況によって変わる', en:'changes depending on the situation' }, tags:['cause'] },
    { id:'g008', type:'grammar', level:'N3', jp:'〜に対して', furi:'〜にたいして', romaji:'~ni taishite', en:'towards, against, in contrast to', pos:'grammar', example:{ jp:'問題に対して対応する', en:'respond to a problem' }, tags:['contrast'] },
  ],

  phrases: [
    { id:'p001', type:'phrases', level:'N5', jp:'ありがとうございます', furi:'', romaji:'arigatou gozaimasu', en:'Thank you very much', pos:'expression', example:{ jp:'お世話になりました。ありがとうございます。', en:'You\'ve been a great help. Thank you.' }, tags:['polite','daily'] },
    { id:'p002', type:'phrases', level:'N5', jp:'すみません', furi:'', romaji:'sumimasen', en:'Excuse me / I\'m sorry', pos:'expression', example:{ jp:'すみません、トイレはどこですか？', en:'Excuse me, where is the restroom?' }, tags:['polite','daily'] },
    { id:'p003', type:'phrases', level:'N5', jp:'〜はどこですか', furi:'〜はどこですか', romaji:'~wa doko desu ka', en:'Where is [place]?', pos:'expression', example:{ jp:'駅はどこですか', en:'Where is the station?' }, tags:['navigation'] },
    { id:'p004', type:'phrases', level:'N4', jp:'お疲れ様です', furi:'おつかれさまです', romaji:'otsukaresama desu', en:'Good work, You\'ve worked hard', pos:'expression', example:{ jp:'お疲れ様でした！今日は大変でしたね。', en:'Good work today! It was tough, wasn\'t it.' }, tags:['work','polite'] },
    { id:'p005', type:'phrases', level:'N4', jp:'よろしくお願いします', furi:'よろしくおねがいします', romaji:'yoroshiku onegaishimasu', en:'Please treat me well / I\'m in your care', pos:'expression', example:{ jp:'初めまして、よろしくお願いします', en:'Nice to meet you, I\'m in your care.' }, tags:['polite','social'] },
    { id:'p006', type:'phrases', level:'N3', jp:'お邪魔します', furi:'おじゃまします', romaji:'ojama shimasu', en:'Sorry to intrude (entering someone\'s home)', pos:'expression', example:{ jp:'お邪魔します！', en:'Sorry to intrude!' }, tags:['etiquette','visiting'] },
  ]
};

// Flat list of all cards
const ALL_CARDS = [
  ...CARDS.vocab, ...CARDS.kanji, ...CARDS.grammar, ...CARDS.phrases
];

// Get cards filtered by level and type
function getCards(type = 'all', level = 'all') {
  let cards = type === 'all' ? ALL_CARDS : CARDS[type] || [];
  if (level !== 'all') cards = cards.filter(c => c.level === level);
  return cards;
}

// Quiz distractors — wrong answers from same type
function getDistractors(card, count = 3) {
  const pool = getCards(card.type, 'all').filter(c => c.id !== card.id);
  const shuffled = pool.sort(() => Math.random() - .5);
  return shuffled.slice(0, count).map(c => c.en);
}

export { CARDS, ALL_CARDS, getCards, getDistractors };
