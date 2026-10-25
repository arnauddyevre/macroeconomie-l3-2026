/* Généré par scripts/preparer_composantes_pib.py. */
window.MASTER_GDP_COMPONENTS = {
  "title": "Composantes de la dépense en France",
  "period": [
    1949,
    2025
  ],
  "unit": "% du PIB à prix courants",
  "base": 2020,
  "vintage": "2026-05-21",
  "source": {
    "institution": "Insee",
    "title": "Comptes nationaux annuels, base 2020, tableau 1.101",
    "sheet": "T_1101 en niveau",
    "file": "audit/T_1101_1103_fr.xlsx",
    "url": "https://www.insee.fr/fr/statistiques/fichier/8988797/T_1101_1103_fr.xlsx",
    "sha256": "79dae87233daf59345a8fee530ae427877c9f68bd67f21d129bffaf12bad3c14"
  },
  "definitions": {
    "private_consumption": "Consommation finale des ménages et des ISBLSM (S14B + S15).",
    "public_consumption": "Consommation finale des administrations publiques (S13).",
    "investment": "Investissement hors stocks de tous les secteurs : FBCF + acquisitions nettes d’objets de valeur (P51G + P53).",
    "stocks": "Variations de stocks (P52).",
    "exports": "Exportations de biens et services (P6).",
    "imports": "Importations de biens et services (P7), représentées positives, à soustraire dans l’identité du PIB."
  },
  "method": "Montants annuels à prix courants divisés par le PIB de la même année. Aucune interpolation. Période et millésime explicités : reconstruction actualisée, non reproduction à l’identique de la figure historique du master p. 29.",
  "audit": {
    "identity": "C + G + investissement hors stocks + stocks + X − M − PIB",
    "rounding_tolerance_billions_eur": 0.0041,
    "published_discrepancies": [
      {
        "year": 2023,
        "residual_billions_eur": -0.024,
        "residual_percentage_point_gdp": -0.0008469115605665969
      },
      {
        "year": 2024,
        "residual_billions_eur": 0.442,
        "residual_percentage_point_gdp": 0.015058414383034525
      }
    ],
    "note": "La ligne S13 publiée diffère de P31 + P32 en 2023 et 2024 ; les mêmes écarts affectent la somme des secteurs de consommation face à P3. Les séries publiées sont conservées, sans recalibrage. Les autres années sont cohérentes aux arrondis près."
  },
  "rows": [
    {
      "year": 1949,
      "gdp_billions_eur": 13.142,
      "private_consumption": 61.071374220057834,
      "public_consumption": 15.17272865621671,
      "investment": 19.449094506163444,
      "stocks": 2.8686653477400705,
      "exports": 14.875970171967738,
      "imports": 13.430223710241973
    },
    {
      "year": 1950,
      "gdp_billions_eur": 15.406,
      "private_consumption": 60.06101518888744,
      "public_consumption": 15.31870699727379,
      "investment": 18.32402959885759,
      "stocks": 3.5181098273399973,
      "exports": 16.097624302219913,
      "imports": 13.319485914578737
    },
    {
      "year": 1951,
      "gdp_billions_eur": 19.403,
      "private_consumption": 60.207184456011966,
      "public_consumption": 15.312065144565276,
      "investment": 18.930062361490492,
      "stocks": 4.566304179766016,
      "exports": 16.981910013915375,
      "imports": 15.99237231355976
    },
    {
      "year": 1952,
      "gdp_billions_eur": 22.627,
      "private_consumption": 59.95492111194591,
      "public_consumption": 16.30795067839307,
      "investment": 19.92310072037831,
      "stocks": 3.248331639192116,
      "exports": 14.973262032085563,
      "imports": 14.407566181994962
    },
    {
      "year": 1953,
      "gdp_billions_eur": 23.445,
      "private_consumption": 60.45638728940073,
      "public_consumption": 16.775431861804222,
      "investment": 20.110897846022606,
      "stocks": 1.4331413947536789,
      "exports": 14.075495841330774,
      "imports": 12.847088931541906
    },
    {
      "year": 1954,
      "gdp_billions_eur": 24.921,
      "private_consumption": 59.87319930981903,
      "public_consumption": 16.11492315717668,
      "investment": 20.380402070542914,
      "stocks": 1.978251274025922,
      "exports": 14.116608482805665,
      "imports": 12.46338429437021
    },
    {
      "year": 1955,
      "gdp_billions_eur": 26.803,
      "private_consumption": 59.44856919001604,
      "public_consumption": 15.587807334999813,
      "investment": 21.396858560608887,
      "stocks": 2.0221616983173525,
      "exports": 13.957392829160915,
      "imports": 12.409058687460359
    },
    {
      "year": 1956,
      "gdp_billions_eur": 29.55,
      "private_consumption": 60.538071065989854,
      "public_consumption": 16.25719120135364,
      "investment": 21.86125211505922,
      "stocks": 2.0846023688663284,
      "exports": 13.150592216582064,
      "imports": 13.884940778341791
    },
    {
      "year": 1957,
      "gdp_billions_eur": 33.391,
      "private_consumption": 59.39324967805697,
      "public_consumption": 15.818633763588993,
      "investment": 23.170914318229464,
      "stocks": 2.365906980923003,
      "exports": 13.416788955107666,
      "imports": 14.162498876942891
    },
    {
      "year": 1958,
      "gdp_billions_eur": 38.537,
      "private_consumption": 58.00659106832395,
      "public_consumption": 15.382619300931571,
      "investment": 23.050574772296752,
      "stocks": 3.42527960142201,
      "exports": 12.920050860212264,
      "imports": 12.785115603186547
    },
    {
      "year": 1959,
      "gdp_billions_eur": 42.104,
      "private_consumption": 57.63822914687441,
      "public_consumption": 15.537716131483943,
      "investment": 23.45620368611058,
      "stocks": 1.1115333460003802,
      "exports": 14.518810564316931,
      "imports": 12.26486794603838
    },
    {
      "year": 1960,
      "gdp_billions_eur": 46.634,
      "private_consumption": 56.353733327615046,
      "public_consumption": 14.980486340438308,
      "investment": 22.989664193506883,
      "stocks": 2.914182785092422,
      "exports": 15.600205858386584,
      "imports": 12.840416863232836
    },
    {
      "year": 1961,
      "gdp_billions_eur": 50.547,
      "private_consumption": 56.56715532079056,
      "public_consumption": 15.352048588442441,
      "investment": 24.347636852830043,
      "stocks": 1.2503214829762401,
      "exports": 15.197736759847272,
      "imports": 12.716877361663402
    },
    {
      "year": 1962,
      "gdp_billions_eur": 56.597,
      "private_consumption": 56.40581656271534,
      "public_consumption": 15.665141261904338,
      "investment": 24.206230012191458,
      "stocks": 2.1873950916126295,
      "exports": 13.937134477092425,
      "imports": 12.401717405516193
    },
    {
      "year": 1963,
      "gdp_billions_eur": 63.394,
      "private_consumption": 56.5416285452882,
      "public_consumption": 16.051992302110612,
      "investment": 25.038647190585863,
      "stocks": 1.3692147521847493,
      "exports": 13.695302394548381,
      "imports": 12.695207748367354
    },
    {
      "year": 1964,
      "gdp_billions_eur": 70.316,
      "private_consumption": 55.50230388531771,
      "public_consumption": 16.080266226747824,
      "investment": 26.00403891006314,
      "stocks": 1.9383924000227546,
      "exports": 13.885886569201888,
      "imports": 13.410887991353318
    },
    {
      "year": 1965,
      "gdp_billions_eur": 75.963,
      "private_consumption": 54.73980753788029,
      "public_consumption": 16.10389268459645,
      "investment": 26.394428866685097,
      "stocks": 1.2532417097797612,
      "exports": 14.378052472914447,
      "imports": 12.870739702223451
    },
    {
      "year": 1966,
      "gdp_billions_eur": 82.27,
      "private_consumption": 54.42202503950408,
      "public_consumption": 16.194238483043637,
      "investment": 26.727847331955758,
      "stocks": 1.7296705968153643,
      "exports": 14.417162999878451,
      "imports": 13.492159961103683
    },
    {
      "year": 1967,
      "gdp_billions_eur": 88.879,
      "private_consumption": 54.4200542310332,
      "public_consumption": 16.417826483196254,
      "investment": 27.12339247741311,
      "stocks": 1.3276477008067147,
      "exports": 14.349846420414268,
      "imports": 13.638767312863555
    },
    {
      "year": 1968,
      "gdp_billions_eur": 96.874,
      "private_consumption": 54.66379007783306,
      "public_consumption": 16.877593575159487,
      "investment": 26.8327931127031,
      "stocks": 1.1499473542952703,
      "exports": 14.408406796457253,
      "imports": 13.93253091644817
    },
    {
      "year": 1969,
      "gdp_billions_eur": 111.382,
      "private_consumption": 54.17212835108007,
      "public_consumption": 17.057513781400942,
      "investment": 26.546479682533977,
      "stocks": 2.3298198990860284,
      "exports": 15.165825716902193,
      "imports": 15.269971808730315
    },
    {
      "year": 1970,
      "gdp_billions_eur": 124.73,
      "private_consumption": 53.18608193698388,
      "public_consumption": 17.28934498516796,
      "investment": 26.20861059889361,
      "stocks": 2.434057564338972,
      "exports": 16.88928084662872,
      "imports": 16.008177663753706
    },
    {
      "year": 1971,
      "gdp_billions_eur": 139.117,
      "private_consumption": 53.2257021068597,
      "public_consumption": 17.640547165335654,
      "investment": 26.412300437761022,
      "stocks": 1.4110425037917727,
      "exports": 17.394710926773868,
      "imports": 16.083584321111008
    },
    {
      "year": 1972,
      "gdp_billions_eur": 155.137,
      "private_consumption": 53.1001630816633,
      "public_consumption": 17.704351637584843,
      "investment": 26.52365328709463,
      "stocks": 1.5592669704841529,
      "exports": 17.541269974280798,
      "imports": 16.428060359553168
    },
    {
      "year": 1973,
      "gdp_billions_eur": 177.826,
      "private_consumption": 52.43102808363232,
      "public_consumption": 17.93438529798792,
      "investment": 26.78517202208901,
      "stocks": 1.8844263493527382,
      "exports": 18.481549379730748,
      "imports": 17.51656113279273
    },
    {
      "year": 1974,
      "gdp_billions_eur": 207.304,
      "private_consumption": 52.847026588970785,
      "public_consumption": 18.38121792150658,
      "investment": 27.37139659630301,
      "stocks": 2.1847142360977116,
      "exports": 21.71545170377803,
      "imports": 22.499324663296417
    },
    {
      "year": 1975,
      "gdp_billions_eur": 233.583,
      "private_consumption": 53.450807635829655,
      "public_consumption": 19.93466990320357,
      "investment": 25.908563551285834,
      "stocks": -0.6400294541982935,
      "exports": 19.858465727385983,
      "imports": 18.51162113681218
    },
    {
      "year": 1976,
      "gdp_billions_eur": 269.716,
      "private_consumption": 53.42137655904729,
      "public_consumption": 20.25352593097925,
      "investment": 25.52647970457815,
      "stocks": 1.3814530839846357,
      "exports": 20.393302584941196,
      "imports": 20.97613786353053
    },
    {
      "year": 1977,
      "gdp_billions_eur": 303.907,
      "private_consumption": 53.27287624174501,
      "public_consumption": 20.518448077865926,
      "investment": 24.59107555929939,
      "stocks": 1.4043769969102389,
      "exports": 21.28776237467383,
      "imports": 21.073881154432115
    },
    {
      "year": 1978,
      "gdp_billions_eur": 345.186,
      "private_consumption": 52.94507888500692,
      "public_consumption": 20.91220385531279,
      "investment": 24.127571801869138,
      "stocks": 0.5721553017793306,
      "exports": 21.280990538434356,
      "imports": 19.837710683515557
    },
    {
      "year": 1979,
      "gdp_billions_eur": 394.491,
      "private_consumption": 53.17992045445904,
      "public_consumption": 20.811374657470004,
      "investment": 24.008405768445922,
      "stocks": 1.2083925869031233,
      "exports": 21.7148173215612,
      "imports": 20.92291078883929
    },
    {
      "year": 1980,
      "gdp_billions_eur": 447.416,
      "private_consumption": 53.7153342750371,
      "public_consumption": 21.412510951776422,
      "investment": 24.86142650240492,
      "stocks": 1.2549841758005973,
      "exports": 21.999213260142685,
      "imports": 23.243469165161727
    },
    {
      "year": 1981,
      "gdp_billions_eur": 504.71,
      "private_consumption": 55.251728715499986,
      "public_consumption": 22.140238949099484,
      "investment": 24.331794495849103,
      "stocks": -0.47968140120068953,
      "exports": 23.051059023993975,
      "imports": 24.295337916823524
    },
    {
      "year": 1982,
      "gdp_billions_eur": 579.251,
      "private_consumption": 55.57866969586587,
      "public_consumption": 22.618346796121198,
      "investment": 23.683688073046053,
      "stocks": 0.4930505083288591,
      "exports": 22.384769296902377,
      "imports": 24.758351733531754
    },
    {
      "year": 1983,
      "gdp_billions_eur": 642.945,
      "private_consumption": 55.309241070387046,
      "public_consumption": 22.780953269719802,
      "investment": 22.296152859109256,
      "stocks": -0.27202948930312854,
      "exports": 23.434974997861403,
      "imports": 23.54944824207358
    },
    {
      "year": 1984,
      "gdp_billions_eur": 699.502,
      "private_consumption": 55.237154432725,
      "public_consumption": 22.940606317065573,
      "investment": 21.551761110046865,
      "stocks": -0.14124334169166064,
      "exports": 24.906719351767407,
      "imports": 24.494997869913167
    },
    {
      "year": 1985,
      "gdp_billions_eur": 749.583,
      "private_consumption": 55.779013131301,
      "public_consumption": 23.000921845879642,
      "investment": 21.360543128646196,
      "stocks": -0.08818236272700956,
      "exports": 24.415841874749027,
      "imports": 24.468137617848857
    },
    {
      "year": 1986,
      "gdp_billions_eur": 807.707,
      "private_consumption": 55.26830892885663,
      "public_consumption": 22.65920686585606,
      "investment": 21.346849785875325,
      "stocks": 0.46204873797057605,
      "exports": 21.383744352840818,
      "imports": 21.120282478671104
    },
    {
      "year": 1987,
      "gdp_billions_eur": 848.788,
      "private_consumption": 55.95236973190007,
      "public_consumption": 22.49536986856553,
      "investment": 21.972035419916402,
      "stocks": 0.3400142320579462,
      "exports": 20.631889235003325,
      "imports": 21.391678487443272
    },
    {
      "year": 1988,
      "gdp_billions_eur": 917.933,
      "private_consumption": 54.97874027842991,
      "public_consumption": 22.036030952150107,
      "investment": 22.707321776208065,
      "stocks": 0.6580000936887551,
      "exports": 21.422260666083474,
      "imports": 21.8023537665603
    },
    {
      "year": 1989,
      "gdp_billions_eur": 988.884,
      "private_consumption": 54.659292697626825,
      "public_consumption": 21.48239833994685,
      "investment": 23.23932837420769,
      "stocks": 1.035814109642789,
      "exports": 22.794078981963505,
      "imports": 23.2110136274831
    },
    {
      "year": 1990,
      "gdp_billions_eur": 1043.975,
      "private_consumption": 54.66538949687492,
      "public_consumption": 21.526856486026965,
      "investment": 23.45985296582773,
      "stocks": 0.956823678727939,
      "exports": 21.98874494121028,
      "imports": 22.597571780933457
    },
    {
      "year": 1991,
      "gdp_billions_eur": 1082.833,
      "private_consumption": 54.53204695460888,
      "public_consumption": 22.01216623431314,
      "investment": 23.22629620634022,
      "stocks": 0.3546253208020073,
      "exports": 22.41425963191,
      "imports": 22.539394347974245
    },
    {
      "year": 1992,
      "gdp_billions_eur": 1121.458,
      "private_consumption": 54.637356013332635,
      "public_consumption": 22.629469850854868,
      "investment": 21.989677723106883,
      "stocks": -0.18395695603401999,
      "exports": 22.44542372518632,
      "imports": 21.517970356446696
    },
    {
      "year": 1993,
      "gdp_billions_eur": 1134.839,
      "private_consumption": 55.06164310532155,
      "public_consumption": 23.736318543863934,
      "investment": 20.52529037158575,
      "stocks": -1.230218559637094,
      "exports": 21.816310507481678,
      "imports": 19.90934396861581
    },
    {
      "year": 1994,
      "gdp_billions_eur": 1172.96,
      "private_consumption": 54.72232642204338,
      "public_consumption": 23.500375119356153,
      "investment": 20.192419178829624,
      "stocks": -0.16471149911335423,
      "exports": 22.75056267903424,
      "imports": 21.00088664575092
    },
    {
      "year": 1995,
      "gdp_billions_eur": 1213.802,
      "private_consumption": 54.401623988096915,
      "public_consumption": 23.463711544386978,
      "investment": 19.80454802348324,
      "stocks": 0.3825170826872917,
      "exports": 23.6896956834805,
      "imports": 21.742013936375123
    },
    {
      "year": 1996,
      "gdp_billions_eur": 1246.974,
      "private_consumption": 54.902989156149204,
      "public_consumption": 23.741713941108635,
      "investment": 19.516204828649197,
      "stocks": -0.29423227749736564,
      "exports": 24.123037048086008,
      "imports": 21.989472114093797
    },
    {
      "year": 1997,
      "gdp_billions_eur": 1289.669,
      "private_consumption": 53.94934669283357,
      "public_consumption": 23.699336806575946,
      "investment": 19.022245242771593,
      "stocks": -0.12817242253632521,
      "exports": 26.630321423559064,
      "imports": 23.17315528247946
    },
    {
      "year": 1998,
      "gdp_billions_eur": 1346.318,
      "private_consumption": 53.90643220992366,
      "public_consumption": 22.88278103687242,
      "investment": 19.409604565934647,
      "stocks": 0.7171411211912787,
      "exports": 27.252773861747375,
      "imports": 24.168658519012595
    },
    {
      "year": 1999,
      "gdp_billions_eur": 1395.148,
      "private_consumption": 53.650580440211364,
      "public_consumption": 22.875135827883497,
      "investment": 20.245307307898518,
      "stocks": 0.48568323934091584,
      "exports": 27.20700599506289,
      "imports": 24.46371281039718
    },
    {
      "year": 2000,
      "gdp_billions_eur": 1473.517,
      "private_consumption": 53.84491661786053,
      "public_consumption": 22.56716413858815,
      "investment": 20.95082717064004,
      "stocks": 0.9070814927822345,
      "exports": 29.758055047888824,
      "imports": 28.0279766029167
    },
    {
      "year": 2001,
      "gdp_billions_eur": 1530.071,
      "private_consumption": 54.146572283247,
      "public_consumption": 22.370661230753342,
      "investment": 20.92687202097158,
      "stocks": 0.587815859525473,
      "exports": 29.430595050817907,
      "imports": 27.46264715820377
    },
    {
      "year": 2002,
      "gdp_billions_eur": 1578.33,
      "private_consumption": 54.044528077144825,
      "public_consumption": 22.9264475743349,
      "investment": 20.396685103875615,
      "stocks": 0.3035486875368269,
      "exports": 28.730683697325656,
      "imports": 26.401829782111474
    },
    {
      "year": 2003,
      "gdp_billions_eur": 1622.313,
      "private_consumption": 54.27990776132596,
      "public_consumption": 23.39437580787431,
      "investment": 20.542706617033826,
      "stocks": 0.10793231639024034,
      "exports": 27.136995142121158,
      "imports": 25.461917644745494
    },
    {
      "year": 2004,
      "gdp_billions_eur": 1696.108,
      "private_consumption": 54.06059048126653,
      "public_consumption": 23.248519551820994,
      "investment": 20.885580399361366,
      "stocks": 0.4788020574161551,
      "exports": 27.538104884830453,
      "imports": 26.211656333205195
    },
    {
      "year": 2005,
      "gdp_billions_eur": 1762.048,
      "private_consumption": 54.31673825003632,
      "public_consumption": 23.26758408397501,
      "investment": 21.309010878250763,
      "stocks": 0.6023672453871859,
      "exports": 28.163534705070465,
      "imports": 27.659291914862706
    },
    {
      "year": 2006,
      "gdp_billions_eur": 1846.021,
      "private_consumption": 54.404093994597034,
      "public_consumption": 22.92433293012376,
      "investment": 21.95240465845188,
      "stocks": 0.7328193991292623,
      "exports": 28.92783993248181,
      "imports": 28.941436744219054
    },
    {
      "year": 2007,
      "gdp_billions_eur": 1937.876,
      "private_consumption": 54.2632758752366,
      "public_consumption": 22.603149014694438,
      "investment": 22.63901302250505,
      "stocks": 0.9300904701848829,
      "exports": 28.8585544173105,
      "imports": 29.29403119704254
    },
    {
      "year": 2008,
      "gdp_billions_eur": 1990.0,
      "private_consumption": 54.61236180904523,
      "public_consumption": 22.702160804020103,
      "investment": 22.978743718592966,
      "stocks": 0.48839195979899497,
      "exports": 29.199045226130657,
      "imports": 29.98075376884422
    },
    {
      "year": 2009,
      "gdp_billions_eur": 1935.84,
      "private_consumption": 55.419249524754115,
      "public_consumption": 24.300148772625835,
      "investment": 21.47610339697496,
      "stocks": -0.7583271344739235,
      "exports": 25.880961236465826,
      "imports": 26.318187453508557
    },
    {
      "year": 2010,
      "gdp_billions_eur": 1996.075,
      "private_consumption": 55.42862868379194,
      "public_consumption": 24.16812995503676,
      "investment": 21.51597510113598,
      "stocks": -0.17809952030860562,
      "exports": 27.826509524942697,
      "imports": 28.761093646280823
    },
    {
      "year": 2011,
      "gdp_billions_eur": 2062.141,
      "private_consumption": 55.060735420128886,
      "public_consumption": 23.96761424170316,
      "investment": 21.731782647258363,
      "stocks": 0.7678427420821369,
      "exports": 29.538862764476338,
      "imports": 31.06678932235962
    },
    {
      "year": 2012,
      "gdp_billions_eur": 2088.287,
      "private_consumption": 54.89638157973497,
      "public_consumption": 24.221718566461412,
      "investment": 21.68993055073369,
      "stocks": 0.13963597915420628,
      "exports": 30.355693446351008,
      "imports": 31.303264350158766
    },
    {
      "year": 2013,
      "gdp_billions_eur": 2120.352,
      "private_consumption": 54.74124107695327,
      "public_consumption": 24.37496227041548,
      "investment": 21.300331265752103,
      "stocks": 0.22015212568479198,
      "exports": 30.59128861622976,
      "imports": 31.227928193054744
    },
    {
      "year": 2014,
      "gdp_billions_eur": 2153.733,
      "private_consumption": 54.514092508217125,
      "public_consumption": 24.365137182742707,
      "investment": 20.98537748179556,
      "stocks": 0.8511268574145447,
      "exports": 30.741832901292774,
      "imports": 31.45747406944129
    },
    {
      "year": 2015,
      "gdp_billions_eur": 2201.402,
      "private_consumption": 54.33119439339112,
      "public_consumption": 24.070024466226524,
      "investment": 20.587607352042017,
      "stocks": 1.12891693566191,
      "exports": 31.693484424925572,
      "imports": 31.81118214665018
    },
    {
      "year": 2016,
      "gdp_billions_eur": 2231.819,
      "private_consumption": 54.62853394473297,
      "public_consumption": 24.11996671773114,
      "investment": 20.949727554071366,
      "stocks": 0.6481708418110966,
      "exports": 31.498208412062084,
      "imports": 31.844562663907784
    },
    {
      "year": 2017,
      "gdp_billions_eur": 2291.681,
      "private_consumption": 54.39880157840467,
      "public_consumption": 24.19197959925487,
      "investment": 21.448796756616648,
      "stocks": 0.7326063269713368,
      "exports": 32.31182699511843,
      "imports": 33.08401125636596
    },
    {
      "year": 2018,
      "gdp_billions_eur": 2355.363,
      "private_consumption": 54.510069148577095,
      "public_consumption": 23.844647300649626,
      "investment": 21.905158567915013,
      "stocks": 0.7064303888615046,
      "exports": 32.91798334269495,
      "imports": 33.88428874869818
    },
    {
      "year": 2019,
      "gdp_billions_eur": 2432.207,
      "private_consumption": 54.10641446225589,
      "public_consumption": 23.518351850808752,
      "investment": 22.449158315883476,
      "stocks": 0.5759378210818404,
      "exports": 32.88955257508921,
      "imports": 33.53941502511916
    },
    {
      "year": 2020,
      "gdp_billions_eur": 2318.276,
      "private_consumption": 53.58020356506301,
      "public_consumption": 25.3398214880368,
      "investment": 22.464969658487604,
      "stocks": 0.33943326851505173,
      "exports": 28.557212342275037,
      "imports": 30.28168345787991
    },
    {
      "year": 2021,
      "gdp_billions_eur": 2508.102,
      "private_consumption": 52.8330586236126,
      "public_consumption": 24.93184089004355,
      "investment": 23.51710576364119,
      "stocks": -0.0696143936729846,
      "exports": 31.28804171441194,
      "imports": 32.500432598036284
    },
    {
      "year": 2022,
      "gdp_billions_eur": 2653.997,
      "private_consumption": 54.08265344685771,
      "public_consumption": 24.624895958812314,
      "investment": 23.52674098727316,
      "stocks": 0.49664713260791177,
      "exports": 36.61605495409377,
      "imports": 39.34695480062714
    },
    {
      "year": 2023,
      "gdp_billions_eur": 2833.826,
      "private_consumption": 54.62279617732352,
      "public_consumption": 24.07148498178787,
      "investment": 23.04975675994221,
      "stocks": -0.003105342388699941,
      "exports": 34.396995440087004,
      "imports": 36.13877492831246
    },
    {
      "year": 2024,
      "gdp_billions_eur": 2935.236,
      "private_consumption": 54.35750311048243,
      "public_consumption": 24.053295884896478,
      "investment": 22.2840003325116,
      "stocks": -0.315647532259757,
      "exports": 33.966740664123776,
      "imports": 34.33083404537148
    },
    {
      "year": 2025,
      "gdp_billions_eur": 2991.056,
      "private_consumption": 54.00824992912202,
      "public_consumption": 24.059362312173363,
      "investment": 22.230576759512363,
      "stocks": 0.1838481125060848,
      "exports": 33.74634242889468,
      "imports": 34.2283795422085
    }
  ]
};
