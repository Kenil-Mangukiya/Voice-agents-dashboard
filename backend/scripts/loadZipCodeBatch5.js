import dotenv from "dotenv";
import connectDB from "../db/index.js";
import ZipCode from "../models/zip-code.model.js";

dotenv.config({ path: ".env" });

connectDB();

// Batch 5: Final 643 rows (95172 - 96162)
const zipCodeBatch5 = `95172	San Jose	Santa Clara
95173	San Jose	Santa Clara
95191	San Jose	Santa Clara
95192	San Jose	Santa Clara
95193	San Jose	Santa Clara
95194	San Jose	Santa Clara
95196	San Jose	Santa Clara
95201	Stockton	San Joaquin
95202	Stockton	San Joaquin
95203	Stockton	San Joaquin
95204	Stockton	San Joaquin
95205	Stockton	San Joaquin
95206	Stockton	San Joaquin
95207	Stockton	San Joaquin
95208	Stockton	San Joaquin
95209	Stockton	San Joaquin
95210	Stockton	San Joaquin
95211	Stockton	San Joaquin
95212	Stockton	San Joaquin
95213	Stockton	San Joaquin
95215	Stockton	San Joaquin
95219	Stockton	San Joaquin
95220	Acampo	San Joaquin
95221	Altaville	Calaveras
95222	Angels Camp	Calaveras
95223	Arnold	Calaveras
95224	Avery	Calaveras
95225	Burson	Calaveras
95226	Campo Seco	Calaveras
95227	Clements	San Joaquin
95228	Copperopolis	Calaveras
95229	Douglas Flat	Calaveras
95230	Farmington	San Joaquin
95231	French Camp	San Joaquin
95232	Glencoe	Calaveras
95233	Hathaway Pines	Calaveras
95234	Holt	San Joaquin
95236	Linden	San Joaquin
95237	Lockeford	San Joaquin
95240	Lodi	San Joaquin
95241	Lodi	San Joaquin
95242	Lodi	San Joaquin
95245	Mokelumne Hill	Calaveras
95246	Mountain Ranch	Calaveras
95247	Murphys	Calaveras
95248	Rail Road Flat	Calaveras
95249	San Andreas	Calaveras
95250	Sheep Ranch	Calaveras
95251	Vallecito	Calaveras
95252	Valley Springs	Calaveras
95253	Victor	San Joaquin
95254	Wallace	Calaveras
95255	West Point	Calaveras
95257	Wilseyville	Calaveras
95258	Woodbridge	San Joaquin
95267	Stockton	San Joaquin
95269	Stockton	San Joaquin
95296	Stockton	San Joaquin
95297	Stockton	San Joaquin
95301	Atwater	Merced
95303	Ballico	Merced
95304	Tracy	San Joaquin
95305	Big Oak Flat	Tuolumne
95306	Catheys Valley	Mariposa
95307	Ceres	Stanislaus
95309	Chinese Camp	Tuolumne
95310	Columbia	Tuolumne
95311	Coulterville	Mariposa
95312	Cressey	Merced
95313	Crows Landing	Stanislaus
95314	Dardanelle	Tuolumne
95315	Delhi	Merced
95316	Denair	Stanislaus
95317	El Nido	Merced
95318	El Portal	Mariposa
95319	Empire	Stanislaus
95320	Escalon	San Joaquin
95321	Groveland	Tuolumne
95322	Gustine	Merced
95323	Hickman	Stanislaus
95324	Hilmar	Merced
95325	Hornitos	Mariposa
95326	Hughson	Stanislaus
95327	Jamestown	Tuolumne
95328	Keyes	Stanislaus
95329	La Grange	Stanislaus
95330	Lathrop	San Joaquin
95333	Le Grand	Merced
95334	Livingston	Merced
95335	Long Barn	Tuolumne
95336	Manteca	San Joaquin
95337	Manteca	San Joaquin
95338	Mariposa	Mariposa
95340	Merced	Merced
95341	Merced	Merced
95343	Merced	Merced
95344	Merced	Merced
95345	Midpines	Mariposa
95346	Mi Wuk Village	Tuolumne
95347	Moccasin	Tuolumne
95348	Merced	Merced
95350	Modesto	Stanislaus
95351	Modesto	Stanislaus
95352	Modesto	Stanislaus
95353	Modesto	Stanislaus
95354	Modesto	Stanislaus
95355	Modesto	Stanislaus
95356	Modesto	Stanislaus
95357	Modesto	Stanislaus
95358	Modesto	Stanislaus
95360	Newman	Stanislaus
95361	Oakdale	Stanislaus
95363	Patterson	Stanislaus
95364	Pinecrest	Tuolumne
95365	Planada	Merced
95366	Ripon	San Joaquin
95367	Riverbank	Stanislaus
95368	Salida	Stanislaus
95369	Snelling	Merced
95370	Sonora	Tuolumne
95372	Soulsbyville	Tuolumne
95373	Standard	Tuolumne
95374	Stevinson	Merced
95375	Strawberry	Tuolumne
95376	Tracy	San Joaquin
95377	Tracy	San Joaquin
95378	Tracy	San Joaquin
95379	Tuolumne	Tuolumne
95380	Turlock	Stanislaus
95381	Turlock	Stanislaus
95382	Turlock	Stanislaus
95383	Twain Harte	Tuolumne
95385	Vernalis	San Joaquin
95386	Waterford	Stanislaus
95387	Westley	Stanislaus
95388	Winton	Merced
95389	Yosemite National Park	Mariposa
95391	Tracy	San Joaquin
95397	Modesto	Stanislaus
95401	Santa Rosa	Sonoma
95402	Santa Rosa	Sonoma
95403	Santa Rosa	Sonoma
95404	Santa Rosa	Sonoma
95405	Santa Rosa	Sonoma
95406	Santa Rosa	Sonoma
95407	Santa Rosa	Sonoma
95408	Santa Rosa	Sonoma
95409	Santa Rosa	Sonoma
95410	Albion	Mendocino
95412	Annapolis	Sonoma
95415	Boonville	Mendocino
95416	Boyes Hot Springs	Sonoma
95417	Branscomb	Mendocino
95418	Calpella	Mendocino
95419	Camp Meeker	Sonoma
95420	Caspar	Mendocino
95421	Cazadero	Sonoma
95422	Clearlake	Lake
95423	Clearlake Oaks	Lake
95424	Clearlake Park	Lake
95425	Cloverdale	Sonoma
95426	Cobb	Lake
95427	Comptche	Mendocino
95428	Covelo	Mendocino
95429	Dos Rios	Mendocino
95430	Duncans Mills	Sonoma
95431	Eldridge	Sonoma
95432	Elk	Mendocino
95433	El Verano	Sonoma
95435	Finley	Lake
95436	Forestville	Sonoma
95437	Fort Bragg	Mendocino
95439	Fulton	Sonoma
95441	Geyserville	Sonoma
95442	Glen Ellen	Sonoma
95443	Glenhaven	Lake
95444	Graton	Sonoma
95445	Gualala	Mendocino
95446	Guerneville	Sonoma
95448	Healdsburg	Sonoma
95449	Hopland	Mendocino
95450	Jenner	Sonoma
95451	Kelseyville	Lake
95452	Kenwood	Sonoma
95453	Lakeport	Lake
95454	Laytonville	Mendocino
95456	Littleriver	Mendocino
95457	Lower Lake	Lake
95458	Lucerne	Lake
95459	Manchester	Mendocino
95460	Mendocino	Mendocino
95461	Middletown	Lake
95462	Monte Rio	Sonoma
95463	Navarro	Mendocino
95464	Nice	Lake
95465	Occidental	Sonoma
95466	Philo	Mendocino
95467	Hidden Valley Lake	Lake
95468	Point Arena	Mendocino
95469	Potter Valley	Mendocino
95470	Redwood Valley	Mendocino
95471	Rio Nido	Sonoma
95472	Sebastopol	Sonoma
95473	Sebastopol	Sonoma
95476	Sonoma	Sonoma
95480	Stewarts Point	Sonoma
95481	Talmage	Mendocino
95482	Ukiah	Mendocino
95485	Upper Lake	Lake
95486	Villa Grande	Sonoma
95487	Vineburg	Sonoma
95488	Westport	Mendocino
95490	Willits	Mendocino
95492	Windsor	Sonoma
95493	Witter Springs	Lake
95494	Yorkville	Mendocino
95497	The Sea Ranch	Sonoma
95501	Eureka	Humboldt
95502	Eureka	Humboldt
95503	Eureka	Humboldt
95511	Alderpoint	Humboldt
95514	Blocksburg	Humboldt
95518	Arcata	Humboldt
95519	Mckinleyville	Humboldt
95521	Arcata	Humboldt
95524	Bayside	Humboldt
95525	Blue Lake	Humboldt
95526	Bridgeville	Humboldt
95527	Burnt Ranch	Trinity
95528	Carlotta	Humboldt
95531	Crescent City	Del Norte
95532	Crescent City	Del Norte
95534	Cutten	Humboldt
95536	Ferndale	Humboldt
95537	Fields Landing	Humboldt
95538	Fort Dick	Del Norte
95540	Fortuna	Humboldt
95542	Garberville	Humboldt
95543	Gasquet	Del Norte
95545	Honeydew	Humboldt
95546	Hoopa	Humboldt
95547	Hydesville	Humboldt
95548	Klamath	Del Norte
95549	Kneeland	Humboldt
95550	Korbel	Humboldt
95551	Loleta	Humboldt
95552	Mad River	Trinity
95553	Miranda	Humboldt
95554	Myers Flat	Humboldt
95555	Orick	Humboldt
95556	Orleans	Humboldt
95558	Petrolia	Humboldt
95559	Phillipsville	Humboldt
95560	Redway	Humboldt
95562	Rio Dell	Humboldt
95563	Salyer	Trinity
95564	Samoa	Humboldt
95565	Scotia	Humboldt
95567	Smith River	Del Norte
95568	Somes Bar	Siskiyou
95569	Redcrest	Humboldt
95570	Trinidad	Humboldt
95571	Weott	Humboldt
95573	Willow Creek	Humboldt
95585	Leggett	Mendocino
95587	Piercy	Mendocino
95589	Whitethorn	Humboldt
95595	Zenia	Trinity
95601	Amador City	Amador
95602	Auburn	Placer
95603	Auburn	Placer
95604	Auburn	Placer
95605	West Sacramento	Yolo
95606	Brooks	Yolo
95607	Capay	Yolo
95608	Carmichael	Sacramento
95609	Carmichael	Sacramento
95610	Citrus Heights	Sacramento
95611	Citrus Heights	Sacramento
95612	Clarksburg	Yolo
95613	Coloma	El Dorado
95614	Cool	El Dorado
95615	Courtland	Sacramento
95616	Davis	Yolo
95617	Davis	Yolo
95618	Davis	Yolo
95619	Diamond Springs	El Dorado
95620	Dixon	Solano
95621	Citrus Heights	Sacramento
95623	El Dorado	El Dorado
95624	Elk Grove	Sacramento
95625	Elmira	Solano
95626	Elverta	Sacramento
95627	Esparto	Yolo
95628	Fair Oaks	Sacramento
95629	Fiddletown	Amador
95630	Folsom	Sacramento
95631	Foresthill	Placer
95632	Galt	Sacramento
95633	Garden Valley	El Dorado
95634	Georgetown	El Dorado
95635	Greenwood	El Dorado
95636	Grizzly Flats	El Dorado
95637	Guinda	Yolo
95638	Herald	Sacramento
95639	Hood	Sacramento
95640	Ione	Amador
95641	Isleton	Sacramento
95642	Jackson	Amador
95644	Kit Carson	Amador
95645	Knights Landing	Yolo
95646	Kirkwood	Alpine
95648	Lincoln	Placer
95650	Loomis	Placer
95651	Lotus	El Dorado
95652	Mcclellan	Sacramento
95653	Madison	Yolo
95654	Martell	Amador
95655	Mather	Sacramento
95656	Mount Aukum	El Dorado
95658	Newcastle	Placer
95659	Nicolaus	Sutter
95660	North Highlands	Sacramento
95661	Roseville	Placer
95662	Orangevale	Sacramento
95663	Penryn	Placer
95664	Pilot Hill	El Dorado
95665	Pine Grove	Amador
95666	Pioneer	Amador
95667	Placerville	El Dorado
95668	Pleasant Grove	Sutter
95669	Plymouth	Amador
95670	Rancho Cordova	Sacramento
95671	Represa	Sacramento
95672	Rescue	El Dorado
95673	Rio Linda	Sacramento
95674	Rio Oso	Sutter
95675	River Pines	Amador
95676	Robbins	Sutter
95677	Rocklin	Placer
95678	Roseville	Placer
95679	Rumsey	Yolo
95680	Ryde	Sacramento
95681	Sheridan	Placer
95682	Shingle Springs	El Dorado
95683	Sloughhouse	Sacramento
95684	Somerset	El Dorado
95685	Sutter Creek	Amador
95686	Thornton	San Joaquin
95687	Vacaville	Solano
95688	Vacaville	Solano
95689	Volcano	Amador
95690	Walnut Grove	Sacramento
95691	West Sacramento	Yolo
95692	Wheatland	Yuba
95693	Wilton	Sacramento
95694	Winters	Yolo
95695	Woodland	Yolo
95696	Vacaville	Solano
95697	Yolo	Yolo
95698	Zamora	Yolo
95699	Drytown	Amador
95701	Alta	Placer
95703	Applegate	Placer
95709	Camino	El Dorado
95712	Chicago Park	Nevada
95713	Colfax	Placer
95714	Dutch Flat	Placer
95715	Emigrant Gap	Placer
95717	Gold Run	Placer
95720	Kyburz	El Dorado
95721	Echo Lake	El Dorado
95722	Meadow Vista	Placer
95724	Norden	Nevada
95726	Pollock Pines	El Dorado
95728	Soda Springs	Nevada
95735	Twin Bridges	El Dorado
95736	Weimar	Placer
95741	Rancho Cordova	Sacramento
95742	Rancho Cordova	Sacramento
95746	Granite Bay	Placer
95747	Roseville	Placer
95757	Elk Grove	Sacramento
95758	Elk Grove	Sacramento
95759	Elk Grove	Sacramento
95762	El Dorado Hills	El Dorado
95763	Folsom	Sacramento
95765	Rocklin	Placer
95776	Woodland	Yolo
95798	West Sacramento	Yolo
95799	West Sacramento	Yolo
95812	Sacramento	Sacramento
95813	Sacramento	Sacramento
95814	Sacramento	Sacramento
95815	Sacramento	Sacramento
95816	Sacramento	Sacramento
95817	Sacramento	Sacramento
95818	Sacramento	Sacramento
95819	Sacramento	Sacramento
95820	Sacramento	Sacramento
95821	Sacramento	Sacramento
95822	Sacramento	Sacramento
95823	Sacramento	Sacramento
95824	Sacramento	Sacramento
95825	Sacramento	Sacramento
95826	Sacramento	Sacramento
95827	Sacramento	Sacramento
95828	Sacramento	Sacramento
95829	Sacramento	Sacramento
95830	Sacramento	Sacramento
95831	Sacramento	Sacramento
95832	Sacramento	Sacramento
95833	Sacramento	Sacramento
95834	Sacramento	Sacramento
95835	Sacramento	Sacramento
95836	Sacramento	Sacramento
95837	Sacramento	Sacramento
95838	Sacramento	Sacramento
95840	Sacramento	Sacramento
95841	Sacramento	Sacramento
95842	Sacramento	Sacramento
95843	Antelope	Sacramento
95851	Sacramento	Sacramento
95852	Sacramento	Sacramento
95853	Sacramento	Sacramento
95860	Sacramento	Sacramento
95864	Sacramento	Sacramento
95865	Sacramento	Sacramento
95866	Sacramento	Sacramento
95867	Sacramento	Sacramento
95887	Sacramento	Sacramento
95894	Sacramento	Sacramento
95899	Sacramento	Sacramento
95901	Marysville	Yuba
95903	Beale Afb	Yuba
95910	Alleghany	Sierra
95912	Arbuckle	Colusa
95913	Artois	Glenn
95914	Bangor	Butte
95915	Belden	Plumas
95916	Berry Creek	Butte
95917	Biggs	Butte
95918	Browns Valley	Yuba
95919	Brownsville	Yuba
95920	Butte City	Glenn
95922	Camptonville	Yuba
95923	Canyon Dam	Plumas
95924	Cedar Ridge	Nevada
95925	Challenge	Yuba
95926	Chico	Butte
95927	Chico	Butte
95928	Chico	Butte
95929	Chico	Butte
95930	Clipper Mills	Butte
95932	Colusa	Colusa
95934	Crescent Mills	Plumas
95935	Dobbins	Yuba
95936	Downieville	Sierra
95937	Dunnigan	Yolo
95938	Durham	Butte
95939	Elk Creek	Glenn
95940	Feather Falls	Butte
95941	Forbestown	Butte
95942	Forest Ranch	Butte
95943	Glenn	Glenn
95944	Goodyears Bar	Sierra
95945	Grass Valley	Nevada
95946	Penn Valley	Nevada
95947	Greenville	Plumas
95948	Gridley	Butte
95949	Grass Valley	Nevada
95950	Grimes	Colusa
95951	Hamilton City	Glenn
95953	Live Oak	Sutter
95954	Magalia	Butte
95955	Maxwell	Colusa
95956	Meadow Valley	Plumas
95957	Meridian	Sutter
95958	Nelson	Butte
95959	Nevada City	Nevada
95960	North San Juan	Nevada
95961	Olivehurst	Yuba
95962	Oregon House	Yuba
95963	Orland	Glenn
95965	Oroville	Butte
95966	Oroville	Butte
95967	Paradise	Butte
95968	Palermo	Butte
95969	Paradise	Butte
95970	Princeton	Colusa
95971	Quincy	Plumas
95972	Rackerby	Yuba
95973	Chico	Butte
95974	Richvale	Butte
95975	Rough And Ready	Nevada
95976	Chico	Butte
95977	Smartville	Nevada
95978	Stirling City	Butte
95979	Stonyford	Colusa
95980	Storrie	Plumas
95981	Strawberry Valley	Yuba
95982	Sutter	Sutter
95983	Taylorsville	Plumas
95984	Twain	Plumas
95986	Washington	Nevada
95987	Williams	Colusa
95988	Willows	Glenn
95991	Yuba City	Sutter
95992	Yuba City	Sutter
95993	Yuba City	Sutter
96001	Redding	Shasta
96002	Redding	Shasta
96003	Redding	Shasta
96006	Adin	Modoc
96007	Anderson	Shasta
96008	Bella Vista	Shasta
96009	Bieber	Lassen
96010	Big Bar	Trinity
96011	Big Bend	Shasta
96013	Burney	Shasta
96014	Callahan	Siskiyou
96015	Canby	Modoc
96016	Cassel	Shasta
96017	Castella	Shasta
96019	Shasta Lake	Shasta
96020	Chester	Plumas
96021	Corning	Tehama
96022	Cottonwood	Shasta
96023	Dorris	Siskiyou
96024	Douglas City	Trinity
96025	Dunsmuir	Siskiyou
96027	Etna	Siskiyou
96028	Fall River Mills	Shasta
96029	Flournoy	Tehama
96031	Forks Of Salmon	Siskiyou
96032	Fort Jones	Siskiyou
96033	French Gulch	Shasta
96034	Gazelle	Siskiyou
96035	Gerber	Tehama
96037	Greenview	Siskiyou
96038	Grenada	Siskiyou
96039	Happy Camp	Siskiyou
96040	Hat Creek	Shasta
96041	Hayfork	Trinity
96044	Hornbrook	Siskiyou
96046	Hyampom	Trinity
96047	Igo	Shasta
96048	Junction City	Trinity
96049	Redding	Shasta
96050	Klamath River	Siskiyou
96051	Lakehead	Shasta
96052	Lewiston	Trinity
96054	Lookout	Modoc
96055	Los Molinos	Tehama
96056	Mcarthur	Lassen
96057	Mccloud	Siskiyou
96058	Macdoel	Siskiyou
96059	Manton	Tehama
96061	Mill Creek	Tehama
96062	Millville	Shasta
96063	Mineral	Tehama
96064	Montague	Siskiyou
96065	Montgomery Creek	Shasta
96067	Mount Shasta	Siskiyou
96068	Nubieber	Lassen
96069	Oak Run	Shasta
96070	Obrien	Shasta
96071	Old Station	Shasta
96073	Palo Cedro	Shasta
96074	Paskenta	Tehama
96075	Paynes Creek	Tehama
96076	Platina	Shasta
96078	Proberta	Tehama
96079	Shasta Lake	Shasta
96080	Red Bluff	Tehama
96084	Round Mountain	Shasta
96085	Scott Bar	Siskiyou
96086	Seiad Valley	Siskiyou
96087	Shasta	Shasta
96088	Shingletown	Shasta
96089	Shasta Lake	Shasta
96090	Tehama	Tehama
96091	Trinity Center	Trinity
96092	Vina	Tehama
96093	Weaverville	Trinity
96094	Weed	Siskiyou
96095	Whiskeytown	Shasta
96096	Whitmore	Shasta
96097	Yreka	Siskiyou
96099	Redding	Shasta
96101	Alturas	Modoc
96103	Blairsden-graeagle	Plumas
96104	Cedarville	Modoc
96105	Chilcoot	Plumas
96106	Clio	Plumas
96107	Coleville	Mono
96108	Davis Creek	Modoc
96109	Doyle	Lassen
96110	Eagleville	Modoc
96111	Floriston	Nevada
96112	Fort Bidwell	Modoc
96113	Herlong	Lassen
96114	Janesville	Lassen
96115	Lake City	Modoc
96116	Likely	Modoc
96117	Litchfield	Lassen
96118	Loyalton	Sierra
96119	Madeline	Lassen
96120	Markleeville	Alpine
96121	Milford	Lassen
96122	Portola	Plumas
96123	Ravendale	Lassen
96124	Calpine	Sierra
96125	Sierra City	Sierra
96126	Sierraville	Sierra
96127	Susanville	Lassen
96128	Standish	Lassen
96129	Beckwourth	Plumas
96130	Susanville	Lassen
96132	Termo	Lassen
96133	Topaz	Mono
96134	Tulelake	Siskiyou
96135	Vinton	Plumas
96136	Wendel	Lassen
96137	Westwood	Lassen
96140	Carnelian Bay	Placer
96141	Homewood	Placer
96142	Tahoma	El Dorado
96143	Kings Beach	Placer
96145	Tahoe City	Placer
96146	Olympic Valley	Placer
96148	Tahoe Vista	Placer
96150	South Lake Tahoe	El Dorado
96151	South Lake Tahoe	El Dorado
96152	South Lake Tahoe	El Dorado
96154	South Lake Tahoe	El Dorado
96155	South Lake Tahoe	El Dorado
96156	South Lake Tahoe	El Dorado
96157	South Lake Tahoe	El Dorado
96158	South Lake Tahoe	El Dorado
96160	Truckee	Nevada
96161	Truckee	Nevada
96162	Truckee	Nevada`;

