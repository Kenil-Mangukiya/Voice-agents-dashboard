import dotenv from "dotenv";
import connectDB from "../db/index.js";
import ZipCode from "../models/zip-code.model.js";

dotenv.config({ path: ".env" });

connectDB();

// Batch 1: First 500 rows (90002 - 91748)
const zipCodeBatch1 = `90002	Los Angeles	Los Angeles
90003	Los Angeles	Los Angeles
90004	Los Angeles	Los Angeles
90005	Los Angeles	Los Angeles
90006	Los Angeles	Los Angeles
90007	Los Angeles	Los Angeles
90008	Los Angeles	Los Angeles
90009	Los Angeles	Los Angeles
90010	Los Angeles	Los Angeles
90011	Los Angeles	Los Angeles
90012	Los Angeles	Los Angeles
90013	Los Angeles	Los Angeles
90014	Los Angeles	Los Angeles
90015	Los Angeles	Los Angeles
90016	Los Angeles	Los Angeles
90017	Los Angeles	Los Angeles
90018	Los Angeles	Los Angeles
90019	Los Angeles	Los Angeles
90020	Los Angeles	Los Angeles
90021	Los Angeles	Los Angeles
90022	Los Angeles	Los Angeles
90023	Los Angeles	Los Angeles
90024	Los Angeles	Los Angeles
90025	Los Angeles	Los Angeles
90026	Los Angeles	Los Angeles
90027	Los Angeles	Los Angeles
90028	Los Angeles	Los Angeles
90029	Los Angeles	Los Angeles
90030	Los Angeles	Los Angeles
90031	Los Angeles	Los Angeles
90033	Los Angeles	Los Angeles
90034	Los Angeles	Los Angeles
90035	Los Angeles	Los Angeles
90036	Los Angeles	Los Angeles
90037	Los Angeles	Los Angeles
90038	Los Angeles	Los Angeles
90039	Los Angeles	Los Angeles
90040	Los Angeles	Los Angeles
90041	Los Angeles	Los Angeles
90042	Los Angeles	Los Angeles
90043	Los Angeles	Los Angeles
90044	Los Angeles	Los Angeles
90045	Los Angeles	Los Angeles
90046	Los Angeles	Los Angeles
90047	Los Angeles	Los Angeles
90048	Los Angeles	Los Angeles
90049	Los Angeles	Los Angeles
90050	Los Angeles	Los Angeles
90051	Los Angeles	Los Angeles
90052	Los Angeles	Los Angeles
90053	Los Angeles	Los Angeles
90054	Los Angeles	Los Angeles
90055	Los Angeles	Los Angeles
90056	Los Angeles	Los Angeles
90057	Los Angeles	Los Angeles
90058	Los Angeles	Los Angeles
90059	Los Angeles	Los Angeles
90060	Los Angeles	Los Angeles
90061	Los Angeles	Los Angeles
90062	Los Angeles	Los Angeles
90064	Los Angeles	Los Angeles
90065	Los Angeles	Los Angeles
90066	Los Angeles	Los Angeles
90067	Los Angeles	Los Angeles
90068	Los Angeles	Los Angeles
90069	West Hollywood	Los Angeles
90070	Los Angeles	Los Angeles
90071	Los Angeles	Los Angeles
90072	Los Angeles	Los Angeles
90073	Los Angeles	Los Angeles
90074	Los Angeles	Los Angeles
90075	Los Angeles	Los Angeles
90076	Los Angeles	Los Angeles
90077	Los Angeles	Los Angeles
90078	Los Angeles	Los Angeles
90079	Los Angeles	Los Angeles
90080	Los Angeles	Los Angeles
90081	Los Angeles	Los Angeles
90082	Los Angeles	Los Angeles
90083	Los Angeles	Los Angeles
90084	Los Angeles	Los Angeles
90086	Los Angeles	Los Angeles
90087	Los Angeles	Los Angeles
90088	Los Angeles	Los Angeles
90089	Los Angeles	Los Angeles
90091	Los Angeles	Los Angeles
90093	Los Angeles	Los Angeles
90094	Los Angeles	Los Angeles
90095	Los Angeles	Los Angeles
90096	Los Angeles	Los Angeles
90101	Los Angeles	Los Angeles
90102	Los Angeles	Los Angeles
90103	Los Angeles	Los Angeles
90189	Los Angeles	Los Angeles
90201	Bell	Los Angeles
90202	Bell Gardens	Los Angeles
90209	Beverly Hills	Los Angeles
90210	Beverly Hills	Los Angeles
90211	Beverly Hills	Los Angeles
90212	Beverly Hills	Los Angeles
90213	Beverly Hills	Los Angeles
90220	Compton	Los Angeles
90221	Compton	Los Angeles
90222	Compton	Los Angeles
90223	Compton	Los Angeles
90224	Compton	Los Angeles
90230	Culver City	Los Angeles
90231	Culver City	Los Angeles
90232	Culver City	Los Angeles
90233	Culver City	Los Angeles
90239	Downey	Los Angeles
90240	Downey	Los Angeles
90241	Downey	Los Angeles
90242	Downey	Los Angeles
90245	El Segundo	Los Angeles
90247	Gardena	Los Angeles
90248	Gardena	Los Angeles
90249	Gardena	Los Angeles
90250	Hawthorne	Los Angeles
90251	Hawthorne	Los Angeles
90254	Hermosa Beach	Los Angeles
90255	Huntington Park	Los Angeles
90260	Lawndale	Los Angeles
90261	Lawndale	Los Angeles
90262	Lynwood	Los Angeles
90263	Malibu	Los Angeles
90264	Malibu	Los Angeles
90265	Malibu	Los Angeles
90266	Manhattan Beach	Los Angeles
90267	Manhattan Beach	Los Angeles
90270	Maywood	Los Angeles
90272	Pacific Palisades	Los Angeles
90274	Palos Verdes Peninsula	Los Angeles
90275	Rancho Palos Verdes	Los Angeles
90277	Redondo Beach	Los Angeles
90278	Redondo Beach	Los Angeles
90280	South Gate	Los Angeles
90290	Topanga	Los Angeles
90291	Venice	Los Angeles
90292	Marina Del Rey	Los Angeles
90293	Playa Del Rey	Los Angeles
90294	Venice	Los Angeles
90295	Marina Del Rey	Los Angeles
90296	Playa Del Rey	Los Angeles
90301	Inglewood	Los Angeles
90302	Inglewood	Los Angeles
90303	Inglewood	Los Angeles
90304	Inglewood	Los Angeles
90305	Inglewood	Los Angeles
90306	Inglewood	Los Angeles
90307	Inglewood	Los Angeles
90308	Inglewood	Los Angeles
90309	Inglewood	Los Angeles
90310	Inglewood	Los Angeles
90311	Inglewood	Los Angeles
90312	Inglewood	Los Angeles
90313	Inglewood	Los Angeles
90397	Inglewood	Los Angeles
90398	Inglewood	Los Angeles
90401	Santa Monica	Los Angeles
90402	Santa Monica	Los Angeles
90403	Santa Monica	Los Angeles
90404	Santa Monica	Los Angeles
90405	Santa Monica	Los Angeles
90406	Santa Monica	Los Angeles
90407	Santa Monica	Los Angeles
90408	Santa Monica	Los Angeles
90409	Santa Monica	Los Angeles
90410	Santa Monica	Los Angeles
90411	Santa Monica	Los Angeles
90501	Torrance	Los Angeles
90502	Torrance	Los Angeles
90503	Torrance	Los Angeles
90504	Torrance	Los Angeles
90505	Torrance	Los Angeles
90506	Torrance	Los Angeles
90507	Torrance	Los Angeles
90508	Torrance	Los Angeles
90509	Torrance	Los Angeles
90510	Torrance	Los Angeles
90601	Whittier	Los Angeles
90602	Whittier	Los Angeles
90603	Whittier	Los Angeles
90604	Whittier	Los Angeles
90605	Whittier	Los Angeles
90606	Whittier	Los Angeles
90607	Whittier	Los Angeles
90608	Whittier	Los Angeles
90609	Whittier	Los Angeles
90610	Whittier	Los Angeles
90612	Whittier	Los Angeles
90620	Buena Park	Orange
90621	Buena Park	Orange
90622	Buena Park	Orange
90623	La Palma	Orange
90624	Buena Park	Orange
90630	Cypress	Orange
90631	La Habra	Orange
90632	La Habra	Orange
90633	La Habra	Orange
90637	La Mirada	Los Angeles
90638	La Mirada	Los Angeles
90639	La Mirada	Los Angeles
90640	Montebello	Los Angeles
90650	Norwalk	Los Angeles
90651	Norwalk	Los Angeles
90652	Norwalk	Los Angeles
90659	Norwalk	Los Angeles
90660	Pico Rivera	Los Angeles
90661	Pico Rivera	Los Angeles
90662	Pico Rivera	Los Angeles
90670	Santa Fe Springs	Los Angeles
90671	Santa Fe Springs	Los Angeles
90680	Stanton	Orange
90701	Artesia	Los Angeles
90702	Artesia	Los Angeles
90703	Cerritos	Los Angeles
90704	Avalon	Los Angeles
90706	Bellflower	Los Angeles
90707	Bellflower	Los Angeles
90710	Harbor City	Los Angeles
90711	Lakewood	Los Angeles
90712	Lakewood	Los Angeles
90713	Lakewood	Los Angeles
90714	Lakewood	Los Angeles
90715	Lakewood	Los Angeles
90716	Hawaiian Gardens	Los Angeles
90717	Lomita	Los Angeles
90720	Los Alamitos	Orange
90721	Los Alamitos	Orange
90723	Paramount	Los Angeles
90731	San Pedro	Los Angeles
90732	San Pedro	Los Angeles
90733	San Pedro	Los Angeles
90734	San Pedro	Los Angeles
90740	Seal Beach	Orange
90742	Sunset Beach	Orange
90743	Surfside	Orange
90744	Wilmington	Los Angeles
90745	Carson	Los Angeles
90746	Carson	Los Angeles
90747	Carson	Los Angeles
90748	Wilmington	Los Angeles
90749	Carson	Los Angeles
90755	Signal Hill	Los Angeles
90801	Long Beach	Los Angeles
90802	Long Beach	Los Angeles
90803	Long Beach	Los Angeles
90804	Long Beach	Los Angeles
90805	Long Beach	Los Angeles
90806	Long Beach	Los Angeles
90807	Long Beach	Los Angeles
90808	Long Beach	Los Angeles
90809	Long Beach	Los Angeles
90810	Long Beach	Los Angeles
90813	Long Beach	Los Angeles
90814	Long Beach	Los Angeles
90815	Long Beach	Los Angeles
90822	Long Beach	Los Angeles
90831	Long Beach	Los Angeles
90832	Long Beach	Los Angeles
90833	Long Beach	Los Angeles
90834	Long Beach	Los Angeles
90835	Long Beach	Los Angeles
90840	Long Beach	Los Angeles
90842	Long Beach	Los Angeles
90844	Long Beach	Los Angeles
90845	Long Beach	Los Angeles
90846	Long Beach	Los Angeles
90847	Long Beach	Los Angeles
90848	Long Beach	Los Angeles
90853	Long Beach	Los Angeles
90888	Long Beach	Los Angeles
90895	Carson	Los Angeles
90899	Long Beach	Los Angeles
91001	Altadena	Los Angeles
91003	Altadena	Los Angeles
91006	Arcadia	Los Angeles
91007	Arcadia	Los Angeles
91009	Duarte	Los Angeles
91010	Duarte	Los Angeles
91011	La Canada Flintridge	Los Angeles
91012	La Canada Flintridge	Los Angeles
91016	Monrovia	Los Angeles
91017	Monrovia	Los Angeles
91020	Montrose	Los Angeles
91021	Montrose	Los Angeles
91023	Mount Wilson	Los Angeles
91024	Sierra Madre	Los Angeles
91025	Sierra Madre	Los Angeles
91030	South Pasadena	Los Angeles
91031	South Pasadena	Los Angeles
91040	Sunland	Los Angeles
91041	Sunland	Los Angeles
91042	Tujunga	Los Angeles
91043	Tujunga	Los Angeles
91046	Verdugo City	Los Angeles
91066	Arcadia	Los Angeles
91077	Arcadia	Los Angeles
91101	Pasadena	Los Angeles
91102	Pasadena	Los Angeles
91103	Pasadena	Los Angeles
91104	Pasadena	Los Angeles
91105	Pasadena	Los Angeles
91106	Pasadena	Los Angeles
91107	Pasadena	Los Angeles
91108	San Marino	Los Angeles
91109	Pasadena	Los Angeles
91110	Pasadena	Los Angeles
91114	Pasadena	Los Angeles
91115	Pasadena	Los Angeles
91116	Pasadena	Los Angeles
91117	Pasadena	Los Angeles
91118	San Marino	Los Angeles
91121	Pasadena	Los Angeles
91123	Pasadena	Los Angeles
91124	Pasadena	Los Angeles
91125	Pasadena	Los Angeles
91126	Pasadena	Los Angeles
91129	Pasadena	Los Angeles
91131	Pasadena	Los Angeles
91182	Pasadena	Los Angeles
91184	Pasadena	Los Angeles
91185	Pasadena	Los Angeles
91188	Pasadena	Los Angeles
91189	Pasadena	Los Angeles
91191	Pasadena	Los Angeles
91199	Pasadena	Los Angeles
91201	Glendale	Los Angeles
91202	Glendale	Los Angeles
91203	Glendale	Los Angeles
91204	Glendale	Los Angeles
91205	Glendale	Los Angeles
91206	Glendale	Los Angeles
91207	Glendale	Los Angeles
91208	Glendale	Los Angeles
91209	Glendale	Los Angeles
91210	Glendale	Los Angeles
91214	La Crescenta	Los Angeles
91221	Glendale	Los Angeles
91222	Glendale	Los Angeles
91224	La Crescenta	Los Angeles
91225	Glendale	Los Angeles
91226	Glendale	Los Angeles
91301	Agoura Hills	Los Angeles
91302	Calabasas	Los Angeles
91303	Canoga Park	Los Angeles
91304	Canoga Park	Los Angeles
91305	Canoga Park	Los Angeles
91306	Winnetka	Los Angeles
91307	West Hills	Los Angeles
91308	West Hills	Los Angeles
91309	Canoga Park	Los Angeles
91310	Castaic	Los Angeles
91311	Chatsworth	Los Angeles
91313	Chatsworth	Los Angeles
91316	Encino	Los Angeles
91319	Newbury Park	Ventura
91320	Newbury Park	Ventura
91321	Newhall	Los Angeles
91322	Newhall	Los Angeles
91324	Northridge	Los Angeles
91325	Northridge	Los Angeles
91326	Porter Ranch	Los Angeles
91327	Northridge	Los Angeles
91328	Northridge	Los Angeles
91329	Northridge	Los Angeles
91330	Northridge	Los Angeles
91331	Pacoima	Los Angeles
91333	Pacoima	Los Angeles
91334	Pacoima	Los Angeles
91335	Reseda	Los Angeles
91337	Reseda	Los Angeles
91340	San Fernando	Los Angeles
91341	San Fernando	Los Angeles
91342	Sylmar	Los Angeles
91343	North Hills	Los Angeles
91344	Granada Hills	Los Angeles
91345	Mission Hills	Los Angeles
91346	Mission Hills	Los Angeles
91350	Santa Clarita	Los Angeles
91351	Canyon Country	Los Angeles
91352	Sun Valley	Los Angeles
91353	Sun Valley	Los Angeles
91354	Valencia	Los Angeles
91355	Valencia	Los Angeles
91356	Tarzana	Los Angeles
91357	Tarzana	Los Angeles
91358	Thousand Oaks	Ventura
91359	Westlake Village	Ventura
91360	Thousand Oaks	Ventura
91361	Westlake Village	Ventura
91362	Thousand Oaks	Ventura
91363	Westlake Village	Los Angeles
91364	Woodland Hills	Los Angeles
91365	Woodland Hills	Los Angeles
91367	Woodland Hills	Los Angeles
91371	Woodland Hills	Los Angeles
91372	Calabasas	Los Angeles
91376	Agoura Hills	Los Angeles
91377	Oak Park	Ventura
91380	Santa Clarita	Los Angeles
91381	Stevenson Ranch	Los Angeles
91382	Santa Clarita	Los Angeles
91383	Santa Clarita	Los Angeles
91384	Castaic	Los Angeles
91385	Valencia	Los Angeles
91386	Canyon Country	Los Angeles
91387	Canyon Country	Los Angeles
91388	Van Nuys	Los Angeles
91390	Santa Clarita	Los Angeles
91392	Sylmar	Los Angeles
91393	North Hills	Los Angeles
91394	Granada Hills	Los Angeles
91395	Mission Hills	Los Angeles
91396	Winnetka	Los Angeles
91399	Woodland Hills	Los Angeles
91401	Van Nuys	Los Angeles
91402	Panorama City	Los Angeles
91403	Sherman Oaks	Los Angeles
91404	Van Nuys	Los Angeles
91405	Van Nuys	Los Angeles
91406	Van Nuys	Los Angeles
91407	Van Nuys	Los Angeles
91408	Van Nuys	Los Angeles
91409	Van Nuys	Los Angeles
91410	Van Nuys	Los Angeles
91411	Van Nuys	Los Angeles
91412	Panorama City	Los Angeles
91413	Sherman Oaks	Los Angeles
91416	Encino	Los Angeles
91423	Sherman Oaks	Los Angeles
91426	Encino	Los Angeles
91436	Encino	Los Angeles
91470	Van Nuys	Los Angeles
91482	Van Nuys	Los Angeles
91495	Sherman Oaks	Los Angeles
91496	Van Nuys	Los Angeles
91497	Van Nuys	Los Angeles
91499	Van Nuys	Los Angeles
91501	Burbank	Los Angeles
91502	Burbank	Los Angeles
91503	Burbank	Los Angeles
91504	Burbank	Los Angeles
91505	Burbank	Los Angeles
91506	Burbank	Los Angeles
91507	Burbank	Los Angeles
91508	Burbank	Los Angeles
91510	Burbank	Los Angeles
91521	Burbank	Los Angeles
91522	Burbank	Los Angeles
91523	Burbank	Los Angeles
91526	Burbank	Los Angeles
91601	North Hollywood	Los Angeles
91602	North Hollywood	Los Angeles
91603	North Hollywood	Los Angeles
91604	Studio City	Los Angeles
91605	North Hollywood	Los Angeles
91606	North Hollywood	Los Angeles
91607	Valley Village	Los Angeles
91608	Universal City	Los Angeles
91609	North Hollywood	Los Angeles
91610	Toluca Lake	Los Angeles
91611	North Hollywood	Los Angeles
91612	North Hollywood	Los Angeles
91614	Studio City	Los Angeles
91615	North Hollywood	Los Angeles
91616	North Hollywood	Los Angeles
91617	Valley Village	Los Angeles
91618	North Hollywood	Los Angeles
91701	Rancho Cucamonga	San Bernardino
91702	Azusa	Los Angeles
91706	Baldwin Park	Los Angeles
91708	Chino	San Bernardino
91709	Chino Hills	San Bernardino
91710	Chino	San Bernardino
91711	Claremont	Los Angeles
91714	City Of Industry	Los Angeles
91715	City Of Industry	Los Angeles
91716	City Of Industry	Los Angeles
91722	Covina	Los Angeles
91723	Covina	Los Angeles
91724	Covina	Los Angeles
91729	Rancho Cucamonga	San Bernardino
91730	Rancho Cucamonga	San Bernardino
91731	El Monte	Los Angeles
91732	El Monte	Los Angeles
91733	South El Monte	Los Angeles
91734	El Monte	Los Angeles
91735	El Monte	Los Angeles
91737	Rancho Cucamonga	San Bernardino
91739	Rancho Cucamonga	San Bernardino
91740	Glendora	Los Angeles
91741	Glendora	Los Angeles
91743	Guasti	San Bernardino
91744	La Puente	Los Angeles
91745	Hacienda Heights	Los Angeles
91746	La Puente	Los Angeles
91747	La Puente	Los Angeles
91748	Rowland Heights	Los Angeles`;

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
    console.log('🔄 Parsing zip code data...');
    const records = parseZipCodeData(zipCodeBatch1);
    
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
