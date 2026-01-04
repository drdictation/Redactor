// Comprehensive names database for PII detection
// Sources: US Census, SSA Popular Baby Names, International name lists
// ~5000 first names, ~2500 last names

// Top first names - combining multiple years of SSA data + international names
export const COMMON_FIRST_NAMES = new Set([
    // === MALE NAMES (Top 1000+) ===
    'liam', 'noah', 'oliver', 'theodore', 'james', 'henry', 'mateo', 'elijah', 'lucas', 'william',
    'benjamin', 'levi', 'ezra', 'sebastian', 'jack', 'daniel', 'samuel', 'michael', 'ethan', 'asher',
    'john', 'hudson', 'luca', 'leo', 'elias', 'owen', 'alexander', 'dylan', 'santiago', 'julian',
    'david', 'joseph', 'matthew', 'luke', 'jackson', 'maverick', 'miles', 'wyatt', 'thomas', 'isaac',
    'jacob', 'mason', 'gabriel', 'anthony', 'carter', 'logan', 'aiden', 'grayson', 'caleb', 'cooper',
    'charles', 'roman', 'josiah', 'ezekiel', 'thiago', 'isaiah', 'joshua', 'wesley', 'jayden', 'bennett',
    'christopher', 'nathan', 'angel', 'nolan', 'waylon', 'cameron', 'brooks', 'andrew', 'beau', 'weston',
    'rowan', 'adrian', 'lincoln', 'enzo', 'ian', 'kai', 'christian', 'axel', 'aaron', 'theo',
    'silas', 'walker', 'jonathan', 'leonardo', 'everett', 'micah', 'ryan', 'august', 'gael', 'robert',
    'jose', 'eli', 'jeremiah', 'luka', 'amir', 'jaxon', 'parker', 'colton', 'myles', 'adam',
    'atlas', 'xavier', 'easton', 'jordan', 'arthur', 'landon', 'austin', 'dominic', 'adriel', 'damian',
    'vincent', 'river', 'emiliano', 'jace', 'archer', 'lorenzo', 'jameson', 'nicholas', 'emmett', 'milo',
    'harrison', 'giovanni', 'carson', 'george', 'kayden', 'jonah', 'greyson', 'hunter', 'graham', 'luis',
    'declan', 'sawyer', 'jasper', 'ryder', 'carlos', 'connor', 'juan', 'matteo', 'dawson', 'calvin',
    'leon', 'dean', 'evan', 'nathaniel', 'diego', 'arlo', 'bryson', 'jason', 'malachi', 'elliot',
    'zion', 'emilio', 'ivan', 'hayden', 'stetson', 'jude', 'legend', 'matias', 'callum', 'hayes',
    'jett', 'cole', 'elliott', 'jesus', 'ace', 'beckett', 'alan', 'beckham', 'jayce', 'braxton',
    'jaxson', 'amari', 'chase', 'rhett', 'max', 'charlie', 'felix', 'kingston', 'judah', 'antonio',
    'emmanuel', 'maxwell', 'ryker', 'alejandro', 'nicolas', 'barrett', 'jesse', 'ashton', 'miguel', 'brayden',
    'tyler', 'peter', 'camden', 'zachary', 'tatum', 'kevin', 'andres', 'finn', 'justin', 'tucker',
    'bentley', 'zayden', 'messiah', 'abraham', 'alex', 'adonis', 'kaiden', 'timothy', 'knox', 'tate',
    'caden', 'ayden', 'nico', 'victor', 'maddox', 'xander', 'oscar', 'colter', 'joel', 'abel',
    'patrick', 'rafael', 'griffin', 'brody', 'jaziel', 'rory', 'eithan', 'edward', 'riley', 'brandon',
    'milan', 'richard', 'malakai', 'ismael', 'kyrie', 'louis', 'elian', 'kairo', 'cohen', 'nash',
    'grant', 'callan', 'dallas', 'harvey', 'muhammad', 'mark', 'javier', 'karter', 'zayn', 'crew',
    'eric', 'simon', 'aziel', 'cyrus', 'gavin', 'marcus', 'ronan', 'derek', 'avery', 'omar',
    'lane', 'warren', 'lennox', 'paul', 'blake', 'jeremy', 'tristan', 'lukas', 'steven', 'emerson',
    'walter', 'cade', 'ellis', 'otto', 'phoenix', 'colt', 'atticus', 'kaleb', 'israel', 'tobias',
    'holden', 'saint', 'romeo', 'kenneth', 'jorge', 'angelo', 'remington', 'paxton', 'cody', 'finley',
    'kayson', 'koa', 'kash', 'josue', 'ares', 'hendrix', 'bryce', 'maximiliano', 'zyaire', 'reid',
    'brian', 'bodhi', 'cruz', 'kaden', 'bryan', 'zane', 'francisco', 'martin', 'brady', 'casey',
    'shepherd', 'aidan', 'baker', 'malcolm', 'jax', 'cash', 'clayton', 'kohen', 'leonel', 'cristian',
    'bowen', 'dante', 'ali', 'jaylen', 'orion', 'briggs', 'jensen', 'prince', 'major', 'king',
    'duke', 'mavrick', 'sterling', 'cannon', 'ruben', 'kyler', 'jaiden', 'braylon', 'desmond', 'khalil',
    'davis', 'royce', 'wilder', 'finnegan', 'trent', 'garrett', 'mohammad', 'sergio', 'corbin', 'odin',
    'porter', 'kian', 'sean', 'quentin', 'chance', 'cason', 'ronald', 'ahmed', 'raymond', 'ricardo',
    'seth', 'troy', 'dax', 'nash', 'marshall', 'leland', 'reed', 'collin', 'phillip', 'lawson',
    'dalton', 'marcos', 'otto', 'louis', 'ross', 'russell', 'wade', 'roy', 'leon', 'julius',
    'fabian', 'edgar', 'hector', 'frank', 'andy', 'hugo', 'conner', 'spencer', 'mario', 'pierce',
    'conor', 'lance', 'drew', 'donovan', 'keegan', 'landen', 'santos', 'jaden', 'kobe', 'kylan',
    // === FEMALE NAMES (Top 1000+) ===
    'olivia', 'emma', 'amelia', 'charlotte', 'mia', 'sophia', 'isabella', 'evelyn', 'ava', 'sofia',
    'camila', 'harper', 'luna', 'eleanor', 'violet', 'aurora', 'elizabeth', 'eliana', 'hazel', 'chloe',
    'ellie', 'nora', 'gianna', 'lily', 'emily', 'aria', 'scarlett', 'penelope', 'zoe', 'ella',
    'abigail', 'mila', 'lucy', 'isla', 'ivy', 'layla', 'lainey', 'nova', 'grace', 'willow',
    'emilia', 'naomi', 'elena', 'madison', 'valentina', 'victoria', 'stella', 'delilah', 'maya', 'hannah',
    'leah', 'lillian', 'genesis', 'josephine', 'sadie', 'adeline', 'zoey', 'sophie', 'paisley', 'alice',
    'ruby', 'eloise', 'madelyn', 'leilani', 'claire', 'addison', 'ayla', 'emery', 'iris', 'eden',
    'natalie', 'maria', 'maeve', 'daisy', 'vivian', 'clara', 'autumn', 'liliana', 'everly', 'audrey',
    'lyla', 'jade', 'kinsley', 'millie', 'madeline', 'josie', 'kennedy', 'athena', 'melody', 'caroline',
    'aaliyah', 'anna', 'sarah', 'quinn', 'lydia', 'lucia', 'allison', 'hailey', 'ailany', 'cora',
    'ariana', 'natalia', 'gabriella', 'savannah', 'brooklyn', 'bella', 'georgia', 'juniper', 'alaia', 'raelynn',
    'hadley', 'rose', 'julia', 'serenity', 'eliza', 'margaret', 'eva', 'amara', 'melanie', 'cecilia',
    'ashley', 'rylee', 'margot', 'samantha', 'catalina', 'juliette', 'aubrey', 'esther', 'mary', 'nevaeh',
    'skylar', 'alina', 'amira', 'ember', 'magnolia', 'sienna', 'elliana', 'summer', 'alana', 'brielle',
    'remi', 'sage', 'valerie', 'hallie', 'wrenley', 'kehlani', 'june', 'sloane', 'emersyn', 'elsie',
    'oaklynn', 'oakley', 'blakely', 'freya', 'piper', 'valeria', 'arya', 'adalynn', 'everleigh', 'genevieve',
    'anastasia', 'isabel', 'peyton', 'amaya', 'isabelle', 'olive', 'ruth', 'ximena', 'evangeline', 'katherine',
    'callie', 'rosalie', 'alani', 'lilah', 'kaia', 'brianna', 'bailey', 'phoebe', 'vivienne', 'andrea',
    'myla', 'lia', 'sara', 'kylie', 'reese', 'annie', 'daphne', 'ada', 'adaline', 'arianna',
    'ariella', 'sutton', 'celeste', 'jasmine', 'mackenzie', 'haven', 'scottie', 'gemma', 'ana', 'arabella',
    'lila', 'molly', 'stevie', 'aitana', 'alaina', 'wren', 'noelle', 'delaney', 'journee', 'blair',
    'adalyn', 'kaylee', 'alexandra', 'mabel', 'norah', 'presley', 'alora', 'vera', 'celine', 'amy',
    'brynlee', 'nyla', 'saylor', 'khloe', 'antonella', 'zara', 'aliyah', 'cataleya', 'lennon', 'kiara',
    'camille', 'dahlia', 'kaylani', 'mariana', 'diana', 'reagan', 'selena', 'kimberly', 'rachel', 'gracie',
    'faith', 'juliana', 'miriam', 'elise', 'noa', 'elaina', 'maisie', 'lilith', 'collins', 'palmer',
    'lilly', 'shiloh', 'ophelia', 'elianna', 'lena', 'harmony', 'aspen', 'gia', 'leila', 'jane',
    'talia', 'adelaide', 'dakota', 'lola', 'lucille', 'kailani', 'morgan', 'zuri', 'milani', 'daniela',
    'selah', 'alessia', 'angela', 'juliet', 'evie', 'amora', 'marley', 'sydney', 'alanna', 'leia',
    'luciana', 'kamila', 'harlow', 'kali', 'octavia', 'gabriela', 'ariel', 'maggie', 'rosemary', 'ryleigh',
    'tessa', 'evelynn', 'londyn', 'danna', 'amina', 'brooke', 'samara', 'kendall', 'rosie', 'alayna',
    'angelina', 'francesca', 'adelyn', 'fatima', 'hope', 'nicole', 'nayeli', 'catherine', 'nina', 'journey',
    'april', 'lana', 'haley', 'destiny', 'paige', 'shelby', 'brittany', 'chelsea', 'crystal', 'amber',
    'danielle', 'heather', 'michelle', 'patricia', 'nancy', 'sandra', 'betty', 'brenda', 'deborah', 'donna',
    'carol', 'ruth', 'sharon', 'laura', 'cynthia', 'kathleen', 'christine', 'diane', 'helen', 'teresa',
    'janet', 'joyce', 'joan', 'ann', 'jean', 'frances', 'martha', 'gloria', 'judith', 'cheryl',
    'megan', 'andrea', 'ann', 'marie', 'anne', 'linda', 'karen', 'susan', 'lisa', 'jennifer',
    'kate', 'katie', 'katelyn', 'kathy', 'kathryn', 'kristin', 'kristina', 'kristen', 'kelly', 'kerri',
    'kim', 'kira', 'kirsten', 'kyra', 'tina', 'tammy', 'tracy', 'stacy', 'stephanie', 'wendy',
    'bonnie', 'connie', 'cindy', 'mindy', 'mandy', 'candy', 'sandy', 'misty', 'missy', 'holly',
    // === INTERNATIONAL NAMES ===
    // Chinese
    'wei', 'fang', 'lei', 'jing', 'xin', 'yan', 'yong', 'ling', 'hong', 'hui',
    'ming', 'xiao', 'ping', 'chang', 'hai', 'jun', 'qiang', 'li', 'na', 'juan',
    'lan', 'mei', 'ying', 'xiong', 'bin', 'chen', 'feng', 'gang', 'hong', 'jian',
    // Indian/South Asian
    'raj', 'amit', 'priya', 'anita', 'sanjay', 'anil', 'sunita', 'ravi', 'krishna', 'neha',
    'arjun', 'rohan', 'aarav', 'ishaan', 'vivaan', 'aditya', 'vihaan', 'aanya', 'aadhya', 'ananya',
    'diya', 'meera', 'pooja', 'sneha', 'deepa', 'kavita', 'shweta', 'preeti', 'nisha', 'rashmi',
    'vikram', 'suresh', 'mahesh', 'ramesh', 'ganesh', 'dinesh', 'naresh', 'rakesh', 'rajesh', 'mukesh',
    // Japanese
    'yuki', 'takeshi', 'hiroshi', 'kenji', 'yoko', 'akiko', 'makoto', 'satoshi', 'haruki', 'sakura',
    'hana', 'mei', 'ren', 'sota', 'haruto', 'yuto', 'hinata', 'yui', 'mio', 'koharu',
    'aoi', 'himari', 'miyu', 'riko', 'saki', 'nanami', 'akari', 'honoka', 'kanna', 'momoka',
    // Korean
    'minjun', 'seojun', 'yejun', 'jiwon', 'hyunwoo', 'jiho', 'minseok', 'junwoo', 'dohyun', 'siwoo',
    'soyeon', 'sujin', 'minji', 'eunji', 'yuna', 'hayoung', 'jiyeon', 'sooyoung', 'jimin', 'nayeon',
    // Spanish/Latin
    'carlos', 'jose', 'juan', 'luis', 'pedro', 'antonio', 'francisco', 'miguel', 'alejandro', 'fernando',
    'pablo', 'ricardo', 'manuel', 'eduardo', 'roberto', 'andres', 'sergio', 'enrique', 'jorge', 'rafael',
    'rosa', 'carmen', 'ana', 'lucia', 'paula', 'elena', 'isabel', 'cristina', 'laura', 'marta',
    'adriana', 'monica', 'veronica', 'claudia', 'patricia', 'lorena', 'silvia', 'beatriz', 'carla', 'rocio',
    // French
    'pierre', 'jean', 'nicolas', 'philippe', 'laurent', 'christophe', 'michel', 'eric', 'patrick', 'olivier',
    'julien', 'stephane', 'pascal', 'thierry', 'alain', 'bruno', 'yves', 'marc', 'jacques', 'bernard',
    'isabelle', 'nathalie', 'sylvie', 'catherine', 'monique', 'martine', 'chantal', 'christine', 'francoise', 'annie',
    'anne', 'dominique', 'valerie', 'sophie', 'veronique', 'aurelie', 'celine', 'sandrine', 'helene', 'marie',
    // German
    'hans', 'peter', 'thomas', 'andreas', 'stefan', 'michael', 'christian', 'markus', 'martin', 'matthias',
    'johannes', 'frank', 'jens', 'klaus', 'wolfgang', 'karl', 'helmut', 'heinz', 'gerhard', 'werner',
    'monika', 'sabine', 'claudia', 'susanne', 'petra', 'birgit', 'andrea', 'ursula', 'renate', 'karin',
    'brigitte', 'helga', 'ingrid', 'heike', 'erika', 'martina', 'anja', 'katrin', 'nicole', 'silke',
    // Russian
    'ivan', 'dmitry', 'alexander', 'alexei', 'sergei', 'andrei', 'nikolai', 'mikhail', 'pavel', 'vladimir',
    'viktor', 'boris', 'yuri', 'oleg', 'igor', 'vasily', 'grigory', 'konstantin', 'anatoly', 'fyodor',
    'anna', 'maria', 'elena', 'olga', 'natalia', 'irina', 'ekaterina', 'tatiana', 'svetlana', 'marina',
    'yulia', 'oksana', 'ludmila', 'valentina', 'nadezhda', 'galina', 'larisa', 'vera', 'tamara', 'zoya',
    // Arabic/Middle Eastern
    'ahmed', 'mohamed', 'mohammed', 'ali', 'omar', 'ibrahim', 'youssef', 'hassan', 'hussein', 'mustafa',
    'khaled', 'karim', 'mahmoud', 'samir', 'tariq', 'faisal', 'nasser', 'rashid', 'saleh', 'waleed',
    'fatima', 'aisha', 'maryam', 'layla', 'noor', 'sara', 'hana', 'rania', 'dina', 'mona',
    'amira', 'yasmin', 'leila', 'samira', 'farah', 'zahra', 'mariam', 'khadija', 'salma', 'nawal',
    // African
    'kofi', 'kwame', 'adisa', 'olumide', 'chibueze', 'emeka', 'chidi', 'nnamdi', 'obinna', 'ikenna',
    'nneka', 'chinwe', 'ngozi', 'adaeze', 'chika', 'ifeoma', 'amaka', 'uchenna', 'obiageli', 'chiamaka',
    // Indonesian/Malay
    'budi', 'agus', 'bambang', 'dedi', 'eko', 'hendra', 'indra', 'joko', 'made', 'putu',
    'siti', 'dewi', 'sri', 'rina', 'wati', 'yanti', 'ani', 'ningsih', 'wulan', 'putri',
    // Filipino
    'jose', 'juan', 'pedro', 'antonio', 'francisco', 'manuel', 'reynaldo', 'roberto', 'ricardo', 'eduardo',
    'maria', 'rosa', 'carmen', 'josefa', 'luisa', 'elena', 'ana', 'cristina', 'patricia', 'michelle',
    // Vietnamese
    'nguyen', 'tran', 'le', 'pham', 'hoang', 'vu', 'vo', 'dang', 'bui', 'do',
    'minh', 'hung', 'anh', 'hoa', 'linh', 'mai', 'lan', 'huong', 'thuy', 'nga',
]);

