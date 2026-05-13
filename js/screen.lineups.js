const ScreenLineups = (() => {

    const TEAM_COLORS = {
        'Argentina':'#74ACDF','France':'#003189','Morocco':'#C1272D','Japan':'#BC002D',
        'Brazil':'#009C3B','Germany':'#4a4a4a','Senegal':'#00853F','Australia':'#00843D',
        'Uruguay':'#5EB6E4','Spain':'#C60B1E','Nigeria':'#008751','South Korea':'#003478',
        'Colombia':'#C8970A','Italy':'#0033A0','Ghana':'#CC0001','Iran':'#239F40',
        'Chile':'#D52B1E','England':'#1D3E8C','Tunisia':'#E70013','Saudi Arabia':'#006C35',
        'Ecuador':'#B8980A','Portugal':'#006600','Algeria':'#006233','Qatar':'#8D1B3D',
        'Peru':'#D91023','Netherlands':'#FF6600','Egypt':'#EF2B2D','New Zealand':'#00247D',
        'Paraguay':'#D52B1E','Belgium':'#ED2939','Cameroon':'#007A5E','USA':'#002868',
        'Mexico':'#006847','Croatia':'#CC0000','Switzerland':'#CC0000','Honduras':'#0073CF',
        'Canada':'#CC0000','Austria':'#ED2939','Poland':'#DC143C','Costa Rica':'#002B7F',
        'Jamaica':'#1a1a1a','Denmark':'#C60C30','Ukraine':'#005BBB','El Salvador':'#1C4490',
        'Panama':'#DA0000','Sweden':'#006AA7','Czech Republic':'#D7141A','Bolivia':'#007934'
    };

    const LINEUPS = {
        'Argentina': { formation:'4-3-3', coach:'L. Scaloni', players:[
            {name:'E. Martínez',num:23},
            {name:'Molina',num:26},{name:'C. Romero',num:13},{name:'L. Martínez',num:14},{name:'Tagliafico',num:3},
            {name:'De Paul',num:7},{name:'E. Fernández',num:24},{name:'Mac Allister',num:20},
            {name:'N. González',num:11},{name:'J. Álvarez',num:9},{name:'Messi',num:10}
        ]},
        'France': { formation:'4-3-3', coach:'D. Deschamps', players:[
            {name:'Maignan',num:16},
            {name:'Koundé',num:5},{name:'Upamecano',num:4},{name:'Saliba',num:17},{name:'T. Hernández',num:22},
            {name:'Kanté',num:13},{name:'Tchouaméni',num:8},{name:'Griezmann',num:7},
            {name:'Dembélé',num:11},{name:'Kolo Muani',num:9},{name:'Mbappé',num:10}
        ]},
        'Morocco': { formation:'4-3-3', coach:'W. Regragui', players:[
            {name:'Bounou',num:1},
            {name:'Hakimi',num:2},{name:'Saïss',num:5},{name:'El Yamiq',num:24},{name:'Mazraoui',num:22},
            {name:'Amrabat',num:4},{name:'Amallah',num:6},{name:'Ounahi',num:8},
            {name:'Boufal',num:17},{name:'En-Nesyri',num:19},{name:'Ziyech',num:7}
        ]},
        'Japan': { formation:'4-2-3-1', coach:'H. Moriyasu', players:[
            {name:'Gonda',num:12},
            {name:'Sakai',num:22},{name:'Itakura',num:16},{name:'Tomiyasu',num:6},{name:'Nagatomo',num:5},
            {name:'Endō',num:7},{name:'Morita',num:15},
            {name:'Kamada',num:14},{name:'Kubo',num:8},{name:'Ito',num:17},
            {name:'Ueda',num:9}
        ]},
        'Brazil': { formation:'4-2-3-1', coach:'Dorival Jr', players:[
            {name:'Alisson',num:1},
            {name:'Danilo',num:2},{name:'Marquinhos',num:4},{name:'Gabriel M.',num:3},{name:'R. Lodi',num:6},
            {name:'B. Guimarães',num:5},{name:'Casemiro',num:18},
            {name:'Rodrygo',num:11},{name:'Paquetá',num:10},{name:'Vinicius Jr',num:7},
            {name:'Endrick',num:9}
        ]},
        'Germany': { formation:'4-2-3-1', coach:'J. Nagelsmann', players:[
            {name:'Ter Stegen',num:1},
            {name:'Kimmich',num:6},{name:'Tah',num:4},{name:'Schlotterbeck',num:3},{name:'Raum',num:19},
            {name:'Goretzka',num:8},{name:'Gündoğan',num:21},
            {name:'Musiala',num:14},{name:'Wirtz',num:10},{name:'Sané',num:25},
            {name:'Füllkrug',num:9}
        ]},
        'Senegal': { formation:'4-3-3', coach:'A. Cissé', players:[
            {name:'E. Mendy',num:16},
            {name:'Sabaly',num:23},{name:'A. Diallo',num:5},{name:'Koulibaly',num:3},{name:'Ballo-Touré',num:20},
            {name:'I. Gueye',num:15},{name:'Kouyaté',num:8},{name:'N. Mendy',num:12},
            {name:'I. Sarr',num:17},{name:'B. Dia',num:13},{name:'Mané',num:10}
        ]},
        'Australia': { formation:'4-3-3', coach:'G. Arnold', players:[
            {name:'M. Ryan',num:1},
            {name:'Atkinson',num:19},{name:'Souttar',num:4},{name:'Degenek',num:6},{name:'Behich',num:5},
            {name:'Irvine',num:8},{name:'McGree',num:17},{name:'Mooy',num:13},
            {name:'Leckie',num:7},{name:'Duke',num:9},{name:'Mabil',num:11}
        ]},
        'Uruguay': { formation:'4-3-3', coach:'M. Bielsa', players:[
            {name:'S. Rochet',num:1},
            {name:'N. Nández',num:18},{name:'J.M. Giménez',num:2},{name:'R. Araujo',num:4},{name:'M. Olivera',num:6},
            {name:'Bentancur',num:8},{name:'F. Valverde',num:10},{name:'M. Ugarte',num:5},
            {name:'F. Pellistri',num:11},{name:'D. Núñez',num:9},{name:'C. Rodríguez',num:7}
        ]},
        'Spain': { formation:'4-3-3', coach:'L. de la Fuente', players:[
            {name:'Unai Simón',num:13},
            {name:'Carvajal',num:2},{name:'Le Normand',num:5},{name:'Laporte',num:14},{name:'Balde',num:3},
            {name:'Rodri',num:16},{name:'Pedri',num:26},{name:'Fabián',num:8},
            {name:'Yamal',num:19},{name:'Morata',num:7},{name:'N. Williams',num:17}
        ]},
        'Nigeria': { formation:'4-3-3', coach:'A. Eguavoen', players:[
            {name:'F. Uzoho',num:23},
            {name:'O. Aina',num:3},{name:'Troost-Ekong',num:5},{name:'L. Balogun',num:6},{name:'Z. Sanusi',num:17},
            {name:'F. Iwobi',num:10},{name:'O. Ndidi',num:4},{name:'Lookman',num:7},
            {name:'Chukwueze',num:11},{name:'Osimhen',num:9},{name:'Iheanacho',num:8}
        ]},
        'South Korea': { formation:'4-2-3-1', coach:'Hong Myung-bo', players:[
            {name:'K. Seung-gyu',num:21},
            {name:'K. Moon-hwan',num:2},{name:'K. Min-jae',num:3},{name:'J. Seung-hyun',num:5},{name:'K. Jin-su',num:15},
            {name:'H. In-beom',num:8},{name:'J. Woo-young',num:16},
            {name:'L. Kang-in',num:17},{name:'H. Hee-chan',num:11},{name:'H. Jun-ho',num:9},
            {name:'Son H-min',num:7}
        ]},
        'Colombia': { formation:'4-2-3-1', coach:'N. Lorenzo', players:[
            {name:'D. Vargas',num:1},
            {name:'S. Muñoz',num:2},{name:'Y. Mina',num:13},{name:'D. Sánchez',num:4},{name:'J. Mojica',num:18},
            {name:'J. Lerma',num:8},{name:'M. Uribe',num:20},
            {name:'L. Díaz',num:10},{name:'Cuadrado',num:11},{name:'L. Sinisterra',num:17},
            {name:'J. Córdoba',num:9}
        ]},
        'Italy': { formation:'4-3-3', coach:'L. Spalletti', players:[
            {name:'Donnarumma',num:1},
            {name:'Di Lorenzo',num:2},{name:'Gatti',num:5},{name:'Bastoni',num:23},{name:'Dimarco',num:22},
            {name:'Barella',num:18},{name:'Jorginho',num:8},{name:'Frattesi',num:11},
            {name:'F. Chiesa',num:14},{name:'Scamacca',num:9},{name:'Pellegrini',num:10}
        ]},
        'Ghana': { formation:'4-4-2', coach:'O. Addo', players:[
            {name:'L. Ati-Zigi',num:1},
            {name:'T. Lamptey',num:2},{name:'D. Amartey',num:14},{name:'A. Djiku',num:5},{name:'B. Rahman',num:17},
            {name:'T. Partey',num:6},{name:'M. Kudus',num:10},{name:'A. Semenyo',num:11},{name:'J. Ayew',num:20},
            {name:'I. Sulemana',num:23},{name:'J. Mensah',num:9}
        ]},
        'Iran': { formation:'4-2-3-1', coach:'C. Queiroz', players:[
            {name:'Beiranvand',num:1},
            {name:'Moharrami',num:2},{name:'Hosseini',num:5},{name:'Cheshmi',num:4},{name:'Pouraliganji',num:3},
            {name:'Ezatolahi',num:8},{name:'Noorollahi',num:6},
            {name:'V. Amiri',num:11},{name:'Jahanbakhsh',num:7},{name:'Ansarifard',num:10},
            {name:'M. Taremi',num:9}
        ]},
        'Chile': { formation:'4-2-3-1', coach:'R. Gareca', players:[
            {name:'G. Arias',num:1},
            {name:'M. Isla',num:4},{name:'G. Maripán',num:3},{name:'G. Medel',num:17},{name:'B. Mena',num:14},
            {name:'C. Palacios',num:19},{name:'M. Ríos',num:20},
            {name:'A. Sánchez',num:7},{name:'E. Pulgar',num:5},{name:'J. Pérez',num:6},
            {name:'A. Vargas',num:11}
        ]},
        'England': { formation:'4-3-3', coach:'T. Tuchel', players:[
            {name:'Pickford',num:1},
            {name:'K. Walker',num:2},{name:'J. Stones',num:5},{name:'H. Maguire',num:6},{name:'L. Shaw',num:3},
            {name:'Bellingham',num:22},{name:'D. Rice',num:4},{name:'P. Foden',num:21},
            {name:'B. Saka',num:7},{name:'H. Kane',num:9},{name:'Rashford',num:11}
        ]},
        'Tunisia': { formation:'4-3-3', coach:'J. Kadri', players:[
            {name:'A. Dahmen',num:16},
            {name:'M. Drager',num:2},{name:'Y. Meriah',num:5},{name:'D. Bronn',num:6},{name:'A. Abdi',num:3},
            {name:'E. Skhiri',num:7},{name:'A. Laidouni',num:4},{name:'W. Khazri',num:10},
            {name:'Y. Msakni',num:11},{name:'N. Sliti',num:17},{name:'I. Jebali',num:19}
        ]},
        'Saudi Arabia': { formation:'4-2-3-1', coach:'R. Mancini', players:[
            {name:'Al-Owais',num:1},
            {name:'Al-Ghamdi',num:2},{name:'Al-Amri',num:5},{name:'Sharahili',num:4},{name:'Al-Shahrani',num:13},
            {name:'Al-Ghannam',num:18},{name:'Abdulhamid',num:8},
            {name:'Al-Dawsari',num:10},{name:'Al-Malki',num:11},{name:'Al-Burayk',num:17},
            {name:'Al-Shehri',num:7}
        ]},
        'Ecuador': { formation:'4-3-3', coach:'F. Sánchez', players:[
            {name:'H. Galíndez',num:1},
            {name:'Preciado',num:2},{name:'Hincapié',num:16},{name:'Arboleda',num:3},{name:'Estupiñán',num:22},
            {name:'C. Gruezo',num:8},{name:'M. Caicedo',num:4},{name:'G. Plata',num:7},
            {name:'A. Valencia',num:13},{name:'E. Cifuentes',num:23},{name:'J. Ibarra',num:11}
        ]},
        'Portugal': { formation:'4-2-3-1', coach:'R. Martínez', players:[
            {name:'D. Costa',num:1},
            {name:'Cancelo',num:20},{name:'Pepe',num:3},{name:'R. Dias',num:4},{name:'N. Mendes',num:25},
            {name:'Palhinha',num:26},{name:'R. Neves',num:15},
            {name:'B. Silva',num:10},{name:'B. Fernandes',num:8},{name:'R. Leão',num:17},
            {name:'C. Ronaldo',num:7}
        ]},
        'Algeria': { formation:'4-3-3', coach:'D. Belmadi', players:[
            {name:'R. M\'Bolhi',num:1},
            {name:'Bensebaini',num:12},{name:'R. Mandi',num:3},{name:'D. Benlamri',num:5},{name:'Z. Atal',num:2},
            {name:'N. Bennacer',num:8},{name:'Tighanamine',num:17},{name:'Ait Nouri',num:22},
            {name:'Y. Belaïli',num:11},{name:'I. Slimani',num:9},{name:'R. Mahrez',num:7}
        ]},
        'Qatar': { formation:'4-3-3', coach:'C. Queiroz', players:[
            {name:'S. Al-Sheeb',num:1},
            {name:'P. Correia',num:23},{name:'B. Khoukhi',num:12},{name:'Al-Harazi',num:5},{name:'Al-Rawi',num:6},
            {name:'A. Hatem',num:21},{name:'K. Boudiaf',num:4},{name:'A. Afif',num:11},
            {name:'H. Al-Haidos',num:10},{name:'A. Muntari',num:9},{name:'B. Al-Yahri',num:18}
        ]},
        'Peru': { formation:'4-2-3-1', coach:'J. Reynoso', players:[
            {name:'P. Gallese',num:1},
            {name:'Advíncula',num:2},{name:'Zambrano',num:3},{name:'A. Callens',num:15},{name:'M. Trauco',num:6},
            {name:'R. Tapia',num:8},{name:'Y. Quispe',num:18},
            {name:'A. Polo',num:11},{name:'C. Cueva',num:10},{name:'J. Carrillo',num:7},
            {name:'G. Lapadula',num:9}
        ]},
        'Netherlands': { formation:'4-3-3', coach:'R. Koeman', players:[
            {name:'B. Verbruggen',num:1},
            {name:'Dumfries',num:22},{name:'Van Dijk',num:4},{name:'J. Timber',num:5},{name:'N. Aké',num:6},
            {name:'F. de Jong',num:21},{name:'Reijnders',num:8},{name:'X. Simons',num:10},
            {name:'Bergwijn',num:7},{name:'M. Depay',num:9},{name:'C. Gakpo',num:11}
        ]},
        'Egypt': { formation:'4-2-3-1', coach:'R. Vitória', players:[
            {name:'El-Shenawy',num:1},
            {name:'A. Kamal',num:2},{name:'M. Hegazy',num:5},{name:'Abdelmonem',num:14},{name:'O. Kamal',num:3},
            {name:'T. Hamed',num:4},{name:'M. El-Nenny',num:18},
            {name:'M. Salah',num:11},{name:'T. Mohamed',num:7},{name:'R. Attia',num:17},
            {name:'O. Marmoush',num:9}
        ]},
        'New Zealand': { formation:'4-4-2', coach:'D. Hay', players:[
            {name:'O. Sail',num:1},
            {name:'B. Smith',num:2},{name:'N. Elcock',num:5},{name:'M. Boxall',num:4},{name:'L. Cacace',num:3},
            {name:'D. Thomas',num:14},{name:'M. Fisher',num:8},{name:'Barbarouses',num:7},{name:'J. Bell',num:16},
            {name:'C. Wood',num:11},{name:'M. Garbett',num:9}
        ]},
        'Paraguay': { formation:'4-3-3', coach:'D. Garnero', players:[
            {name:'A. Silva',num:1},
            {name:'R. Rojas',num:2},{name:'F. Balbuena',num:5},{name:'O. Romero',num:20},{name:'Arzamendia',num:3},
            {name:'R. Olmedo',num:8},{name:'Villasanti',num:22},{name:'A. Cubas',num:4},
            {name:'M. Almiron',num:16},{name:'A. Enciso',num:7},{name:'C. González',num:9}
        ]},
        'Belgium': { formation:'4-3-3', coach:'D. Tedesco', players:[
            {name:'K. Casteels',num:1},
            {name:'Castagne',num:2},{name:'W. Faes',num:14},{name:'A. Theate',num:5},{name:'Saelemaekers',num:22},
            {name:'Tielemans',num:8},{name:'H. Vanaken',num:6},{name:'De Bruyne',num:7},
            {name:'L. Openda',num:9},{name:'R. Lukaku',num:10},{name:'J. Doku',num:11}
        ]},
        'Cameroon': { formation:'4-3-3', coach:'R. Song', players:[
            {name:'A. Onana',num:1},
            {name:'C. Fai',num:2},{name:'N. Nkoulou',num:3},{name:'M. Ngadeu',num:5},{name:'B. Tolo',num:6},
            {name:'Zambo Anguissa',num:4},{name:'P. Imoko',num:14},{name:'M. Gouet',num:7},
            {name:'V. Aboubakar',num:10},{name:'Moumi Ngamaleu',num:19},{name:'Toko Ekambi',num:17}
        ]},
        'USA': { formation:'4-3-3', coach:'G. Berhalter', players:[
            {name:'M. Turner',num:1},
            {name:'S. Dest',num:22},{name:'C. Richards',num:4},{name:'M. Ream',num:5},{name:'A. Robinson',num:18},
            {name:'T. Adams',num:14},{name:'Y. Musah',num:8},{name:'W. McKennie',num:16},
            {name:'T. Weah',num:11},{name:'F. Balogun',num:9},{name:'C. Pulisic',num:10}
        ]},
        'Mexico': { formation:'4-3-3', coach:'J. Lozano', players:[
            {name:'G. Ochoa',num:13},
            {name:'J. Sánchez',num:2},{name:'E. Álvarez',num:4},{name:'C. Montes',num:3},{name:'G. Moreno',num:15},
            {name:'H. Herrera',num:16},{name:'C. Rodríguez',num:7},{name:'A. Vega',num:11},
            {name:'H. Lozano',num:22},{name:'R. Jiménez',num:9},{name:'A. Córdova',num:10}
        ]},
        'Croatia': { formation:'4-3-3', coach:'Z. Dalić', players:[
            {name:'Livaković',num:1},
            {name:'Juranović',num:22},{name:'J. Sutalo',num:14},{name:'L. Gvardiol',num:6},{name:'B. Sosa',num:19},
            {name:'M. Brozović',num:11},{name:'M. Kovačić',num:8},{name:'L. Modrić',num:10},
            {name:'M. Kramarić',num:9},{name:'A. Budimir',num:16},{name:'I. Perišić',num:4}
        ]},
        'Switzerland': { formation:'3-4-3', coach:'M. Yakin', players:[
            {name:'Y. Sommer',num:1},
            {name:'F. Schär',num:5},{name:'N. Elvedi',num:3},{name:'R. Rodríguez',num:13},
            {name:'S. Zuber',num:17},{name:'R. Freuler',num:8},{name:'G. Xhaka',num:10},{name:'M. Akanji',num:20},
            {name:'B. Embolo',num:7},{name:'N. Ndoye',num:11},{name:'S. Vargas',num:19}
        ]},
        'Honduras': { formation:'4-3-3', coach:'R. Rueda', players:[
            {name:'L. López',num:1},
            {name:'M. Bernardez',num:3},{name:'J. Izaguirre',num:4},{name:'O. Mejia',num:5},{name:'H. García',num:2},
            {name:'R. Lozano',num:8},{name:'L. Garrido',num:6},{name:'D. Pereira',num:18},
            {name:'R. Quioto',num:11},{name:'J. Menjívar',num:9},{name:'C. Discua',num:7}
        ]},
        'Canada': { formation:'4-2-3-1', coach:'J. Marsch', players:[
            {name:'M. Crepeau',num:1},
            {name:'A. Johnston',num:2},{name:'S. Miller',num:5},{name:'K. Henry',num:4},{name:'A. Davies',num:19},
            {name:'S. Arfield',num:8},{name:'M. Kaye',num:16},
            {name:'J. Buchanan',num:21},{name:'T. Laryea',num:11},{name:'A. Larin',num:17},
            {name:'J. David',num:9}
        ]},
        'Austria': { formation:'4-2-3-1', coach:'R. Rangnick', players:[
            {name:'P. Pentz',num:1},
            {name:'S. Lainer',num:3},{name:'K. Danso',num:5},{name:'M. Wöber',num:4},{name:'P. Mwene',num:15},
            {name:'S. Schlager',num:8},{name:'F. Grillitsch',num:7},
            {name:'C. Baumgartner',num:14},{name:'P. Wimmer',num:21},{name:'F. Sabitzer',num:11},
            {name:'M. Arnautović',num:9}
        ]},
        'Poland': { formation:'4-2-3-1', coach:'M. Probierz', players:[
            {name:'B. Dragowski',num:12},
            {name:'M. Cash',num:2},{name:'M. Glik',num:15},{name:'J. Bednarek',num:5},{name:'Bereszyński',num:3},
            {name:'Krychowiak',num:10},{name:'K. Linetty',num:8},
            {name:'P. Zieliński',num:14},{name:'K. Świderski',num:11},{name:'S. Szymański',num:20},
            {name:'Lewandowski',num:9}
        ]},
        'Costa Rica': { formation:'4-2-3-1', coach:'G. Alfaro', players:[
            {name:'K. Navas',num:1},
            {name:'B. Oviedo',num:2},{name:'C. Waston',num:5},{name:'F. Calvo',num:3},{name:'J. Mora',num:17},
            {name:'Y. Tejeda',num:18},{name:'R. Borges',num:4},
            {name:'J. Campbell',num:22},{name:'B. Ruiz',num:10},{name:'G. Torres',num:7},
            {name:'J. Venegas',num:9}
        ]},
        'Jamaica': { formation:'4-2-3-1', coach:'S. McClaren', players:[
            {name:'A. Blake',num:1},
            {name:'K. Lawrence',num:13},{name:'L. Mariappa',num:4},{name:'A. Thomas',num:5},{name:'R. Topps',num:22},
            {name:'D. Nicholson',num:8},{name:'K. Pinnock',num:11},
            {name:'B. Antonio',num:17},{name:'M. Morrison',num:6},{name:'N. Holgate',num:15},
            {name:'L. Bailey',num:7}
        ]},
        'Denmark': { formation:'3-4-3', coach:'K. Hjulmand', players:[
            {name:'K. Schmeichel',num:1},
            {name:'S. Kjær',num:4},{name:'A. Christensen',num:5},{name:'J. Andersen',num:6},
            {name:'P. Højbjerg',num:23},{name:'C. Eriksen',num:10},{name:'M. Damsgaard',num:24},{name:'J. Bah',num:18},
            {name:'Skov Olsen',num:8},{name:'R. Højlund',num:17},{name:'Lindstrøm',num:11}
        ]},
        'Ukraine': { formation:'4-3-3', coach:'S. Rebrov', players:[
            {name:'A. Lunin',num:13},
            {name:'Zinchenko',num:2},{name:'I. Zabarnyi',num:5},{name:'S. Kryvtsov',num:4},{name:'Matviyenko',num:22},
            {name:'Malinovskyi',num:8},{name:'Stepanenko',num:6},{name:'M. Mudryk',num:15},
            {name:'A. Dovbyk',num:9},{name:'H. Sudakov',num:17},{name:'Tsygankov',num:7}
        ]},
        'El Salvador': { formation:'4-2-3-1', coach:'H. Pérez', players:[
            {name:'M. Galdámez',num:1},
            {name:'Monterroza',num:2},{name:'H. Duenas',num:5},{name:'J. Benítez',num:4},{name:'J. Rodas',num:3},
            {name:'D. Jacobo',num:8},{name:'M. Osorio',num:6},
            {name:'A. Góchez',num:11},{name:'N. Abergil',num:10},{name:'J. Menjívar',num:7},
            {name:'J. Panameño',num:9}
        ]},
        'Panama': { formation:'5-3-2', coach:'T. Christiansen', players:[
            {name:'L. Mejía',num:1},
            {name:'M. Murillo',num:4},{name:'E. Davis',num:5},{name:'H. Cummings',num:2},{name:'G. Torres',num:3},{name:'J. Escobar',num:16},
            {name:'A. Cooper',num:8},{name:'F. Fajardo',num:11},{name:'A. Rodríguez',num:10},
            {name:'R. Brown',num:7},{name:'G. Ávila',num:9}
        ]},
        'Sweden': { formation:'4-4-2', coach:'J.D. Tomasson', players:[
            {name:'R. Olsen',num:1},
            {name:'E. Krafth',num:15},{name:'V. Lindelöf',num:4},{name:'A. Danielson',num:5},{name:'Augustinsson',num:3},
            {name:'E. Forsberg',num:10},{name:'D. Kulusevski',num:21},{name:'V. Claesson',num:11},{name:'S. Larsson',num:7},
            {name:'A. Isak',num:22},{name:'V. Gyökeres',num:9}
        ]},
        'Czech Republic': { formation:'4-2-3-1', coach:'I. Hašek', players:[
            {name:'J. Staněk',num:1},
            {name:'V. Coufal',num:5},{name:'D. Holes',num:22},{name:'L. Krejčí',num:4},{name:'J. Boril',num:3},
            {name:'T. Souček',num:8},{name:'A. Barák',num:11},
            {name:'L. Provod',num:14},{name:'V. Sýkora',num:17},{name:'M. Jankto',num:10},
            {name:'P. Schick',num:9}
        ]},
        'Bolivia': { formation:'4-4-2', coach:'G. Costas', players:[
            {name:'C. Lampe',num:1},
            {name:'L. Haquin',num:2},{name:'J. Jusino',num:4},{name:'M. Suárez',num:5},{name:'P. Áñez',num:3},
            {name:'R. Wayar',num:8},{name:'F. Vaca',num:10},{name:'J. Ramallo',num:7},{name:'R. Martins',num:11},
            {name:'M. Algarañaz',num:9},{name:'V. Ábrego',num:17}
        ]}
    };

    let currentGroup = 'A';
    let currentTeam  = 'Argentina';

    function render() {
        const el = document.getElementById('screen-lineups');
        el.innerHTML = `
            <div class="lineups-wrap">
                <div class="lineups-title">${currentLang === 'he' ? '👕 הרכבים משוערים' : '👕 Predicted Lineups'}</div>
                <div class="lineups-groups">
                    ${GROUPS.map(g => `
                        <button class="lg-btn${g.id === currentGroup ? ' active' : ''}"
                                onclick="ScreenLineups.selectGroup('${g.id}')">
                            ${currentLang === 'he' ? 'בית' : 'Group'} ${g.id}
                        </button>
                    `).join('')}
                </div>
                <div class="lineups-teams" id="lineups-teams">
                    ${renderTeamButtons()}
                </div>
                <div id="lineups-pitch-area">
                    ${renderPitch()}
                </div>
            </div>`;
    }

    function renderTeamButtons() {
        const group = GROUPS.find(g => g.id === currentGroup);
        return group.teams.map(t => `
            <button class="lt-btn${t === currentTeam ? ' active' : ''}"
                    onclick="ScreenLineups.selectTeam('${t}')">
                <span>${TEAM_FLAGS[t] || '🏳'}</span>
                <span>${t}</span>
            </button>
        `).join('');
    }

    function renderPitch() {
        const data = LINEUPS[currentTeam];
        if (!data) return `<div class="lineups-empty">נתונים לא זמינים</div>`;

        const rows = data.formation.split('-').map(Number);
        const players = data.players;
        const color = TEAM_COLORS[currentTeam] || '#2563eb';

        let idx = 1;
        const outfieldRows = rows.map(n => {
            const row = players.slice(idx, idx + n);
            idx += n;
            return row;
        });
        const rowsTopToBottom = [...outfieldRows].reverse();

        return `
            <div class="lineup-team-info">
                <span class="lineup-flag-big">${TEAM_FLAGS[currentTeam] || '🏳'}</span>
                <div>
                    <div class="lineup-team-name">${currentTeam}</div>
                    <div class="lineup-team-meta">
                        ${data.formation}
                        &nbsp;·&nbsp;
                        ${currentLang === 'he' ? 'מאמן' : 'Coach'}: ${data.coach}
                    </div>
                    <div class="lineup-team-meta" style="opacity:.7;margin-top:1px">
                        ${currentLang === 'he' ? 'הרכב משוער — מבוסס על המשחק האחרון' : 'Predicted lineup — based on last match'}
                    </div>
                </div>
            </div>
            <div class="lineup-pitch-wrap">
                <div class="lineup-pitch">
                    <div class="lp-border"></div>
                    <div class="lp-midline"></div>
                    <div class="lp-circle"></div>
                    <div class="lp-box-top"></div>
                    <div class="lp-box-bot"></div>
                    ${rowsTopToBottom.map(row => `
                        <div class="lineup-row">
                            ${row.map(p => renderPlayer(p, color)).join('')}
                        </div>
                    `).join('')}
                    <div class="lineup-row">
                        ${renderPlayer(players[0], color)}
                    </div>
                </div>
            </div>`;
    }

    function renderPlayer(p, color) {
        return `
            <div class="lp-player">
                <div class="lp-jersey" style="background:${color}">
                    <span class="lp-num">${p.num}</span>
                </div>
                <div class="lp-name">${p.name}</div>
            </div>`;
    }

    function selectGroup(id) {
        currentGroup = id;
        currentTeam = GROUPS.find(g => g.id === id).teams[0];
        document.querySelectorAll('.lg-btn').forEach(b => {
            b.classList.toggle('active', b.textContent.trim().endsWith(id));
        });
        document.getElementById('lineups-teams').innerHTML = renderTeamButtons();
        document.getElementById('lineups-pitch-area').innerHTML = renderPitch();
    }

    function selectTeam(name) {
        currentTeam = name;
        document.getElementById('lineups-teams').innerHTML = renderTeamButtons();
        document.getElementById('lineups-pitch-area').innerHTML = renderPitch();
    }

    return { render, selectGroup, selectTeam };
})();
