import dotenv from "dotenv";
import connectDB from "../db/index.js";
import ZipCode from "../models/zip-code.model.js";

dotenv.config({ path: ".env" });

connectDB();

// Batch 3: Third 500 rows (92691 - 93953)
const zipCodeBatch3 = `92691	Mission Viejo	Orange
92692	Mission Viejo	Orange
92693	San Juan Capistrano	Orange
92694	Ladera Ranch	Orange
92697	Irvine	Orange
92698	Aliso Viejo	Orange
92701	Santa Ana	Orange
92702	Santa Ana	Orange
92703	Santa Ana	Orange
92704	Santa Ana	Orange
92705	Santa Ana	Orange
92706	Santa Ana	Orange
92707	Santa Ana	Orange
92708	Fountain Valley	Orange
92709	Irvine	Orange
92710	Irvine	Orange
92711	Santa Ana	Orange
92712	Santa Ana	Orange
92725	Santa Ana	Orange
92728	Fountain Valley	Orange
92735	Santa Ana	Orange
92780	Tustin	Orange
92781	Tustin	Orange
92782	Tustin	Orange
92799	Santa Ana	Orange
92801	Anaheim	Orange
92802	Anaheim	Orange
92803	Anaheim	Orange
92804	Anaheim	Orange
92805	Anaheim	Orange
92806	Anaheim	Orange
92807	Anaheim	Orange
92808	Anaheim	Orange
92809	Anaheim	Orange
92811	Atwood	Orange
92812	Anaheim	Orange
92814	Anaheim	Orange
92815	Anaheim	Orange
92816	Anaheim	Orange
92817	Anaheim	Orange
92821	Brea	Orange
92822	Brea	Orange
92823	Brea	Orange
92825	Anaheim	Orange
92831	Fullerton	Orange
92832	Fullerton	Orange
92833	Fullerton	Orange
92834	Fullerton	Orange
92835	Fullerton	Orange
92836	Fullerton	Orange
92837	Fullerton	Orange
92838	Fullerton	Orange
92840	Garden Grove	Orange
92841	Garden Grove	Orange
92842	Garden Grove	Orange
92843	Garden Grove	Orange
92844	Garden Grove	Orange
92845	Garden Grove	Orange
92846	Garden Grove	Orange
92850	Anaheim	Orange
92856	Orange	Orange
92857	Orange	Orange
92859	Orange	Orange
92860	Norco	Riverside
92861	Villa Park	Orange
92862	Orange	Orange
92863	Orange	Orange
92864	Orange	Orange
92865	Orange	Orange
92866	Orange	Orange
92867	Orange	Orange
92868	Orange	Orange
92869	Orange	Orange
92870	Placentia	Orange
92871	Placentia	Orange
92877	Corona	Riverside
92878	Corona	Riverside
92879	Corona	Riverside
92880	Corona	Riverside
92881	Corona	Riverside
92882	Corona	Riverside
92883	Corona	Riverside
92885	Yorba Linda	Orange
92886	Yorba Linda	Orange
92887	Yorba Linda	Orange
92899	Anaheim	Orange
93001	Ventura	Ventura
93002	Ventura	Ventura
93003	Ventura	Ventura
93004	Ventura	Ventura
93005	Ventura	Ventura
93006	Ventura	Ventura
93007	Ventura	Ventura
93009	Ventura	Ventura
93010	Camarillo	Ventura
93011	Camarillo	Ventura
93012	Camarillo	Ventura
93013	Carpinteria	Santa Barbara
93014	Carpinteria	Santa Barbara
93015	Fillmore	Ventura
93016	Fillmore	Ventura
93020	Moorpark	Ventura
93021	Moorpark	Ventura
93022	Oak View	Ventura
93023	Ojai	Ventura
93024	Ojai	Ventura
93030	Oxnard	Ventura
93031	Oxnard	Ventura
93032	Oxnard	Ventura
93033	Oxnard	Ventura
93034	Oxnard	Ventura
93035	Oxnard	Ventura
93036	Oxnard	Ventura
93040	Piru	Ventura
93041	Port Hueneme	Ventura
93042	Point Mugu Nawc	Ventura
93043	Port Hueneme Cbc Base	Ventura
93044	Port Hueneme	Ventura
93060	Santa Paula	Ventura
93061	Santa Paula	Ventura
93062	Simi Valley	Ventura
93063	Simi Valley	Ventura
93064	Brandeis	Ventura
93065	Simi Valley	Ventura
93066	Somis	Ventura
93067	Summerland	Santa Barbara
93093	Simi Valley	Ventura
93094	Simi Valley	Ventura
93099	Simi Valley	Ventura
93101	Santa Barbara	Santa Barbara
93102	Santa Barbara	Santa Barbara
93103	Santa Barbara	Santa Barbara
93105	Santa Barbara	Santa Barbara
93106	Santa Barbara	Santa Barbara
93107	Santa Barbara	Santa Barbara
93108	Santa Barbara	Santa Barbara
93109	Santa Barbara	Santa Barbara
93110	Santa Barbara	Santa Barbara
93111	Santa Barbara	Santa Barbara
93116	Goleta	Santa Barbara
93117	Goleta	Santa Barbara
93118	Goleta	Santa Barbara
93120	Santa Barbara	Santa Barbara
93121	Santa Barbara	Santa Barbara
93130	Santa Barbara	Santa Barbara
93140	Santa Barbara	Santa Barbara
93150	Santa Barbara	Santa Barbara
93160	Santa Barbara	Santa Barbara
93190	Santa Barbara	Santa Barbara
93199	Goleta	Santa Barbara
93201	Alpaugh	Tulare
93202	Armona	Kings
93203	Arvin	Kern
93204	Avenal	Kings
93205	Bodfish	Kern
93206	Buttonwillow	Kern
93207	California Hot Springs	Tulare
93208	Camp Nelson	Tulare
93210	Coalinga	Fresno
93212	Corcoran	Kings
93215	Delano	Kern
93216	Delano	Kern
93218	Ducor	Tulare
93219	Earlimart	Tulare
93220	Edison	Kern
93221	Exeter	Tulare
93222	Frazier Park	Kern
93223	Farmersville	Tulare
93224	Fellows	Kern
93225	Frazier Park	Kern
93226	Glennville	Kern
93227	Goshen	Tulare
93230	Hanford	Kings
93232	Hanford	Kings
93234	Huron	Fresno
93235	Ivanhoe	Tulare
93237	Kaweah	Tulare
93238	Kernville	Kern
93239	Kettleman City	Kings
93240	Lake Isabella	Kern
93241	Lamont	Kern
93242	Laton	Fresno
93243	Lebec	Kern
93244	Lemon Cove	Tulare
93245	Lemoore	Kings
93246	Lemoore	Kings
93247	Lindsay	Tulare
93249	Lost Hills	Kern
93250	Mc Farland	Kern
93251	Mc Kittrick	Kern
93252	Maricopa	Kern
93254	New Cuyama	Santa Barbara
93255	Onyx	Kern
93256	Pixley	Tulare
93257	Porterville	Tulare
93258	Porterville	Tulare
93260	Posey	Tulare
93261	Richgrove	Tulare
93262	Sequoia National Park	Tulare
93263	Shafter	Kern
93265	Springville	Tulare
93266	Stratford	Kings
93267	Strathmore	Tulare
93268	Taft	Kern
93270	Terra Bella	Tulare
93271	Three Rivers	Tulare
93272	Tipton	Tulare
93274	Tulare	Tulare
93275	Tulare	Tulare
93276	Tupman	Kern
93277	Visalia	Tulare
93278	Visalia	Tulare
93279	Visalia	Tulare
93280	Wasco	Kern
93282	Waukena	Tulare
93283	Weldon	Kern
93285	Wofford Heights	Kern
93286	Woodlake	Tulare
93287	Woody	Kern
93290	Visalia	Tulare
93291	Visalia	Tulare
93292	Visalia	Tulare
93301	Bakersfield	Kern
93302	Bakersfield	Kern
93303	Bakersfield	Kern
93304	Bakersfield	Kern
93305	Bakersfield	Kern
93306	Bakersfield	Kern
93307	Bakersfield	Kern
93308	Bakersfield	Kern
93309	Bakersfield	Kern
93311	Bakersfield	Kern
93312	Bakersfield	Kern
93313	Bakersfield	Kern
93314	Bakersfield	Kern
93380	Bakersfield	Kern
93381	Bakersfield	Kern
93382	Bakersfield	Kern
93383	Bakersfield	Kern
93384	Bakersfield	Kern
93385	Bakersfield	Kern
93386	Bakersfield	Kern
93387	Bakersfield	Kern
93388	Bakersfield	Kern
93389	Bakersfield	Kern
93390	Bakersfield	Kern
93401	San Luis Obispo	San Luis Obispo
93402	Los Osos	San Luis Obispo
93403	San Luis Obispo	San Luis Obispo
93405	San Luis Obispo	San Luis Obispo
93406	San Luis Obispo	San Luis Obispo
93407	San Luis Obispo	San Luis Obispo
93408	San Luis Obispo	San Luis Obispo
93409	San Luis Obispo	San Luis Obispo
93410	San Luis Obispo	San Luis Obispo
93412	Los Osos	San Luis Obispo
93420	Arroyo Grande	San Luis Obispo
93421	Arroyo Grande	San Luis Obispo
93422	Atascadero	San Luis Obispo
93423	Atascadero	San Luis Obispo
93424	Avila Beach	San Luis Obispo
93426	Bradley	Monterey
93427	Buellton	Santa Barbara
93428	Cambria	San Luis Obispo
93429	Casmalia	Santa Barbara
93430	Cayucos	San Luis Obispo
93432	Creston	San Luis Obispo
93433	Grover Beach	San Luis Obispo
93434	Guadalupe	Santa Barbara
93435	Harmony	San Luis Obispo
93436	Lompoc	Santa Barbara
93437	Lompoc	Santa Barbara
93438	Lompoc	Santa Barbara
93440	Los Alamos	Santa Barbara
93441	Los Olivos	Santa Barbara
93442	Morro Bay	San Luis Obispo
93443	Morro Bay	San Luis Obispo
93444	Nipomo	San Luis Obispo
93445	Oceano	San Luis Obispo
93446	Paso Robles	San Luis Obispo
93447	Paso Robles	San Luis Obispo
93448	Pismo Beach	San Luis Obispo
93449	Pismo Beach	San Luis Obispo
93450	San Ardo	Monterey
93451	San Miguel	San Luis Obispo
93452	San Simeon	San Luis Obispo
93453	Santa Margarita	San Luis Obispo
93454	Santa Maria	Santa Barbara
93455	Santa Maria	Santa Barbara
93456	Santa Maria	Santa Barbara
93457	Santa Maria	Santa Barbara
93458	Santa Maria	Santa Barbara
93460	Santa Ynez	Santa Barbara
93461	Shandon	San Luis Obispo
93463	Solvang	Santa Barbara
93464	Solvang	Santa Barbara
93465	Templeton	San Luis Obispo
93475	Oceano	San Luis Obispo
93483	Grover Beach	San Luis Obispo
93501	Mojave	Kern
93502	Mojave	Kern
93504	California City	Kern
93505	California City	Kern
93510	Acton	Los Angeles
93512	Benton	Mono
93513	Big Pine	Inyo
93514	Bishop	Inyo
93515	Bishop	Inyo
93516	Boron	Kern
93517	Bridgeport	Mono
93518	Caliente	Kern
93519	Cantil	Kern
93522	Darwin	Inyo
93523	Edwards	Kern
93524	Edwards	Kern
93526	Independence	Inyo
93527	Inyokern	Kern
93528	Johannesburg	Kern
93529	June Lake	Mono
93530	Keeler	Inyo
93531	Keene	Kern
93532	Lake Hughes	Los Angeles
93534	Lancaster	Los Angeles
93535	Lancaster	Los Angeles
93536	Lancaster	Los Angeles
93539	Lancaster	Los Angeles
93541	Lee Vining	Mono
93542	Little Lake	Inyo
93543	Littlerock	Los Angeles
93544	Llano	Los Angeles
93545	Lone Pine	Inyo
93546	Mammoth Lakes	Mono
93549	Olancha	Inyo
93550	Palmdale	Los Angeles
93551	Palmdale	Los Angeles
93552	Palmdale	Los Angeles
93553	Pearblossom	Los Angeles
93554	Randsburg	Kern
93555	Ridgecrest	Kern
93556	Ridgecrest	Kern
93558	Red Mountain	San Bernardino
93560	Rosamond	Kern
93561	Tehachapi	Kern
93562	Trona	San Bernardino
93563	Valyermo	Los Angeles
93581	Tehachapi	Kern
93584	Lancaster	Los Angeles
93586	Lancaster	Los Angeles
93590	Palmdale	Los Angeles
93591	Palmdale	Los Angeles
93592	Trona	San Bernardino
93596	Boron	Kern
93599	Palmdale	Los Angeles
93601	Ahwahnee	Madera
93602	Auberry	Fresno
93603	Badger	Tulare
93604	Bass Lake	Madera
93605	Big Creek	Fresno
93606	Biola	Fresno
93607	Burrel	Fresno
93608	Cantua Creek	Fresno
93609	Caruthers	Fresno
93610	Chowchilla	Madera
93611	Clovis	Fresno
93612	Clovis	Fresno
93613	Clovis	Fresno
93614	Coarsegold	Madera
93615	Cutler	Tulare
93616	Del Rey	Fresno
93618	Dinuba	Tulare
93619	Clovis	Fresno
93620	Dos Palos	Merced
93621	Dunlap	Fresno
93622	Firebaugh	Fresno
93623	Fish Camp	Mariposa
93624	Five Points	Fresno
93625	Fowler	Fresno
93626	Friant	Fresno
93627	Helm	Fresno
93628	Hume	Fresno
93630	Kerman	Fresno
93631	Kingsburg	Fresno
93633	Kings Canyon National Pk	Tulare
93634	Lakeshore	Fresno
93635	Los Banos	Merced
93636	Madera	Madera
93637	Madera	Madera
93638	Madera	Madera
93639	Madera	Madera
93640	Mendota	Fresno
93641	Miramonte	Fresno
93642	Mono Hot Springs	Fresno
93643	North Fork	Madera
93644	Oakhurst	Madera
93645	O Neals	Madera
93646	Orange Cove	Fresno
93647	Orosi	Tulare
93648	Parlier	Fresno
93649	Piedra	Fresno
93650	Fresno	Fresno
93651	Prather	Fresno
93652	Raisin City	Fresno
93653	Raymond	Madera
93654	Reedley	Fresno
93656	Riverdale	Fresno
93657	Sanger	Fresno
93660	San Joaquin	Fresno
93661	Santa Rita Park	Merced
93662	Selma	Fresno
93664	Shaver Lake	Fresno
93665	South Dos Palos	Merced
93666	Sultana	Tulare
93667	Tollhouse	Fresno
93668	Tranquillity	Fresno
93669	Wishon	Madera
93670	Yettem	Tulare
93673	Traver	Tulare
93675	Squaw Valley	Fresno
93701	Fresno	Fresno
93702	Fresno	Fresno
93704	Fresno	Fresno
93705	Fresno	Fresno
93706	Fresno	Fresno
93707	Fresno	Fresno
93708	Fresno	Fresno
93709	Fresno	Fresno
93710	Fresno	Fresno
93711	Fresno	Fresno
93712	Fresno	Fresno
93714	Fresno	Fresno
93715	Fresno	Fresno
93716	Fresno	Fresno
93717	Fresno	Fresno
93718	Fresno	Fresno
93720	Fresno	Fresno
93721	Fresno	Fresno
93722	Fresno	Fresno
93723	Fresno	Fresno
93724	Fresno	Fresno
93725	Fresno	Fresno
93726	Fresno	Fresno
93727	Fresno	Fresno
93728	Fresno	Fresno
93729	Fresno	Fresno
93730	Fresno	Fresno
93740	Fresno	Fresno
93741	Fresno	Fresno
93744	Fresno	Fresno
93745	Fresno	Fresno
93747	Fresno	Fresno
93755	Fresno	Fresno
93760	Fresno	Fresno
93761	Fresno	Fresno
93764	Fresno	Fresno
93765	Fresno	Fresno
93771	Fresno	Fresno
93772	Fresno	Fresno
93773	Fresno	Fresno
93774	Fresno	Fresno
93775	Fresno	Fresno
93776	Fresno	Fresno
93777	Fresno	Fresno
93778	Fresno	Fresno
93779	Fresno	Fresno
93780	Fresno	Fresno
93784	Fresno	Fresno
93786	Fresno	Fresno
93790	Fresno	Fresno
93791	Fresno	Fresno
93792	Fresno	Fresno
93793	Fresno	Fresno
93794	Fresno	Fresno
93844	Fresno	Fresno
93888	Fresno	Fresno
93901	Salinas	Monterey
93902	Salinas	Monterey
93905	Salinas	Monterey
93906	Salinas	Monterey
93907	Salinas	Monterey
93908	Salinas	Monterey
93912	Salinas	Monterey
93915	Salinas	Monterey
93920	Big Sur	Monterey
93921	Carmel By The Sea	Monterey
93922	Carmel	Monterey
93923	Carmel	Monterey
93924	Carmel Valley	Monterey
93925	Chualar	Monterey
93926	Gonzales	Monterey
93927	Greenfield	Monterey
93928	Jolon	Monterey
93930	King City	Monterey
93932	Lockwood	Monterey
93933	Marina	Monterey
93940	Monterey	Monterey
93942	Monterey	Monterey
93943	Monterey	Monterey
93944	Monterey	Monterey
93950	Pacific Grove	Monterey
93953	Pebble Beach	Monterey`;

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
    console.log('🔄 Parsing zip code data (Batch 3)...');
    const records = parseZipCodeData(zipCodeBatch3);
    
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
