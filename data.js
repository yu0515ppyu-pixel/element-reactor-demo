(function(root){
  "use strict";
  const ATTRIBUTE_KEYS=["light","warmth","dream","eerie","comfort","memory"];
  const ITEM_TAGS=Object.freeze(["light_source","dim_light","harsh_light","bed","soft","floor","door","window","heater","fire","cold","mechanical","clock","noise","mechanical_noise","mirror","memory_object","spiritual","protective","lock","water","fog","atmosphere","dream_object","organic","decoration","observation"]);
  const TAG_META=Object.freeze({
    light_source:{label:"照明",icon:"💡",composition:"lighting"},dim_light:{label:"柔和照明",icon:"🌙",composition:"lighting"},harsh_light:{label:"强光",icon:"☀",composition:"lighting"},bed:{label:"睡眠用品",icon:"🛏",composition:"sleep"},soft:{label:"柔软物件",icon:"🩶",composition:"sleep"},floor:{label:"地板",icon:"🪵",composition:"floor"},door:{label:"门",icon:"🚪",composition:"door"},window:{label:"窗",icon:"🪟",composition:"window"},heater:{label:"取暖",icon:"🔥",composition:"heat"},fire:{label:"火源",icon:"🔥",composition:"heat"},cold:{label:"寒冷",icon:"❄",composition:"atmosphere"},mechanical:{label:"机械",icon:"⚙",composition:"mechanical"},clock:{label:"钟表",icon:"⏱",composition:"mechanical"},noise:{label:"噪声",icon:"🔇",composition:"atmosphere"},mechanical_noise:{label:"机械噪声",icon:"🔇",composition:"mechanical"},mirror:{label:"镜子",icon:"◇",composition:"decoration"},memory_object:{label:"记忆旧物",icon:"🧠",composition:"memory"},spiritual:{label:"灵异物件",icon:"👻",composition:"atmosphere"},protective:{label:"防护",icon:"🛡",composition:"decoration"},lock:{label:"锁",icon:"🔒",composition:"door"},water:{label:"水",icon:"💧",composition:"atmosphere"},fog:{label:"雾",icon:"🌫",composition:"atmosphere"},atmosphere:{label:"氛围",icon:"🌫",composition:"atmosphere"},dream_object:{label:"梦境物件",icon:"🌙",composition:"atmosphere"},organic:{label:"生命",icon:"♥",composition:"decoration"},decoration:{label:"装饰",icon:"✶",composition:"decoration"},observation:{label:"观察装置",icon:"👁",composition:"decoration"}
  });
  const TAG_ALIASES=Object.freeze({lighting:"light_source",light:"light_source",warm:"heater",dream:"dream_object",memory:"memory_object",wall:"decoration",eerie:"spiritual",electric:"mechanical"});
  const TAG_OVERRIDES=Object.freeze({
    "electric-lamp":["light_source","harsh_light"],"soul-fire":["light_source","dim_light","spiritual"],"moon-lamp":["light_source","dim_light","dream_object"],"fog-lamp":["light_source","dim_light","fog","atmosphere"],"star-lantern":["light_source","dim_light"],"crystal-prism":["light_source","harsh_light"],"cold-light":["light_source","harsh_light"],"cold-mirror":["light_source","harsh_light","mirror"],"dream-bed":["bed","dream_object","memory_object"],"cloud-bed":["bed","soft"],"wood-floor":["floor"],"wet-sand":["floor","water"],"moss-floor":["floor","soft"],fireplace:["heater","fire"],"steam-heater":["heater"],"warm-current":["heater","atmosphere"],"hearth-core":["heater","fire"],"warm-heart":["heater","organic"],"mechanical-clock":["mechanical","clock"],"mechanical-noise":["mechanical","noise","mechanical_noise","atmosphere"],"echo-bell":["noise","memory_object","decoration"],"wind-chime":["noise","decoration"],"memory-mirror":["mirror","memory_object"],"shadow-mirror":["mirror","spiritual"],mirror:["mirror"],"old-desk":["memory_object"],"memory-letter":["memory_object"],"old-affection":["memory_object"],past:["memory_object"],"dark-door":["door"],"spirit-door":["door","spiritual"],"shadow-threshold":["door","spiritual"],"memory-door":["door","memory_object"],"veil-door":["door","fog"],"threshold-door":["door","lock"],"fog-window":["window","fog"],"dream-fog":["atmosphere","fog","dream_object"],moonlight:["atmosphere","dim_light","dream_object"],"quiet-breeze":["atmosphere","soft"],"ice-wind":["atmosphere","cold"],sandstorm:["atmosphere","noise"],"bone-armor":["protective","spiritual","decoration","organic"],"shadow-lock":["lock","protective","spiritual"],"time-seal":["lock","protective"],"memory-lock":["lock","memory_object"],"light-eye":["observation"],"electric-eye":["observation","mechanical"],"dream-eye":["observation","dream_object"],"signal-eye":["observation","mechanical"],"mechanical-heart":["mechanical","organic"],"gear-core":["mechanical"],"rust-machine":["mechanical"],"mechanical-lab":["mechanical"]
  });
  const normalizeItemTags=(tags=[],id="")=>{
    const source=TAG_OVERRIDES[id]||tags||[];
    return[...new Set(source.map(tag=>TAG_ALIASES[tag]||tag).filter(Boolean))]
  };
  const OWNERSHIP_TYPES=Object.freeze({HOTEL_FURNITURE:"HOTEL_FURNITURE",REUSABLE_ITEM:"REUSABLE_ITEM",CONSUMABLE:"CONSUMABLE",GUEST_GIFT:"GUEST_GIFT",ATMOSPHERE:"ATMOSPHERE"});
  const emptyAttributes=()=>Object.fromEntries(ATTRIBUTE_KEYS.map(key=>[key,0]));
  const attrs=(values={})=>Object.fromEntries(ATTRIBUTE_KEYS.map(key=>[key,Math.max(0,Math.min(5,Number(values[key])||0))]));
  const make=(id,label,level,category,iconKey,description,usageTags=[],options={})=>({
    id,label,level,category,icon:iconKey,iconKey,colorKey:options.colorKey||iconKey,recipeDepth:options.recipeDepth??(level===1?0:null),
    libraryCategory:options.libraryCategory||null,attributes:attrs(options.attributes),
    elementType:options.elementType||({base:"nature",material:"material",component:"object",atmosphere:"space",evolution:"space"}[category]||"material"),
    personality:options.personality||description,usageTags:normalizeItemTags(usageTags,id),tags:normalizeItemTags(options.tags||usageTags,id),visualTraits:[...(options.visualTraits||[iconKey])],
    visual:options.visual||null,visualEffect:options.visualEffect||null,roomEffects:options.roomEffects||null,
    roomRole:options.roomRole||null,resultType:options.resultType||"material",representation:options.representation||"element_token",
    ownershipType:options.ownershipType||(category==="atmosphere"?OWNERSHIP_TYPES.ATMOSPHERE:options.roomRole?["wall","centerpiece"].includes(options.roomRole)?OWNERSHIP_TYPES.REUSABLE_ITEM:OWNERSHIP_TYPES.HOTEL_FURNITURE:null),
    description,sourceElements:[...(options.sourceElements||[])],reactionHistory:[]
  });
  const baseSpecs=[
    ["water","水","自然 / 物质","water","流动、溶解与承载。",["cold","soft"]],
    ["fire","火","自然 / 物质","fire","燃烧、转化与供暖。",["warm","lighting"]],
    ["wind","风","自然 / 物质","wind","推动、扩散与声音的载体。",["soft","atmosphere"]],
    ["earth","土","自然 / 物质","earth","重量、地基与塑形。",["structure","floor"]],
    ["wood","木","自然 / 物质","wood","生长、家具与温暖结构。",["structure","floor","furniture","warm"]],
    ["metal","金属","自然 / 物质","metal","结构、导通与机械。",["structure","mechanical","cold"]],
    ["electricity","电","自然 / 物质","electricity","激活、能量与机械动力。",["lighting","mechanical"]],
    ["ice","冰","自然 / 物质","ice","凝固、保存与冷静。",["cold","calm"]],
    ["light","光","自然 / 物质","light","显现、照明与指引。",["lighting"]],
    ["shadow","影","自然 / 物质","shadow","遮蔽、未知与暗面。",["eerie","door"]],
    ["fog","雾","自然 / 物质","fog","模糊边界与柔化空间。",["atmosphere","dream","soft"]],
    ["sand","沙","自然 / 物质","sand","颗粒、时间感与荒原。",["structure","memory"]],
    ["soul","灵魂","意识 / 生命","soul","意识、幽光与精神残留。",["spiritual","eerie"]],
    ["memory","记忆","意识 / 生命","memory","过去、身份与回返。",["memory"]],
    ["dream","梦","意识 / 生命","dream","潜意识、休息与变形叙事。",["dream","soft"]],
    ["heart","心脏","意识 / 生命","heart","情感、节律与生命动力。",["warm"]],
    ["bone","骨","意识 / 生命","bone","遗骸、结构与古老证据。",["structure","eerie"]],
    ["eye","眼睛","意识 / 生命","eye","观看、识别与被观看。",["memory"]],
    ["door","门","空间 / 规则","door","入口、转换与边界。",["door","structure"]],
    ["bridge","桥","空间 / 规则","bridge","跨越、连接与相遇。",["structure"]],
    ["mirror","镜子","空间 / 规则","mirror","映照、复制与另一面。",["memory","wall"]],
    ["moon","月亮","空间 / 规则","moon","周期、夜晚与冷白光。",["lighting","dream","calm"]],
    ["time","时间","空间 / 规则","time","顺序、衰变与不可逆。",["memory","mechanical"]],
    ["lock","锁","空间 / 规则","lock","封闭、条件与秘密。",["structure","door"]]
  ];
  const baseMeta={
    water:{elementType:"nature",attributes:{comfort:1,memory:1},tags:["water","natural","cold","fluid"],personality:"柔和、冷静，也善于承载其他东西。"},
    fire:{elementType:"energy",attributes:{light:2,warmth:5},tags:["fire","energy","hot"],personality:"带来光和温度，也容易让东西发生变化。"},
    wind:{elementType:"nature",attributes:{comfort:1,dream:1},tags:["air","natural","motion"],personality:"推动、传播，也会让安静的东西发出声音。"},
    earth:{elementType:"material",attributes:{comfort:1},tags:["earth","natural","organic","solid"],personality:"稳定而沉重，适合成为空间的基础。"},
    wood:{elementType:"material",attributes:{warmth:2,comfort:2,memory:1},tags:["wood","organic","natural"],personality:"会生长，也会留下使用和时间的痕迹。"},
    metal:{elementType:"material",attributes:{light:1},tags:["metal","mechanical","cold","solid"],personality:"坚硬、精确，喜欢能量与秩序。"},
    electricity:{elementType:"energy",attributes:{light:3,warmth:1},tags:["electric","energy","mechanical"],personality:"短促而强烈，能让沉睡的装置开始运转。"},
    ice:{elementType:"nature",attributes:{light:1,dream:1},tags:["water","cold","natural","crystal"],personality:"保存、减速，也会把光折成清晰边缘。"},
    light:{elementType:"energy",attributes:{light:5,comfort:1},tags:["light","energy","clarity"],personality:"让事物显现，也会改变影子和反射。"},
    shadow:{elementType:"concept",attributes:{eerie:3,dream:1},tags:["shadow","abstract","cold"],personality:"遮蔽轮廓，也为入口和未知提供形状。"},
    fog:{elementType:"nature",attributes:{dream:3,eerie:1,comfort:1},tags:["water","natural","soft","cold"],personality:"模糊边界，让远处和近处暂时混在一起。"},
    sand:{elementType:"material",attributes:{warmth:1,memory:1},tags:["earth","natural","grain","time"],personality:"细小、会流动，也最容易留下经过的痕迹。"},
    soul:{elementType:"spirit",attributes:{light:1,dream:2,eerie:4,memory:2},tags:["spiritual","abstract","life"],personality:"拥有幽光与意志，但很难独自安定下来。"},
    memory:{elementType:"concept",attributes:{dream:2,memory:5},tags:["abstract","past","concept"],personality:"很少独立成形，但会改变已有物件。"},
    dream:{elementType:"concept",attributes:{dream:5,comfort:2,memory:1},tags:["abstract","soft","concept"],personality:"让现实松动，并把不相干的东西暂时连接。"},
    heart:{elementType:"spirit",attributes:{warmth:3,comfort:2,memory:1},tags:["organic","life","emotion"],personality:"提供节律、温度，以及让物件继续工作的意愿。"},
    bone:{elementType:"material",attributes:{eerie:2,memory:2},tags:["organic","past","solid"],personality:"既是结构，也是某种已经结束的生命证据。"},
    eye:{elementType:"object",attributes:{light:1,dream:1,memory:2},tags:["organic","vision","object"],personality:"观看、记录，也会因为镜面而看见另一边。"},
    door:{elementType:"space",attributes:{eerie:1,memory:1},tags:["space","threshold","object"],personality:"划分内外，也暗示某个尚未抵达的地方。"},
    bridge:{elementType:"space",attributes:{comfort:1,memory:1},tags:["space","connection","structure"],personality:"跨过分隔，让两种原本远离的东西相遇。"},
    mirror:{elementType:"object",attributes:{light:1,dream:1,memory:2},tags:["object","reflection","cold"],personality:"映照，也会保存或扭曲。"},
    moon:{elementType:"nature",attributes:{light:1,dream:4,eerie:1,comfort:2,memory:1},tags:["moon","cold","natural"],personality:"微弱的光、梦和安静。"},
    time:{elementType:"concept",attributes:{dream:1,memory:3},tags:["abstract","time","concept"],personality:"让变化获得顺序，也让旧痕迹变得有意义。"},
    lock:{elementType:"object",attributes:{eerie:1,memory:1},tags:["object","metal","secret"],personality:"把入口变成条件，把普通物件变成秘密。"}
  };
  const bases=baseSpecs.map(([id,label,libraryCategory,iconKey,description,usageTags])=>make(id,label,1,"base",iconKey,description,usageTags,{libraryCategory,resultType:"material",...baseMeta[id]}));
  const rewardElements=[
    make("star","星星",1,"base","star","怕黑的小孩留下的微光元素。",["lighting","upgrade"],{libraryCategory:"奖励元素",attributes:{light:1,comfort:1}}),
    make("cloud","云",1,"base","dream","会改变轮廓和距离感的柔软材料。",["dream","soft","upgrade"],{libraryCategory:"奖励元素",attributes:{dream:1,calm:1}}),
    make("feather","羽毛",1,"base","wind","轻、安静，能够削弱尖锐的声音。",["calm","soft","upgrade"],{libraryCategory:"奖励元素",attributes:{calm:1}}),
    make("old-paper","旧纸",1,"base","memory","带着折痕、气味和手写痕迹的纸。",["memory","upgrade"],{libraryCategory:"奖励元素",attributes:{memory:1}}),
    make("gear","齿轮",1,"base","metal","可以把动力转化为稳定节律的机械零件。",["mechanical","upgrade"],{libraryCategory:"奖励元素",attributes:{mechanical:1}}),
    make("crystal","晶体",1,"base","ice","会折射光线和梦境色彩的透明结构。",["lighting","dream","upgrade"],{libraryCategory:"奖励元素",attributes:{light:1,dream:1}}),
    make("seed","种子",1,"base","wood","可以让冰冷结构上重新长出柔软表面。",["warm","floor","upgrade"],{libraryCategory:"奖励元素",attributes:{comfort:1}}),
    make("key","钥匙",1,"base","lock","不是打开已有门，而是让入口获得新的意义。",["door","eerie","upgrade"],{libraryCategory:"奖励元素",attributes:{eerie:1}})
  ];

  const lightProfiles={
    "electric-lamp":{attributes:{light:5,warmth:2,comfort:2,calm:1,mechanical:2},visual:{lightColor:"#ffd878",glowRadius:190,glowIntensity:.9,softness:.62,flickerAmount:0,particleType:"none",particleDensity:0}},
    "soul-fire":{attributes:{light:3,eerie:5,dream:2,memory:1},visual:{lightColor:"#55dfd2",glowRadius:138,glowIntensity:.62,softness:.82,flickerAmount:.12,particleType:"ghost_orb",particleDensity:6}},
    "moon-lamp":{attributes:{light:2,comfort:2,eerie:0,dream:4,calm:5},visual:{lightColor:"#d4e4ff",glowRadius:104,glowIntensity:.4,softness:.96,flickerAmount:0,particleType:"moon_dust",particleDensity:3}},
    "fog-lamp":{attributes:{light:2,warmth:0,comfort:1,eerie:2,dream:3,calm:3},visual:{lightColor:"#d8ddd8",glowRadius:184,glowIntensity:.34,softness:1,flickerAmount:0,particleType:"mist",particleDensity:12}}
  };
  function LightComponent(element,profile){const visual={...profile.visual};return Object.assign(element,{roomRole:"light",resultType:"component",attributes:attrs(profile.attributes),visual,lightColor:visual.lightColor,glowRadius:visual.glowRadius,glowIntensity:visual.glowIntensity,particleType:visual.particleType})}
  function RoomEffectComponent(element){return Object.assign(element,{roomRole:"atmosphere",resultType:"atmosphere",representation:"effect_token"})}

  const outputDefs={
    steam:["蒸汽",2,"material","steam","水被火转化后的漂浮材料。",["soft","atmosphere"],{}],
    "cold-light":["冷光",2,"material","light","低温、清晰而缺少暖意的光。",["lighting","cold"],{attributes:{light:1}}],
    "shadow-fog":["影雾",2,"material","fog","会吞没轮廓的暗色雾团。",["atmosphere","eerie"],{attributes:{eerie:1}}],
    "dream-sand":["梦砂",2,"material","sand","会记录梦境碎片的细沙。",["dream","memory"],{attributes:{dream:1}}],
    "moon-dust":["月尘",2,"material","moon","带有微弱月光的细小颗粒。",["dream","calm"],{attributes:{dream:1,calm:1}}],
    echo:["回声",2,"material","wind","被风保存下来的记忆声纹。",["memory","atmosphere"],{attributes:{memory:1}}],
    ember:["余烬",2,"material","fire","土地里仍未熄灭的微热核心。",["warm"],{attributes:{warmth:1}}],
    "rust-shard":["锈片",2,"material","metal","水侵蚀金属留下的时间碎片。",["memory","mechanical"],{attributes:{memory:1,mechanical:1}}],
    static:["静电",2,"material","electricity","停留在空气中的短促能量。",["mechanical"],{attributes:{mechanical:1}}],
    "window-frame":["窗框",2,"material","mirror","能承接天气与外部景象的结构。",["window","structure"],{}],

    "electric-lamp":["电灯",3,"component","light","稳定、明亮而舒适的室内灯。",["lighting","warm","mechanical"],{roomRole:"light"}],
    "soul-fire":["魂灯",3,"component","soul","以幽光照明、但会让人稍感不安的灯。",["lighting","spiritual","eerie"],{roomRole:"light"}],
    "moon-lamp":["月灯",3,"component","moon","柔和安静、适合休息的冷白灯。",["lighting","dream","calm","soft"],{roomRole:"light"}],
    "fog-lamp":["雾灯",3,"component","fog","把光扩散成大片柔白薄雾的灯。",["lighting","dream","soft"],{roomRole:"light"}],
    "wood-floor":["木地板",3,"component","wood","让房间脚下更温暖、舒适的木质地面。",["floor","structure","warm"],{roomRole:"floor",attributes:{warmth:1,comfort:1},visual:{variant:"wood-floor"}}],
    "wind-chime":["风铃",3,"component","wind","会轻轻摇摆、让空间安静下来的挂件。",["wall","calm","soft"],{roomRole:"wall",attributes:{calm:2,comfort:1},visual:{variant:"wind-chime"}}],
    "memory-mirror":["记忆镜",3,"component","mirror","映出旧日残片而非当前景象的墙镜。",["wall","memory","eerie"],{roomRole:"wall",attributes:{memory:3,eerie:1,calm:1},visual:{variant:"memory-mirror"}}],
    "dark-door":["暗门",3,"component","door","藏在阴影里的第二个入口。",["door","structure","eerie"],{roomRole:"door",attributes:{eerie:2},visual:{variant:"dark-door"}}],
    "fog-window":["雾窗",3,"component","fog","让窗外景象变得模糊、安静的窗。",["window","dream","calm","soft"],{roomRole:"window",attributes:{dream:2,calm:1},visual:{variant:"fog-window"}}],
    fireplace:["壁炉",3,"component","fire","提供持续暖意与舒适角落的壁炉。",["furniture","centerpiece","warm"],{roomRole:"furniture",attributes:{light:1,warmth:4,comfort:2},visual:{variant:"fireplace",lightColor:"#ef9a54",glowRadius:135,glowIntensity:.45}}],
    "mechanical-clock":["机械钟",3,"component","time","用齿轮和滴答声记录房间节律。",["wall","mechanical"],{roomRole:"wall",attributes:{mechanical:4},visual:{variant:"mechanical-clock"}}],
    "moon-pool":["月光水池",3,"component","water","把月光反射到天花和墙面的中央水池。",["centerpiece","dream","calm"],{roomRole:"centerpiece",attributes:{light:1,dream:3,calm:2},visual:{variant:"moon-pool"}}],
    "dream-bed":["梦床",3,"component","dream","会把记忆带进梦里、但不一定让人睡得安稳的床。",["furniture","dream","memory"],{roomRole:"furniture",attributes:{comfort:2,dream:4,eerie:1,memory:1,calm:1},visual:{variant:"dream-bed"}}],
    "old-desk":["旧书桌",3,"component","memory","带着使用痕迹和旧日气味的书桌。",["furniture","memory"],{roomRole:"furniture",attributes:{comfort:1,memory:2},visual:{variant:"old-desk"}}],
    "echo-bell":["回声铃",3,"component","wind","会让声音在房间中短暂回返的墙铃。",["wall","memory","calm"],{roomRole:"wall",attributes:{memory:1,calm:1},visual:{variant:"echo-bell"}}],
    "star-lantern":["星灯",3,"component","star","把微小星光聚成柔和照明的灯。",["lighting","dream","soft"],{roomRole:"light",attributes:{light:3,comfort:2,dream:2,calm:1},visual:{variant:"star-lantern",lightColor:"#fff0a8",glowRadius:126,glowIntensity:.52,softness:.9,particleType:"moon_dust",particleDensity:5}}],
    "cloud-bed":["云床",3,"component","dream","像云一样稳定托住身体、适合安静休息的轻软睡床。",["furniture","soft","calm"],{roomRole:"furniture",attributes:{comfort:5,warmth:1,dream:1,eerie:0,calm:4},visual:{variant:"cloud-bed"}}],
    "quiet-breeze":["静风",4,"atmosphere","wind","羽毛让空气变慢后形成的安静气流。",["atmosphere","soft","calm"],{roomRole:"atmosphere",attributes:{calm:3,comfort:1,mechanical:-1},visualEffect:{type:"quiet-breeze",color:"#dce7df",density:5}}],
    "memory-letter":["旧信",3,"component","memory","字迹模糊、却能唤回私人记忆的旧信。",["wall","memory","soft"],{roomRole:"wall",ownershipType:OWNERSHIP_TYPES.GUEST_GIFT,attributes:{memory:3,comfort:1},visual:{variant:"memory-letter"}}],
    "gear-core":["齿轮核心",3,"component","metal","持续运转并为机械空间提供节律的核心。",["centerpiece","mechanical"],{roomRole:"centerpiece",attributes:{mechanical:5,light:1},visual:{variant:"gear-core"}}],
    "crystal-prism":["晶棱灯",3,"component","light","把白光分解成柔和彩色光斑的晶体灯。",["lighting","dream","soft"],{roomRole:"light",attributes:{light:4,comfort:2,dream:2},visual:{variant:"crystal-prism",lightColor:"#d8d1ff",glowRadius:150,glowIntensity:.58,softness:.78,particleType:"moon_dust",particleDensity:4}}],
    "moss-floor":["苔地板",3,"component","wood","从土地上生长出的柔软绿色地面。",["floor","warm","soft"],{roomRole:"floor",attributes:{warmth:2,comfort:3,calm:1},visual:{variant:"moss-floor"}}],
    "threshold-door":["界门",3,"component","door","钥匙赋予门的第二层边界。",["door","eerie","memory"],{roomRole:"door",attributes:{eerie:3,memory:2,dream:1},visual:{variant:"threshold-door"}}],
    "frost-water":["霜水",3,"component","water","冰层下仍缓慢流动的冷水。",["centerpiece","cold","water"],{roomRole:"centerpiece",ownershipType:OWNERSHIP_TYPES.CONSUMABLE,attributes:{dream:1,comfort:1},visual:{variant:"frost-water"}}],
    "ice-wind":["冰风",4,"atmosphere","wind","带着晶体碎屑的冷空气。",["atmosphere","cold"],{roomRole:"atmosphere",attributes:{dream:1,eerie:1},visualEffect:{type:"ice-wind",color:"#c8e6ed",density:6}}],
    "shadow-mirror":["影镜",3,"component","mirror","只映出观看者背后阴影的镜面。",["wall","eerie","memory"],{roomRole:"wall",attributes:{eerie:3,dream:1,memory:1},visual:{variant:"shadow-mirror"}}],
    "wet-sand":["湿沙地",3,"component","sand","能够留下每一次脚步的潮湿地面。",["floor","water","memory"],{roomRole:"floor",attributes:{comfort:1,memory:2},visual:{variant:"wet-sand"}}],
    sandstorm:["沙暴",4,"atmosphere","wind","颗粒让整个空间失去清晰边界。",["atmosphere","earth","eerie"],{roomRole:"atmosphere",attributes:{eerie:2,dream:1},visualEffect:{type:"sandstorm",color:"#c3a778",density:9}}],
    "hourglass-sand":["时砂漏",3,"component","time","让沙粒以可见速度记录时间的中央装置。",["centerpiece","time","memory"],{roomRole:"centerpiece",attributes:{memory:2,dream:1},visual:{variant:"hourglass-sand"}}],
    "moon-spirit":["月灵",4,"atmosphere","soul","月色里短暂获得轮廓的幽微意识。",["atmosphere","spiritual","dream"],{roomRole:"atmosphere",attributes:{light:1,dream:3,eerie:2,memory:1},visualEffect:{type:"moon-spirit",color:"#cbd7ef",density:5}}],
    "spirit-door":["灵门",3,"component","door","只对精神痕迹开启的入口。",["door","spiritual","eerie"],{roomRole:"door",attributes:{eerie:3,dream:1,memory:1},visual:{variant:"spirit-door"}}],
    "warm-heart":["炽心",3,"component","heart","持续散发热量和微光的生命核心。",["centerpiece","warm","organic"],{roomRole:"centerpiece",attributes:{light:1,warmth:4,comfort:2},visual:{variant:"warm-heart",lightColor:"#e99062",glowRadius:110,glowIntensity:.35}}],
    "mechanical-heart":["机械心脏",3,"component","metal","以金属节律维持运转的心脏装置。",["centerpiece","mechanical","organic"],{roomRole:"centerpiece",attributes:{light:1,warmth:1,eerie:1},visual:{variant:"mechanical-heart"}}],
    "old-affection":["旧情",4,"atmosphere","memory","记忆触碰心脏后留下的温暖残响。",["atmosphere","memory","warm"],{roomRole:"atmosphere",attributes:{warmth:2,comfort:2,memory:3},visualEffect:{type:"old-affection",color:"#d8a99b",density:4}}],
    "burial-stone":["埋骨石",3,"component","earth","把遗骸和土地压成一块沉默纪念物。",["centerpiece","memory","eerie"],{roomRole:"centerpiece",attributes:{eerie:2,memory:3},visual:{variant:"burial-stone"}}],
    "bone-armor":["骨甲",3,"component","bone","骨与金属共同形成的硬质墙面护甲。",["wall","metal","eerie"],{roomRole:"wall",attributes:{eerie:2,memory:1},visual:{variant:"bone-armor"}}],
    "bone-spirit":["骨灵",4,"atmosphere","soul","遗骸中仍未离开的意识微光。",["atmosphere","spiritual","eerie"],{roomRole:"atmosphere",attributes:{eerie:4,memory:2,dream:1},visualEffect:{type:"bone-spirit",color:"#b6c7bd",density:6}}],
    "light-eye":["光眼",3,"component","eye","会自动追随亮处的墙面观察器。",["wall","light","vision"],{roomRole:"wall",attributes:{light:2,memory:1},visual:{variant:"light-eye"}}],
    "electric-eye":["电眼",3,"component","eye","由电流驱动、持续扫描房间的眼形装置。",["wall","electric","mechanical"],{roomRole:"wall",attributes:{light:2,eerie:1},visual:{variant:"electric-eye"}}],
    "dream-eye":["梦眼",3,"component","eye","闭上时反而能看见梦境的墙面眼睛。",["wall","dream","eerie"],{roomRole:"wall",attributes:{dream:3,eerie:2,memory:1},visual:{variant:"dream-eye"}}],
    "shadow-threshold":["影门",3,"component","door","被阴影填满、无法确认深度的门。",["door","shadow","eerie"],{roomRole:"door",attributes:{eerie:4,dream:1},visual:{variant:"shadow-threshold"}}],
    "memory-door":["记忆之门",3,"component","door","只有特定记忆靠近时才显现的入口。",["door","memory","space"],{roomRole:"door",attributes:{memory:4,dream:1,eerie:1},visual:{variant:"memory-door"}}],
    "fog-bridge":["雾桥",3,"component","bridge","终点被雾藏起的室内桥形装置。",["centerpiece","space","dream"],{roomRole:"centerpiece",attributes:{dream:2,eerie:1},visual:{variant:"fog-bridge"}}],
    "moon-bridge":["月桥",3,"component","bridge","月牙形冷光勾勒出的拱桥。",["centerpiece","moon","lighting"],{roomRole:"centerpiece",attributes:{light:2,dream:3,comfort:1},visual:{variant:"moon-bridge"}}],
    "soul-bridge":["魂桥",3,"component","bridge","让精神痕迹跨越房间的幽光桥。",["centerpiece","spiritual","eerie"],{roomRole:"centerpiece",attributes:{light:1,eerie:3,memory:2},visual:{variant:"soul-bridge"}}],
    past:["往昔",4,"atmosphere","time","时间与记忆重叠后覆盖全室的旧日感。",["atmosphere","memory","past"],{roomRole:"atmosphere",attributes:{memory:4,dream:1,comfort:1},visualEffect:{type:"past",color:"#cbbda6",density:5}}],
    "time-seal":["时间封印",3,"component","lock","让局部时间暂时停住的墙面封印。",["wall","time","secret"],{roomRole:"wall",attributes:{memory:2,eerie:2},visual:{variant:"time-seal"}}],
    "memory-lock":["记忆锁",3,"component","lock","必须用一段旧事才能打开的锁。",["wall","memory","secret"],{roomRole:"wall",attributes:{memory:3,eerie:1},visual:{variant:"memory-lock"}}],
    "shadow-lock":["影锁",3,"component","lock","把阴影固定在门后的黑色锁具。",["wall","shadow","secret"],{roomRole:"wall",attributes:{eerie:3},visual:{variant:"shadow-lock"}}],
    "steam-heater":["蒸汽暖器",3,"component","steam","利用蒸汽持续供暖的家具。",["furniture","warm","water"],{roomRole:"furniture",attributes:{warmth:3,comfort:2},visual:{variant:"steam-heater"}}],
    "cold-mirror":["冷光镜",3,"component","mirror","让冷光沿镜面均匀扩散的墙镜。",["wall","lighting","cold"],{roomRole:"wall",attributes:{light:3,dream:1},visual:{variant:"cold-mirror"}}],
    "veil-door":["帷雾门",3,"component","door","影雾像帘幕一样垂在门框里。",["door","eerie","soft"],{roomRole:"door",attributes:{eerie:3,dream:2},visual:{variant:"veil-door"}}],
    "dream-hourglass":["梦砂漏",3,"component","time","每次落下都会改变梦境片段的砂漏。",["centerpiece","dream","memory"],{roomRole:"centerpiece",attributes:{dream:3,memory:2},visual:{variant:"dream-hourglass"}}],
    "moon-memory-dust":["追忆月尘",4,"atmosphere","moon","月尘携带记忆后形成的全室微光。",["atmosphere","moon","memory"],{roomRole:"atmosphere",attributes:{light:1,dream:2,memory:3},visualEffect:{type:"moon-memory-dust",color:"#d7ddf2",density:8}}],
    "hearth-core":["炉心",3,"component","fire","余烬被心脏重新唤醒后的暖光核心。",["centerpiece","warm","organic"],{roomRole:"centerpiece",attributes:{light:2,warmth:5,comfort:2},visual:{variant:"hearth-core",lightColor:"#ef8750",glowRadius:130,glowIntensity:.46}}],
    "rust-machine":["锈蚀机",3,"component","metal","锈片被静电驱动后勉强运转的旧机器。",["centerpiece","mechanical","memory"],{roomRole:"centerpiece",attributes:{eerie:1,memory:2},visual:{variant:"rust-machine"}}],
    "signal-eye":["信号眼",3,"component","eye","静电让眼睛能够捕捉不可见信号。",["wall","electric","vision"],{roomRole:"wall",attributes:{light:1,eerie:2,memory:1},visual:{variant:"signal-eye"}}],

    "dream-fog":["梦雾",4,"atmosphere","fog","让整个空间柔化、像梦境一样缓慢流动。",["atmosphere","dream","soft"],{roomRole:"atmosphere",attributes:{light:-1,dream:3,calm:1},visualEffect:{type:"dream-fog",color:"#b9bfd4",density:10}}],
    moonlight:["月色",4,"atmosphere","moon","覆盖全室的淡冷白月光。",["atmosphere","dream","calm","lighting"],{roomRole:"atmosphere",attributes:{light:1,dream:2,calm:2},visualEffect:{type:"moonlight",color:"#cadcff",density:4}}],
    "warm-current":["暖流",4,"atmosphere","fire","在房间中缓慢循环的温暖空气。",["atmosphere","warm"],{roomRole:"atmosphere",attributes:{warmth:2,comfort:1},visualEffect:{type:"warm-current",color:"#eab273",density:6}}],
    "memory-echo":["回忆残响",4,"atmosphere","memory","让旧日片段在空间里轻轻回返。",["atmosphere","memory"],{roomRole:"atmosphere",attributes:{memory:3,calm:1,eerie:1},visualEffect:{type:"memory-echo",color:"#b8d7c8",density:8}}],
    "mechanical-noise":["机械噪声",4,"atmosphere","metal","硬质节律和震动线充满房间。",["atmosphere","mechanical","noise","mechanical_noise"],{roomRole:"atmosphere",attributes:{},roomEffects:{comfortPenalty:1},visualEffect:{type:"mechanical-noise",color:"#aab4b6",density:7}}]
  };
  const recipeSpecs=[
    ["water","fire","steam"],["ice","light","cold-light"],["fog","shadow","shadow-fog"],["dream","earth","dream-sand"],["moon","earth","moon-dust"],["wind","memory","echo"],["fire","earth","ember"],["metal","water","rust-shard"],["wind","electricity","static"],["wind","mirror","window-frame"],
    ["light","electricity","electric-lamp"],["soul","fire","soul-fire"],["moon","light","moon-lamp"],["fog","light","fog-lamp"],["wood","earth","wood-floor"],["wood","wind","wind-chime"],["mirror","memory","memory-mirror"],["wood","shadow","dark-door"],["fog","window-frame","fog-window"],["fire","wood","fireplace"],["metal","time","mechanical-clock"],["water","moon","moon-pool"],["dream","wood","dream-bed"],["memory","wood","old-desk"],["echo","metal","echo-bell"],
    ["dream","fog","dream-fog"],["moon-lamp","water","moonlight"],["fireplace","wind","warm-current"],["memory","echo","memory-echo"],["mechanical-clock","electricity","mechanical-noise"],
    ["star","moon","star-lantern"],["cloud","dream","cloud-bed"],["feather","wind","quiet-breeze"],["old-paper","memory","memory-letter"],["gear","electricity","gear-core"],["crystal","light","crystal-prism"],["seed","earth","moss-floor"],["key","door","threshold-door"],
    ["ice","water","frost-water"],["ice","wind","ice-wind"],["shadow","mirror","shadow-mirror"],
    ["sand","water","wet-sand"],["sand","wind","sandstorm"],["sand","time","hourglass-sand"],
    ["soul","moon","moon-spirit"],["soul","door","spirit-door"],
    ["heart","fire","warm-heart"],["heart","metal","mechanical-heart"],["heart","memory","old-affection"],
    ["bone","earth","burial-stone"],["bone","metal","bone-armor"],["bone","soul","bone-spirit"],
    ["eye","light","light-eye"],["eye","electricity","electric-eye"],["eye","dream","dream-eye"],
    ["door","shadow","shadow-threshold"],["door","memory","memory-door"],
    ["bridge","fog","fog-bridge"],["bridge","moon","moon-bridge"],["bridge","soul","soul-bridge"],
    ["time","memory","past"],["time","lock","time-seal"],["lock","memory","memory-lock"],["lock","shadow","shadow-lock"],
    ["steam","metal","steam-heater"],["cold-light","mirror","cold-mirror"],["shadow-fog","door","veil-door"],
    ["dream-sand","time","dream-hourglass"],["moon-dust","memory","moon-memory-dust"],["ember","heart","hearth-core"],
    ["rust-shard","electricity","rust-machine"],["static","eye","signal-eye"]
  ].map(([a,b,id])=>({a,b,id,label:outputDefs[id][0],level:outputDefs[id][1],iconKey:outputDefs[id][3]}));
  const key=(a,b)=>[a,b].sort().join("|");
  const library=Object.fromEntries([...bases,...rewardElements].map(item=>[item.id,item]));
  for(const spec of recipeSpecs){
    const [label,level,category,iconKey,description,usageTags,options]=outputDefs[spec.id];
    let element=make(spec.id,label,level,category,iconKey,description,usageTags,{...options,colorKey:category==="atmosphere"?"fog":category==="component"?"product":iconKey,sourceElements:[spec.a,spec.b],resultType:category==="atmosphere"?"atmosphere":category==="component"?"component":"material",representation:category==="atmosphere"?"effect_token":"element_token"});
    if(category==="atmosphere")element=RoomEffectComponent(element);
    if(lightProfiles[spec.id])element=LightComponent(element,lightProfiles[spec.id]);
    library[spec.id]=element;
  }
  const recipeDepths=new Map([...bases,...rewardElements].map(item=>[item.id,0]));
  let depthChanged=true;while(depthChanged){depthChanged=false;for(const spec of recipeSpecs){if(!recipeDepths.has(spec.a)||!recipeDepths.has(spec.b))continue;const depth=Math.max(recipeDepths.get(spec.a),recipeDepths.get(spec.b))+1;if(!recipeDepths.has(spec.id)||depth<recipeDepths.get(spec.id)){recipeDepths.set(spec.id,depth);depthChanged=true}}}
  for(const [id,depth] of recipeDepths)if(library[id])library[id].recipeDepth=depth;
  const continuationCounts=new Map();for(const spec of recipeSpecs){continuationCounts.set(spec.a,(continuationCounts.get(spec.a)||0)+1);continuationCounts.set(spec.b,(continuationCounts.get(spec.b)||0)+1)}
  const contentRoleOverrides={"sandstorm":"NEGATIVE_EXAMPLE","mechanical-noise":"NEGATIVE_EXAMPLE","bone-armor":"ROOM_USE","quiet-breeze":"ROOM_USE","frost-water":"ROOM_USE"};
  for(const element of Object.values(library)){element.continuationCount=continuationCounts.get(element.id)||0;element.canReactFurther=element.level>1&&element.continuationCount>0;element.contentRole=contentRoleOverrides[element.id]||(element.canReactFurther?"CONTINUE_REACTION":element.roomRole?"ROOM_USE":element.tags?.some(tag=>["noise","cold","harsh_light"].includes(tag))?"NEGATIVE_EXAMPLE":"COLLECTIBLE")}
  const evolutionSpecs=[
    ["moon-memory-room","月下记忆室","冷白月色与旧日映像共同塑造的安静房间。",["upgrade","memory","dream"],{light:1,dream:2,memory:2,calm:2}],
    ["fog-bedroom","雾中寝室","光线柔软、薄雾缓慢流动的休息空间。",["upgrade","dream","soft"],{dream:2,comfort:2,calm:2}],
    ["mechanical-lab","机械实验间","墙面、节律和装置都带有机械秩序的硬朗空间。",["upgrade","mechanical"],{mechanical:3}]
  ];
  for(const [id,label,description,usageTags,attributes] of evolutionSpecs){library[id]=make(id,label,5,"evolution","rare",description,usageTags,{colorKey:"rare",attributes,resultType:"roomEvolution",recipeDepth:2});library[id].continuationCount=0;library[id].canReactFurther=false;library[id].contentRole="COLLECTIBLE"}
  const evolutionIds=evolutionSpecs.map(item=>item[0]);
  root.REACTOR_DATA={
    ATTRIBUTE_KEYS:Object.freeze(ATTRIBUTE_KEYS),ITEM_TAGS,TAG_META,TAG_ALIASES,normalizeItemTags,OWNERSHIP_TYPES,elementLibrary:Object.freeze(library),
    reactionRules:Object.freeze(Object.fromEntries(recipeSpecs.map(spec=>[key(spec.a,spec.b),spec.id]))),
    reactionKey:key,BASIC_IDS:Object.freeze(bases.map(item=>item.id)),REWARD_IDS:Object.freeze(rewardElements.map(item=>item.id)),
    LIGHT_COMPONENT_IDS:Object.freeze(Object.keys(lightProfiles)),EVOLUTION_IDS:Object.freeze(evolutionIds),LightComponent,RoomEffectComponent,
    CATEGORIES:["全部","自然 / 物质","意识 / 生命","空间 / 规则","奖励元素"],
    productIds:Object.freeze([...recipeSpecs.map(spec=>spec.id),...evolutionIds]),recipeSpecs:Object.freeze(recipeSpecs)
  };
})(typeof window!=="undefined"?window:globalThis);
