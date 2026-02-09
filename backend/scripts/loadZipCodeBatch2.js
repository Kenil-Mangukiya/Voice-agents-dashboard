import dotenv from "dotenv";
import connectDB from "../db/index.js";
import ZipCode from "../models/zip-code.model.js";

dotenv.config({ path: ".env" });

connectDB();

// Batch 2: Second 500 rows (91749 - 92690)
const zipCodeBatch2 = `91749	La Puente	Los Angeles
91750	La Verne	Los Angeles
91752	Mira Loma	Riverside
91754	Monterey Park	Los Angeles
91755	Monterey Park	Los Angeles
91756	Monterey Park	Los Angeles
91758	Ontario	San Bernardino
91759	Mt Baldy	Los Angeles
91761	Ontario	San Bernardino
91762	Ontario	San Bernardino
91763	Montclair	San Bernardino
91764	Ontario	San Bernardino
91765	Diamond Bar	Los Angeles
91766	Pomona	Los Angeles
91767	Pomona	Los Angeles
91768	Pomona	Los Angeles
91769	Pomona	Los Angeles
91770	Rosemead	Los Angeles
91771	Rosemead	Los Angeles
91772	Rosemead	Los Angeles
91773	San Dimas	Los Angeles
91775	San Gabriel	Los Angeles
91776	San Gabriel	Los Angeles
91778	San Gabriel	Los Angeles
91780	Temple City	Los Angeles
91784	Upland	San Bernardino
91785	Upland	San Bernardino
91786	Upland	San Bernardino
91788	Walnut	Los Angeles
91789	Walnut	Los Angeles
91790	West Covina	Los Angeles
91791	West Covina	Los Angeles
91792	West Covina	Los Angeles
91793	West Covina	Los Angeles
91795	Walnut	Los Angeles
91797	Pomona	Los Angeles
91798	Ontario	San Bernardino
91799	Pomona	Los Angeles
91801	Alhambra	Los Angeles
91802	Alhambra	Los Angeles
91803	Alhambra	Los Angeles
91804	Alhambra	Los Angeles
91841	Alhambra	Los Angeles
91896	Alhambra	Los Angeles
91899	Alhambra	Los Angeles
91901	Alpine	San Diego
91902	Bonita	San Diego
91903	Alpine	San Diego
91905	Boulevard	San Diego
91906	Campo	San Diego
91908	Bonita	San Diego
91909	Chula Vista	San Diego
91910	Chula Vista	San Diego
91911	Chula Vista	San Diego
91912	Chula Vista	San Diego
91913	Chula Vista	San Diego
91914	Chula Vista	San Diego
91915	Chula Vista	San Diego
91916	Descanso	San Diego
91917	Dulzura	San Diego
91921	Chula Vista	San Diego
91931	Guatay	San Diego
91932	Imperial Beach	San Diego
91933	Imperial Beach	San Diego
91934	Jacumba	San Diego
91935	Jamul	San Diego
91941	La Mesa	San Diego
91942	La Mesa	San Diego
91943	La Mesa	San Diego
91944	La Mesa	San Diego
91945	Lemon Grove	San Diego
91946	Lemon Grove	San Diego
91947	Lincoln Acres	San Diego
91948	Mount Laguna	San Diego
91950	National City	San Diego
91951	National City	San Diego
91962	Pine Valley	San Diego
91963	Potrero	San Diego
91976	Spring Valley	San Diego
91977	Spring Valley	San Diego
91978	Spring Valley	San Diego
91979	Spring Valley	San Diego
91980	Tecate	San Diego
91987	Tecate	San Diego
91990	Potrero	San Diego
92003	Bonsall	San Diego
92004	Borrego Springs	San Diego
92007	Cardiff By The Sea	San Diego
92008	Carlsbad	San Diego
92009	Carlsbad	San Diego
92010	Carlsbad	San Diego
92011	Carlsbad	San Diego
92013	Carlsbad	San Diego
92014	Del Mar	San Diego
92018	Carlsbad	San Diego
92019	El Cajon	San Diego
92020	El Cajon	San Diego
92021	El Cajon	San Diego
92022	El Cajon	San Diego
92023	Encinitas	San Diego
92024	Encinitas	San Diego
92025	Escondido	San Diego
92026	Escondido	San Diego
92027	Escondido	San Diego
92028	Fallbrook	San Diego
92029	Escondido	San Diego
92030	Escondido	San Diego
92033	Escondido	San Diego
92036	Julian	San Diego
92037	La Jolla	San Diego
92038	La Jolla	San Diego
92039	La Jolla	San Diego
92040	Lakeside	San Diego
92046	Escondido	San Diego
92049	Oceanside	San Diego
92051	Oceanside	San Diego
92052	Oceanside	San Diego
92054	Oceanside	San Diego
92055	Camp Pendleton	San Diego
92056	Oceanside	San Diego
92057	Oceanside	San Diego
92059	Pala	San Diego
92060	Palomar Mountain	San Diego
92061	Pauma Valley	San Diego
92064	Poway	San Diego
92065	Ramona	San Diego
92066	Ranchita	San Diego
92067	Rancho Santa Fe	San Diego
92068	San Luis Rey	San Diego
92069	San Marcos	San Diego
92070	Santa Ysabel	San Diego
92071	Santee	San Diego
92072	Santee	San Diego
92074	Poway	San Diego
92075	Solana Beach	San Diego
92078	San Marcos	San Diego
92079	San Marcos	San Diego
92081	Vista	San Diego
92082	Valley Center	San Diego
92083	Vista	San Diego
92084	Vista	San Diego
92085	Vista	San Diego
92086	Warner Springs	San Diego
92088	Fallbrook	San Diego
92090	El Cajon	San Diego
92091	Rancho Santa Fe	San Diego
92092	La Jolla	San Diego
92093	La Jolla	San Diego
92096	San Marcos	San Diego
92101	San Diego	San Diego
92102	San Diego	San Diego
92103	San Diego	San Diego
92104	San Diego	San Diego
92105	San Diego	San Diego
92106	San Diego	San Diego
92107	San Diego	San Diego
92108	San Diego	San Diego
92109	San Diego	San Diego
92110	San Diego	San Diego
92111	San Diego	San Diego
92112	San Diego	San Diego
92113	San Diego	San Diego
92114	San Diego	San Diego
92115	San Diego	San Diego
92116	San Diego	San Diego
92117	San Diego	San Diego
92118	Coronado	San Diego
92119	San Diego	San Diego
92120	San Diego	San Diego
92121	San Diego	San Diego
92122	San Diego	San Diego
92123	San Diego	San Diego
92124	San Diego	San Diego
92126	San Diego	San Diego
92127	San Diego	San Diego
92128	San Diego	San Diego
92129	San Diego	San Diego
92130	San Diego	San Diego
92132	San Diego	San Diego
92133	San Diego	San Diego
92134	San Diego	San Diego
92135	San Diego	San Diego
92136	San Diego	San Diego
92137	San Diego	San Diego
92138	San Diego	San Diego
92139	San Diego	San Diego
92140	San Diego	San Diego
92142	San Diego	San Diego
92143	San Ysidro	San Diego
92145	San Diego	San Diego
92147	San Diego	San Diego
92149	San Diego	San Diego
92150	San Diego	San Diego
92152	San Diego	San Diego
92153	San Diego	San Diego
92154	San Diego	San Diego
92155	San Diego	San Diego
92158	San Diego	San Diego
92159	San Diego	San Diego
92160	San Diego	San Diego
92161	San Diego	San Diego
92162	San Diego	San Diego
92163	San Diego	San Diego
92164	San Diego	San Diego
92165	San Diego	San Diego
92166	San Diego	San Diego
92167	San Diego	San Diego
92168	San Diego	San Diego
92170	San Diego	San Diego
92171	San Diego	San Diego
92172	San Diego	San Diego
92173	San Ysidro	San Diego
92174	San Diego	San Diego
92175	San Diego	San Diego
92176	San Diego	San Diego
92177	San Diego	San Diego
92178	Coronado	San Diego
92179	San Diego	San Diego
92182	San Diego	San Diego
92184	San Diego	San Diego
92186	San Diego	San Diego
92187	San Diego	San Diego
92190	San Diego	San Diego
92191	San Diego	San Diego
92192	San Diego	San Diego
92193	San Diego	San Diego
92194	San Diego	San Diego
92195	San Diego	San Diego
92196	San Diego	San Diego
92197	San Diego	San Diego
92198	San Diego	San Diego
92199	San Diego	San Diego
92201	Indio	Riverside
92202	Indio	Riverside
92203	Indio	Riverside
92210	Indian Wells	Riverside
92211	Palm Desert	Riverside
92220	Banning	Riverside
92222	Bard	Imperial
92223	Beaumont	Riverside
92225	Blythe	Riverside
92226	Blythe	Riverside
92227	Brawley	Imperial
92230	Cabazon	Riverside
92231	Calexico	Imperial
92232	Calexico	Imperial
92233	Calipatria	Imperial
92234	Cathedral City	Riverside
92235	Cathedral City	Riverside
92236	Coachella	Riverside
92239	Desert Center	Riverside
92240	Desert Hot Springs	Riverside
92241	Desert Hot Springs	Riverside
92242	Earp	San Bernardino
92243	El Centro	Imperial
92244	El Centro	Imperial
92247	La Quinta	Riverside
92248	La Quinta	Riverside
92249	Heber	Imperial
92250	Holtville	Imperial
92251	Imperial	Imperial
92252	Joshua Tree	San Bernardino
92253	La Quinta	Riverside
92254	Mecca	Riverside
92255	Palm Desert	Riverside
92256	Morongo Valley	San Bernardino
92257	Niland	Imperial
92258	North Palm Springs	Riverside
92259	Ocotillo	Imperial
92260	Palm Desert	Riverside
92261	Palm Desert	Riverside
92262	Palm Springs	Riverside
92263	Palm Springs	Riverside
92264	Palm Springs	Riverside
92266	Palo Verde	Imperial
92267	Parker Dam	San Bernardino
92268	Pioneertown	San Bernardino
92270	Rancho Mirage	Riverside
92273	Seeley	Imperial
92274	Thermal	Riverside
92275	Salton City	Imperial
92276	Thousand Palms	Riverside
92277	Twentynine Palms	San Bernardino
92278	Twentynine Palms	San Bernardino
92280	Vidal	San Bernardino
92281	Westmorland	Imperial
92282	White Water	Riverside
92283	Winterhaven	Imperial
92284	Yucca Valley	San Bernardino
92285	Landers	San Bernardino
92286	Yucca Valley	San Bernardino
92292	Palm Springs	Riverside
92301	Adelanto	San Bernardino
92304	Amboy	San Bernardino
92305	Angelus Oaks	San Bernardino
92307	Apple Valley	San Bernardino
92308	Apple Valley	San Bernardino
92309	Baker	San Bernardino
92310	Fort Irwin	San Bernardino
92311	Barstow	San Bernardino
92312	Barstow	San Bernardino
92313	Grand Terrace	San Bernardino
92314	Big Bear City	San Bernardino
92315	Big Bear Lake	San Bernardino
92316	Bloomington	San Bernardino
92317	Blue Jay	San Bernardino
92318	Bryn Mawr	San Bernardino
92320	Calimesa	Riverside
92321	Cedar Glen	San Bernardino
92322	Cedarpines Park	San Bernardino
92323	Cima	San Bernardino
92324	Colton	San Bernardino
92325	Crestline	San Bernardino
92326	Crest Park	San Bernardino
92327	Daggett	San Bernardino
92328	Death Valley	Inyo
92329	Phelan	San Bernardino
92331	Fontana	San Bernardino
92332	Essex	San Bernardino
92333	Fawnskin	San Bernardino
92334	Fontana	San Bernardino
92335	Fontana	San Bernardino
92336	Fontana	San Bernardino
92337	Fontana	San Bernardino
92338	Ludlow	San Bernardino
92339	Forest Falls	San Bernardino
92340	Hesperia	San Bernardino
92341	Green Valley Lake	San Bernardino
92342	Helendale	San Bernardino
92344	Hesperia	San Bernardino
92345	Hesperia	San Bernardino
92346	Highland	San Bernardino
92347	Hinkley	San Bernardino
92350	Loma Linda	San Bernardino
92352	Lake Arrowhead	San Bernardino
92354	Loma Linda	San Bernardino
92356	Lucerne Valley	San Bernardino
92357	Loma Linda	San Bernardino
92358	Lytle Creek	San Bernardino
92359	Mentone	San Bernardino
92363	Needles	San Bernardino
92364	Nipton	San Bernardino
92365	Newberry Springs	San Bernardino
92366	Mountain Pass	San Bernardino
92368	Oro Grande	San Bernardino
92369	Patton	San Bernardino
92371	Phelan	San Bernardino
92372	Pinon Hills	San Bernardino
92373	Redlands	San Bernardino
92374	Redlands	San Bernardino
92375	Redlands	San Bernardino
92376	Rialto	San Bernardino
92377	Rialto	San Bernardino
92378	Rimforest	San Bernardino
92382	Running Springs	San Bernardino
92384	Shoshone	Inyo
92385	Skyforest	San Bernardino
92386	Sugarloaf	San Bernardino
92389	Tecopa	Inyo
92391	Twin Peaks	San Bernardino
92392	Victorville	San Bernardino
92393	Victorville	San Bernardino
92394	Victorville	San Bernardino
92395	Victorville	San Bernardino
92397	Wrightwood	San Bernardino
92398	Yermo	San Bernardino
92399	Yucaipa	San Bernardino
92401	San Bernardino	San Bernardino
92402	San Bernardino	San Bernardino
92403	San Bernardino	San Bernardino
92404	San Bernardino	San Bernardino
92405	San Bernardino	San Bernardino
92406	San Bernardino	San Bernardino
92407	San Bernardino	San Bernardino
92408	San Bernardino	San Bernardino
92410	San Bernardino	San Bernardino
92411	San Bernardino	San Bernardino
92412	San Bernardino	San Bernardino
92413	San Bernardino	San Bernardino
92414	San Bernardino	San Bernardino
92415	San Bernardino	San Bernardino
92418	San Bernardino	San Bernardino
92423	San Bernardino	San Bernardino
92424	San Bernardino	San Bernardino
92427	San Bernardino	San Bernardino
92501	Riverside	Riverside
92502	Riverside	Riverside
92503	Riverside	Riverside
92504	Riverside	Riverside
92505	Riverside	Riverside
92506	Riverside	Riverside
92507	Riverside	Riverside
92508	Riverside	Riverside
92509	Riverside	Riverside
92513	Riverside	Riverside
92514	Riverside	Riverside
92515	Riverside	Riverside
92516	Riverside	Riverside
92517	Riverside	Riverside
92518	March Air Reserve Base	Riverside
92519	Riverside	Riverside
92521	Riverside	Riverside
92522	Riverside	Riverside
92530	Lake Elsinore	Riverside
92531	Lake Elsinore	Riverside
92532	Lake Elsinore	Riverside
92536	Aguanga	Riverside
92539	Anza	Riverside
92543	Hemet	Riverside
92544	Hemet	Riverside
92545	Hemet	Riverside
92546	Hemet	Riverside
92548	Homeland	Riverside
92549	Idyllwild	Riverside
92551	Moreno Valley	Riverside
92552	Moreno Valley	Riverside
92553	Moreno Valley	Riverside
92554	Moreno Valley	Riverside
92555	Moreno Valley	Riverside
92556	Moreno Valley	Riverside
92557	Moreno Valley	Riverside
92561	Mountain Center	Riverside
92562	Murrieta	Riverside
92563	Murrieta	Riverside
92564	Murrieta	Riverside
92567	Nuevo	Riverside
92570	Perris	Riverside
92571	Perris	Riverside
92572	Perris	Riverside
92581	San Jacinto	Riverside
92582	San Jacinto	Riverside
92583	San Jacinto	Riverside
92584	Menifee	Riverside
92585	Sun City	Riverside
92586	Sun City	Riverside
92587	Sun City	Riverside
92589	Temecula	Riverside
92590	Temecula	Riverside
92591	Temecula	Riverside
92592	Temecula	Riverside
92593	Temecula	Riverside
92595	Wildomar	Riverside
92596	Winchester	Riverside
92599	Perris	Riverside
92602	Irvine	Orange
92603	Irvine	Orange
92604	Irvine	Orange
92605	Huntington Beach	Orange
92606	Irvine	Orange
92607	Laguna Niguel	Orange
92609	El Toro	Orange
92610	Foothill Ranch	Orange
92612	Irvine	Orange
92614	Irvine	Orange
92615	Huntington Beach	Orange
92616	Irvine	Orange
92617	Irvine	Orange
92618	Irvine	Orange
92619	Irvine	Orange
92620	Irvine	Orange
92623	Irvine	Orange
92624	Capistrano Beach	Orange
92625	Corona Del Mar	Orange
92626	Costa Mesa	Orange
92627	Costa Mesa	Orange
92628	Costa Mesa	Orange
92629	Dana Point	Orange
92630	Lake Forest	Orange
92637	Laguna Woods	Orange
92646	Huntington Beach	Orange
92647	Huntington Beach	Orange
92648	Huntington Beach	Orange
92649	Huntington Beach	Orange
92650	East Irvine	Orange
92651	Laguna Beach	Orange
92652	Laguna Beach	Orange
92653	Laguna Hills	Orange
92654	Laguna Hills	Orange
92655	Midway City	Orange
92656	Aliso Viejo	Orange
92657	Newport Coast	Orange
92658	Newport Beach	Orange
92659	Newport Beach	Orange
92660	Newport Beach	Orange
92661	Newport Beach	Orange
92662	Newport Beach	Orange
92663	Newport Beach	Orange
92672	San Clemente	Orange
92673	San Clemente	Orange
92674	San Clemente	Orange
92675	San Juan Capistrano	Orange
92676	Silverado	Orange
92677	Laguna Niguel	Orange
92678	Trabuco Canyon	Orange
92679	Trabuco Canyon	Orange
92683	Westminster	Orange
92684	Westminster	Orange
92685	Westminster	Orange
92688	Rancho Santa Margarita	Orange
92690	Mission Viejo	Orange`;

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
    console.log('🔄 Parsing zip code data (Batch 2)...');
    const records = parseZipCodeData(zipCodeBatch2);
    
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
