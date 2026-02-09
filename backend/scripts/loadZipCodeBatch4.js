import dotenv from "dotenv";
import connectDB from "../db/index.js";
import ZipCode from "../models/zip-code.model.js";

dotenv.config({ path: ".env" });

connectDB();

// Batch 4: Fourth 500 rows (93954 - 95170)
const zipCodeBatch4 = `93954	San Lucas	Monterey
93955	Seaside	Monterey
93960	Soledad	Monterey
93962	Spreckels	Monterey
94002	Belmont	San Mateo
94005	Brisbane	San Mateo
94010	Burlingame	San Mateo
94011	Burlingame	San Mateo
94013	Daly City	San Mateo
94014	Daly City	San Mateo
94015	Daly City	San Mateo
94016	Daly City	San Mateo
94017	Daly City	San Mateo
94018	El Granada	San Mateo
94019	Half Moon Bay	San Mateo
94020	La Honda	San Mateo
94021	Loma Mar	San Mateo
94022	Los Altos	Santa Clara
94023	Los Altos	Santa Clara
94024	Los Altos	Santa Clara
94025	Menlo Park	San Mateo
94026	Menlo Park	San Mateo
94027	Atherton	San Mateo
94028	Portola Valley	San Mateo
94030	Millbrae	San Mateo
94035	Mountain View	Santa Clara
94037	Montara	San Mateo
94038	Moss Beach	San Mateo
94039	Mountain View	Santa Clara
94040	Mountain View	Santa Clara
94041	Mountain View	Santa Clara
94042	Mountain View	Santa Clara
94043	Mountain View	Santa Clara
94044	Pacifica	San Mateo
94060	Pescadero	San Mateo
94061	Redwood City	San Mateo
94062	Redwood City	San Mateo
94063	Redwood City	San Mateo
94064	Redwood City	San Mateo
94065	Redwood City	San Mateo
94066	San Bruno	San Mateo
94070	San Carlos	San Mateo
94074	San Gregorio	San Mateo
94080	South San Francisco	San Mateo
94083	South San Francisco	San Mateo
94085	Sunnyvale	Santa Clara
94086	Sunnyvale	Santa Clara
94087	Sunnyvale	Santa Clara
94088	Sunnyvale	Santa Clara
94089	Sunnyvale	Santa Clara
94096	San Bruno	San Mateo
94098	San Bruno	San Mateo
94101	San Francisco	San Francisco
94102	San Francisco	San Francisco
94103	San Francisco	San Francisco
94104	San Francisco	San Francisco
94105	San Francisco	San Francisco
94106	San Francisco	San Francisco
94107	San Francisco	San Francisco
94108	San Francisco	San Francisco
94109	San Francisco	San Francisco
94110	San Francisco	San Francisco
94111	San Francisco	San Francisco
94112	San Francisco	San Francisco
94114	San Francisco	San Francisco
94115	San Francisco	San Francisco
94116	San Francisco	San Francisco
94117	San Francisco	San Francisco
94118	San Francisco	San Francisco
94119	San Francisco	San Francisco
94120	San Francisco	San Francisco
94121	San Francisco	San Francisco
94122	San Francisco	San Francisco
94124	San Francisco	San Francisco
94125	San Francisco	San Francisco
94126	San Francisco	San Francisco
94127	San Francisco	San Francisco
94128	San Francisco	San Mateo
94129	San Francisco	San Francisco
94130	San Francisco	San Francisco
94131	San Francisco	San Francisco
94132	San Francisco	San Francisco
94133	San Francisco	San Francisco
94134	San Francisco	San Francisco
94135	San Francisco	San Francisco
94136	San Francisco	San Francisco
94137	San Francisco	San Francisco
94138	San Francisco	San Francisco
94139	San Francisco	San Francisco
94140	San Francisco	San Francisco
94141	San Francisco	San Francisco
94142	San Francisco	San Francisco
94143	San Francisco	San Francisco
94144	San Francisco	San Francisco
94145	San Francisco	San Francisco
94146	San Francisco	San Francisco
94147	San Francisco	San Francisco
94150	San Francisco	San Francisco
94151	San Francisco	San Francisco
94152	San Francisco	San Francisco
94153	San Francisco	San Francisco
94154	San Francisco	San Francisco
94155	San Francisco	San Francisco
94157	San Francisco	San Francisco
94158	San Francisco	San Francisco
94159	San Francisco	San Francisco
94160	San Francisco	San Francisco
94161	San Francisco	San Francisco
94162	San Francisco	San Francisco
94163	San Francisco	San Francisco
94164	San Francisco	San Francisco
94165	San Francisco	San Francisco
94166	San Francisco	San Francisco
94167	San Francisco	San Francisco
94168	San Francisco	San Francisco
94169	San Francisco	San Francisco
94170	San Francisco	San Francisco
94171	San Francisco	San Francisco
94172	San Francisco	San Francisco
94175	San Francisco	San Francisco
94177	San Francisco	San Francisco
94188	San Francisco	San Francisco
94199	San Francisco	San Francisco
94203	Sacramento	Sacramento
94204	Sacramento	Sacramento
94205	Sacramento	Sacramento
94206	Sacramento	Sacramento
94207	Sacramento	Sacramento
94208	Sacramento	Sacramento
94209	Sacramento	Sacramento
94211	Sacramento	Sacramento
94229	Sacramento	Sacramento
94230	Sacramento	Sacramento
94234	Sacramento	Sacramento
94235	Sacramento	Sacramento
94236	Sacramento	Sacramento
94237	Sacramento	Sacramento
94239	Sacramento	Sacramento
94240	Sacramento	Sacramento
94244	Sacramento	Sacramento
94245	Sacramento	Sacramento
94246	Sacramento	Sacramento
94247	Sacramento	Sacramento
94248	Sacramento	Sacramento
94249	Sacramento	Sacramento
94250	Sacramento	Sacramento
94252	Sacramento	Sacramento
94254	Sacramento	Sacramento
94256	Sacramento	Sacramento
94257	Sacramento	Sacramento
94258	Sacramento	Sacramento
94259	Sacramento	Sacramento
94261	Sacramento	Sacramento
94262	Sacramento	Sacramento
94263	Sacramento	Sacramento
94267	Sacramento	Sacramento
94268	Sacramento	Sacramento
94269	Sacramento	Sacramento
94271	Sacramento	Sacramento
94273	Sacramento	Sacramento
94274	Sacramento	Sacramento
94277	Sacramento	Sacramento
94278	Sacramento	Sacramento
94280	Sacramento	Sacramento
94282	Sacramento	Sacramento
94283	Sacramento	Sacramento
94284	Sacramento	Sacramento
94285	Sacramento	Sacramento
94286	Sacramento	Sacramento
94287	Sacramento	Sacramento
94288	Sacramento	Sacramento
94289	Sacramento	Sacramento
94290	Sacramento	Sacramento
94291	Sacramento	Sacramento
94293	Sacramento	Sacramento
94294	Sacramento	Sacramento
94295	Sacramento	Sacramento
94296	Sacramento	Sacramento
94297	Sacramento	Sacramento
94298	Sacramento	Sacramento
94299	Sacramento	Sacramento
94301	Palo Alto	Santa Clara
94302	Palo Alto	Santa Clara
94303	Palo Alto	Santa Clara
94304	Palo Alto	Santa Clara
94305	Stanford	Santa Clara
94306	Palo Alto	Santa Clara
94309	Palo Alto	Santa Clara
94401	San Mateo	San Mateo
94402	San Mateo	San Mateo
94403	San Mateo	San Mateo
94404	San Mateo	San Mateo
94497	San Mateo	San Mateo
94501	Alameda	Alameda
94502	Alameda	Alameda
94503	American Canyon	Napa
94506	Danville	Contra Costa
94507	Alamo	Contra Costa
94508	Angwin	Napa
94509	Antioch	Contra Costa
94510	Benicia	Solano
94511	Bethel Island	Contra Costa
94512	Birds Landing	Solano
94513	Brentwood	Contra Costa
94514	Byron	Contra Costa
94515	Calistoga	Napa
94516	Canyon	Contra Costa
94517	Clayton	Contra Costa
94518	Concord	Contra Costa
94519	Concord	Contra Costa
94520	Concord	Contra Costa
94521	Concord	Contra Costa
94522	Concord	Contra Costa
94523	Pleasant Hill	Contra Costa
94524	Concord	Contra Costa
94525	Crockett	Contra Costa
94526	Danville	Contra Costa
94527	Concord	Contra Costa
94528	Diablo	Contra Costa
94529	Concord	Contra Costa
94530	El Cerrito	Contra Costa
94531	Antioch	Contra Costa
94533	Fairfield	Solano
94534	Fairfield	Solano
94535	Travis Afb	Solano
94536	Fremont	Alameda
94537	Fremont	Alameda
94538	Fremont	Alameda
94539	Fremont	Alameda
94540	Hayward	Alameda
94541	Hayward	Alameda
94542	Hayward	Alameda
94543	Hayward	Alameda
94544	Hayward	Alameda
94545	Hayward	Alameda
94546	Castro Valley	Alameda
94547	Hercules	Contra Costa
94548	Knightsen	Contra Costa
94549	Lafayette	Contra Costa
94550	Livermore	Alameda
94551	Livermore	Alameda
94552	Castro Valley	Alameda
94553	Martinez	Contra Costa
94555	Fremont	Alameda
94556	Moraga	Contra Costa
94557	Hayward	Alameda
94558	Napa	Napa
94559	Napa	Napa
94560	Newark	Alameda
94561	Oakley	Contra Costa
94562	Oakville	Napa
94563	Orinda	Contra Costa
94564	Pinole	Contra Costa
94565	Pittsburg	Contra Costa
94566	Pleasanton	Alameda
94567	Pope Valley	Napa
94568	Dublin	Alameda
94569	Port Costa	Contra Costa
94570	Moraga	Contra Costa
94571	Rio Vista	Solano
94572	Rodeo	Contra Costa
94573	Rutherford	Napa
94574	Saint Helena	Napa
94575	Moraga	Contra Costa
94576	Deer Park	Napa
94577	San Leandro	Alameda
94578	San Leandro	Alameda
94579	San Leandro	Alameda
94580	San Lorenzo	Alameda
94581	Napa	Napa
94582	San Ramon	Contra Costa
94583	San Ramon	Contra Costa
94585	Suisun City	Solano
94586	Sunol	Alameda
94587	Union City	Alameda
94588	Pleasanton	Alameda
94589	Vallejo	Solano
94590	Vallejo	Solano
94591	Vallejo	Solano
94592	Vallejo	Solano
94595	Walnut Creek	Contra Costa
94596	Walnut Creek	Contra Costa
94597	Walnut Creek	Contra Costa
94598	Walnut Creek	Contra Costa
94599	Yountville	Napa
94601	Oakland	Alameda
94602	Oakland	Alameda
94603	Oakland	Alameda
94604	Oakland	Alameda
94605	Oakland	Alameda
94606	Oakland	Alameda
94607	Oakland	Alameda
94608	Emeryville	Alameda
94609	Oakland	Alameda
94610	Oakland	Alameda
94611	Oakland	Alameda
94612	Oakland	Alameda
94613	Oakland	Alameda
94614	Oakland	Alameda
94615	Oakland	Alameda
94617	Oakland	Alameda
94618	Oakland	Alameda
94619	Oakland	Alameda
94620	Piedmont	Alameda
94621	Oakland	Alameda
94622	Oakland	Alameda
94623	Oakland	Alameda
94624	Oakland	Alameda
94625	Oakland	Alameda
94649	Oakland	Alameda
94659	Oakland	Alameda
94660	Oakland	Alameda
94661	Oakland	Alameda
94662	Emeryville	Alameda
94666	Oakland	Alameda
94701	Berkeley	Alameda
94702	Berkeley	Alameda
94703	Berkeley	Alameda
94704	Berkeley	Alameda
94705	Berkeley	Alameda
94706	Albany	Alameda
94707	Berkeley	Alameda
94708	Berkeley	Alameda
94709	Berkeley	Alameda
94710	Berkeley	Alameda
94712	Berkeley	Alameda
94720	Berkeley	Alameda
94801	Richmond	Contra Costa
94802	Richmond	Contra Costa
94803	El Sobrante	Contra Costa
94804	Richmond	Contra Costa
94805	Richmond	Contra Costa
94806	San Pablo	Contra Costa
94807	Richmond	Contra Costa
94808	Richmond	Contra Costa
94820	El Sobrante	Contra Costa
94850	Richmond	Contra Costa
94901	San Rafael	Marin
94903	San Rafael	Marin
94904	Greenbrae	Marin
94912	San Rafael	Marin
94913	San Rafael	Marin
94914	Kentfield	Marin
94915	San Rafael	Marin
94920	Belvedere Tiburon	Marin
94922	Bodega	Sonoma
94923	Bodega Bay	Sonoma
94924	Bolinas	Marin
94925	Corte Madera	Marin
94926	Cotati	Sonoma
94927	Rohnert Park	Sonoma
94928	Rohnert Park	Sonoma
94929	Dillon Beach	Marin
94930	Fairfax	Marin
94931	Cotati	Sonoma
94933	Forest Knolls	Marin
94937	Inverness	Marin
94938	Lagunitas	Marin
94939	Larkspur	Marin
94940	Marshall	Marin
94941	Mill Valley	Marin
94942	Mill Valley	Marin
94945	Novato	Marin
94946	Nicasio	Marin
94947	Novato	Marin
94948	Novato	Marin
94949	Novato	Marin
94950	Olema	Marin
94951	Penngrove	Sonoma
94952	Petaluma	Sonoma
94953	Petaluma	Sonoma
94954	Petaluma	Sonoma
94955	Petaluma	Sonoma
94956	Point Reyes Station	Marin
94957	Ross	Marin
94960	San Anselmo	Marin
94963	San Geronimo	Marin
94964	San Quentin	Marin
94965	Sausalito	Marin
94966	Sausalito	Marin
94970	Stinson Beach	Marin
94971	Tomales	Marin
94972	Valley Ford	Sonoma
94973	Woodacre	Marin
94974	San Quentin	Marin
94975	Petaluma	Sonoma
94976	Corte Madera	Marin
94977	Larkspur	Marin
94978	Fairfax	Marin
94979	San Anselmo	Marin
94998	Novato	Marin
94999	Petaluma	Sonoma
95001	Aptos	Santa Cruz
95002	Alviso	Santa Clara
95003	Aptos	Santa Cruz
95004	Aromas	Monterey
95005	Ben Lomond	Santa Cruz
95006	Boulder Creek	Santa Cruz
95007	Brookdale	Santa Cruz
95008	Campbell	Santa Clara
95009	Campbell	Santa Clara
95010	Capitola	Santa Cruz
95011	Campbell	Santa Clara
95012	Castroville	Monterey
95013	Coyote	Santa Clara
95014	Cupertino	Santa Clara
95015	Cupertino	Santa Clara
95017	Davenport	Santa Cruz
95018	Felton	Santa Cruz
95019	Freedom	Santa Cruz
95020	Gilroy	Santa Clara
95021	Gilroy	Santa Clara
95023	Hollister	San Benito
95024	Hollister	San Benito
95026	Holy City	Santa Clara
95030	Los Gatos	Santa Clara
95031	Los Gatos	Santa Clara
95032	Los Gatos	Santa Clara
95033	Los Gatos	Santa Cruz
95035	Milpitas	Santa Clara
95036	Milpitas	Santa Clara
95037	Morgan Hill	Santa Clara
95038	Morgan Hill	Santa Clara
95039	Moss Landing	Monterey
95041	Mount Hermon	Santa Cruz
95042	New Almaden	Santa Clara
95043	Paicines	San Benito
95044	Redwood Estates	Santa Clara
95045	San Juan Bautista	San Benito
95046	San Martin	Santa Clara
95050	Santa Clara	Santa Clara
95051	Santa Clara	Santa Clara
95052	Santa Clara	Santa Clara
95053	Santa Clara	Santa Clara
95054	Santa Clara	Santa Clara
95055	Santa Clara	Santa Clara
95056	Santa Clara	Santa Clara
95060	Santa Cruz	Santa Cruz
95061	Santa Cruz	Santa Cruz
95062	Santa Cruz	Santa Cruz
95063	Santa Cruz	Santa Cruz
95064	Santa Cruz	Santa Cruz
95065	Santa Cruz	Santa Cruz
95066	Scotts Valley	Santa Cruz
95067	Scotts Valley	Santa Cruz
95070	Saratoga	Santa Clara
95071	Saratoga	Santa Clara
95073	Soquel	Santa Cruz
95075	Tres Pinos	San Benito
95076	Watsonville	Santa Cruz
95077	Watsonville	Santa Cruz
95101	San Jose	Santa Clara
95103	San Jose	Santa Clara
95106	San Jose	Santa Clara
95108	San Jose	Santa Clara
95109	San Jose	Santa Clara
95110	San Jose	Santa Clara
95111	San Jose	Santa Clara
95112	San Jose	Santa Clara
95113	San Jose	Santa Clara
95115	San Jose	Santa Clara
95116	San Jose	Santa Clara
95117	San Jose	Santa Clara
95118	San Jose	Santa Clara
95119	San Jose	Santa Clara
95120	San Jose	Santa Clara
95121	San Jose	Santa Clara
95122	San Jose	Santa Clara
95123	San Jose	Santa Clara
95124	San Jose	Santa Clara
95125	San Jose	Santa Clara
95126	San Jose	Santa Clara
95128	San Jose	Santa Clara
95129	San Jose	Santa Clara
95130	San Jose	Santa Clara
95131	San Jose	Santa Clara
95132	San Jose	Santa Clara
95133	San Jose	Santa Clara
95134	San Jose	Santa Clara
95135	San Jose	Santa Clara
95136	San Jose	Santa Clara
95138	San Jose	Santa Clara
95139	San Jose	Santa Clara
95140	Mount Hamilton	Santa Clara
95141	San Jose	Santa Clara
95148	San Jose	Santa Clara
95150	San Jose	Santa Clara
95151	San Jose	Santa Clara
95152	San Jose	Santa Clara
95153	San Jose	Santa Clara
95154	San Jose	Santa Clara
95155	San Jose	Santa Clara
95156	San Jose	Santa Clara
95157	San Jose	Santa Clara
95158	San Jose	Santa Clara
95159	San Jose	Santa Clara
95160	San Jose	Santa Clara
95161	San Jose	Santa Clara
95164	San Jose	Santa Clara
95170	San Jose	Santa Clara`;

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
    console.log('🔄 Parsing zip code data (Batch 4)...');
    const records = parseZipCodeData(zipCodeBatch4);
    
    console.log(`📊 Found ${records.length} records to insert`);
    console.log(`First record: ${JSON.stringify(records[0])}`);
    console.log(`Last record: ${JSON.stringify(records[records.length - 1])}`);
    
    console.log('📥 Inserting into database...');
    const result = await ZipCode.insertMany(records, { ordered: false });
    
    console.log(`✅ Successfully inserted ${result.length} zip code records`);
    console.log(`📈 Total records in database: ${await ZipCode.countDocuments()}`);
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