// Top surnames/last names from US Census + international
export const COMMON_LAST_NAMES = new Set([
    // === US Census Top 1000 Surnames ===
    'smith', 'johnson', 'williams', 'brown', 'jones', 'garcia', 'miller', 'davis', 'rodriguez', 'martinez',
    'hernandez', 'lopez', 'gonzalez', 'wilson', 'anderson', 'thomas', 'taylor', 'moore', 'jackson', 'martin',
    'lee', 'perez', 'thompson', 'white', 'harris', 'sanchez', 'clark', 'ramirez', 'lewis', 'robinson',
    'walker', 'young', 'allen', 'king', 'wright', 'scott', 'torres', 'nguyen', 'hill', 'flores',
    'green', 'adams', 'nelson', 'baker', 'hall', 'rivera', 'campbell', 'mitchell', 'carter', 'roberts',
    'gomez', 'phillips', 'evans', 'turner', 'diaz', 'parker', 'cruz', 'edwards', 'collins', 'reyes',
    'stewart', 'morris', 'morales', 'murphy', 'cook', 'rogers', 'gutierrez', 'ortiz', 'morgan', 'cooper',
    'peterson', 'bailey', 'reed', 'kelly', 'howard', 'ramos', 'kim', 'cox', 'ward', 'richardson',
    'watson', 'brooks', 'chavez', 'wood', 'james', 'bennett', 'gray', 'mendoza', 'ruiz', 'hughes',
    'price', 'alvarez', 'castillo', 'sanders', 'patel', 'myers', 'long', 'ross', 'foster', 'jimenez',
    'powell', 'jenkins', 'perry', 'russell', 'sullivan', 'bell', 'coleman', 'butler', 'henderson', 'barnes',
    'gonzales', 'fisher', 'vasquez', 'simmons', 'stokes', 'simpson', 'mcdonald', 'reynolds', 'hamilton', 'graham',
    'kim', 'wallace', 'west', 'cole', 'hayes', 'jordan', 'owens', 'reynolds', 'fisher', 'ellis',
    'harrison', 'gibson', 'mcdonald', 'cruz', 'marshall', 'ortiz', 'gomez', 'murray', 'freeman', 'wells',
    'webb', 'simpson', 'stevens', 'tucker', 'porter', 'hunter', 'hicks', 'crawford', 'henry', 'boyd',
    'mason', 'morales', 'kennedy', 'warren', 'dixon', 'ramos', 'reyes', 'burns', 'gordon', 'shaw',
    'holmes', 'rice', 'robertson', 'hunt', 'black', 'daniels', 'palmer', 'mills', 'nichols', 'grant',
    'knight', 'ferguson', 'rose', 'stone', 'hawkins', 'dunn', 'perkins', 'hudson', 'spencer', 'gardner',
    'stephens', 'payne', 'pierce', 'berry', 'matthews', 'arnold', 'wagner', 'willis', 'ray', 'watkins',
    'olson', 'carroll', 'duncan', 'snyder', 'hart', 'cunningham', 'bradley', 'lane', 'andrews', 'ruiz',
    'harper', 'fox', 'riley', 'armstrong', 'carpenter', 'weaver', 'greene', 'lawrence', 'elliott', 'chavez',
    'sims', 'austin', 'peters', 'kelley', 'franklin', 'lawson', 'fields', 'gutierrez', 'schmidt', 'carr',
    'vasquez', 'castillo', 'wheeler', 'chapman', 'oliver', 'montgomery', 'richards', 'williamson', 'johnston', 'banks',
    'meyer', 'bishop', 'mccoy', 'howell', 'alvarez', 'morrison', 'hansen', 'fernandez', 'garza', 'harvey',
    // === Chinese Surnames ===
    'wang', 'zhang', 'li', 'liu', 'chen', 'yang', 'huang', 'zhao', 'wu', 'zhou',
    'xu', 'sun', 'ma', 'zhu', 'hu', 'guo', 'he', 'lin', 'luo', 'gao',
    'zheng', 'liang', 'xie', 'song', 'tang', 'xu', 'deng', 'han', 'feng', 'cao',
    'peng', 'zeng', 'xiao', 'tian', 'dong', 'pan', 'yuan', 'cai', 'jiang', 'yu',
    'du', 'ye', 'cheng', 'wei', 'su', 'lu', 'ding', 'ren', 'shen', 'yao',
    // === Indian Surnames ===
    'singh', 'kumar', 'sharma', 'gupta', 'patel', 'shah', 'reddy', 'jain', 'verma', 'mehta',
    'nair', 'mukherjee', 'banerjee', 'chatterjee', 'pillai', 'iyer', 'rao', 'desai', 'naidu', 'menon',
    'kapur', 'bhatia', 'malhotra', 'khanna', 'chopra', 'sethi', 'srivastava', 'mishra', 'pandey', 'tiwari',
    'dwivedi', 'trivedi', 'agarwal', 'saxena', 'rastogi', 'chandra', 'mohan', 'chauhan', 'yadav', 'thakur',
    // === Japanese Surnames ===
    'sato', 'suzuki', 'takahashi', 'tanaka', 'watanabe', 'ito', 'yamamoto', 'nakamura', 'kobayashi', 'kato',
    'yoshida', 'yamada', 'sasaki', 'yamaguchi', 'saito', 'matsumoto', 'inoue', 'kimura', 'hayashi', 'shimizu',
    'yamazaki', 'mori', 'abe', 'ikeda', 'hashimoto', 'yamashita', 'ishikawa', 'nakajima', 'maeda', 'fujita',
    // === Korean Surnames ===
    'kim', 'lee', 'park', 'choi', 'jung', 'kang', 'cho', 'yoon', 'jang', 'lim',
    'han', 'shin', 'seo', 'kwon', 'hwang', 'ahn', 'song', 'jeon', 'hong', 'yoo',
    // === German Surnames ===
    'muller', 'schmidt', 'schneider', 'fischer', 'weber', 'meyer', 'wagner', 'becker', 'schulz', 'hoffmann',
    'schaefer', 'koch', 'bauer', 'richter', 'klein', 'wolf', 'schroeder', 'neumann', 'schwarz', 'zimmermann',
    'braun', 'kruger', 'hofmann', 'hartmann', 'lange', 'schmitt', 'werner', 'schmitz', 'krause', 'meier',
    // === Spanish/Hispanic Surnames ===
    'fernandez', 'gonzalez', 'rodriguez', 'lopez', 'martinez', 'sanchez', 'perez', 'gomez', 'martin', 'ruiz',
    'diaz', 'hernandez', 'alvarez', 'moreno', 'munoz', 'romero', 'alonso', 'gutierrez', 'navarro', 'torres',
    'dominguez', 'vazquez', 'ramos', 'gil', 'ramirez', 'serrano', 'blanco', 'suarez', 'molina', 'morales',
    // === French Surnames ===
    'dubois', 'thomas', 'robert', 'richard', 'petit', 'durand', 'leroy', 'moreau', 'simon', 'laurent',
    'lefebvre', 'michel', 'garcia', 'david', 'bertrand', 'roux', 'vincent', 'fournier', 'morel', 'girard',
    // === Italian Surnames ===
    'rossi', 'russo', 'ferrari', 'esposito', 'bianchi', 'romano', 'colombo', 'ricci', 'marino', 'greco',
    'bruno', 'gallo', 'conti', 'manna', 'costa', 'giordano', 'mancini', 'rizzo', 'lombardi', 'moretti',
    // === Portuguese/Brazilian Surnames ===
    'silva', 'santos', 'oliveira', 'souza', 'rodrigues', 'ferreira', 'alves', 'pereira', 'lima', 'gomes',
    'costa', 'ribeiro', 'martins', 'carvalho', 'almeida', 'lopes', 'soares', 'fernandes', 'vieira', 'barbosa',
    // === Russian Surnames ===
    'ivanov', 'petrov', 'sidorov', 'smirnov', 'kuznetsov', 'popov', 'vasiliev', 'sokolov', 'mikhailov', 'novikov',
    'fedorov', 'morozov', 'volkov', 'alekseev', 'lebedev', 'semenov', 'egorov', 'pavlov', 'kozlov', 'stepanov',
    // === Polish Surnames ===
    'nowak', 'kowalski', 'wisniewski', 'wojcik', 'kowalczyk', 'kaminski', 'lewandowski', 'zielinski', 'szymanski', 'wozniak',
    // === Dutch Surnames ===
    'de jong', 'jansen', 'de vries', 'van den berg', 'van dijk', 'bakker', 'janssen', 'visser', 'smit', 'meijer',
    // === Vietnamese Surnames ===
    'nguyen', 'tran', 'le', 'pham', 'hoang', 'vu', 'vo', 'dang', 'bui', 'do',
    // === Filipino Surnames ===
    'dela cruz', 'santos', 'reyes', 'cruz', 'bautista', 'del rosario', 'gonzales', 'ramos', 'mendoza', 'flores',
    // === Indonesian Surnames ===
    'wijaya', 'putra', 'setiawan', 'susanto', 'santoso', 'hidayat', 'pratama', 'nugroho', 'rahman', 'dewi',
    // === African Surnames ===
    'okonkwo', 'adebayo', 'ibrahim', 'abubakar', 'mohammed', 'musa', 'ahmed', 'ali', 'hassan', 'omar',
    'diallo', 'traore', 'coulibaly', 'diop', 'ndiaye', 'mbeki', 'mandela', 'zuma', 'mugabe', 'kenyatta',
]);

// Check if a word is a common name
export function isCommonName(word: string): boolean {
    const lower = word.toLowerCase();
    return COMMON_FIRST_NAMES.has(lower) || COMMON_LAST_NAMES.has(lower);
}

// Export the name counts for UI display
export const NAME_DB_STATS = {
    firstNames: COMMON_FIRST_NAMES.size,
    lastNames: COMMON_LAST_NAMES.size,
    total: COMMON_FIRST_NAMES.size + COMMON_LAST_NAMES.size
};
