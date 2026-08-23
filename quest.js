(function(root){
  "use strict";
  const CORE_ATTRIBUTES=["light","warmth","dream","eerie","comfort","memory"];
  const SPEECH_PROFILES=Object.freeze({
    child:{sentenceLength:"short",tone:"hesitant",habits:["嗯……","有点","我怕"],intents:{TOO_DARK:["这里有点暗。","这盏灯是不是小了点？","晚上住这儿，我可能还是看不清。"],TOO_EERIE:["等等……这屋里是不是有什么？","这个光怎么怪怪的？","我总觉得背后有人……"],COMFORTABLE:["这个看着软软的。","这里暖暖的，我没那么怕了。","嗯……待着还挺安心的。"],ACCEPTED:["今晚我就住这间吧。","这样的话，我应该敢一个人睡。","好，我想住这里。"],REJECTED:["算了，我还是有点怕。","这个房间我不敢睡……","我能不能换一间？"]}},
    "oddity-lover":{sentenceLength:"short",tone:"excited",habits:["诶！","有意思","再怪点"],intents:{TOO_ORDINARY:["嗯？这也太正常了。","普通客房我可不想住。","就这些？没劲。"],STRANGE_GOOD:["诶，这个有意思！","对，就是这种怪东西。","这个我没见过，挺好！"],ACCEPTED:["今晚就给我这间！","行，我住这儿。","别动了，这样正好。"],REJECTED:["算了，这间没什么意思。","我还是去找点怪的吧。","这可不像你们旅店该有的房间。"]}},
    insomniac:{sentenceLength:"medium",tone:"tired",habits:["嗯……","算了","我这几天"],intents:{TOO_BRIGHT:["这灯还是太亮了。","我一躺下，肯定会一直盯着这光。","能再暗一点吗？眼睛累。"],TOO_NOISY:["那个声音一直响，我听着烦。","这滴答声一晚上都不停吧？","太吵了，我脑子更清醒了。"],RESTFUL:["这个亮度可以。","躺下来以后，眼睛没那么累。","嗯……这里总算安静点了。"],ACCEPTED:["今晚应该能睡。","行，我先住下试试。","嗯……就这间吧。"],REJECTED:["我可能还是换一间吧。","算了，我今晚真受不了这个。","这间我睡不着。"]}},
    elder:{sentenceLength:"medium",tone:"reflective",habits:["以前","嗯……","说到一半会停一下"],intents:{FAMILIAR:["这个……有点像我以前家里的东西。","嗯，看到它就想起以前了。","这旧样子挺好，别换新的。"],UNFAMILIAR:["都太新了，住着有点生。","还少点以前的味道。","我看了半天，没想起什么。"],ACCEPTED:["好，我今晚就在这儿歇下。","这间挺好，让我慢慢待一晚。","嗯……就住这里吧。"],REJECTED:["还是算了，我换一间看看。","这里住着不像从前。","我今晚大概住不惯。"]}},
    mechanic:{sentenceLength:"short",tone:"precise",habits:["先看结构","直接","少废话"],intents:{ORDERLY:["灯够亮，东西也摆得利落。","这个装置运转得挺稳。","行，没什么多余的。"],DISORDERED:["东西太杂了。","这个装置放这儿没用。","先把会响的和会亮的分清楚。"],ACCEPTED:["可以，我住这间。","检查完了，没问题。","行，就这样。"],REJECTED:["不行，换一间。","这间住着只会让我烦。","先整理好再叫我。"]}},
    dreamwalker:{sentenceLength:"medium",tone:"dreamy",habits:["嗯……","像是","话说得很轻"],intents:{DREAMY:["嗯……像是已经睡着了一半。","月光落进来以后，墙好像远了。","这里怪怪的……像我刚睡醒。"],TOO_CLEAR:["这里太清楚了。","梦还没进来。","墙都在原来的地方，我睡不进去。"],ACCEPTED:["别叫醒我……今晚就这里。","嗯，我住下了。","把门轻一点关上。"],REJECTED:["还不行，我在这里睡不着。","这不是我要找的那一晚。","等房间做完梦，再来叫我。"]}},
    "cold-guest":{sentenceLength:"short",tone:"urgent",habits:["冷死了","快一点","直说"],intents:{WARM_ENOUGH:["啊，终于暖起来了！","手指没那么僵了。","这个暖气挺顶用。"],TOO_COLD:["还是冷。","我站这么近都没觉得热。","这被子看着就不保暖。"],ACCEPTED:["行，我今晚住这间。","别开窗，我就住下了。","好，这间够暖。"],REJECTED:["不行，我得换个暖和点的。","这间我一晚上都得发抖。","算了，我还是去找火炉吧。"]}},
    mystery:{sentenceLength:"medium",tone:"cryptic",habits:["停顿","不解释","像在自言自语"],intents:{THRESHOLD:["门后有声音。不是现在的声音。","嗯……这次门认得我。","今晚，路会从这里经过。"],NOT_THRESHOLD:["还没有。它只是一扇门。","这里什么都没想起来。","入口不在这间客房里。"],ACCEPTED:["钥匙不用还我。今晚我住下。","够了。请把门关上。","这一晚，就从这里开始。"],REJECTED:["不必了。我去别处等。","今晚，这扇门不会开。","这间房还留不住我。"]}},
    default:{sentenceLength:"medium",tone:"natural",habits:["嗯……","有点"],intents:{CONFUSED:["这个……放我房间里干嘛的？","我有点没看懂。","这些东西是不是放得太杂了？"],ANGRY:["你是不是根本没听我刚才说什么？","我说的不是这个。","算了，先别让我住进去。"],UNCOMFORTABLE:["待着还是有点不舒服。","我躺下来估计会一直翻身。","这儿让我放松不下来。"],ACCEPTED:["这个还行，我住下了。","嗯，今晚就这里吧。","好，我想住这间。"],REJECTED:["算了，我还是换一间吧。","这间我就不住了。","不好意思，我住不下。"]}}
  });
  const SPEECH_STYLES=SPEECH_PROFILES;
  const {TAG_META={},normalizeItemTags=(tags=[])=>[...new Set(tags||[])]}=root.REACTOR_DATA||{};
  const stats=(values={})=>Object.fromEntries(CORE_ATTRIBUTES.map(key=>[key,Math.max(0,Math.min(5,Number(values[key])||0))]));
  const validateRange=(value,context)=>{const number=Number(value);if(!Number.isFinite(number)||number<0||number>5)throw new RangeError(`${context} must be between 0 and 5; received ${value}`);return number};
  const rules=(value={},context="rules")=>Object.fromEntries(Object.entries(value).map(([key,rule])=>{if(!CORE_ATTRIBUTES.includes(key))throw new TypeError(`${context} contains unsupported roomStat: ${key}`);return[key,Object.fromEntries(Object.entries(rule).map(([bound,amount])=>[bound,validateRange(amount,`${context}.${key}.${bound}`)]))]}));
  const normalizeTagList=(tags=[])=>Object.freeze(normalizeItemTags(tags));
  const template=(id,title,dialogue,difficulty,requiredStats,preferredStats={},dislikedStats={},inspectionTags=[],options={})=>Object.freeze({
    id,day:options.day||1,title,dialogue,difficulty,requiredStats:rules(requiredStats,`${id}.requiredStats`),preferredStats:rules(preferredStats,`${id}.preferredStats`),dislikedStats:rules(dislikedStats,`${id}.dislikedStats`),inspectionTags:normalizeTagList(inspectionTags),
    requiredItemTags:normalizeTagList(options.requiredItemTags||options.requiredRoomTags||[]),preferredItemTags:normalizeTagList(options.preferredItemTags||[]),dislikedItemTags:normalizeTagList(options.dislikedItemTags||[]),
    minDistinctComponents:Math.max(1,Number(options.minDistinctComponents)||1),minCompositionCategories:Math.max(1,Number(options.minCompositionCategories)||1),preferredRecipeDepth:Math.max(0,Number(options.preferredRecipeDepth)||0),specialCompletionRule:options.specialCompletionRule||null
  });
  const npc=(definition)=>Object.freeze({...definition,speechProfile:Object.freeze(definition.speechProfile||SPEECH_PROFILES[definition.id]||SPEECH_PROFILES.default),speechStyle:Object.freeze(definition.speechProfile||SPEECH_PROFILES[definition.id]||SPEECH_PROFILES.default),tagReactions:Object.freeze(definition.tagReactions||{}),preferences:stats(definition.preferences),dislikes:stats(definition.dislikes),requestPool:Object.freeze(definition.requestPool)});
  const npcDatabase=Object.freeze([
    npc({id:"child",name:"怕黑的小孩",visualType:"child",personality:"谨慎、怕黑，但很容易被温暖的东西安慰。",preferences:{light:5,comfort:5,warmth:3},dislikes:{eerie:5},dialogueStyle:"短句、犹豫，会反复说“有点”",reward:{elementId:"star",label:"星星"},requestPool:[template("safe-night","今晚别太黑","我有点怕黑……晚上能给我留盏灯吗？别一闪一闪的，我会更怕。",1,{light:{min:3},comfort:{min:2}},{warmth:{min:1}},{eerie:{min:3}},["lighting"]),template("soft-corner","亮一点的床边","床边亮一点就行。嗯……最好也暖和一点，我一个人睡会安心些。",2,{light:{min:2},comfort:{min:3}},{warmth:{min:2},comfort:{min:1}},{eerie:{min:4}},["lighting","soft"])]}),
    npc({id:"oddity-lover",name:"怪东西爱好者",visualType:"oddity",personality:"厌倦普通事物，喜欢无法立刻解释的客房。",preferences:{eerie:5,dream:4,memory:3},dislikes:{comfort:1},dialogueStyle:"语速快、直接、爱感叹",reward:{elementId:"cloud",label:"云"},requestPool:[template("strange-room","别给我普通客房","普通房间就别给我了，没意思。你们这儿不是有怪东西吗？给我整点特别的！",2,{eerie:{min:2},dream:{min:2}},{memory:{min:1}},{},["eerie","dream"]),template("haunted-memory","像梦又像旧事","我想住一晚奇怪的。最好像做梦，又像翻到别人忘下的旧东西。",3,{eerie:{min:2},memory:{min:2}},{dream:{min:2}},{light:{min:5}},["memory","eerie"])]}),
    npc({id:"insomniac",name:"失眠的人",visualType:"insomniac",personality:"疲惫、敏感，尤其受强光与机械声影响。",preferences:{comfort:5,dream:3},dislikes:{light:4},dialogueStyle:"疲惫、话少、会停顿和抱怨",reward:{elementId:"feather",label:"羽毛"},requestPool:[template("quiet-bedroom","今晚想睡一觉","我这几天都没睡好。今晚安静一点就行……哦对，别放一直响的东西。",2,{comfort:{min:3}},{dream:{min:2}},{light:{min:5},eerie:{min:4}},["soft","furniture"],{dislikedItemTags:["noise","mechanical_noise"]}),template("dim-rest","灯别太亮","灯别太亮，我眼睛累。床舒服一点，其他的……算了，安静就行。",3,{comfort:{min:4},light:{max:4}},{dream:{min:2}},{eerie:{min:4}},["dream","soft"],{dislikedItemTags:["noise","mechanical_noise","harsh_light"]})]}),
    npc({id:"elder",name:"怀旧老人",visualType:"elder",personality:"温和、健谈，会从旧物和光线里寻找过去。",preferences:{memory:5,warmth:3,comfort:3},dislikes:{},dialogueStyle:"语速慢、常说以前、说到一半会停",reward:{elementId:"old-paper",label:"旧纸"},requestPool:[template("old-room","住着像以前","现在这些旅店都弄得太新了。你这儿有没有……旧一点的客房？",2,{memory:{min:3}},{warmth:{min:2},comfort:{min:2}},{eerie:{min:5}},["memory","furniture","wall"]),template("memory-corner","留点旧痕迹","不用崭新。我以前家里有面老镜子……差不多那种感觉，就行。",3,{memory:{min:4},comfort:{min:1}},{warmth:{min:1},comfort:{min:2}},{eerie:{min:5}},["memory","calm"])]}),
    npc({id:"mechanic",name:"机械迷",visualType:"mechanic",personality:"讲究结构、动力与清晰秩序。",preferences:{light:5,comfort:2},dislikes:{dream:5},dialogueStyle:"精确、干脆、不说多余的话",reward:{elementId:"gear",label:"齿轮"},requestPool:[template("bright-lab","灯亮，装置要稳","给我一间亮点的客房。装置要能正常运转，别摆一堆没用的。",2,{light:{min:3},comfort:{min:1}},{light:{min:4}},{dream:{min:4}},["mechanical","lighting"],{requiredRoomTags:["mechanical"]}),template("machine-order","别让东西乱响","有齿轮可以，但要安静、整齐。晚上乱响的东西都拿走。",3,{light:{min:2},comfort:{min:1}},{light:{min:3}},{dream:{min:5}},["mechanical","wall"],{requiredRoomTags:["mechanical"]})]}),
    npc({id:"dreamwalker",name:"梦游者",visualType:"dreamwalker",personality:"安静而恍惚，把客房当作梦的入口。",preferences:{dream:5,comfort:4},dislikes:{},dialogueStyle:"含混、诗意、像在自言自语",reward:{elementId:"crystal",label:"晶体"},requestPool:[template("live-in-dream","今晚别叫醒我","我想睡进一个梦里。床要软……墙最好别离我太近。",3,{dream:{min:5},comfort:{min:3}},{comfort:{min:2}},{eerie:{min:5}},["dream","atmosphere"]),template("moon-dream","月光落进梦里","留一点月光，再放些雾。今晚我想忘记自己醒着。",3,{dream:{min:5}},{comfort:{min:3}},{eerie:{min:4}},["dream","lighting","soft"])]}),
    npc({id:"cold-guest",name:"怕冷的人",visualType:"cold",personality:"总在发抖，最在意持续的暖意和舒适。",preferences:{warmth:5,comfort:5,light:2},dislikes:{dream:1},dialogueStyle:"急切、直白、总催着快一点",reward:{elementId:"seed",label:"种子"},requestPool:[template("warm-place","先把客房弄暖","外面冷死了。快给我一间暖和的，地板也别冰脚。",2,{warmth:{min:4},comfort:{min:2}},{light:{min:1}},{eerie:{min:5}},["warm","furniture","floor"]),template("warm-rest","要能暖一整晚","光有火还不够，我得在里面睡一晚。床和地板都暖点，拜托。",3,{warmth:{min:5},comfort:{min:3}},{light:{min:1}},{eerie:{min:5}},["warm","comfort"])]}),
    npc({id:"mystery",name:"神秘客人",visualType:"mystery",personality:"不解释来历，只用隐喻描述今晚要住的地方。",preferences:{eerie:4,dream:4,memory:4},dislikes:{light:2},dialogueStyle:"隐晦、克制、常常停顿",reward:{elementId:"key",label:"钥匙"},requestPool:[template("threshold","今晚要经过一扇门","我不只是来睡觉。给我一间……像是能跨到别处的客房。",4,{eerie:{min:2},dream:{min:2},memory:{min:2}},{comfort:{min:1}},{light:{min:5}},["door","eerie","memory"],{requiredItemTags:["door"]}),template("forgotten-gate","别问门通向哪里","不要问门通向哪里。让它看起来像很久没人打开过，就够了。",4,{eerie:{min:3},memory:{min:3}},{dream:{min:2}},{light:{min:5}},["door","memory","eerie"],{requiredItemTags:["door"]})]})
  ]);
  const dayTemplate=(day,id,title,dialogue,difficulty,required,preferred={},disliked={},options={})=>template(id,title,dialogue,difficulty,required,preferred,disliked,options.inspectionTags||[],{...options,day});
  const DAY_REQUEST_POOLS=Object.freeze({
    child:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"child-d2-comfort-light","灯亮了，床边也要舒服","上次那盏灯还挺好的。不过床边还是空空的……今晚能不能舒服一点？",2,{light:{min:3},comfort:{min:3}},{warmth:{min:1}},{eerie:{min:4}},{requiredItemTags:["light_source"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"child-d2-soft-sleep","想要柔和的床边光","别弄得太怪。我想要柔和一点的灯，还有能让我安心躺下的东西。",2,{light:{min:2},comfort:{min:3}},{dream:{min:2}},{eerie:{min:3}},{requiredItemTags:["light_source","bed"],dislikedItemTags:["spiritual"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"child-d3-bedside-safe","床边要看得清","我想在床边看得清，躺下来也别冷冰冰的。屋里不要有那种怪怪的光。",3,{light:{min:3},comfort:{min:4}},{warmth:{min:2}},{eerie:{min:3}},{requiredItemTags:["light_source","bed"],dislikedItemTags:["spiritual"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"child-d3-gentle-dream","亮着一点，慢慢睡着","今晚我想做个好梦。灯别刺眼，床也软一点，这样我就不会一直醒着了。",3,{light:{min:2},comfort:{min:4},dream:{min:3}},{warmth:{min:1}},{eerie:{min:3}},{requiredItemTags:["light_source","bed"],dislikedItemTags:["harsh_light","spiritual"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2})
      ])
    }),
    "oddity-lover":Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"oddity-d2-strange-door","门后最好别太正常","给我留扇奇怪的门。门后像梦也行，像黑洞也行，反正别太普通。",2,{eerie:{min:2},dream:{min:2}},{memory:{min:1}},{},{requiredItemTags:["door"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"oddity-d2-weird-display","给我一个解释不了的角落","墙上或桌上放点奇怪的吧。我想进门就看见一个解释不了的东西。",2,{eerie:{min:2},memory:{min:2}},{dream:{min:2}},{},{requiredItemTags:["decoration"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"oddity-d3-spirit-gate","有什么在门后","这次我要真怪一点的。门后得像有什么，屋里还要留下一点旧事。",3,{eerie:{min:3},dream:{min:2},memory:{min:2}},{},{light:{min:5}},{requiredItemTags:["spiritual","door"],dislikedItemTags:["harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"oddity-d3-haunted-mirror","镜子里的东西不太对","有没有那种镜子？照进去像是自己，但又好像少了点什么。",3,{eerie:{min:3},memory:{min:3}},{dream:{min:2}},{light:{min:5}},{requiredItemTags:["spiritual","mirror"],dislikedItemTags:["harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2})
      ])
    }),
    insomniac:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"insomniac-d2-real-bed","今晚先给我一张能睡的床","床舒服点就行。还有……别给我放会一直响的东西，我真的受不了。",2,{comfort:{min:4},dream:{min:2}},{},{light:{min:5},eerie:{min:4}},{requiredItemTags:["bed"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"insomniac-d2-dim-bed","床要软，光要暗","我只想躺下就睡。床软一点，光压低一点，其他声音都别来找我。",2,{comfort:{min:4},light:{max:4}},{dream:{min:3}},{eerie:{min:4}},{requiredItemTags:["bed","dim_light"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"insomniac-d3-quiet-dream","让整间屋安静下来","昨晚差点睡着。今天把床留下，再让整间屋慢一点……什么都别响。",3,{comfort:{min:4},dream:{min:4}},{},{light:{min:5},eerie:{min:4}},{requiredItemTags:["bed","atmosphere"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"insomniac-d3-night-routine","灯、床和安静的夜晚","给我一点看得见的柔光，一张床，再把屋里那些乱七八糟的声音压下去。",3,{comfort:{min:4},dream:{min:3},light:{min:1,max:4}},{},{eerie:{min:4}},{requiredItemTags:["bed","light_source","atmosphere"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2})
      ])
    }),
    elder:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"elder-d2-old-comfort","旧东西留下，住着也舒服","旧东西我喜欢，但人上了年纪，坐着躺着也得舒服些。",2,{memory:{min:3},comfort:{min:3}},{warmth:{min:1}},{eerie:{min:5}},{requiredItemTags:["memory_object"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"elder-d2-clock-memory","钟走着，旧事也在走","有个钟也好。别太吵，让我听着它，慢慢想点以前的事。",2,{memory:{min:4},comfort:{min:1}},{warmth:{min:1}},{eerie:{min:5}},{requiredItemTags:["memory_object"],preferredItemTags:["clock"],dislikedItemTags:["mechanical_noise"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"elder-d3-memory-wall","墙上要有能认出来的旧东西","房间里留一个能认出来的角落吧。镜子、信、旧桌子都行，别把它们弄得太吵。",3,{memory:{min:4},comfort:{min:2}},{warmth:{min:2}},{eerie:{min:5}},{requiredItemTags:["memory_object","decoration"],dislikedItemTags:["mechanical_noise"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"elder-d3-clock-corner","一个会走的旧角落","摆一个钟，再留点旧物。它可以走，但别叫得整间屋都是声音。",3,{memory:{min:4},comfort:{min:2}},{warmth:{min:1}},{eerie:{min:5}},{requiredItemTags:["memory_object","clock"],dislikedItemTags:["mechanical_noise"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2})
      ])
    }),
    mechanic:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"mechanic-d2-separate-light","灯和机械都要有","一盏灯不算一间有装置的客房。照明留着，再给我一个真正的机械东西。",2,{light:{min:3},comfort:{min:1}},{},{dream:{min:4}},{requiredItemTags:["mechanical","light_source"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"mechanic-d2-observation","让装置能看清楚","我要看清它怎么运转。灯光给够，再放个能观察结构的东西。",2,{light:{min:3},comfort:{min:1}},{},{dream:{min:4}},{requiredItemTags:["mechanical","observation","light_source"],dislikedItemTags:["mechanical_noise"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"mechanic-d3-stable-room","装置、灯和落脚处","装置要运转，灯要稳，脚下也别乱。机械归机械，一直响可不算做得好。",3,{light:{min:3},comfort:{min:2}},{},{dream:{min:4}},{requiredItemTags:["mechanical","light_source","floor"],dislikedItemTags:["noise","mechanical_noise"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2}),
        dayTemplate(3,"mechanic-d3-signal-room","给我一间能读取信号的客房","我想试一个能读信号的装置。照明不能少，但多余的噪声全部拿走。",3,{light:{min:3},comfort:{min:2}},{},{dream:{min:4}},{requiredItemTags:["mechanical","observation","light_source"],dislikedItemTags:["noise","mechanical_noise"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:2})
      ])
    }),
    dreamwalker:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"dreamwalker-d2-bed-and-dream","床在这里，梦也要在","先给我一张床。然后让梦从房间的别处慢慢进来……别让它发出声音。",2,{dream:{min:5},comfort:{min:3}},{},{eerie:{min:5}},{requiredItemTags:["bed","dream_object"],dislikedItemTags:["noise"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"dreamwalker-d2-fog-sleep","躺下后，房间要慢慢消失","床留着。再放一点雾或月色，让墙边慢慢看不清。",2,{dream:{min:5},comfort:{min:3}},{},{eerie:{min:5}},{requiredItemTags:["bed","atmosphere"],dislikedItemTags:["noise"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"dreamwalker-d3-window-dream","梦要从窗外进来","床留在里面，窗也留一扇。今晚让雾从窗外进来，别把我吵醒。",3,{dream:{min:5},comfort:{min:3}},{},{eerie:{min:4}},{requiredItemTags:["bed","atmosphere","window"],dislikedItemTags:["noise","mechanical_noise"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2}),
        dayTemplate(3,"dreamwalker-d3-moon-room","床、月光和一间正在做梦的房","我要躺下，看见一点月光，再让整间屋轻轻地做梦。",3,{dream:{min:5},comfort:{min:4},light:{min:1,max:4}},{},{eerie:{min:4}},{requiredItemTags:["bed","atmosphere","light_source"],dislikedItemTags:["noise","harsh_light"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2})
      ])
    }),
    "cold-guest":Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"cold-d2-warm-floor","屋里暖，脚下也要暖","暖和点倒是其次，我最怕半夜脚底一落地就冰。取暖的和地板都给我安排上。",2,{warmth:{min:4},comfort:{min:3}},{light:{min:1}},{eerie:{min:5}},{requiredItemTags:["heater","floor"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"cold-d2-all-night","这股暖意要留一整晚","别只热一会儿。火边要暖，地上也得能落脚，我可不想裹着被子跳路。",2,{warmth:{min:5},comfort:{min:3}},{light:{min:1}},{eerie:{min:5}},{requiredItemTags:["heater","floor"],dislikedItemTags:["cold"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"cold-d3-complete-warmth","火、地板和一盏灯","屋里要暖，脚下不能冰，晚上起来还得看得见路。这回可别少一样。",3,{warmth:{min:5},comfort:{min:4},light:{min:2}},{},{eerie:{min:5}},{requiredItemTags:["heater","floor","light_source"],dislikedItemTags:["cold"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2}),
        dayTemplate(3,"cold-d3-no-cold-draft","整间屋都要暖起来","别让暖气只缩在一个角落。地上、灯下、我坐的地方都要暖，冷风一点都别来。",3,{warmth:{min:5},comfort:{min:4},light:{min:2}},{},{eerie:{min:5}},{requiredItemTags:["heater","floor","light_source"],dislikedItemTags:["cold","noise"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2})
      ])
    }),
    mystery:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"mystery-d2-memory-door","门要记得它曾通向哪里","今晚的门不能是新的。让它记得一些事，或者在旁边留一件会记得的东西。",3,{eerie:{min:2},memory:{min:3}},{dream:{min:1}},{light:{min:5}},{requiredItemTags:["door","memory_object"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"mystery-d2-dreaming-gate","找一扇做过梦的门","门要在。旧事也要在。再让它看起来……像是曾经做过一个梦。",3,{eerie:{min:2},memory:{min:2},dream:{min:2}},{},{light:{min:5}},{requiredItemTags:["door","memory_object"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"mystery-d3-door-in-fog","让路在雾里出现","把门留在那里。再让一层氛围把它藏住一半。我要记得来路，却不必看清前面。",4,{eerie:{min:3},dream:{min:3},memory:{min:3},light:{max:4}},{},{},{requiredItemTags:["door","atmosphere"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"mystery-d3-locked-threshold","有些门要在梦里锁上","今晚的门要能锁上。给它一点梦，一点记忆，再留一层让人看不透的气息。",4,{eerie:{min:3},dream:{min:3},memory:{min:3},light:{max:4}},{},{},{requiredItemTags:["door","atmosphere","lock"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:2})
      ])
    })
  });
  const requestPoolForDay=(npc,day=1)=>day===1?npc.requestPool:(DAY_REQUEST_POOLS[npc.id]?.[Math.min(3,Math.max(2,day))]||npc.requestPool);
  const TAG_REACTION_POOLS=Object.freeze({
    child:{light_source:["有灯的话，我就能看清了。","这边亮起来了。"],dim_light:["这个光软软的，不会晃眼睛。","留这么一点亮就好。"],bed:["这个看着软软的。","我应该敢在这里躺下了。"],soft:["摸起来软一点，我就没那么紧张。"],dream_object:["这个会把坏梦挡在外面吗？"],spiritual:["这个里面是不是有什么？","我不太想靠近这个。"],harsh_light:["太亮了，眼睛有点痛。"]},
    "oddity-lover":{door:["这扇门后面看着就不对劲，有意思。"],spiritual:["这个味道对了，再怪点也行。"],mirror:["镜子里看起来和外面不太一样。"],observation:["它也在看我？这个不错。"],memory_object:["像是别人落下的旧东西。"],atmosphere:["屋里的空气都不太正常了。"],dream_object:["这东西像是从梦里掉出来的。"],decoration:["一进门就看到这个，够怪。"]},
    insomniac:{noise:["这东西晚上也会一直响吗？","这个声音……我听着就睡不着。","要不还是把它拿出去吧。"],mechanical_noise:["这个一启动，我今晚就别想睡了。"],clock:["这个晚上也会滴答滴答吗？","指针能不能停一晚？"],bed:["这个床看着还行。","嗯……至少躺着应该挺舒服。","这个我倒是挺想试试。"],dim_light:["这个亮度可以，闭上眼不会还在晃。","灯这样暗一点就好。"],harsh_light:["这个也太亮了。","晚上一直这么亮，我肯定睡不着。"],atmosphere:["屋里慢下来了一点。"],dream_object:["这个放床边，也许能让我少醒几次。"],fog:["这个倒挺安静的……就是有点看不清。"],cold:["有点凉，我睡着以后可能会醒。"],spiritual:["它待在旁边，我反而更清醒了。"]},
    elder:{memory_object:["这个……让我想起以前了。","旧东西有旧东西的好。"],mirror:["我以前家里也有这样一面镜子。"],clock:["这个声音慢慢的，像以前。"],noise:["响一两声还好，一直响就扰人了。"],mechanical_noise:["现在的东西怎么都这么吵。"],decoration:["这个角落留着吧，别换新的。"],atmosphere:["屋里的气味，倒有点像从前。"]},
    mechanic:{mechanical:["先别动，我要看看里面怎么接的。","这个结构还能再收紧一点。","动力传到这里，思路是对的。"],noise:["机械归机械，一直响可不算做得好。","能动是能动，没必要一直响吧。"],mechanical_noise:["振动没收住，这不叫稳定。"],light_source:["照明够了，接缝都看得清。"],observation:["它能记录东西？把读数给我看看。","扫描范围有多大？"],clock:["这个齿轮怎么走的？","擒纵结构还算干净。"],lock:["锁舌做得不差，咬合还可以。"],door:["门轴有点松，不过结构能用。"],memory_object:["旧归旧，先看它还能不能运转。"],spiritual:["我看不见传动结构，它到底怎么动的？"]},
    dreamwalker:{bed:["躺下以后，梦就会近一点。"],atmosphere:["墙边开始变远了。"],dream_object:["它把醒着的声音压低了。","这个梦还没有完全散掉。"],fog:["雾进来了……很好。"],window:["梦可以从这扇窗进来。"],noise:["这个声音会把我拉回来。"],light_source:["留一点光，但别让它太清醒。"]},
    "cold-guest":{heater:["这个热乎多了。","嗯，这个放屋里应该挺暖。"],fire:["火别灭，今晚就靠它了。"],floor:["这个踩起来应该没那么冰。","总算不是那种冷冰冰的地面了。"],cold:["这个别放我屋里，我看着都冷。","怎么感觉比刚才还冷了……"],light_source:["晚上起来至少看得见路。"],soft:["这个看着能挡一点冷气。"]},
    mystery:{door:["嗯……至少门在这里。","这扇门还可以。","别问我要去哪。"],lock:["这个锁有点意思。","有些门，最好确实锁上。"],observation:["你为什么要让它一直看着这里？","……这个东西不需要。"],memory_object:["它记得的事，比你以为的多。"],atmosphere:["路开始看不清了。"],dream_object:["梦会替门记住另一边。"],spiritual:["门后的东西已经靠近了。"]}
  });
  const NPC_STATES=Object.freeze(["ENTERING","REQUESTING","BUILDING","PREVIEW_ENTER","WAITING","WALKING_TO_ROOM","INSPECTING","REACTING","WAITING_FOR_CONFIRMATION","LEAVING"]);
  const NPC_EMOTIONS=Object.freeze(["NEUTRAL","HAPPY","RELAXED","SURPRISED","CONFUSED","SCARED","ANGRY","DISAPPOINTED"]);
  const SPECIAL_REACTIONS=Object.freeze({
    child:Object.freeze({
      "soul-fire":Object.freeze({emotion:"SCARED",line:"等等……这个灯里面是不是有什么东西？",reason:"魂灯的幽光让孩子害怕"}),
      "moon-lamp":Object.freeze({emotion:"RELAXED",line:"这个像月光一样，我还挺喜欢的。",reason:"柔和月光让孩子放松"}),
      "electric-lamp":Object.freeze({emotion:"HAPPY",line:"这个亮度刚刚好！",reason:"稳定亮光给了孩子安全感"}),
      "dream-bed":Object.freeze({emotion:"SURPRISED",line:"这张床好像在做梦……我得先看看里面有没有怪东西。",reason:"梦床让孩子好奇又有些犹豫"}),
      "cloud-bed":Object.freeze({emotion:"RELAXED",line:"这个软软的，我躺下应该就不怕了。",reason:"云床柔软稳定，让孩子安心"}),
      "bone-armor":Object.freeze({emotion:"SCARED",line:"等等，墙上为什么挂着骨头？",reason:"骨甲的外形让孩子害怕"})
    }),
    "oddity-lover":Object.freeze({
      "soul-fire":Object.freeze({emotion:"HAPPY",line:"这个不错，普通灯可没这个味道。",reason:"怪东西爱好者喜欢魂灯的异质感"}),
      "shadow-mirror":Object.freeze({emotion:"SURPRISED",line:"镜子里那个影子比我慢了半拍。",reason:"影镜带来了意外发现"}),
      "shadow-threshold":Object.freeze({emotion:"HAPPY",line:"对，就是这种不知道通向哪里的门。",reason:"影门符合奇异偏好"}),
      "dream-eye":Object.freeze({emotion:"SURPRISED",line:"它刚才是不是眨了一下？",reason:"梦眼引起了好奇"}),
      "dark-door":Object.freeze({emotion:"HAPPY",line:"一扇没有写通向哪里的门，这才对。",reason:"暗门符合奇异偏好"}),
      "bone-armor":Object.freeze({emotion:"HAPPY",line:"骨头和金属拼成墙甲？这个够怪，留着。",reason:"骨甲满足了怪异装饰偏好"})
    }),
    insomniac:Object.freeze({
      "mechanical-clock":Object.freeze({emotion:"DISAPPOINTED",line:"这个钟一直响，我大概更睡不着了。",reason:"机械钟的节律干扰休息"}),
      "mechanical-noise":Object.freeze({emotion:"ANGRY",line:"这个声音一晚不停的话，你还让我怎么睡？",reason:"机械噪声严重违背委托"}),
      "dream-bed":Object.freeze({emotion:"SURPRISED",line:"这张床会做梦？听着有点累，不过我可以试试。",reason:"梦床能引梦，但不够稳定"}),
      "cloud-bed":Object.freeze({emotion:"RELAXED",line:"这个托得挺稳……嗯，我想现在就躺下。",reason:"云床柔软稳定，适合睡眠"}),
      "moon-lamp":Object.freeze({emotion:"RELAXED",line:"这个光不刺眼，可以留着。",reason:"月灯光线柔和"}),
      "wind-chime":Object.freeze({emotion:"DISAPPOINTED",line:"它每响一下，我就会再醒一次。",reason:"风铃的声音干扰睡眠"})
    }),
    elder:Object.freeze({"memory-mirror":Object.freeze({emotion:"SURPRISED",line:"镜子里的光，像我以前家里那面。",reason:"记忆镜唤起了往事"}),"old-affection":Object.freeze({emotion:"RELAXED",line:"有些事过了很久，摸到还是暖的。",reason:"旧情带来温暖回忆"}),past:Object.freeze({emotion:"RELAXED",line:"嗯……就让过去在这里坐一会儿吧。",reason:"往昔氛围符合老人偏好"}),"echo-bell":Object.freeze({emotion:"SURPRISED",line:"这个回声，像老屋走廊里传过来的。",reason:"回声铃触发熟悉记忆"})}),
    mechanic:Object.freeze({"mechanical-clock":Object.freeze({emotion:"HAPPY",line:"齿轮节距还算准。",reason:"机械钟结构清晰"}),"mechanical-heart":Object.freeze({emotion:"SURPRISED",line:"它的节律是自己生成的？",reason:"机械心脏引发技术好奇"}),"electric-lamp":Object.freeze({emotion:"HAPPY",line:"供电稳，亮度也够。",reason:"电灯运转稳定"}),"gear-core":Object.freeze({emotion:"SURPRISED",line:"这个核心还差一个真正的负载。",reason:"齿轮核心具有扩展潜力"}),"rust-machine":Object.freeze({emotion:"CONFUSED",line:"它能动，但这些锈会让结构不稳。",reason:"锈蚀机结构不稳"})}),
    dreamwalker:Object.freeze({"dream-bed":Object.freeze({emotion:"RELAXED",line:"别叫我……床已经开始下沉了。",reason:"梦床引入睡意"}),"cloud-bed":Object.freeze({emotion:"RELAXED",line:"很软，可它只托住身体，还没有托住梦。",reason:"云床舒适但梦境感较弱"}),"dream-fog":Object.freeze({emotion:"RELAXED",line:"雾把墙放远了。",reason:"梦雾改变空间感"}),moonlight:Object.freeze({emotion:"HAPPY",line:"月光在地上，我在另一边。",reason:"月色符合梦境"}),"moon-dust":Object.freeze({emotion:"SURPRISED",line:"这些微光落下来以后，梦变得更近了。",reason:"月尘形成柔和的梦境线索"}),"fog-window":Object.freeze({emotion:"RELAXED",line:"窗外没有路了……这样正好。",reason:"雾窗模糊了现实边界"})}),
    "cold-guest":Object.freeze({fireplace:Object.freeze({emotion:"HAPPY",line:"啊，这个终于有点用了。",reason:"壁炉带来强暖意"}),"steam-heater":Object.freeze({emotion:"HAPPY",line:"暖气散得挺匀，这个不错。",reason:"蒸汽暖器持续取暖"}),steam:Object.freeze({emotion:"RELAXED",line:"这股热气要是能留久一点就好了。",reason:"蒸汽提供短暂暖意"}),"ice-wind":Object.freeze({emotion:"ANGRY",line:"你还把冰风放我房里？",reason:"冰风严重违背取暖需求"}),"wood-floor":Object.freeze({emotion:"RELAXED",line:"这个地面踩上去不会抽脚。",reason:"木地板减少冰冷感"}),"wet-sand":Object.freeze({emotion:"CONFUSED",line:"这地面不冰，可踩着湿漉漉的也不好受。",reason:"湿沙地保留了水汽和不适感"})}),
    mystery:Object.freeze({"memory-door":Object.freeze({emotion:"HAPPY",line:"这扇门记得我。",reason:"记忆之门回应了旅客"}),"shadow-threshold":Object.freeze({emotion:"RELAXED",line:"影子已经先过去了。",reason:"影门形成边界"}),"spirit-door":Object.freeze({emotion:"SURPRISED",line:"它今晚竟然是醒着的。",reason:"灵门产生意外回应"}),"shadow-lock":Object.freeze({emotion:"HAPPY",line:"有些东西确实不该跟着出来。",reason:"影锁封闭了边界"}),"signal-eye":Object.freeze({emotion:"CONFUSED",line:"把它的视线转开。",reason:"神秘客人不喜欢被观察"}),"bone-armor":Object.freeze({emotion:"RELAXED",line:"骨甲朝外。很好，门后的东西进不来。",reason:"骨甲形成了保护边界"})})
  });
  class NPCStateMachine{constructor(onChange=()=>{}){this.state="ENTERING";this.history=["ENTERING"];this.onChange=onChange}setState(next,detail={}){if(!NPC_STATES.includes(next))throw new Error(`Unknown NPC state: ${next}`);this.state=next;this.history.push(next);this.onChange(next,detail);return next}reset(){this.history=[];return this.setState("ENTERING")}}
  const satisfies=(value,rule)=>!(rule.min!==undefined&&value<rule.min)&&!(rule.max!==undefined&&value>rule.max);
  const countSatisfied=(rules,values)=>Object.entries(rules||{}).filter(([key,rule])=>satisfies(values[key]||0,rule)).length;
  const tagCount=(counts,tag)=>Number(counts?.[tag])||0;
  function evaluateRequestItem(request,item,roomStats={},roomTags=[],context={}){
    const requiredStats=request.requiredStats||{},preferredStats=request.preferredStats||{},dislikedStats=request.dislikedStats||{},roomTagCounts=context.roomTagCounts||Object.fromEntries(roomTags.map(tag=>[tag,1])),composition=context.roomComposition||{},components=context.components||[];
    const requiredTags=request.requiredItemTags||request.requiredRoomTags||[],preferredTags=request.preferredItemTags||[],dislikedTags=request.dislikedItemTags||[];
    const statsMet=countSatisfied(requiredStats,roomStats)===Object.keys(requiredStats).length,missingRequiredTags=requiredTags.filter(tag=>tagCount(roomTagCounts,tag)<1),tagRequirementsMet=missingRequiredTags.length===0;
    const meaningfulComponents=components.filter(component=>calculateComponentRelevance(component,request)>=.25),distinctComponents=meaningfulComponents.length||(!components.length&&item?1:0),compositionCategoryCount=Object.values(composition).filter(Boolean).length,distinctMet=distinctComponents>=(request.minDistinctComponents||1),compositionMet=compositionCategoryCount>=(request.minCompositionCategories||1);
    const roomRequirementsMet=statsMet&&tagRequirementsMet&&distinctMet&&compositionMet,depthPreferred=(request.preferredRecipeDepth||0)>0,depthMet=!depthPreferred||components.some(component=>(component.recipeDepth||0)>=request.preferredRecipeDepth),preferredMet=countSatisfied(preferredStats,roomStats)+preferredTags.filter(tag=>tagCount(roomTagCounts,tag)>0).length+(depthPreferred&&depthMet?1:0);
    const dislikedStatHits=Object.entries(dislikedStats).filter(([key,rule])=>satisfies(roomStats[key]||0,rule)).map(([key])=>key),dislikedTagHits=dislikedTags.filter(tag=>tagCount(roomTagCounts,tag)>0),dislikedHits=dislikedStatHits.length+dislikedTagHits.length;
    let score=0;if(roomRequirementsMet){const preferredTotal=Object.keys(preferredStats).length+preferredTags.length+(depthPreferred?1:0);score=dislikedHits?1:(preferredMet===preferredTotal?3:2)}
    return{score,requiredMet:roomRequirementsMet,roomRequirementsMet,statsMet,tagRequirementsMet,distinctMet,compositionMet,depthMet,missingRequiredTags,preferredMet,dislikedHits,dislikedStatHits,dislikedTagHits,item,roomStats,roomTags,roomTagCounts,roomComposition:composition,distinctComponents,meaningfulComponents,compositionCategoryCount,components,request,npc:request.npc||null}
  }
  function calculateNpcScore({request={},roomStats={},roomTags=[],roomTagCounts={},roomComposition={},components=[],item=null,npc=null}={}){return evaluateRequestItem({...request,npc},item,roomStats,roomTags,{roomTagCounts,roomComposition,components})}
  function ruleGap(value,rule={}){if(rule.min!==undefined&&value<rule.min)return(rule.min-value)/Math.max(1,rule.min);if(rule.max!==undefined&&value>rule.max)return(value-rule.max)/Math.max(1,5-rule.max);return 0}
  function calculateComponentRelevance(component,request={}){
    if(!component)return 0;
    const attributes=component.attributes||{},required=Object.entries(request.requiredStats||{}),preferred=Object.entries(request.preferredStats||{}),disliked=Object.entries(request.dislikedStats||{});
    let earned=0,possible=required.length*3+preferred.length*1.5;
    for(const [key,rule] of required){const value=Math.max(0,Number(attributes[key])||0);if(value>0)earned+=1.5;if(rule.min!==undefined&&value>=Math.min(rule.min,2))earned+=1.5;if(rule.max!==undefined&&value<=rule.max)earned+=.75}
    for(const [key,rule] of preferred){const value=Math.max(0,Number(attributes[key])||0);if(value>0&&satisfies(value,rule))earned+=1.5;else if(value>0)earned+=.7}
    for(const [key,rule] of disliked){const value=Math.max(0,Number(attributes[key])||0);if(value>0&&satisfies(value,rule))earned-=2}
    const requiredTags=new Set(request.requiredItemTags||request.requiredRoomTags||[]),wantedTags=new Set([...requiredTags,...(request.preferredItemTags||[]),...(request.inspectionTags||[])]),componentTags=normalizeItemTags([...(component.tags||[]),...(component.usageTags||[]),component.roomRole].filter(Boolean));
    if(wantedTags.size){possible+=2;if(componentTags.some(tag=>wantedTags.has(tag)))earned+=2}
    if(!possible)return component.roomRole?.length?.5:0;
    const normalized=Math.round(Math.max(0,Math.min(1,earned/possible))*100)/100;
    return componentTags.some(tag=>requiredTags.has(tag))?Math.max(.4,normalized):normalized;
  }
  function calculateRequestViolationScore({request={},roomStats={},components=[],npc={},roomTagCounts={},evaluation=null}={}){
    let score=0;const reasons=[];
    const required=Object.entries(request.requiredStats||{}),missing=required.filter(([key,rule])=>!satisfies(roomStats[key]||0,rule));
    if(required.length&&missing.length===required.length){score+=2;reasons.push("核心需求完全没有满足")}else if(missing.length){score+=1;reasons.push(`仍缺少${missing.map(([key])=>key).join("、")}`)}
    const disliked=Object.entries(request.dislikedStats||{}).filter(([key,rule])=>satisfies(roomStats[key]||0,rule));if(disliked.length){score+=2;reasons.push(`明显踩到${disliked.map(([key])=>key).join("、")}`)}
    const missingTags=evaluation?.missingRequiredTags||(request.requiredItemTags||[]).filter(tag=>tagCount(roomTagCounts,tag)<1);if(missingTags.length){score+=1;reasons.push(`还缺少${missingTags.join("、")}`)}
    const dislikedTagHits=evaluation?.dislikedTagHits||(request.dislikedItemTags||[]).filter(tag=>tagCount(roomTagCounts,tag)>0);if(dislikedTagHits.length){score+=2;reasons.push(`房间里出现了${dislikedTagHits.join("、")}`)}
    if(evaluation&&!evaluation.distinctMet){score+=1;reasons.push("还缺少不同作用来源")}
    if(evaluation&&!evaluation.compositionMet){score+=1;reasons.push("房间组成还不够完整")}
    const relevance=components.map(component=>({component,value:calculateComponentRelevance(component,request)})),irrelevantCount=relevance.filter(item=>item.value<.25).length;if(irrelevantCount>=4){score+=1;reasons.push("房间里有大量无关物件")}
    const hated=components.filter(component=>Object.entries(npc.dislikes||{}).some(([key,weight])=>weight>=4&&(component.attributes?.[key]||0)>=3));if(hated.length){score+=2;reasons.push(`出现特别不喜欢的${hated.map(item=>item.label).join("、")}`)}
    return{score,reasons,irrelevantCount,relevance,missingRequired:missing.map(([key])=>key),missingRequiredTags:missingTags,dislikedHits:[...disliked.map(([key])=>key),...dislikedTagHits],dislikedTagHits};
  }
  function findSpecialReaction(npc={},components=[]){const table=SPECIAL_REACTIONS[npc.id]||{};for(const component of components){if(table[component.id])return{...table[component.id],component}}return null}
  function calculateNpcEmotion({npc={},request={},roomStats={},components=[],roomTagCounts={},evaluation=null,score=0,entryEmotion="NEUTRAL"}={}){
    const violation=calculateRequestViolationScore({request,roomStats,components,npc,roomTagCounts,evaluation}),special=findSpecialReaction(npc,components),reasons=[...violation.reasons];let emotion="NEUTRAL";
    const negativeSpecial=special&&["CONFUSED","SCARED","ANGRY","DISAPPOINTED"].includes(special.emotion);
    if(negativeSpecial){emotion=special.emotion;reasons.unshift(special.reason)}
    else if(npc.id==="child"&&(roomStats.eerie||0)>=3){emotion="SCARED";reasons.unshift("灵异感压过了安全感")}
    else if(evaluation?.requiredMet===false&&violation.irrelevantCount>=2){emotion="CONFUSED";reasons.unshift("摆进来的东西不少，但最要紧的部分还没找到")}
    else if(evaluation?.requiredMet===false){emotion="DISAPPOINTED";reasons.unshift("最要紧的部分还没有准备好")}
    else if(violation.dislikedHits.length>=2||violation.score>=4){emotion="ANGRY";reasons.unshift("委托被明显违背")}
    else if(violation.dislikedHits.length){emotion="DISAPPOINTED";reasons.unshift("房间里有一件东西实在不合适")}
    else if(special){emotion=special.emotion;reasons.unshift(special.reason)}
    else if(violation.irrelevantCount>=2&&score<=1){emotion="DISAPPOINTED";reasons.unshift("多余物件掩盖了真正需求")}
    else if(violation.irrelevantCount>=1&&score<=1){emotion="CONFUSED";reasons.unshift("看不出部分物件与委托的关系")}
    else if(score>=3){emotion=(roomStats.comfort||0)>=3||npc.id==="insomniac"?"RELAXED":"HAPPY";reasons.unshift("主要需要得到了回应")}
    else if(score===2){emotion=(roomStats.comfort||0)>=2||roomStats.dream>=3?"RELAXED":"HAPPY";reasons.unshift("今晚住下来应该没问题")}
    else if(components.some(component=>calculateComponentRelevance(component,request)>=.75)){emotion="SURPRISED";reasons.unshift("有一件物件意外地接近需求")}
    else{emotion="DISAPPOINTED";reasons.unshift("主要问题还没有解决")}
    return{entryEmotion,finalEmotion:emotion,emotion,requiredMet:evaluation?.requiredMet,reasons:[...new Set(reasons)].slice(0,4),specialReaction:special,requestViolationScore:violation.score,irrelevantCount:violation.irrelevantCount,relevance:violation.relevance,missingRequired:violation.missingRequired,missingRequiredTags:violation.missingRequiredTags,dislikedHits:violation.dislikedHits,dislikedTagHits:violation.dislikedTagHits};
  }
  function evaluationDialogue(result){const name=result.npc?.name||"客人";if(!result.requiredMet)return`${name}摇了摇头：“嗯……这间我可能住不下。”`;if(result.dislikedHits)return`${name}皱了皱眉：“有一样东西让我不太舒服。”`;if(result.score===3)return`${name}笑了：“好，今晚就住这间。”`;return`${name}点点头：“这个还行，我先住下试试。”`}
  function selectFeedbackFocus(roomStats={},request={},npc={},context={}){
    const candidates=[];
    if(context.specialReaction)candidates.push({key:context.specialReaction.component?.id||"special",label:context.specialReaction.component?.label,kind:"special",line:context.specialReaction.line,met:true,priority:120});
    for(const [key,rule] of Object.entries(request.requiredStats||{})){const value=roomStats[key]||0,met=!(rule.min!==undefined&&value<rule.min)&&!(rule.max!==undefined&&value>rule.max);candidates.push({key,value,kind:"required",met,priority:met?95:110,gap:ruleGap(value,rule)})}
    for(const [key,rule] of Object.entries(request.dislikedStats||{})){const value=roomStats[key]||0,hit=rule.min!==undefined?value>=rule.min:rule.max!==undefined?value>rule.max:false;if(hit)candidates.push({key,value,kind:"disliked",met:false,priority:90})}
    for(const [key] of Object.entries(request.preferredStats||{})){if(candidates.some(item=>item.key===key))continue;const value=roomStats[key]||0;candidates.push({key,value,kind:"preferred",met:value>=3,priority:60+value})}
    for(const key of CORE_ATTRIBUTES){const value=roomStats[key]||0;if(value>=4&&!candidates.some(item=>item.key===key))candidates.push({key,value,kind:"extreme",met:true,priority:40+value+(npc.preferences?.[key]||0)})}
    if(context.irrelevantCount)candidates.push({key:"irrelevant",value:context.irrelevantCount,kind:"irrelevant",met:false,priority:context.irrelevantCount>=2?92:68});
    return candidates.sort((a,b)=>b.priority-a.priority||(b.gap||0)-(a.gap||0)).filter((item,index,all)=>all.findIndex(other=>other.key===item.key)===index).slice(0,3);
  }
  const FEELING_VARIANTS=Object.freeze({
    TOO_DARK:["这里有点暗。","我怎么看不太清。","晚上住这儿，我估计得一直开灯。"],TOO_BRIGHT:["这灯有点晃眼。","也太亮了，我闭眼都能看见。","能把光压低一点吗？"],TOO_EERIE:["这屋里怎么老让我觉得背后有人……","等等，刚才是不是有什么动了？","这里待久了，我有点发毛。"],TOO_COLD:["还是有点冷。","被子摸着都是凉的。","这儿一到晚上肯定更冷。"],UNCOMFORTABLE:["这床躺着不太对劲。","我待着总想换个姿势。","嗯……放松不下来。"],IRRELEVANT:["这个……放我房间里干嘛的？","东西不少，可我刚才说的那件事还没解决。","你是不是拿错东西了？"],CONFUSED:["这个……是给我的吗？","我有点没明白。","这些东西是不是放得太杂了？"],ANGRY:["你是不是根本没听我刚才说什么？","我刚才不是这么说的。","算了，先别让我住进去。"],GENERIC_GOOD:["嗯，这个还行。","住起来比我想的舒服。","进来以后，感觉好多了。"],GENERIC_BAD:["嗯……还是不太行。","我住进去大概会后悔。","有几样东西得先换掉。"]
  });
  const profileFor=npc=>npc?.speechProfile||SPEECH_PROFILES[npc?.id]||SPEECH_PROFILES.default;
  function pickSpeech(npc,intent,random=Math.random,used=new Set()){const profile=profileFor(npc),pool=profile.intents?.[intent]||SPEECH_PROFILES.default.intents?.[intent]||FEELING_VARIANTS[intent]||FEELING_VARIANTS.GENERIC_BAD,available=pool.filter(line=>!used.has(line)),choices=available.length?available:pool,line=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];used.add(line);return line}
  function primaryFeelingIntent({npc={},roomStats={},request={},score=0,emotionResult={},focus=[],components=[]}){const emotion=emotionResult.finalEmotion||"NEUTRAL",missing=emotionResult.missingRequired||[],disliked=emotionResult.dislikedHits||[];if(emotion==="ANGRY")return"ANGRY";if(emotion==="CONFUSED")return"CONFUSED";if(emotion==="SCARED")return"TOO_EERIE";if(emotion==="DISAPPOINTED"&&emotionResult.irrelevantCount)return"IRRELEVANT";if(missing.includes("light"))return(roomStats.light||0)>4?"TOO_BRIGHT":"TOO_DARK";if(disliked.includes("light")||(npc.id==="insomniac"&&(roomStats.light||0)>4))return"TOO_BRIGHT";if(missing.includes("warmth"))return"TOO_COLD";if(missing.includes("comfort"))return"UNCOMFORTABLE";if(missing.includes("memory"))return npc.id==="elder"?"UNFAMILIAR":"GENERIC_BAD";if(missing.includes("dream"))return npc.id==="dreamwalker"?"TOO_CLEAR":"GENERIC_BAD";if(npc.id==="child")return(roomStats.eerie||0)>=3?"TOO_EERIE":score>=2?"COMFORTABLE":"TOO_DARK";if(npc.id==="insomniac")return(roomStats.light||0)>4?"TOO_BRIGHT":componentsContainNoise(components)?"TOO_NOISY":score>=2?"RESTFUL":"UNCOMFORTABLE";if(npc.id==="elder")return score>=2?"FAMILIAR":"UNFAMILIAR";if(npc.id==="oddity-lover")return score>=2?"STRANGE_GOOD":"TOO_ORDINARY";if(npc.id==="mechanic")return score>=2?"ORDERLY":"DISORDERED";if(npc.id==="dreamwalker")return score>=2?"DREAMY":"TOO_CLEAR";if(npc.id==="cold-guest")return score>=2?"WARM_ENOUGH":"TOO_COLD";if(npc.id==="mystery")return score>=2?"THRESHOLD":"NOT_THRESHOLD";return score>=2?"GENERIC_GOOD":"GENERIC_BAD"}
  function componentsContainNoise(components=[]){return components.some(item=>normalizeItemTags([...(item.tags||[]),...(item.usageTags||[])]).some(tag=>["noise","mechanical_noise"].includes(tag)))}
  function selectTagReaction(npc={},components=[],request={},emotionResult={},random=Math.random){
    const pools=TAG_REACTION_POOLS[npc.id]||{},present=new Set(components.flatMap(item=>normalizeItemTags([...(item.tags||[]),...(item.usageTags||[]),item.roomRole].filter(Boolean)))),priority=[...(emotionResult.dislikedTagHits||[]),...(request.requiredItemTags||[]),...(request.preferredItemTags||[]),...present];
    const tag=priority.find(key=>present.has(key)&&pools[key]?.length);if(!tag)return null;const pool=pools[tag],line=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];return{tag,line,label:TAG_META[tag]?.label||tag}
  }
  const MISSING_TAG_REACTIONS=Object.freeze({
    child:{light_source:["屋里还是黑的……灯是不是还没放进来？"],bed:["我还没找到今晚能躺下的地方。"]},
    "oddity-lover":{door:["说好的门呢？现在这个角落还是太正常了。"],decoration:["我一进门还是什么都没看见，怪东西放哪儿了？"],mirror:["少了面镜子，这个怪劲儿还没出来。"]},
    insomniac:{bed:["我还是没看见今晚能睡的地方。"],atmosphere:["屋里还是绷得太紧，我躺下也静不下来。"]},
    elder:{memory_object:["这里还没有什么能让我认出来的旧东西。"],clock:["我没听见钟走，也没看见它在哪儿。"],decoration:["墙上还是空的，少了点旧日子的痕迹。"]},
    mechanic:{mechanical:["我没看见真正会运转的结构。"],light_source:["光不够，我连接缝都看不清。"],observation:["没有读数，也没有能观察的装置。"]},
    dreamwalker:{bed:["没有能躺下的地方，梦落不进来。"],atmosphere:["墙还离得太近，这里还醒着。"],window:["窗不在，梦找不到进来的方向。"]},
    "cold-guest":{heater:["取暖的东西呢？我进来还是一身冷。"],floor:["地板还是冰的，我不想踩下去。"],light_source:["至少留盏灯吧，我半夜还得找鞋。"]},
    mystery:{door:["门不在这里。今晚的路也不会来。"],atmosphere:["路还太清楚，它不会在这里出现。"],lock:["没有锁，这道边界留不住任何东西。"]}
  });
  function selectMissingTagReaction(npc={},emotionResult={},random=Math.random){const missing=emotionResult.missingRequiredTags||[],pools=MISSING_TAG_REACTIONS[npc.id]||{},tag=missing.find(key=>pools[key]?.length);if(!tag)return null;const pool=pools[tag];return{tag,line:pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]}}
  const OBJECT_REACTION_TEMPLATES=Object.freeze({
    child:["{item}放在这里，我晚上醒来也能认出来。","嗯……{item}可以离床边近一点。","{item}看着还行，我敢靠近一点。"],
    "oddity-lover":["{item}先别动，我还没看够。","诶，{item}比我刚才想的还怪。","就把{item}留在一进门能看见的地方。"],
    insomniac:["{item}可以留，晚上安静一点就行。","嗯……{item}别挪了，这样就好。","{item}放远一点，我应该还能睡。"],
    elder:["{item}放在这里，倒像从前住过的屋子。","嗯，{item}这个旧样子挺好。","看到{item}，我想起以前家里的一个角落。"],
    mechanic:["{item}先留着，我还要再看一眼结构。","{item}的接缝还算规整。","把{item}转过来，我要看背面的连接。"],
    dreamwalker:["{item}一靠近，墙就远了一点。","别碰{item}，梦还停在上面。","{item}的影子已经先睡着了。"],
    "cold-guest":["{item}靠近一点，我手总算没那么僵。","嗯，{item}这边确实暖和些。","{item}先别拿走，我还冷着呢。"],
    mystery:["{item}留着。它知道该朝哪边。","别动{item}。它已经听见门后的声音。","{item}认得这条路，不需要解释。"]
  });
  const SPECIAL_REACTION_DELIVERY=Object.freeze({
    child:{positive:["{item}可以留下。","嗯……{item}我愿意再靠近一点。"],negative:["等等，{item}先离我远一点。","我不想让{item}靠床太近。"]},
    "oddity-lover":{positive:["{item}越看越有意思。","别收走，{item}正合我意。"],negative:["怪是够怪，可{item}这个方向不太对。","{item}先放远点，我得重新看看。"]},
    insomniac:{positive:["嗯……{item}可以留。","{item}别再动了，这样我还能睡。"],negative:["{item}先拿远一点，我现在更清醒了。","等等，{item}今晚不会一直这样吧？"]},
    elder:{positive:["{item}让我想起些旧事。","嗯，{item}留在这里吧。"],negative:["{item}看久了，心里不太安稳。","先把{item}挪开吧。"]},
    mechanic:{positive:["{item}的结构值得再看一遍。","先别动{item}，连接做得不错。"],negative:["{item}这个状态不对。","停一下，{item}得先断开检查。"]},
    dreamwalker:{positive:["{item}已经飘进梦里了。","别碰{item}……它正在变远。"],negative:["{item}把梦吵醒了。","先让{item}离开这里。"]},
    "cold-guest":{positive:["{item}靠近一点，暖和。","嗯，{item}总算有点用。"],negative:["{item}拿走，光看着我都冷。","别把{item}留在床边。"]},
    mystery:{positive:["{item}知道该待在哪里。","留下{item}。别问。"],negative:["{item}不该在这一边。","把{item}转过去。现在。"]}
  });
  function spokenObjectName(component){const tags=normalizeItemTags([...(component?.tags||[]),...(component?.usageTags||[]),component?.roomRole].filter(Boolean));if(tags.includes("bed"))return"这张床";if(tags.includes("light_source"))return"床边这盏灯";if(tags.includes("door"))return"这扇门";if(tags.includes("clock"))return"这个钟";if(tags.includes("mirror"))return"这面镜子";if(tags.includes("floor"))return"脚下这块地板";if(tags.includes("memory_object"))return"这件旧物";if(tags.includes("protective"))return"这件护具";if(tags.includes("atmosphere"))return"这股气息";if(tags.includes("observation"))return"这个装置";return component?.label?`这个${component.label}`:"这个东西"}
  function selectSpecialReactionLine(npc={},specialReaction={},random=Math.random){const negative=["CONFUSED","SCARED","ANGRY","DISAPPOINTED"].includes(specialReaction.emotion),delivery=SPECIAL_REACTION_DELIVERY[npc.id]?.[negative?"negative":"positive"]||[],pool=[specialReaction.line,...delivery.map(line=>line.replace("{item}",spokenObjectName(specialReaction.component)))].filter(Boolean);return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]}
  function selectObjectReaction(npc={},components=[],request={},random=Math.random){const pool=OBJECT_REACTION_TEMPLATES[npc.id]||[],relevant=components.filter(component=>calculateComponentRelevance(component,request)>=.4);if(!pool.length||!relevant.length)return null;const component=relevant[Math.min(relevant.length-1,Math.floor(random()*relevant.length))],template=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];return{component,line:template.replace("{item}",spokenObjectName(component))}}
  function feedbackGenerator({roomStats={},request={},npc={},score=0,item=null,components=[],emotionResult=null,emotion=null,random=Math.random}){
    const resolved=emotionResult||calculateNpcEmotion({npc,request,roomStats,components,score}),feeling=emotion||resolved.finalEmotion,accepted=resolved.requiredMet!==false&&!['CONFUSED','DISAPPOINTED','SCARED','ANGRY'].includes(feeling),focus=selectFeedbackFocus(roomStats,request,npc,resolved),used=new Set(),intents=new Set(),lines=[];
    const push=(line,intent)=>{if(!line||used.has(line)||intents.has(intent)||lines.length>=2)return false;lines.push(line);used.add(line);intents.add(intent);return true};
    if(resolved.specialReaction?.line){push(selectSpecialReactionLine(npc,resolved.specialReaction,random),`special:${resolved.specialReaction.component?.id||"item"}`);for(const tag of normalizeItemTags(resolved.specialReaction.component?.tags||[]))intents.add(`tag:${tag}`)}
    const missingReaction=selectMissingTagReaction(npc,resolved,random);if(missingReaction)push(missingReaction.line,`missing:${missingReaction.tag}`);
    const tagReaction=selectTagReaction(npc,components,request,resolved,random);if(tagReaction)push(tagReaction.line,`tag:${tagReaction.tag}`);
    const primary=primaryFeelingIntent({npc,roomStats,request,score,emotionResult:{...resolved,finalEmotion:feeling},focus,components});
    if(accepted&&lines.length<2&&random()<.55){const objectReaction=selectObjectReaction(npc,components,request,random);if(objectReaction)push(objectReaction.line,`object:${objectReaction.component.id}`)}
    if(lines.length<2)push(pickSpeech(npc,primary,random,used),`feeling:${primary}`);
    const secondary=accepted?(npc.id==="child"?"COMFORTABLE":npc.id==="insomniac"?"RESTFUL":npc.id==="elder"?"FAMILIAR":npc.id==="oddity-lover"?"STRANGE_GOOD":npc.id==="mechanic"?"ORDERLY":npc.id==="dreamwalker"?"DREAMY":npc.id==="cold-guest"?"WARM_ENOUGH":npc.id==="mystery"?"THRESHOLD":"GENERIC_GOOD"):(resolved.irrelevantCount?"IRRELEVANT":primary);if(lines.length<2)push(pickSpeech(npc,secondary,random,used),`feeling:${secondary}`);
    const decisionIntent=accepted?"ACCEPTED":"REJECTED",decision=pickSpeech(npc,decisionIntent,random,used);if(!used.has(decision))lines.push(decision);return[...new Set(lines)].slice(0,3)
  }
  const feedbackDisplayDuration=text=>Math.max(2200,String(text||"").length*90);
  const NPCRequests=npcDatabase.flatMap(npc=>[...npc.requestPool,...(DAY_REQUEST_POOLS[npc.id]?.[2]||[]),...(DAY_REQUEST_POOLS[npc.id]?.[3]||[])]);
  root.NPC_SYSTEM={npcDatabase,NPCRequests,NPCRequest:npcDatabase[0].requestPool[0],DAY_REQUEST_POOLS,requestPoolForDay,TAG_REACTION_POOLS,MISSING_TAG_REACTIONS,NPC_STATES,NPC_EMOTIONS,NPCStateMachine,evaluateRequestItem,calculateNpcScore,calculateComponentRelevance,calculateRequestViolationScore,calculateNpcEmotion,SPECIAL_REACTIONS,evaluationDialogue,selectFeedbackFocus,selectTagReaction,selectMissingTagReaction,primaryFeelingIntent,pickSpeech,feedbackGenerator,feedbackDisplayDuration,SPEECH_PROFILES,SPEECH_STYLES,FEELING_VARIANTS};
})(typeof window!=="undefined"?window:globalThis);