function parseZipCodeData(data) {
  return data
    .split('\n')
    .filter(line => line.trim()) // Remove empty lines
    .map(line => {
      const [zip, city, county] = line.split('\t').map(item => item.trim());
      return {
        zip,
        city,
        county,
        state: 'CA'
      };
    });
}

async function loadZipCodeBatch() {
  try {
    console.log('🔄 Parsing zip code data (Batch 5 - FINAL)...');
    const records = parseZipCodeData(zipCodeBatch5);
    
    console.log(`📊 Found ${records.length} records to insert`);
    console.log(`First record: ${JSON.stringify(records[0])}`);
    console.log(`Last record: ${JSON.stringify(records[records.length - 1])}`);
    
    console.log('📥 Inserting into database...');
    const result = await ZipCode.insertMany(records, { ordered: false });
    
    console.log(`✅ Successfully inserted ${result.length} zip code records`);
    const totalCount = await ZipCode.countDocuments();
    console.log(`📈 Total records in database: ${totalCount}`);
    
    if (totalCount === 2643) {
      console.log(`\n🎉 ALL 2,643 ZIP CODES SUCCESSFULLY LOADED! 🎉\n`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error loading zip codes:', error.message);
    if (error.writeErrors) {
      console.log(`⚠️ Inserted ${error.result.insertedCount} records before error`);
      console.log(`⚠️ ${error.writeErrors.length} duplicate records skipped`);
    }
    process.exit(1);
  }
}

loadZipCodeBatch();
