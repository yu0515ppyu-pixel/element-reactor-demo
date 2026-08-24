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
  const DECISION_EXPANSIONS=Object.freeze({child:{ACCEPTED:["嗯……那我今晚试试。","灯别关，我就住。","好吧，这间我敢睡。"],REJECTED:["不行，我还是会怕。","我今晚不要睡这里。","能先把吓人的拿走吗？"]},"oddity-lover":{ACCEPTED:["这间归我了！","好，就要这个怪的。","可以，我今晚研究它。"],REJECTED:["这也能叫怪？算了。","没意思，我不住。","等你弄得更离谱再叫我。"]},insomniac:{ACCEPTED:["嗯……我先躺下了。","可以，别再动东西。","就这儿吧，我困了。"],REJECTED:["不住了，我现在更清醒。","还是算了，太折腾。","我去找个没声音的地方。"]},elder:{ACCEPTED:["那我就在这里慢慢歇着。","行，这间住着不生。","好，东西都先留着吧。"],REJECTED:["罢了，这里我歇不惯。","还是换一间旧一点的吧。","这儿让我想不起什么。"]},mechanic:{ACCEPTED:["验过了，可以入住。","参数没问题，就这间。","结构稳定。我住。"],REJECTED:["验收不通过。","先返工，我不住。","故障没排掉，换房。"]},dreamwalker:{ACCEPTED:["嘘……我已经住进去了。","门关上，我要继续睡。","这一晚可以留下。"],REJECTED:["梦没来，我也不留。","这里还醒着……算了。","等它睡着以后再说。"]},"cold-guest":{ACCEPTED:["可以，快把门关上。","这温度行，我住了。","好，别让火灭。"],REJECTED:["太冷了，我不住。","算了，我去炉边坐着。","这间留给不怕冷的人吧。"]},mystery:{ACCEPTED:["门已开。今晚留下。","可以。灯不要再动。","路到了。我住。"],REJECTED:["路没有来。告辞。","门是空的。我不留。","不对。今晚到此为止。"]}});
  const DECISION_MORE=Object.freeze({child:{ACCEPTED:["我把被子拉好就睡。","嗯，这回可以。"],REJECTED:["我还是去亮一点的地方。","这个我真的不敢。"]},"oddity-lover":{ACCEPTED:["成交，这些都别收。","今晚够我看了。"],REJECTED:["太规矩了，我待不住。","先算了，下次再怪一点。"]},insomniac:{ACCEPTED:["嘘，我现在就想睡。","行，别再来敲门。"],REJECTED:["我越看越精神，算了。","今晚先不折腾了。"]},elder:{ACCEPTED:["嗯，住一晚正好。","就留这间吧。"],REJECTED:["我还是另找个熟一点的地方。","这些东西跟我合不来。"]},mechanic:{ACCEPTED:["运行正常。入住。","不用再调了。"],REJECTED:["参数不对，我不接收。","先把问题排干净。"]},dreamwalker:{ACCEPTED:["我已经快听不见你了。","好……别再开灯。"],REJECTED:["路断了，我走了。","梦停在门外，我也不进。"]},"cold-guest":{ACCEPTED:["总算能把外套脱了。","行，这里不冻人。"],REJECTED:["我脚还是冰的，不住。","这点热气撑不到半夜。"]},mystery:{ACCEPTED:["可以。门会替我回答。","留下。其余不用问。"],REJECTED:["不是这里。","门没有回应。到此为止。"]}});
  const FEEDBACK_INTENTS=Object.freeze(["SATISFIED","VERY_SATISFIED","MISSING_CORE","FAILED_REQUEST","TOO_BRIGHT","TOO_DARK","TOO_COLD","TOO_EERIE","TOO_NOISY","LIKES_OBJECT","DISLIKES_OBJECT","CONFUSED_OBJECT","REPEAT_GUEST","SPECIAL_TAG"]);
  const STANDARD_INTENT_VARIANTS=Object.freeze({SATISFIED:["嗯……这个行。","这样就可以了。","好，我能住。"],VERY_SATISFIED:["这回真的对了。","就这样，别再动了。","这个我很喜欢。"],MISSING_CORE:["还少了最要紧的东西。","等等，我要的那个还没有。","别的先不说，关键的东西呢？"],FAILED_REQUEST:["这跟我说的不是一回事。","不行，最要紧的问题还在。","今晚我住不了这间。"],TOO_BRIGHT:["这个灯太晃眼了。","能不能暗一点？","这么亮，我反而待不住。"],TOO_DARK:["这里还是看不清。","灯是不是还没开？","太暗了，我不敢住。"],TOO_COLD:["还是冷。","这屋里一点热气都没有。","我手都没暖起来。"],TOO_EERIE:["等等，刚才是不是有什么动了？","这个先拿远一点。","这里让我有点发毛。"],TOO_NOISY:["怎么还有声音……","这个一直响，我睡不了。","先把吵的那个停掉。"],LIKES_OBJECT:["这个我喜欢。","这个先留着。","嗯，这件正合适。"],DISLIKES_OBJECT:["这个先拿走。","我不想让它留在房里。","这件东西我不喜欢。"],CONFUSED_OBJECT:["这个……是做什么的？","等等，为什么要放这个？","我没看懂这件东西。"],REPEAT_GUEST:["上次的布置我还记得。","我来过，别把上次全忘了。","上回有一样东西还不错。"],SPECIAL_TAG:["这个倒是有点意思。","嗯？这件东西不太一样。","先别动它，我想再看看。"]});
  const feedbackIntentPool=Object.freeze(Object.fromEntries(Object.entries(SPEECH_PROFILES).map(([id,profile])=>[id,Object.freeze({...STANDARD_INTENT_VARIANTS,...profile.intents,ACCEPTED:[...(profile.intents?.ACCEPTED||[]),...(DECISION_EXPANSIONS[id]?.ACCEPTED||[]),...(DECISION_MORE[id]?.ACCEPTED||[])],REJECTED:[...(profile.intents?.REJECTED||[]),...(DECISION_EXPANSIONS[id]?.REJECTED||[]),...(DECISION_MORE[id]?.REJECTED||[])]})])));
  const SPEECH_STYLES=SPEECH_PROFILES;
  const {TAG_META={},normalizeItemTags=(tags=[])=>[...new Set(tags||[])],normalizeRoomStats=(values={},context="roomStats")=>{const unknown=Object.keys(values).filter(key=>!CORE_ATTRIBUTES.includes(key));if(unknown.length)throw new TypeError(`${context} contains unsupported roomStats: ${unknown.join(", ")}`);return Object.fromEntries(CORE_ATTRIBUTES.map(key=>{const raw=values[key]??0,number=Number(raw);if(!Number.isFinite(number)||number<0||number>5)throw new RangeError(`${context}.${key} must be between 0 and 5; received ${raw}`);return[key,number]}))}}=root.REACTOR_DATA||{};
  const stats=(values={},context="npc.stats")=>normalizeRoomStats(values,context);
  const validateRange=(value,context)=>{const number=Number(value);if(!Number.isFinite(number)||number<0||number>5)throw new RangeError(`${context} must be between 0 and 5; received ${value}`);return number};
  const rules=(value={},context="rules")=>Object.fromEntries(Object.entries(value).map(([key,rule])=>{if(!CORE_ATTRIBUTES.includes(key))throw new TypeError(`${context} contains unsupported roomStat: ${key}`);return[key,Object.fromEntries(Object.entries(rule).map(([bound,amount])=>[bound,validateRange(amount,`${context}.${key}.${bound}`)]))]}));
  const ROOM_EFFECT_META=Object.freeze({mechanicalStrength:{label:"机械强度"},calmStrength:{label:"安静程度"},lightPenalty:{label:"遮光影响"},mechanicalSuppression:{label:"机械抑制"},timeStability:{label:"时间稳定"},observationStrength:{label:"观测强度"},protectionStrength:{label:"防护强度"},heatPersistence:{label:"持续暖意"}});
  const effectRules=(value={},context="roomEffects")=>Object.fromEntries(Object.entries(value).map(([key,rule])=>{if(!ROOM_EFFECT_META[key])throw new TypeError(`${context} contains unsupported roomEffect: ${key}`);return[key,Object.fromEntries(Object.entries(rule).map(([bound,amount])=>[bound,validateRange(amount,`${context}.${key}.${bound}`)]))]}));
  const normalizeTagList=(tags=[])=>Object.freeze(normalizeItemTags(tags));
  const template=(id,title,dialogue,difficulty,requiredStats,preferredStats={},dislikedStats={},inspectionTags=[],options={})=>Object.freeze({
    id,day:options.day||1,title,dialogue,difficulty,requiredStats:rules(requiredStats,`${id}.requiredStats`),preferredStats:rules(preferredStats,`${id}.preferredStats`),dislikedStats:rules(dislikedStats,`${id}.dislikedStats`),inspectionTags:normalizeTagList(inspectionTags),
    requiredItemTags:normalizeTagList(options.requiredItemTags||options.requiredRoomTags||[]),preferredItemTags:normalizeTagList(options.preferredItemTags||[]),dislikedItemTags:normalizeTagList(options.dislikedItemTags||[]),
    minDistinctComponents:Math.max(1,Number(options.minDistinctComponents)||1),minCompositionCategories:Math.max(1,Number(options.minCompositionCategories)||1),preferredRecipeDepth:Math.max(0,Number(options.preferredRecipeDepth)||0),preferredRoomEffects:effectRules(options.preferredRoomEffects||{},`${id}.preferredRoomEffects`),dislikedRoomEffects:effectRules(options.dislikedRoomEffects||{},`${id}.dislikedRoomEffects`),specialCompletionRule:options.specialCompletionRule||null
  });
  const ITEM_PREFERENCES=Object.freeze({child:Object.freeze({"cloud-bed":.2,"dream-bed":-.12,"electric-lamp":.12,"moon-lamp":.06,"spirit-door":-.18,"light-eye":-.28,"fog-bridge":-.12,"shadow-lock":-.24,"frost-water":-.1}),insomniac:Object.freeze({"cloud-bed":.24,"dream-bed":-.14,"fog-lamp":.1,"moon-lamp":.08,"electric-lamp":-.2,"hourglass-sand":.16,"moon-pool":.12,"light-eye":-.3,"fog-bridge":-.08,"frost-water":-.12}),dreamwalker:Object.freeze({"dream-bed":.24,"cloud-bed":-.1,"moon-lamp":.1,"fog-lamp":.08,"shadow-threshold":.2,"dark-door":-.06,"moon-pool":.32,"fog-bridge":.34,"hourglass-sand":.16,"frost-water":.08}),elder:Object.freeze({"memory-letter":.3,"memory-door":.12,"bone-armor":-.15,"hourglass-sand":.36}),mechanic:Object.freeze({"gear-core":.34,"light-eye":.28,"hourglass-sand":.08,"shadow-lock":-.12}),"cold-guest":Object.freeze({"wood-floor":.12,"moss-floor":-.2,"frost-water":-.4}),"oddity-lover":Object.freeze({"bone-armor":.16,"moss-floor":.08,"dark-door":.45,"shadow-threshold":.2,"spirit-door":.1,"moon-pool":.14,"light-eye":.25,"fog-bridge":.34,"shadow-lock":.24,"frost-water":.1}),mystery:Object.freeze({"bone-armor":.1,"memory-letter":.12,"memory-door":.22,"dark-door":.1,"spirit-door":.12,"shadow-threshold":.16,"moon-pool":.14,"hourglass-sand":.2,"light-eye":-.28,"fog-bridge":.36,"shadow-lock":.32})});
  const npc=(definition)=>Object.freeze({...definition,itemPreferences:ITEM_PREFERENCES[definition.id]||Object.freeze({}),speechProfile:Object.freeze(definition.speechProfile||SPEECH_PROFILES[definition.id]||SPEECH_PROFILES.default),speechStyle:Object.freeze(definition.speechProfile||SPEECH_PROFILES[definition.id]||SPEECH_PROFILES.default),tagReactions:Object.freeze(definition.tagReactions||{}),preferences:stats(definition.preferences,`${definition.id}.preferences`),dislikes:stats(definition.dislikes,`${definition.id}.dislikes`),requestPool:Object.freeze(definition.requestPool)});
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
      ]),
      4:Object.freeze([
        dayTemplate(4,"child-d4-watchful-night","亮着，也要守得住","灯还是要亮着。床边最好有个能守住门口、还能记得坏东西有没有来过的东西，但别弄得太吓人。",4,{light:{min:3},comfort:{min:2}},{warmth:{min:1}},{eerie:{min:4}},{requiredItemTags:["light_source","protective"],preferredItemTags:["advanced_result"],dislikedItemTags:["observation"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:3})
      ])
    }),
    "oddity-lover":Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"oddity-d2-strange-door","门后最好别太正常","给我留扇奇怪的门。藏在墙里也行，门后像梦或黑洞也行，反正别太普通。",2,{eerie:{min:2},dream:{min:2}},{memory:{min:1}},{},{requiredItemTags:["door"],preferredItemTags:["secret"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"oddity-d2-weird-display","给我一个解释不了的角落","墙上或桌上放点奇怪的吧。我想进门就看见一个解释不了的东西。",2,{eerie:{min:2},memory:{min:2}},{dream:{min:2}},{},{requiredItemTags:["decoration"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
        dayTemplate(3,"oddity-d3-spirit-gate","有什么在门后","这次我要真怪一点的。门后得像有什么，屋里还要留下一点旧事。",3,{eerie:{min:3},dream:{min:2},memory:{min:2}},{},{light:{min:5}},{requiredItemTags:["spiritual","door"],dislikedItemTags:["harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"oddity-d3-haunted-mirror","镜子里的东西不太对","有没有那种镜子？照进去像是自己，但又好像少了点什么。",3,{eerie:{min:3},memory:{min:3}},{dream:{min:2}},{light:{min:5}},{requiredItemTags:["spiritual","mirror"],dislikedItemTags:["harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2})
      ]),
      4:Object.freeze([
        dayTemplate(4,"oddity-d4-room-watches-back","让房间记得我来过","给我一个会观察房间的东西。最好我走了以后，它还记得这里发生过什么；别用刺眼的强光把痕迹照没了。",4,{eerie:{min:2},memory:{min:3}},{dream:{min:1}},{},{requiredItemTags:["observation","memory_object"],preferredItemTags:["recording","advanced_result"],dislikedItemTags:["harsh_light"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:3,preferredRoomEffects:{observationStrength:{min:3}}})
      ])
    }),
    insomniac:Object.freeze({
      2:Object.freeze([
        dayTemplate(2,"insomniac-d2-real-bed","今晚先给我一张能睡的床","床舒服点就行。还有……别给我放会一直响的东西，我真的受不了。",2,{comfort:{min:4},dream:{min:2}},{},{light:{min:5},eerie:{min:4}},{requiredItemTags:["bed"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,preferredRecipeDepth:1}),
        dayTemplate(2,"insomniac-d2-dim-bed","床要软，光要暗","我只想躺下就睡。床软一点，光压低一点，其他声音都别来找我。",2,{comfort:{min:4},light:{max:4}},{dream:{min:3}},{eerie:{min:4}},{requiredItemTags:["bed","dim_light"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,preferredRecipeDepth:1})
      ]),
      3:Object.freeze([
dayTemplate(3,"insomniac-d3-quiet-dream","让整间屋安静下来","上次差点睡着。这次把床留下，再让整间屋慢一点……什么都别响。",3,{comfort:{min:4},dream:{min:4}},{},{light:{min:5},eerie:{min:4}},{requiredItemTags:["bed","atmosphere"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:2}),
        dayTemplate(3,"insomniac-d3-night-routine","灯、床和安静的夜晚","给我一点看得见的柔光，一张床，再把屋里那些乱七八糟的声音压下去。",3,{comfort:{min:4},dream:{min:3},light:{min:1,max:4}},{},{eerie:{min:4}},{requiredItemTags:["bed","light_source","atmosphere"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:3,minCompositionCategories:3,preferredRecipeDepth:2})
      ]),
      4:Object.freeze([
        dayTemplate(4,"insomniac-d4-hold-the-night","让今晚慢一点","床要舒服。再给我一个能把时间放慢的东西……不要滴答，也不要响。",4,{comfort:{min:4},dream:{min:3},light:{max:4}},{memory:{min:2}},{eerie:{min:4}},{requiredItemTags:["bed","clock"],preferredItemTags:["time_anchor","advanced_result"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:3,preferredRoomEffects:{timeStability:{min:3}}})
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
      ]),
      4:Object.freeze([
        dayTemplate(4,"elder-d4-stay-in-an-hour","把这一刻留久一点","我想要一件会走的旧东西，再留个能认出来的角落。要是这一刻能慢一点，就更好了。",4,{memory:{min:5},comfort:{min:2}},{dream:{min:1}},{eerie:{min:5}},{requiredItemTags:["clock","memory_object"],preferredItemTags:["time_anchor","personal"],dislikedItemTags:["mechanical_noise"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:3,preferredRoomEffects:{timeStability:{min:3}}})
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
      ]),
      4:Object.freeze([
        dayTemplate(4,"mechanic-d4-responsive-machine","装置要会回应房间","这次不要只会转的机器。我要它像活的一样读到房间变化，再给我一个稳定的辅助装置。",4,{light:{min:2},memory:{min:2}},{comfort:{min:1}},{dream:{min:5}},{requiredItemTags:["mechanical","observation"],preferredItemTags:["living_machine","recording","advanced_result"],dislikedItemTags:["noise","mechanical_noise"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:3,preferredRoomEffects:{observationStrength:{min:2}}})
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
      ]),
      4:Object.freeze([
        dayTemplate(4,"dreamwalker-d4-road-in-sleep","床要通向一条梦里的路","先给我一张床。然后在房间里留一条梦里的路——不是醒着能走的那种。",4,{dream:{min:5},comfort:{min:2},light:{max:4}},{memory:{min:1}},{eerie:{min:5}},{requiredItemTags:["bed","path","dream_object"],preferredItemTags:["advanced_result"],dislikedItemTags:["noise","mechanical_noise","harsh_light"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:3})
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
      ]),
      4:Object.freeze([
        dayTemplate(4,"cold-d4-even-warmth","暖意别只停在炉边","我不要只暖一个角落。地板要能踩，热气得慢慢走遍整间屋。",4,{warmth:{min:5},comfort:{min:3}},{light:{min:1}},{eerie:{min:5}},{requiredItemTags:["heater","floor"],preferredItemTags:["stable_heat","advanced_result"],dislikedItemTags:["cold","damp"],minDistinctComponents:2,minCompositionCategories:2,preferredRecipeDepth:3,preferredRoomEffects:{heatPersistence:{min:3}}})
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
      ]),
      4:Object.freeze([
        dayTemplate(4,"mystery-d4-guarded-dream-road","把那条路守住","今晚会有一条路经过房间。让它像梦一样出现，再替我守住入口。",4,{dream:{min:3},eerie:{min:3},memory:{min:3},light:{max:4}},{},{},{requiredItemTags:["path","protective"],preferredItemTags:["advanced_result"],dislikedItemTags:["observation","harsh_light"],minDistinctComponents:3,minCompositionCategories:2,preferredRecipeDepth:3,preferredRoomEffects:{protectionStrength:{min:3}}})
      ])
    })
  });
  const requestPoolForDay=(npc,day=1)=>day===1?npc.requestPool:(DAY_REQUEST_POOLS[npc.id]?.[Math.min(4,Math.max(2,day))]||npc.requestPool);
  const TAG_REACTION_POOLS=Object.freeze({
    child:{light_source:["有灯的话，我就能看清了。","这边亮起来了。","这盏灯开着，我就敢闭眼了。","先别关灯，好吗？","床边能看清，我就没那么怕。"],dim_light:["这个光软软的，不会晃眼睛。","留这么一点亮就好。","像月光，不刺眼。"],bed:["这个看着软软的。","我应该敢在这里躺下了。","这张床我喜欢。","嗯……我可以先坐一下吗？"],soft:["摸起来软一点，我就没那么紧张。","软软的，晚上应该不会冷。"],dream_object:["这个会把坏梦挡在外面吗？","它不会半夜自己做梦吧？"],spiritual:["这个里面是不是有什么？","我不太想靠近这个。","等等，这个先拿远一点。"],harsh_light:["太亮了，眼睛有点痛。","这个亮得我睡不着。"]},
    "oddity-lover":{door:["这扇门后面看着就不对劲，有意思。","门先留着，我还想看看它通哪儿。","诶，这入口有点东西。"],spiritual:["这个味道对了，再怪点也行。","它刚才是不是动了？太好了。","别解释，我就喜欢不知道它是什么。","这个能放房里？挺酷的啊。","有意思，再让我靠近点看。"],mirror:["镜子里看起来和外面不太一样。","等会儿，镜子里是不是少了一个人？"],observation:["它也在看我？这个不错。","我走以后它还会盯着门吗？"],memory_object:["像是别人落下的旧东西。","这旧东西肯定有故事。"],atmosphere:["屋里的空气都不太正常了。","一进来就不对劲，正好。"],dream_object:["这东西像是从梦里掉出来的。","这个梦看起来不太安全，我喜欢。"],decoration:["一进门就看到这个，够怪。","把怪的那面朝门口。"]},
    insomniac:{noise:["这东西晚上也会一直响吗？","这个声音……我听着就睡不着。","要不还是把它拿出去吧。","怎么还有声音……","这个先停掉，拜托。"],mechanical_noise:["这个一启动，我今晚就别想睡了。","振动一直传到床边，算了。","听着它，我脑子根本停不下来。"],clock:["这个晚上也会滴答滴答吗？","指针能不能停一晚？","钟放远一点，我不想数它走了几格。"],bed:["这个床看着还行。","嗯……至少躺着应该挺舒服。","这个我倒是挺想试试。","这个看着就挺软的。","嗯……这种床我应该能睡得久一点。","这张床先别动，我想躺一会儿。"],dim_light:["这个亮度可以，闭上眼不会还在晃。","灯这样暗一点就好。","这个光不追着眼睛跑，行。","雾里这点光……还算安静。"],harsh_light:["这个也太亮了。","晚上一直这么亮，我肯定睡不着。","把这个灯压暗一点，我眼睛疼。"],atmosphere:["屋里慢下来了一点。","嗯……空气总算没那么绷着。"],dream_object:["这个放床边，也许能让我少醒几次。","梦太多也麻烦，我只想睡。"],fog:["这个倒挺安静的……就是有点看不清。","雾留一点就行，别漫到床上。"],cold:["有点凉，我睡着以后可能会醒。","脚边是冷的，我会醒。"],spiritual:["它待在旁边，我反而更清醒了。","这种东西守床边？不了。"]},
    elder:{memory_object:["这个……让我想起以前了。","旧东西有旧东西的好。","这种东西我以前也留过一沓。","先别收，我再看看上面的旧痕。","嗯……这件比那些大阵仗更像日子。","看见它，我倒想起一个名字。"],personal:["这不是摆设，是有人真留过的东西。","字都淡了，心思还在。","信这种东西，舍不得扔也正常。"],mirror:["我以前家里也有这样一面镜子。","镜子旧一点，人看着也没那么生。"],clock:["这个声音慢慢的，像以前。","钟走着就好，别催。"],noise:["响一两声还好，一直响就扰人了。","上了年纪，耳边经不起一直闹。"],mechanical_noise:["现在的东西怎么都这么吵。","这个响法，摆床边就算了。"],decoration:["这个角落留着吧，别换新的。","墙上有点旧东西，屋子才像住过人。"],atmosphere:["屋里的气味，倒有点像从前。","嗯……这股气息慢慢回来了。"]},
    mechanic:{mechanical:["先别动，我要看看里面怎么接的。","这个结构还能再收紧一点。","动力传到这里，思路是对的。","负载接上以后再测一次。","齿轮啮合还行，噪声也压住了。","这个核心还有下一步，别急着当成成品。"],noise:["机械归机械，一直响可不算做得好。","能动是能动，没必要一直响吧。","声音比转速还大，结构有问题。"],mechanical_noise:["振动没收住，这不叫稳定。","先停机。这个共振不对。","噪声这么大，轴承肯定有问题。"],light_source:["照明够了，接缝都看得清。","光线稳定，可以检查细部。","灯别晃，测量会偏。"],observation:["它能记录东西？把读数给我看看。","扫描范围有多大？","这个眼的信号从哪儿输出？"],clock:["这个齿轮怎么走的？","擒纵结构还算干净。","节拍稳定，留着。"],lock:["锁舌做得不差，咬合还可以。","边界结构清楚，能用。"],door:["门轴有点松，不过结构能用。","门框受力还算均匀。"],memory_object:["旧归旧，先看它还能不能运转。","锈不等于坏，得拆开看。"],spiritual:["我看不见传动结构，它到底怎么动的？","没有动力源，它凭什么在动？"]},
    dreamwalker:{bed:["躺下以后，梦就会近一点。","这个……好像就是我该睡的地方。","床往下沉了，我还在上面。","别整理，它已经开始做梦。","这张床知道我要去哪。"],soft:["很软……只是还太像真的。","舒服，可梦还在门外。"],atmosphere:["墙边开始变远了。","空气慢下来，我也快不见了。","这里和醒着隔开了一点。"],dream_object:["它把醒着的声音压低了。","这个梦还没有完全散掉。","嗯……它记得我没做完的梦。"],fog:["雾进来了……很好。","看不清以后，路反而出来了。","雾别散，我快走到了。"],window:["梦可以从这扇窗进来。","窗外已经不是刚才那里了。"],noise:["这个声音会把我拉回来。","太响了……梦断了。"],light_source:["留一点光，但别让它太清醒。","月光可以，白天的灯不行。","光轻一点，我还没醒。"]},
    "cold-guest":{heater:["这个热乎多了。","嗯，这个放屋里应该挺暖。","先别关，我手还没暖回来。","热气散得开，这个行。","靠近一点……对，就是这个温度。"],fire:["火别灭，今晚就靠它了。","这个火能烧一夜吗？","炉边总算能坐人了。"],floor:["这个踩起来应该没那么冰。","总算不是那种冷冰冰的地面了。","地面暖不暖，我一脚就知道。"],cold:["这个别放我屋里，我看着都冷。","怎么感觉比刚才还冷了……","脚底都凉了，快拿走。","这股冷风是故意的吗？"],damp:["这个地面有点潮，我脚会更冷。","软是软，怎么湿乎乎的？"],light_source:["晚上起来至少看得见路。","灯留着，半夜找炉子方便。"],soft:["这个看着能挡一点冷气。","软的可以，别是凉的就行。"]},
    mystery:{door:["嗯……至少门在这里。","这扇门还可以。","别问我要去哪。","门留着。","它朝错了方向……现在对了。","这道边界，比墙更重要。"],lock:["这个锁有点意思。","有些门，最好确实锁上。","锁住的不是门。很好。"],observation:["你为什么要让它一直看着这里？","……这个东西不需要。","让那只眼转过去。"],memory_object:["它记得的事，比你以为的多。","信这种东西，写出来就不只是你的了。","旧痕会替我认路。"],personal:["有人写下它，也就留下了入口。","别拆那封信。"],atmosphere:["路开始看不清了。","看不清，才走得过去。"],dream_object:["梦会替门记住另一边。","今晚的梦会先穿过去。"],spiritual:["门后的东西已经靠近了。","它在外面。骨甲朝外。"]}
  });
  Object.assign(TAG_REACTION_POOLS["oddity-lover"],{
    secret:["原来入口藏在这里。别告诉我开关。","越不像门越好，我就要这种。","先别打开，让我猜一会儿。"],
    shadow:["影子比门先动了，太好了。","这边界看着不守规矩。","我想看看影子到底通向哪儿。"]
  });
  Object.assign(TAG_REACTION_POOLS.dreamwalker,{shadow:["影子已经走进梦里了。","别开灯，门后的距离正在变长。","这道影子边界知道梦往哪边走。"]});
  Object.assign(TAG_REACTION_POOLS.elder,{secret:["门藏得安静，不碍人。","这种暗门，以前老屋里也见过。"],shadow:["影子太深了，我不往那边走。","这扇门让我想不起屋外是什么。"]});
  Object.assign(TAG_REACTION_POOLS.mystery,{secret:["藏好。入口不该被每个人看见。","暗扣留着，不要标出来。","这扇门懂得沉默。"],shadow:["影子已经先过去了。","边界在影子里，不在门框上。","别踩那道影，它会记住你。"]});
  const NPC_STATES=Object.freeze(["ENTERING","REQUESTING","BUILDING","PREVIEW_ENTER","WAITING","WALKING_TO_ROOM","INSPECTING","REACTING","WAITING_FOR_CONFIRMATION","LEAVING"]);
  const NPC_EMOTIONS=Object.freeze(["NEUTRAL","HAPPY","RELAXED","SURPRISED","CONFUSED","SCARED","ANGRY","DISAPPOINTED"]);
  const BASE_SPECIAL_REACTIONS=Object.freeze({
    child:Object.freeze({
      "soul-fire":Object.freeze({emotion:"SCARED",line:"等等……这个灯里面是不是有什么东西？",reason:"魂灯的幽光让孩子害怕"}),
      "moon-lamp":Object.freeze({emotion:"RELAXED",line:"这个像月光一样，我还挺喜欢的。",reason:"柔和月光让孩子放松"}),
      "electric-lamp":Object.freeze({emotion:"HAPPY",line:"这个亮度刚刚好！",reason:"稳定亮光给了孩子安全感"}),
      "dream-bed":Object.freeze({emotion:"SURPRISED",line:"这张床好像在做梦……我得先看看里面有没有怪东西。",reason:"梦床让孩子好奇又有些犹豫"}),
      "cloud-bed":Object.freeze({emotion:"RELAXED",line:"这个软软的，我躺下应该就不怕了。",reason:"云床柔软稳定，让孩子安心"}),
      "bone-armor":Object.freeze({emotion:"SCARED",line:"等等，墙上为什么挂着骨头？",reason:"骨甲的外形让孩子害怕"}),
      "light-eye":Object.freeze({emotion:"SCARED",line:"它一直看着我……能把那只眼遮起来吗？",reason:"光眼的强光与注视感让孩子害怕"}),
      "fog-bridge":Object.freeze({emotion:"CONFUSED",line:"桥那边什么都看不见，我不想一个人过去。",reason:"雾桥不像可靠的现实路径"}),
      "shadow-lock":Object.freeze({emotion:"SCARED",line:"这个锁下面的影子是不是在动？",reason:"影锁的非机械形态让孩子不安"}),
      "memory-seal":Object.freeze({emotion:"SURPRISED",line:"它有点怪……不过放远一点，真的能守住门吗？",reason:"记忆封印带来安全感，也保留了让孩子犹豫的灵异感"})
    }),
    "oddity-lover":Object.freeze({
      "soul-fire":Object.freeze({emotion:"HAPPY",line:"这个不错，普通灯可没这个味道。",reason:"怪东西爱好者喜欢魂灯的异质感"}),
      "shadow-mirror":Object.freeze({emotion:"SURPRISED",line:"镜子里那个影子比我慢了半拍。",reason:"影镜带来了意外发现"}),
      "shadow-threshold":Object.freeze({emotion:"HAPPY",line:"对，就是这种不知道通向哪里的门。",reason:"影门符合奇异偏好"}),
      "dream-eye":Object.freeze({emotion:"SURPRISED",line:"它刚才是不是眨了一下？",reason:"梦眼引起了好奇"}),
      "dark-door":Object.freeze({emotion:"HAPPY",line:"一扇没有写通向哪里的门，这才对。",reason:"暗门符合奇异偏好"}),
      "bone-armor":Object.freeze({emotion:"HAPPY",line:"骨头和金属拼成墙甲？这个够怪，留着。",reason:"骨甲满足了怪异装饰偏好"}),
      "moon-pool":Object.freeze({emotion:"SURPRISED",line:"没有水声的水池？月光倒像在里面呼吸。",reason:"月光水池是无法立刻解释的静态景观"}),
      "frost-water":Object.freeze({emotion:"SURPRISED",line:"水冻住了还在动？这盆先别收。",reason:"霜水兼具静止与流动的矛盾感"}),
      "light-eye":Object.freeze({emotion:"HAPPY",line:"它在照我，还是在研究我？都行，留着。",reason:"光眼兼具功能与怪异副作用"}),
      "fog-bridge":Object.freeze({emotion:"HAPPY",line:"一条不通门外的桥？这才像旅店里该有的东西。",reason:"雾桥形成非现实路径"}),
      "shadow-lock":Object.freeze({emotion:"SURPRISED",line:"连锁舌都没有，它到底把什么锁住了？有意思。",reason:"影锁的非机械封闭方式符合奇异偏好"}),
      "echo-observatory":Object.freeze({emotion:"HAPPY",line:"它把我刚才那句话也记下来了？别删，我明天还要回来听。",reason:"回声观测台会记录整间房间的变化"})
    }),
    insomniac:Object.freeze({
      "mechanical-clock":Object.freeze({emotion:"DISAPPOINTED",line:"这个钟一直响，我大概更睡不着了。",reason:"机械钟的节律干扰休息"}),
      "mechanical-noise":Object.freeze({emotion:"ANGRY",line:"这个声音一晚不停的话，你还让我怎么睡？",reason:"机械噪声严重违背委托"}),
      "dream-bed":Object.freeze({emotion:"SURPRISED",line:"这张床会做梦？听着有点累，不过我可以试试。",reason:"梦床能引梦，但不够稳定"}),
      "cloud-bed":Object.freeze({emotion:"RELAXED",line:"这个托得挺稳……嗯，我想现在就躺下。",reason:"云床柔软稳定，适合睡眠"}),
      "moon-lamp":Object.freeze({emotion:"RELAXED",line:"这个光不刺眼，可以留着。",reason:"月灯光线柔和"}),
      "fog-lamp":Object.freeze({emotion:"RELAXED",line:"雾里这点光挺安静的……留着吧。",reason:"雾灯柔和且不会刺激眼睛"}),
      "electric-lamp":Object.freeze({emotion:"DISAPPOINTED",line:"这个灯太精神了，我闭眼还看得见。",reason:"电灯可靠但对失眠者过亮"}),
      "wind-chime":Object.freeze({emotion:"DISAPPOINTED",line:"它每响一下，我就会再醒一次。",reason:"风铃的声音干扰睡眠"}),
      "moon-pool":Object.freeze({emotion:"RELAXED",line:"没有水声就好……天花上的反光看着挺安静。",reason:"无声月光水景不会打断休息"}),
      "hourglass-sand":Object.freeze({emotion:"RELAXED",line:"它不滴答，只是慢慢落……这个我能接受。",reason:"时砂漏提供无声的时间感"}),
      "light-eye":Object.freeze({emotion:"DISAPPOINTED",line:"关不掉的亮光还一直盯着我，我更睡不着了。",reason:"光眼同时带来强光与注视压力"}),
      "fog-bridge":Object.freeze({emotion:"CONFUSED",line:"我只想睡觉，不想半夜找这座桥通向哪儿。",reason:"雾桥会让普通休息空间失去安定感"}),
      "time-anchor":Object.freeze({emotion:"RELAXED",line:"它没响……但房间真的慢下来了。就这样，别再动。",reason:"时序锚提供无声且稳定的时间感"})
    }),
    elder:Object.freeze({"memory-mirror":Object.freeze({emotion:"SURPRISED",line:"镜子里的光，像我以前家里那面。",reason:"记忆镜唤起了往事"}),"old-affection":Object.freeze({emotion:"RELAXED",line:"有些事过了很久，摸到还是暖的。",reason:"旧情带来温暖回忆"}),past:Object.freeze({emotion:"RELAXED",line:"嗯……就让过去在这里坐一会儿吧。",reason:"往昔氛围符合老人偏好"}),"echo-bell":Object.freeze({emotion:"SURPRISED",line:"这个回声，像老屋走廊里传过来的。",reason:"回声铃触发熟悉记忆"}),"memory-letter":Object.freeze({emotion:"RELAXED",line:"这种东西我以前也留过一沓。",reason:"私人旧信比宏大记忆造物更贴近日常"}),"memory-door":Object.freeze({emotion:"RELAXED",line:"这扇门像是还记得旧屋的方向。",reason:"记忆之门带来熟悉的归家感"}),"bone-armor":Object.freeze({emotion:"DISAPPOINTED",line:"这个摆床边就算了，夜里看着不安生。",reason:"老人不喜欢骨甲靠近休息处"}),"hourglass-sand":Object.freeze({emotion:"RELAXED",line:"沙落得这么慢……从前等一个人，也是这样看着时间走。",reason:"时砂漏把时间流逝转化为怀旧体验"}),"time-anchor":Object.freeze({emotion:"RELAXED",line:"这会儿像是肯多留一阵了……坐下吧，不必催它走。",reason:"时序锚让老人感到一段记忆被安稳保留"})}),
    mechanic:Object.freeze({"mechanical-clock":Object.freeze({emotion:"HAPPY",line:"齿轮节距还算准。",reason:"机械钟结构清晰"}),"mechanical-heart":Object.freeze({emotion:"SURPRISED",line:"它的节律是自己生成的？",reason:"机械心脏引发技术好奇"}),"electric-lamp":Object.freeze({emotion:"HAPPY",line:"供电稳，亮度也够。",reason:"电灯运转稳定"}),"gear-core":Object.freeze({emotion:"SURPRISED",line:"这个核心还差一个真正的负载。",reason:"齿轮核心具有扩展潜力"}),"rust-machine":Object.freeze({emotion:"CONFUSED",line:"它能动，但这些锈会让结构不稳。",reason:"锈蚀机结构不稳"}),"light-eye":Object.freeze({emotion:"HAPPY",line:"光路和观察方向是同一套结构，效率不错。",reason:"光眼兼具照明与观察功能"}),"hourglass-sand":Object.freeze({emotion:"SURPRISED",line:"没有擒纵机构？简单，但这种无声计时值得看看。",reason:"机械师认可时砂漏与机械钟不同的结构"}),"shadow-lock":Object.freeze({emotion:"CONFUSED",line:"没有锁舌，也没有受力点——它凭什么算锁住了？",reason:"影锁缺少机械师能理解的传动结构"}),"breathing-drive":Object.freeze({emotion:"SURPRISED",line:"动力回路在自己调节节拍……先别拆，我要看它下一次呼吸。",reason:"呼吸驱动核展现了会响应环境的机械生命"}),"echo-observatory":Object.freeze({emotion:"HAPPY",line:"整间房的变化都留下读数了。这个才算完整观测。",reason:"回声观测台满足全室观测需求"})}),
    dreamwalker:Object.freeze({"dream-bed":Object.freeze({emotion:"RELAXED",line:"别叫我……床已经开始下沉了。",reason:"梦床引入睡意"}),"cloud-bed":Object.freeze({emotion:"RELAXED",line:"挺舒服的，不过有点太正常了。",reason:"云床舒适但梦境感较弱"}),"moon-lamp":Object.freeze({emotion:"HAPPY",line:"月光留在床边……梦就不会走散。",reason:"月灯提供梦游者偏爱的柔和梦境光"}),"fog-lamp":Object.freeze({emotion:"RELAXED",line:"光在雾里慢下来，我也快睡着了。",reason:"雾灯模糊现实边界"}),"dream-fog":Object.freeze({emotion:"RELAXED",line:"雾把墙放远了。",reason:"梦雾改变空间感"}),moonlight:Object.freeze({emotion:"HAPPY",line:"月光在地上，我在另一边。",reason:"月色符合梦境"}),"moon-dust":Object.freeze({emotion:"SURPRISED",line:"这些微光落下来以后，梦变得更近了。",reason:"月尘形成柔和的梦境线索"}),"fog-window":Object.freeze({emotion:"RELAXED",line:"窗外没有路了……这样正好。",reason:"雾窗模糊了现实边界"}),"moss-floor":Object.freeze({emotion:"SURPRISED",line:"脚下像长进了梦里……别换掉。",reason:"苔地板的有机潮湿感符合梦游者"}),"shadow-threshold":Object.freeze({emotion:"SURPRISED",line:"影子已经进去了……门还留在这里。",reason:"影门把现实边界转化为梦境通道"}),"moon-pool":Object.freeze({emotion:"HAPPY",line:"月亮没有挂在天上，它沉在房间里……正好。",reason:"月光水池把无声月色固定在室内"}),"frost-water":Object.freeze({emotion:"SURPRISED",line:"冰下面还在流，梦也会从那条缝里过去。",reason:"霜水的缓慢流动具有梦境暗示"}),"hourglass-sand":Object.freeze({emotion:"SURPRISED",line:"沙落下去了，刚才那一刻却还没走。",reason:"时砂漏制造异常时间感"}),"fog-bridge":Object.freeze({emotion:"HAPPY",line:"路终于出现了……别问它通向哪里。",reason:"雾桥提供通往非现实空间的梦境路径"}),"dream-road":Object.freeze({emotion:"HAPPY",line:"路已经睡着了……我沿着雾往下走。",reason:"梦中雾径提供了只有入睡后出现的路径"})}),
    "cold-guest":Object.freeze({fireplace:Object.freeze({emotion:"HAPPY",line:"啊，这个终于有点用了。",reason:"壁炉带来强暖意"}),"steam-heater":Object.freeze({emotion:"HAPPY",line:"暖气散得挺匀，这个不错。",reason:"蒸汽暖器持续取暖"}),steam:Object.freeze({emotion:"RELAXED",line:"这股热气要是能留久一点就好了。",reason:"蒸汽提供短暂暖意"}),"ice-wind":Object.freeze({emotion:"ANGRY",line:"你还把冰风放我房里？",reason:"冰风严重违背取暖需求"}),"wood-floor":Object.freeze({emotion:"RELAXED",line:"这个地面踩上去不会抽脚。",reason:"木地板减少冰冷感"}),"moss-floor":Object.freeze({emotion:"DISAPPOINTED",line:"这地板软是软，可潮气一直往脚上钻。",reason:"苔地板潮冷，不适合怕冷客人"}),"wet-sand":Object.freeze({emotion:"CONFUSED",line:"这地面不冰，可踩着湿漉漉的也不好受。",reason:"湿沙地保留了水汽和不适感"}),"frost-water":Object.freeze({emotion:"ANGRY",line:"你还真把一盆结霜的水放进来了？快拿出去。",reason:"霜水会持续放大房间寒意"}),"everwarm-hearth":Object.freeze({emotion:"HAPPY",line:"这次不是只有炉边热了。脚底也暖，今晚它别停就行。",reason:"恒温炉心把暖意稳定送到整间房"})}),
    mystery:Object.freeze({"memory-door":Object.freeze({emotion:"HAPPY",line:"这扇门记得我。",reason:"记忆之门回应了旅客"}),"shadow-threshold":Object.freeze({emotion:"RELAXED",line:"影子已经先过去了。",reason:"影门形成边界"}),"spirit-door":Object.freeze({emotion:"SURPRISED",line:"它今晚竟然是醒着的。",reason:"灵门产生意外回应"}),"dark-door":Object.freeze({emotion:"RELAXED",line:"藏起来。这样才像入口。",reason:"暗门满足了隐秘而非灵异的入口需求"}),"shadow-lock":Object.freeze({emotion:"HAPPY",line:"有些东西确实不该跟着出来。",reason:"影锁封闭了边界"}),"signal-eye":Object.freeze({emotion:"CONFUSED",line:"把它的视线转开。",reason:"神秘客人不喜欢被观察"}),"bone-armor":Object.freeze({emotion:"RELAXED",line:"骨甲朝外。很好，门后的东西进不来。",reason:"骨甲形成了保护边界"}),"moon-pool":Object.freeze({emotion:"SURPRISED",line:"水里没有月亮。很好，它在等另一边的月亮。",reason:"月光水池暗示另一处空间"}),"hourglass-sand":Object.freeze({emotion:"RELAXED",line:"让它继续落。门只在某一粒沙经过时打开。",reason:"时砂漏为入口提供时间条件"}),"light-eye":Object.freeze({emotion:"CONFUSED",line:"让它闭上。我要走的路不该被看见。",reason:"神秘客拒绝光眼的持续观察"}),"fog-bridge":Object.freeze({emotion:"HAPPY",line:"桥已经到了，尽头还在路上。",reason:"雾桥形成非现实通路"}),"memory-seal":Object.freeze({emotion:"RELAXED",line:"封印朝里，路朝外。今晚没有别的东西会跟过来。",reason:"记忆封印守住房间边界"}),"dream-road":Object.freeze({emotion:"HAPPY",line:"路来了。别照亮它，也别问我什么时候回来。",reason:"梦中雾径形成受控的非现实通路"})})
  });
  const DAY4_SPECIAL_REACTIONS=Object.freeze({
    child:Object.freeze({
      "breathing-drive":Object.freeze({emotion:"SCARED",line:"它真的在呼吸……我不要它在床边看着我。",reason:"会回应环境的机械生命让孩子害怕"}),
      "time-anchor":Object.freeze({emotion:"CONFUSED",line:"今晚怎么一直不往前走？我有点不敢睡了。",reason:"孩子不喜欢夜晚被固定住"}),
      "dream-road":Object.freeze({emotion:"SCARED",line:"这条路要等我睡着才出现？那我不想一个人过去。",reason:"梦中路径让孩子缺乏安全感"}),
      "everwarm-hearth":Object.freeze({emotion:"RELAXED",line:"暖气真的走到床边了。这样我就不用缩在炉子旁边。",reason:"持续均匀的暖意让孩子安心"})
    }),
    "oddity-lover":Object.freeze({
      "breathing-drive":Object.freeze({emotion:"HAPPY",line:"它刚才跟着我喘了一下？很好，千万别修成普通机器。",reason:"机械生命的房间响应符合怪异偏好"}),
      "dream-road":Object.freeze({emotion:"HAPPY",line:"醒着看不见的路？今晚我偏要看看它把我送去哪儿。",reason:"梦中雾径提供可探索的非现实路径"}),
      "memory-seal":Object.freeze({emotion:"HAPPY",line:"拿记忆当门闩，这可比普通锁有意思多了。",reason:"记忆封印以旧痕迹维持边界"}),
      "everwarm-hearth":Object.freeze({emotion:"DISAPPOINTED",line:"整间屋都一样暖？太听话了，反而没什么怪的。",reason:"稳定均匀的暖意对怪东西爱好者过于普通"})
    }),
    insomniac:Object.freeze({
      "echo-observatory":Object.freeze({emotion:"CONFUSED",line:"它会记下整晚的动静？那我更要想着自己有没有睡着了。",reason:"全室记录会加重失眠者的自我关注"}),
      "everwarm-hearth":Object.freeze({emotion:"RELAXED",line:"没有响声，暖意也没停……这样躺着应该不会再醒。",reason:"无声且持续的暖意帮助休息"})
    }),
    elder:Object.freeze({
      "echo-observatory":Object.freeze({emotion:"SURPRISED",line:"连刚才那声咳嗽也留下了……原来一间屋也会替人记事。",reason:"回声观测台保存整间客房的生活痕迹"}),
      "memory-seal":Object.freeze({emotion:"RELAXED",line:"把这点旧事留在门里吧。明早走了，也别让它散掉。",reason:"记忆封印保存老人珍惜的旧痕迹"})
    }),
    mechanic:Object.freeze({
      "time-anchor":Object.freeze({emotion:"HAPPY",line:"它固定的是节拍，不是把齿轮卡死。这个结构成立。",reason:"时序锚稳定时间而非制造机械停转"}),
      "dream-road":Object.freeze({emotion:"CONFUSED",line:"这条路只在睡着后出现，我没法测它的承重。先别算装置。",reason:"梦中路径无法用机械标准验证"}),
      "memory-seal":Object.freeze({emotion:"CONFUSED",line:"它靠一段回忆受力？我找不到能检修的结构。",reason:"记忆封印缺少可检修的机械结构"}),
      "everwarm-hearth":Object.freeze({emotion:"HAPPY",line:"热量在全室循环，输出也没乱跳。这个辅助装置合格。",reason:"恒温炉心提供稳定的全室热循环"})
    }),
    dreamwalker:Object.freeze({
      "echo-observatory":Object.freeze({emotion:"CONFUSED",line:"它把梦里的脚步也记下来了……那我醒来以后还走得掉吗？",reason:"全室记录使梦游者担心梦境留下束缚"}),
      "time-anchor":Object.freeze({emotion:"SURPRISED",line:"梦醒了，这一刻还没醒……我可以再从这里走一次。",reason:"时序锚让梦中的一个时刻得以重复"}),
      "memory-seal":Object.freeze({emotion:"CONFUSED",line:"别把梦锁住。它要是记得出口，我反而回不来了。",reason:"记忆封印会让梦境边界过于固定"}),
      "everwarm-hearth":Object.freeze({emotion:"DISAPPOINTED",line:"太均匀了……梦里的温度不该每个角落都一样。",reason:"恒温炉心的稳定感削弱梦境变化"})
    }),
    "cold-guest":Object.freeze({
      "breathing-drive":Object.freeze({emotion:"CONFUSED",line:"它自己喘得挺热闹，可我站这边还是冷。",reason:"机械生命的局部暖意不能替代全室供暖"}),
      "echo-observatory":Object.freeze({emotion:"CONFUSED",line:"记录冷不冷有什么用？先让屋里暖起来。",reason:"观测装置没有解决怕冷需求"}),
      "time-anchor":Object.freeze({emotion:"CONFUSED",line:"你把这一刻留久一点，我就得多冷一会儿。",reason:"怕冷客人不希望寒冷时刻被固定"}),
      "dream-road":Object.freeze({emotion:"ANGRY",line:"雾都铺到地上了！我脚还没暖，你先给我修了条冷路？",reason:"梦中雾径的冷雾违背取暖需求"}),
      "memory-seal":Object.freeze({emotion:"CONFUSED",line:"锁得再牢也不保暖。这个先别占炉子的位置。",reason:"防护物没有解决取暖需求"})
    }),
    mystery:Object.freeze({
      "breathing-drive":Object.freeze({emotion:"SCARED",line:"让它停下。门后的东西会听见这阵呼吸。",reason:"机械生命的持续响应会暴露隐秘入口"}),
      "echo-observatory":Object.freeze({emotion:"CONFUSED",line:"它记得太多。我要经过的路，不该留下整间屋的记录。",reason:"全室记录违背神秘客人的隐匿需求"}),
      "time-anchor":Object.freeze({emotion:"RELAXED",line:"很好。门只需要在这一刻打开，把它留在这里。",reason:"时序锚固定了隐秘入口开启的时刻"})
    })
  });
  const SPECIAL_REACTIONS=Object.freeze(Object.fromEntries(Object.keys(BASE_SPECIAL_REACTIONS).map(npcId=>[npcId,Object.freeze({...BASE_SPECIAL_REACTIONS[npcId],...(DAY4_SPECIAL_REACTIONS[npcId]||{})})])));
  class NPCStateMachine{constructor(onChange=()=>{}){this.state="ENTERING";this.history=["ENTERING"];this.onChange=onChange}setState(next,detail={}){if(!NPC_STATES.includes(next))throw new Error(`Unknown NPC state: ${next}`);this.state=next;this.history.push(next);this.onChange(next,detail);return next}reset(){this.history=[];return this.setState("ENTERING")}}
  const satisfies=(value,rule)=>!(rule.min!==undefined&&value<rule.min)&&!(rule.max!==undefined&&value>rule.max);
  const countSatisfied=(rules,values)=>Object.entries(rules||{}).filter(([key,rule])=>satisfies(values[key]||0,rule)).length;
  const tagCount=(counts,tag)=>Number(counts?.[tag])||0;
  function evaluateRequestItem(request,item,roomStats={},roomTags=[],context={}){
    const requiredStats=request.requiredStats||{},preferredStats=request.preferredStats||{},dislikedStats=request.dislikedStats||{},roomTagCounts=context.roomTagCounts||Object.fromEntries(roomTags.map(tag=>[tag,1])),composition=context.roomComposition||{},components=context.components||[],roomEffects=context.roomEffects||components.reduce((total,component)=>{for(const [key,value] of Object.entries(component.roomEffects||{}))if(Number.isFinite(Number(value)))total[key]=(total[key]||0)+Number(value);return total},{});
    const requiredTags=request.requiredItemTags||request.requiredRoomTags||[],preferredTags=request.preferredItemTags||[],dislikedTags=request.dislikedItemTags||[];
    const statsMet=countSatisfied(requiredStats,roomStats)===Object.keys(requiredStats).length,missingRequiredTags=requiredTags.filter(tag=>tagCount(roomTagCounts,tag)<1),tagRequirementsMet=missingRequiredTags.length===0;
    const meaningfulComponents=components.filter(component=>calculateComponentRelevance(component,request)>=.25),distinctComponents=meaningfulComponents.length||(!components.length&&item?1:0),compositionCategoryCount=Object.values(composition).filter(Boolean).length,distinctMet=distinctComponents>=(request.minDistinctComponents||1),compositionMet=compositionCategoryCount>=(request.minCompositionCategories||1);
    const roomRequirementsMet=statsMet&&tagRequirementsMet&&distinctMet&&compositionMet,depthPreferred=(request.preferredRecipeDepth||0)>0,depthMet=!depthPreferred||components.some(component=>(component.recipeDepth||0)>=request.preferredRecipeDepth),preferredEffectEntries=Object.entries(request.preferredRoomEffects||{}),preferredEffectMet=preferredEffectEntries.filter(([key,rule])=>satisfies(roomEffects[key]||0,rule)).map(([key])=>key),preferredMet=countSatisfied(preferredStats,roomStats)+preferredTags.filter(tag=>tagCount(roomTagCounts,tag)>0).length+(depthPreferred&&depthMet?1:0)+preferredEffectMet.length;
    const dislikedStatHits=Object.entries(dislikedStats).filter(([key,rule])=>satisfies(roomStats[key]||0,rule)).map(([key])=>key),dislikedTagHits=dislikedTags.filter(tag=>tagCount(roomTagCounts,tag)>0),dislikedEffectHits=Object.entries(request.dislikedRoomEffects||{}).filter(([key,rule])=>satisfies(roomEffects[key]||0,rule)).map(([key])=>key),dislikedHits=dislikedStatHits.length+dislikedTagHits.length+dislikedEffectHits.length;
    let score=0;if(roomRequirementsMet){const preferredTotal=Object.keys(preferredStats).length+preferredTags.length+(depthPreferred?1:0)+preferredEffectEntries.length;score=dislikedHits?1:(preferredMet===preferredTotal?3:2)}
    return{score,requiredMet:roomRequirementsMet,roomRequirementsMet,statsMet,tagRequirementsMet,distinctMet,compositionMet,depthMet,missingRequiredTags,preferredMet,preferredEffectMet,dislikedHits,dislikedStatHits,dislikedTagHits,dislikedEffectHits,item,roomStats,roomEffects,roomTags,roomTagCounts,roomComposition:composition,distinctComponents,meaningfulComponents,compositionCategoryCount,components,request,npc:request.npc||null}
  }
  function calculateNpcScore({request={},roomStats={},roomTags=[],roomTagCounts={},roomComposition={},roomEffects={},components=[],item=null,npc=null}={}){return evaluateRequestItem({...request,npc},item,roomStats,roomTags,{roomTagCounts,roomComposition,roomEffects,components})}
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
    const normalized=Math.round(Math.max(0,Math.min(1,earned/possible+(Number(request.npc?.itemPreferences?.[component.id])||0)))*100)/100;
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
  function pickSpeech(npc,intent,random=Math.random,used=new Set()){const profile=profileFor(npc),pool=feedbackIntentPool[npc?.id]?.[intent]||profile.intents?.[intent]||feedbackIntentPool.default?.[intent]||FEELING_VARIANTS[intent]||FEELING_VARIANTS.GENERIC_BAD,available=pool.filter(line=>!used.has(line)),choices=available.length?available:pool,line=choices[Math.min(choices.length-1,Math.floor(random()*choices.length))];used.add(line);return line}
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
    elder:["{item}放在这里，倒像从前住过的屋子。","{item}留着这个旧样子就好。","看到{item}，我想起以前家里的一个角落。"],
    mechanic:["{item}先留着，我还要再看一眼结构。","{item}的接缝还算规整。","把{item}转过来，我要看背面的连接。"],
    dreamwalker:["{item}一靠近，墙就远了一点。","别碰{item}，梦还停在上面。","{item}的影子已经先睡着了。"],
    "cold-guest":["{item}靠近一点，我手总算没那么僵。","嗯，{item}这边确实暖和些。","{item}先别拿走，我还冷着呢。"],
    mystery:["{item}留着。它知道该朝哪边。","别动{item}。它已经听见门后的声音。","{item}认得这条路，不需要解释。"]
  });
  const SPECIAL_REACTION_DELIVERY=Object.freeze({
    child:{positive:["{item}可以留下。","嗯……{item}我愿意再靠近一点。","{item}放床边，我就看得见了。","{item}不会吓我。"],negative:["等等，{item}先离我远一点。","我不想让{item}靠床太近。","{item}晚上不会自己动吧？","{item}我有点怕。"]},
    "oddity-lover":{positive:["{item}越看越有意思。","别收走，{item}正合我意。","{item}够怪，留着！","等等，我还没研究完{item}。"],negative:["怪是够怪，可{item}这个方向不太对。","{item}先放远点，我得重新看看。","{item}怪得有点无聊。","这个{item}先别算成品。"]},
    insomniac:{positive:["嗯……{item}可以留。","{item}别再动了，这样我还能睡。","这个{item}不吵，行。","{item}放远一点光，我能睡。"],negative:["{item}先拿远一点，我现在更清醒了。","等等，{item}今晚不会一直这样吧？","这个{item}一放进来，我更睡不着了。","{item}先停掉，真的。"]},
    elder:{positive:["{item}让我想起些旧事。","嗯，{item}留在这里吧。","{item}我以前见过类似的。","{item}旧得刚刚好。","{item}别急着收，我再看一会儿。","把{item}放回原处就好。","嗯，{item}留着吧。","{item}看着不生。"],negative:["{item}看久了，心里不太安稳。","先把{item}挪开吧。","{item}摆床边就算了。","{item}太闹，我歇不住。"]},
    mechanic:{positive:["{item}的结构值得再看一遍。","先别动{item}，连接做得不错。","{item}运转稳定，可以。","{item}还有继续加工的余地。"],negative:["{item}这个状态不对。","停一下，{item}得先断开检查。","{item}的振动没收住。","{item}不能带故障运行。"]},
    dreamwalker:{positive:["{item}已经飘进梦里了。","别碰{item}……它正在变远。","{item}落下以后，梦近了。","{item}已经先睡着了。"],negative:["{item}把梦吵醒了。","先让{item}离开这里。","{item}太清楚，我醒了。","{item}不属于今晚的梦。"]},
    "cold-guest":{positive:["{item}靠近一点，暖和。","嗯，{item}总算有点用。","{item}能把冷气挡住。","{item}先别拿走，我还没暖够。"],negative:["{item}拿走，光看着我都冷。","别把{item}留在床边。","{item}冷得我手疼。","{item}一来，地面又凉了。"]},
    mystery:{positive:["{item}知道该待在哪里。","留下{item}。别问。","{item}朝向门外。很好。","{item}认得路。","{item}已经选好位置。","让{item}朝着门。","{item}不必解释。","就留{item}。"],negative:["{item}不该在这一边。","把{item}转过去。现在。","{item}会把路引错。","拿走{item}。门在等。"]}
  });
  function spokenObjectName(component){const tags=normalizeItemTags([...(component?.tags||[]),...(component?.usageTags||[]),component?.roomRole].filter(Boolean));if(tags.includes("bed"))return"这张床";if(tags.includes("light_source"))return"床边这盏灯";if(tags.includes("door"))return"这扇门";if(tags.includes("clock"))return"这个钟";if(tags.includes("mirror"))return"这面镜子";if(tags.includes("floor"))return"脚下这块地板";if(tags.includes("memory_object"))return"这件旧物";if(tags.includes("protective"))return"这件护具";if(tags.includes("atmosphere"))return"这股气息";if(tags.includes("observation"))return"这个装置";return component?.label?`这个${component.label}`:"这个东西"}
  function selectSpecialReactionLine(npc={},specialReaction={},random=Math.random){const negative=["CONFUSED","SCARED","ANGRY","DISAPPOINTED"].includes(specialReaction.emotion),delivery=SPECIAL_REACTION_DELIVERY[npc.id]?.[negative?"negative":"positive"]||[],pool=[specialReaction.line,...delivery.map(line=>line.replace("{item}",spokenObjectName(specialReaction.component)))].filter(Boolean);return pool[Math.min(pool.length-1,Math.floor(random()*pool.length))]}
  function selectObjectReaction(npc={},components=[],request={},random=Math.random){const pool=OBJECT_REACTION_TEMPLATES[npc.id]||[],relevant=components.filter(component=>calculateComponentRelevance(component,request)>=.4);if(!pool.length||!relevant.length)return null;const component=relevant[Math.min(relevant.length-1,Math.floor(random()*relevant.length))],template=pool[Math.min(pool.length-1,Math.floor(random()*pool.length))];return{component,line:template.replace("{item}",spokenObjectName(component))}}
  function canonicalFeedbackIntent(intent=""){const raw=String(intent),tag=raw.startsWith("tag:")?raw.slice(4):"";if(["harsh_light"].includes(tag))return"TOO_BRIGHT";if(["noise","mechanical_noise"].includes(tag))return"TOO_NOISY";if(["cold","damp"].includes(tag))return"TOO_COLD";if(raw.startsWith("missing:"))return"MISSING_CORE";if(raw.startsWith("special:"))return"SPECIAL_TAG";if(raw.startsWith("object:"))return"LIKES_OBJECT";if(raw==="CONFUSED"||raw==="IRRELEVANT")return"CONFUSED_OBJECT";if(raw==="LIKES_ITEM")return"LIKES_OBJECT";if(raw==="DISLIKES_ITEM")return"DISLIKES_OBJECT";if(raw==="CONFUSED_ITEM")return"CONFUSED_OBJECT";if(raw.startsWith("tag:"))return"SPECIAL_TAG";if(raw.startsWith("feeling:"))return raw.slice(8);return raw}
  const HISTORY_REFERENCE_ENDINGS=Object.freeze({child:["我还记得。","我上回敢闭眼了。","那次我没那么怕。"],"oddity-lover":["我回去还想了半天。","我一直没猜出它怎么做的。","那件怪东西我可没忘。"],insomniac:["我确实多睡了一会儿。","我醒来以后还记得。","那晚总算没一直翻身。"],elder:["我后来还想起过。","那种旧样子，我没忘。","看着它，心里会慢一点。"],mechanic:["结构我记得。","我后来又想了下它的接法。","上回的数据还在我脑子里。"],dreamwalker:["还留在梦里。","我醒来时它还在。","后来又在梦里见过。"],"cold-guest":["那晚没让我一直发抖。","我那回终于把手暖过来了。","至少那次没冻醒。"],mystery:["它仍然记得我。","它后来还开过一次。","那条路没有忘记。"]});
  function repeatGuestReference(npc={},solutionHistory=[],random=Math.random){if(!Array.isArray(solutionHistory)||!solutionHistory.length||random()>=.24)return null;const recent=solutionHistory.slice(-3).filter(record=>record?.usedComponents?.length);if(!recent.length)return null;const record=recent[Math.min(recent.length-1,Math.floor(random()*recent.length))],used=record.usedComponents,component=used.find(item=>item.roomRole==="light")||used.find(item=>item.id?.includes("bed"))||used.find(item=>item.roomRole==="door")||used.find(item=>item.id?.includes("clock"))||used[0];if(!component)return null;const nounPool=component.roomRole==="light"?["上次那个小灯","上回床边那盏灯","之前留下的那盏灯"]:component.id?.includes("bed")?["上回那张床","之前那张软床","我睡过的那张床"]:component.roomRole==="door"?["上次那扇门","之前那道门","我来过的那扇门"]:component.id?.includes("clock")?["上回那个钟","之前那个钟","我听过的那个钟"]:[`上次那个${component.label}`,`之前的${component.label}`,`我见过的${component.label}`],endings=HISTORY_REFERENCE_ENDINGS[npc.id]||["我还记得。","我没有忘。","后来又想起来了。"],noun=nounPool[Math.min(nounPool.length-1,Math.floor(random()*nounPool.length))],ending=endings[Math.min(endings.length-1,Math.floor(random()*endings.length))];return`${noun}，${ending}`}
  function feedbackGenerator({roomStats={},request={},npc={},score=0,item=null,components=[],emotionResult=null,emotion=null,solutionHistory=[],random=Math.random}){
    const resolved=emotionResult||calculateNpcEmotion({npc,request,roomStats,components,score}),feeling=emotion||resolved.finalEmotion,accepted=resolved.requiredMet!==false&&!['CONFUSED','DISAPPOINTED','SCARED','ANGRY'].includes(feeling),focus=selectFeedbackFocus(roomStats,request,npc,resolved),used=new Set(),intents=new Set(),lines=[];
    const push=(line,intent)=>{const family=canonicalFeedbackIntent(intent);if(!line||used.has(line)||intents.has(family)||lines.length>=2)return false;lines.push(line);used.add(line);intents.add(family);return true};
    const repeatLine=repeatGuestReference(npc,solutionHistory,random);if(repeatLine)push(repeatLine,"REPEAT_GUEST");
    if(resolved.specialReaction?.line){push(selectSpecialReactionLine(npc,resolved.specialReaction,random),`special:${resolved.specialReaction.component?.id||"item"}`);for(const tag of normalizeItemTags(resolved.specialReaction.component?.tags||[]))intents.add(canonicalFeedbackIntent(`tag:${tag}`))}
    const missingReaction=selectMissingTagReaction(npc,resolved,random);if(missingReaction)push(missingReaction.line,`missing:${missingReaction.tag}`);
    const tagReaction=selectTagReaction(npc,components,request,resolved,random);if(tagReaction)push(tagReaction.line,`tag:${tagReaction.tag}`);
    const primary=primaryFeelingIntent({npc,roomStats,request,score,emotionResult:{...resolved,finalEmotion:feeling},focus,components});
    if(accepted&&lines.length<2&&random()<.55){const objectReaction=selectObjectReaction(npc,components,request,random);if(objectReaction)push(objectReaction.line,`object:${objectReaction.component.id}`)}
    if(lines.length<2)push(pickSpeech(npc,primary,random,used),`feeling:${primary}`);
    const secondary=accepted?(npc.id==="child"?"COMFORTABLE":npc.id==="insomniac"?"RESTFUL":npc.id==="elder"?"FAMILIAR":npc.id==="oddity-lover"?"STRANGE_GOOD":npc.id==="mechanic"?"ORDERLY":npc.id==="dreamwalker"?"DREAMY":npc.id==="cold-guest"?"WARM_ENOUGH":npc.id==="mystery"?"THRESHOLD":"GENERIC_GOOD"):(resolved.irrelevantCount?"IRRELEVANT":primary);if(lines.length<2)push(pickSpeech(npc,secondary,random,used),`feeling:${secondary}`);
    const decisionIntent=accepted?"ACCEPTED":"REJECTED",decision=pickSpeech(npc,decisionIntent,random,new Set(used));if(!used.has(decision))lines.push(decision);return[...new Set(lines)].slice(0,3)
  }
  const feedbackDisplayDuration=text=>Math.max(2200,String(text||"").length*90);
  const NPCRequests=npcDatabase.flatMap(npc=>[...npc.requestPool,...(DAY_REQUEST_POOLS[npc.id]?.[2]||[]),...(DAY_REQUEST_POOLS[npc.id]?.[3]||[]),...(DAY_REQUEST_POOLS[npc.id]?.[4]||[])]);
  root.NPC_SYSTEM={npcDatabase,NPCRequests,NPCRequest:npcDatabase[0].requestPool[0],DAY_REQUEST_POOLS,requestPoolForDay,ROOM_EFFECT_META,TAG_REACTION_POOLS,MISSING_TAG_REACTIONS,NPC_STATES,NPC_EMOTIONS,NPCStateMachine,evaluateRequestItem,calculateNpcScore,calculateComponentRelevance,calculateRequestViolationScore,calculateNpcEmotion,SPECIAL_REACTIONS,evaluationDialogue,selectFeedbackFocus,selectTagReaction,selectMissingTagReaction,primaryFeelingIntent,pickSpeech,feedbackGenerator,feedbackDisplayDuration,feedbackIntentPool,FEEDBACK_INTENTS,canonicalFeedbackIntent,repeatGuestReference,SPEECH_PROFILES,SPEECH_STYLES,FEELING_VARIANTS};
})(typeof window!=="undefined"?window:globalThis);
