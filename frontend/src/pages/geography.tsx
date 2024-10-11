import { Badge } from "@components/ui/badge";
import { listGroups } from "@utils/group";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { InferGetServerSidePropsType } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";

import { Group } from "@schema/group.schema";
import Link from "next/link";
import Layout from "../components/_shared/Layout";

export async function getStaticProps() {
  const countriesByLetterObj: any = {};

  const groups = (
    await listGroups({
      type: "geography",
      limit: 350,
    })
  ).filter((country) => {
    if (country.geography_type === "country") {
      let letter = country.title[0]!.toLowerCase();
      if (letter === "Å".toLowerCase()) letter = "a";
      const array = countriesByLetterObj[letter];
      if (!array) {
        countriesByLetterObj[letter] = [
          { name: country.name, title: country.title },
        ];
      } else {
        array.push({ name: country.name, title: country.title });
      }
      return true;
    }
    return false;
  }) as Array<Group & { geography_shape: any; iso2: string }>;
  return {
    props: {
      groups,
      countriesByLetterObj,
    },
  };
}

const flagsCache = new Map();

export default function DatasetsPage({
  groups,
  countriesByLetterObj,
}: InferGetServerSidePropsType<typeof getStaticProps>): JSX.Element {
  const router = useRouter();

  useEffect(() => {
    const getCountryFlag = (country: (typeof groups)[0]) => {
      const cachedImage = flagsCache.get(country.iso2);

      if (cachedImage && !cachedImage.isLoading) {
        return cachedImage;
      }

      flagsCache.set(country.iso2, {
        isLoading: true,
        url: "",
      });

      fetch(
        // Using the flagscdn because it responds faster than S3
        `https://flagcdn.com/h60/${country.iso2.toLowerCase()}.png` ??
          country.image_display_url,
      ).then(async (r) => {
        const blob = await r.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          flagsCache.set(country.iso2, {
            isLoading: false,
            url: reader.result as string,
          });
          const imgEl: any = document.getElementById(
            `country-popup-flag-${country.iso2}`,
          );
          if (imgEl) {
            imgEl.src = reader.result;
          }
        };
        reader.readAsDataURL(blob);
      });
    };

    const map = new maplibregl.Map({
      style: style,
      container: "map",
      attributionControl: false,
      interactive: window.innerWidth < 787,
      renderWorldCopies: false,
      scrollZoom: false,
      maxZoom: window.innerWidth < 787 ? 0.6 : null,
    });

    map.on("load", () => {
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: "customized-tooltip",
      });

      let maxOfDatasets = 0;

      groups.forEach((x) => {
        if (maxOfDatasets < x.package_count) maxOfDatasets = x.package_count;
      });

      const getFillColor = (packageCount: number) => {
        if (packageCount === 0) return "#D1D5DB";

        const colors = interpolateColors(
          hexToRgb("#B2EBF2"),
          hexToRgb("#006064"),
          10,
        );

        let index = 0;
        const percentage = `${(packageCount / maxOfDatasets) * 100}`;

        if (/\d/g.test(percentage[1]!)) {
          index = Number(percentage[0]!);
        }

        if (/\d\d\d/g.test(percentage.slice(0, 3)!)) {
          index = colors.length - 1;
        }

        return colors[index];
      };

      map.addSource("countriesWithDashedLines", {
        type: "geojson",
        data: countriesWithDashedLines as any,
      });

      const groupBatchesSize = 50;
      const groupBatchesCount = Math.ceil(groups.length / groupBatchesSize) + 1;
      const groupBatches = new Array(groupBatchesCount);
      let i;
      for (i = 0; i < groupBatchesCount; i++) {
        groupBatches[i] = groups.slice(
          i * groupBatchesSize,
          (i + 1) * groupBatchesSize,
        );
      }

      groupBatches.forEach((groupsWoGeo) => {
        listGroups({
          type: "geography",
          showCoordinates: true,
          groupIds: groupsWoGeo.map((g: any) => g.name),
        }).then((groups) => {
          groups.forEach((x: any, index: number) => {
            if (x.geography_shape) {
              const lineLayerId = x.id + `--${index}`;
              const fillColor = getFillColor(x.package_count);
              map.addSource(x.id, {
                type: "geojson",
                data: x.geography_shape,
              });

              map.addLayer({
                id: x.id,
                type: "fill",
                source: x.id,
                paint: {
                  "fill-color": fillColor,
                  "fill-outline-color": "white",
                },
              });

              map.addLayer({
                id: lineLayerId,
                type: "line",
                source: x.id,
                paint: {
                  "line-width": 2,
                  "line-color": "white",
                },
              });

              map.on("click", x.id, () => {
                router.push(`/search?country=${x.name.toLowerCase()}`);
              });

              map.on("mouseenter", x.id, (e) => {
                map.setPaintProperty(lineLayerId, "line-color", fillColor);
                map.getCanvas().style.cursor = "pointer";
                if (popup._container) {
                  popup._container.style.minWidth = "194px";
                  popup._container.style.cursor = "pointer";
                  popup._container.style.width = "194px";
                  popup._container.style.height = "171px";
                  popup._container.style.minHeight = "171px";
                }

                popup
                  .setLngLat(e.lngLat)
                  .setHTML(
                    `
              <div>
              <img style="object-fit: cover; width: 40px; height: 40px; border-radius: 9999px;" id="country-popup-flag-${x.iso2}" src="${getCountryFlag(x)?.url ?? "/assets/loading.webp"}"></img>

              <div class="country-title" style="color: white'; font-size: 14px">${
                x.title
              }
              </div>
              <div style="color: #9CA3AF">${x.iso2.toUpperCase()}</div>

                </div>

                <div style="color: white; font-size: 30px">${formatNumber(
                  x.package_count,
                )}</div>
                <div style="color: #9CA3AF; font-size: 16px">${
                  x.package_count > 1 ? "Datasets" : "Dataset"
                }</div>
              `,
                  )
                  .addTo(map);
              });

              map.on("mouseleave", x.id, () => {
                map.setPaintProperty(lineLayerId, "line-color", "white");
                map.getCanvas().style.cursor = "";
                popup.remove();
              });
            }
          });
        });
      });

      map.addLayer({
        id: "countriesWithDashedLines",
        source: "countriesWithDashedLines",
        type: "line",
        paint: {
          "line-width": 1.8,
          "line-color": "black",
          "line-dasharray": [0.7, 0.5], // [dash length, gap length]
        },
      });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Geography</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout backgroundEffect effectSize="40%">
        <div className="container">
          <div>
            <div className="mb-8 border-b-[1px] border-[#E5E7EB] pb-5">
              <h1 className="text-[30px] font-bold text-[#111928]">
                All Geographies
              </h1>
              <h5 className="text-base text-[#6B7280]">
                Datasets by country & geography
              </h5>
            </div>
            <div
              className="flex max-h-[523px] min-h-[523px] sm:max-h-[823px] sm:min-h-[823px]"
              id="map"
            >
              <div className="customized-scroll max-w-60 absolute top-[650px] z-10 max-h-[157px] overflow-y-scroll rounded border-black bg-transparent p-2">
                <p>
                  The United Nations Geospatial Data, or Geodata, is a worldwide
                  geospatial dataset of the United Nations.
                  <br />
                  <br />
                  The United Nations Geodata is provided to facilitate the
                  preparation of cartographic materials in the United Nations
                  includes geometry, attributes and labels to facilitate the
                  adequate depiction and naming of geographic features for the
                  preparation of maps in accordance with United Nations policies
                  and practices.
                  <br />
                  <br />
                  The geospatial datasets here included are referred to as UN
                  Geodata simplified and are generalized based on UNGeodata 25
                  million scale.
                  <br />
                  <br />
                  The feature layers include polygons/areas of countries
                  (BNDA_simplified), lines for international boundaries and
                  limits (BNDL_simplified), and major water body
                  (WBYA_simplified). In addition, aggregated regional areas are
                  available following M49 methodology (GEOA_simplified,
                  SUBA_simplified, INTA_simplified) and SDG regional grouping
                  (SDGA_simplified).
                  <br />
                  <br />
                  The UN Geodata simplified is prepared in the context of the
                  Administrative Instruction on the “Guidelines for the
                  Publication of Maps” and should serve global mapping purposes
                  as opposed to local mapping. The scale is unspecific for the
                  United Nations Geodata simplified and is suitable for
                  generalized world maps and web-maps.
                  <br />
                  <br />
                  <span className="font-bold">Terms of use</span>
                  <br />
                  <br />
                  The boundaries and names shown and the designations used on
                  this map do not imply official endorsement or acceptance by
                  the United Nations. (short form)
                  <br />
                  <br />
                  The designations employed and the presentation of material on
                  this map do not imply the expression of any opinion whatsoever
                  on the part of the Secretariat of the United Nations
                  concerning the legal status of any country, territory, city or
                  area or of its authorities, or concerning the delimitation of
                  its frontiers or boundaries. (long form)
                  <br />
                  <br />
                  Final boundary between the Republic of Sudan and the Republic
                  of South Sudan has not yet been determined.
                  <br />
                  <br />
                  Dotted line represents approximately the Line of Control in
                  Jammu and Kashmir agreed upon by India and Pakistan. The final
                  status of Jammu and Kashmir has not yet been agreed upon by
                  the parties.
                  <br />
                  <br />A dispute exists between the Governments of Argentina
                  and the United Kingdom of Great Britain and Northern Ireland
                  concerning sovereignty over the Falkland Islands (Malvinas).
                </p>
                <br />
                <ul style={{ listStyleType: "disc" }} className="pl-7">
                  <li>Non-Self-Governing-Territories</li>
                </ul>
                <br />
                <br />
                <span className="font-bold">Credits</span>
                <br />
                <br />
                United Nations Geospatial
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center">
            <div className="mb-24 flex max-w-[1280px] flex-col flex-wrap gap-4 pt-20 sm:max-h-[6273px] md:max-h-[4573px] lg:max-h-[3473px] xl:max-h-[2873px]">
              {Object.keys(countriesByLetterObj).map((letter) => (
                <LetterCard
                  letter={letter}
                  countries={countriesByLetterObj[letter] || []}
                />
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

const LetterCard = ({
  countries,
  letter,
}: {
  letter: string;
  countries: { name: string; title: string }[];
}) => (
  <div className="flex h-fit max-h-fit max-w-full grid-rows-1 flex-col gap-5 rounded-lg bg-white p-6 shadow-md sm:max-w-[200px] xl:w-[200px]">
    <Badge
      className="h-12 w-12 items-center justify-center px-3"
      variant={"success"}
    >
      <span className="text-[30px] font-extrabold uppercase">{letter}</span>
    </Badge>
    <div className="flex flex-col gap-3">
      {countries.map((word) => (
        <Link
          key={`word-card-${word.name}`}
          id={word.title}
          href={`/search?country=${word.name}`}
          className="cursor-pointer break-words text-[#6B7280] hover:underline"
        >
          {word.title}
        </Link>
      ))}
    </div>
  </div>
);

const style: any = {
  id: "43f36e14-e3f5-43c1-84c0-50a9c80dc5c7",
  name: "MapLibre",
  zoom: 0.8619833357855968,
  pitch: 0,
  center: [17.65431710431244, 41.954120326746775],
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  layers: [
    {
      id: "background",
      type: "background",
      paint: {
        "background-color": "rgb(228 250 238)",
        "background-opacity": 0,
      },
      filter: ["all"],
      layout: {
        visibility: "visible",
      },
      maxzoom: 24,
    },
    {
      id: "coastline",
      type: "line",
      paint: {
        "line-blur": 0.5,
        "line-color": "white",
        "line-width": 2,
      },
      filter: ["all"],
      layout: {
        "line-cap": "round",
        "line-join": "round",
        visibility: "visible",
      },
      source: "maplibre",
      maxzoom: 24,
      minzoom: 24,
      "source-layer": "countries",
    },
    {
      id: "countries-fill",
      type: "fill",
      paint: {
        "fill-color": "#D1D5DB",
      },
      filter: ["all"],
      layout: {
        visibility: "visible",
      },
      source: "maplibre",
      maxzoom: 24,
      "source-layer": "countries",
    },
    {
      id: "countries-boundary",
      type: "line",
      paint: {
        "line-color": "rgba(255, 255, 255, 1)",
        "line-width": 2,
        "line-opacity": {
          stops: [
            [3, 0.5],
            [6, 1],
          ],
        },
      },
      layout: {
        "line-cap": "round",
        "line-join": "round",
        visibility: "visible",
      },
      source: "maplibre",
      maxzoom: 24,
      "source-layer": "countries",
    },
    {
      id: "geolines-label",
      type: "symbol",
      paint: {
        "text-color": "#1077B0",
        "text-halo-blur": 1,
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": 1,
      },
      filter: ["all", ["!=", "name", "International Date Line"]],
      layout: {
        "text-font": ["Open Sans Semibold"],
        "text-size": {
          stops: [
            [2, 12],
            [6, 16],
          ],
        },
        "text-field": "{name}",
        visibility: "visible",
        "symbol-placement": "line",
      },
      source: "maplibre",
      maxzoom: 24,
      minzoom: 24,
      "source-layer": "geolines",
    },
    {
      id: "countries-label",
      type: "symbol",
      paint: {
        "text-color": "rgba(8, 37, 77, 1)",
        "text-halo-blur": {
          stops: [
            [2, 0.2],
            [6, 0],
          ],
        },
        "text-halo-color": "rgba(255, 255, 255, 1)",
        "text-halo-width": {
          stops: [
            [2, 1],
            [6, 1.6],
          ],
        },
      },
      filter: ["all"],
      layout: {
        "text-font": ["Open Sans Semibold"],
        "text-size": {
          stops: [
            [2, 10],
            [4, 12],
            [6, 16],
          ],
        },
        "text-field": {
          stops: [
            [2, "{ABBREV}"],
            [4, "{NAME}"],
          ],
        },
        visibility: "visible",
        "text-max-width": 10,
        "text-transform": {
          stops: [
            [0, "uppercase"],
            [2, "none"],
          ],
        },
      },
      source: "maplibre",
      maxzoom: 24,
      minzoom: 24,
      "source-layer": "centroids",
    },
    {
      id: "crimea-fill",
      type: "fill",
      source: "crimea",
      paint: {
        "fill-color": "#D1D5DB",
      },
    },
  ],
  bearing: 0,
  sources: {
    maplibre: {
      url: "https://demotiles.maplibre.org/tiles/tiles.json",
      type: "vector",
    },
    crimea: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [34.00905273547181, 46.55925987559425],
              [33.64325260204026, 46.34533545368038],
              [33.628682598560204, 46.12569762665683],
              [33.64292861730951, 46.10476396128129],
              [33.648473474905984, 46.09033047763651],
              [33.63876482059936, 46.077976784785335],
              [33.62782672238245, 46.06747935719011],
              [33.62911357645072, 46.05708111413949],
              [33.642686868727424, 46.02192963417187],
              [33.6429723910654, 46.01521185644708],
              [33.636224138774026, 46.006705833212465],
              [33.63052626465907, 45.99692992186792],
              [33.63193836679693, 45.988472992911284],
              [33.64276684834442, 45.984575360297384],
              [33.646928693041986, 45.97981936210982],
              [33.638745893564305, 45.96829769147004],
              [33.61958133326394, 45.951176418494185],
              [33.63181380398527, 45.9445404758078],
              [33.638921676216, 45.94737012930554],
              [33.64561542516918, 45.95403251372139],
              [33.65666403976448, 45.95687114427736],
              [33.6825817382811, 45.95878100879199],
              [33.738791807037614, 45.94836945227263],
              [33.758180142697, 45.94072970008301],
              [33.77735917288169, 45.92923970233858],
              [33.75927796793485, 45.92241179584471],
              [33.72529865009221, 45.91587363154565],
              [33.70875012326826, 45.91008760988058],
              [33.69378857293381, 45.91480850795665],
              [33.69092650243843, 45.89657370898402],
              [33.693592356906805, 45.87271465766318],
              [33.69226765972388, 45.86041392418218],
              [33.6704813511748, 45.8584273836251],
              [33.65936345808916, 45.85944682601249],
              [33.653870582376726, 45.86425922279372],
              [33.65107345584843, 45.87089907254003],
              [33.63067378180233, 45.88040685247182],
              [33.61945300059696, 45.88147266102649],
              [33.60987421595539, 45.88048951126686],
              [33.59906957603934, 45.877610457390375],
              [33.57828877687868, 45.86810261756233],
              [33.55357394560386, 45.84700625141778],
              [33.530220674480375, 45.84221983655459],
              [33.5192297395441, 45.84121682367507],
              [33.50832088442496, 45.84313067048083],
              [33.48901101848409, 45.85268298292175],
              [33.482152996405716, 45.854578171799005],
              [33.46719955896293, 45.849912739405056],
              [33.42447496599681, 45.83075886348303],
              [33.40940172404095, 45.82691953557702],
              [33.37918350072067, 45.802867525073566],
              [33.37362145339398, 45.79619281922518],
              [33.33805543634864, 45.78577808972071],
              [33.26498872665803, 45.75410774187094],
              [33.22887541283427, 45.75131270772724],
              [33.19548267281132, 45.7644887297206],
              [33.1789202379222, 45.78010311364778],
              [33.1688456078636, 45.78470227904205],
              [33.161012432811674, 45.77921593899549],
              [33.15951585299757, 45.76864464913777],
              [33.165962301438725, 45.762685940125465],
              [33.1750888126426, 45.759218220695715],
              [33.181464829753, 45.75490447884948],
              [33.17613930782352, 45.7437961960276],
              [33.16369168844906, 45.735912015025065],
              [32.93692665480876, 45.662114646778264],
              [32.86839112407645, 45.63044340698664],
              [32.83803944575723, 45.60834075026611],
              [32.82702772424804, 45.59576101516498],
              [32.82433467080986, 45.58705137380335],
              [32.82563941622885, 45.579605763895614],
              [32.82993674258438, 45.56978311819469],
              [32.82851940940563, 45.56227808675749],
              [32.813310142795274, 45.55930933158257],
              [32.80213583657516, 45.560145780074464],
              [32.78258622159436, 45.565158335073846],
              [32.77333922465823, 45.56689313356526],
              [32.758306734735356, 45.565030173463356],
              [32.750177256846115, 45.55943726334968],
              [32.74340732630185, 45.55261895849793],
              [32.73524549539499, 45.54598788110354],
              [32.72031700779701, 45.53735927760957],
              [32.70536040418847, 45.53169142131733],
              [32.68589438933773, 45.52663379187257],
              [32.66370583186284, 45.52563107058867],
              [32.64312077736798, 45.52188979044979],
              [32.525284074162556, 45.45838108691365],
              [32.49490411219156, 45.43524910229854],
              [32.48107654411925, 45.408986638827514],
              [32.48514589713025, 45.39458067125969],
              [32.51256939517424, 45.34060655033625],
              [32.535915460470335, 45.33777248012882],
              [32.57027153843481, 45.32510892683359],
              [32.590830644991826, 45.32038723212662],
              [32.66380378113439, 45.320421746458976],
              [32.67760722618917, 45.32609231279554],
              [32.71316246802607, 45.353283572618125],
              [32.72817188836078, 45.36074681043402],
              [32.750518060251466, 45.36371725645313],
              [32.89973931692998, 45.35412322462227],
              [32.941197846443885, 45.34245505845169],
              [32.97701667405008, 45.32596743563991],
              [33.04296090827762, 45.2853982930032],
              [33.05274355585479, 45.28154273654923],
              [33.06850284417635, 45.27703461892352],
              [33.07825272648239, 45.272210805127315],
              [33.089426322403455, 45.25656353201492],
              [33.09897492343546, 45.247820101667884],
              [33.12384611720435, 45.238235755071685],
              [33.15767197859745, 45.20755227709648],
              [33.172959979330074, 45.19681657531794],
              [33.21837666514142, 45.187878368659824],
              [33.24017433636709, 45.180191106261134],
              [33.248571989896675, 45.16588271012458],
              [33.259649216030766, 45.155918961282026],
              [33.28309785485047, 45.16064860772312],
              [33.31767999550894, 45.17535522412791],
              [33.35458473323109, 45.18598673360148],
              [33.39725661527919, 45.18973663076909],
              [33.41344561756824, 45.18490731877088],
              [33.468468576977216, 45.149132412229676],
              [33.537128652906205, 45.11719769268973],
              [33.56161328289443, 45.094099022711475],
              [33.57837628774928, 45.053145935448015],
              [33.58247744978442, 45.027377243150454],
              [33.5851414316958, 45.01816461606674],
              [33.6031021265521, 44.993103583251695],
              [33.605922209331794, 44.986905272229734],
              [33.60843524291815, 44.97039962759274],
              [33.61943161357851, 44.93184946652454],
              [33.619484500808824, 44.90819321920554],
              [33.61549738593425, 44.88894092276257],
              [33.608561183117274, 44.871288478948514],
              [33.59889474705494, 44.859790298912856],
              [33.55904244709464, 44.850057575124595],
              [33.54667558363471, 44.83724531175508],
              [33.53701832136994, 44.81871953508235],
              [33.5303157846202, 44.798338017069625],
              [33.5249116915937, 44.78918633101301],
              [33.51669091675143, 44.784809980590666],
              [33.524785531609865, 44.77183212449111],
              [33.5302902535075, 44.75724515985675],
              [33.53710734694323, 44.73034290771247],
              [33.54650992495621, 44.70989226909535],
              [33.5481286806762, 44.699106546699085],
              [33.543995566510915, 44.68230506537358],
              [33.53580273994743, 44.6726082589706],
              [33.52337411931097, 44.661863083605255],
              [33.515320778874354, 44.6491266698327],
              [33.516377841582795, 44.63464990118433],
              [33.52466971637648, 44.62863961572572],
              [33.557474298027785, 44.62473000923737],
              [33.5710648827386, 44.620853511273225],
              [33.55105839203679, 44.61506440493406],
              [33.499905706797676, 44.61452599304897],
              [33.48451102966331, 44.60992438254493],
              [33.47658499621011, 44.60714391514574],
              [33.46705078205747, 44.60616254193252],
              [33.44476599234898, 44.607062134677875],
              [33.4353466482458, 44.60509936890821],
              [33.413591053005575, 44.593500212748125],
              [33.40543527945235, 44.59055535193136],
              [33.37510958624222, 44.58564691897425],
              [33.37074452434078, 44.58851022190515],
              [33.372237834990756, 44.576810695127364],
              [33.37913003799301, 44.56412673079859],
              [33.48759131590526, 44.51024086451031],
              [33.50011215135888, 44.50041002882833],
              [33.517917009115365, 44.49074142372788],
              [33.53836387802215, 44.49164280212756],
              [33.56041892763031, 44.4966411022441],
              [33.57822378538677, 44.497542389459795],
              [33.59062975079095, 44.48975808594983],
              [33.619577003408466, 44.46229988129974],
              [33.62635433636015, 44.45336293328907],
              [33.63175322871038, 44.434828756313124],
              [33.645537634715026, 44.42498521035591],
              [33.721007257593925, 44.39946630464436],
              [33.74168386660085, 44.39560878121904],
              [33.80727466517129, 44.39454176175843],
              [33.81841706002561, 44.39552670349164],
              [33.83909366903248, 44.40143600575672],
              [33.85149963444792, 44.40143600575945],
              [33.91467816197718, 44.38387049706651],
              [33.938111652185, 44.38083293528811],
              [33.957065210440874, 44.38272116790142],
              [34.06614966692763, 44.42019923628979],
              [34.088893936836286, 44.42200415824283],
              [34.10279321289039, 44.42487551014821],
              [34.135933345669, 44.44163597968952],
              [34.14696087047267, 44.44959070749778],
              [34.16058918507403, 44.466287285335795],
              [34.170123399227776, 44.48186111741296],
              [34.182759104731986, 44.49267838558103],
              [34.22923417224524, 44.49949719774551],
              [34.24301857824986, 44.50744404277697],
              [34.263903954150294, 44.53186886058606],
              [34.26631622520165, 44.53555362837611],
              [34.26631622520165, 44.54153064468656],
              [34.27033667695244, 44.545378535987936],
              [34.2757355693048, 44.54644280144541],
              [34.285384653508004, 44.54562413743594],
              [34.299973149863405, 44.54554227040174],
              [34.32260254971496, 44.543577427039224],
              [34.3308731933177, 44.54546040325087],
              [34.340292537420794, 44.55798473830754],
              [34.38042135640006, 44.631830317636684],
              [34.41495238900856, 44.673669777529994],
              [34.424193090575585, 44.68239452736094],
              [34.42959198292681, 44.68884644523774],
              [34.469399167794535, 44.730194532749294],
              [34.47376422969597, 44.73011292571252],
              [34.47376422969597, 44.72635887754967],
              [34.475142670296464, 44.723502373339585],
              [34.499724861011515, 44.74292382044041],
              [34.532800295801195, 44.752620844929055],
              [34.61217550038418, 44.76534519537847],
              [34.65065696715081, 44.777088262503725],
              [34.72084256772871, 44.811080759265764],
              [34.756796893391225, 44.82094054159748],
              [34.82646979041766, 44.81208604604609],
              [34.84289620758207, 44.816893835303176],
              [34.856910353686715, 44.82373813182468],
              [34.889648317948144, 44.817871641692506],
              [34.90733830566026, 44.820886440346584],
              [34.922960632465504, 44.83050015059965],
              [34.92950822531711, 44.83652826953224],
              [34.94179932067178, 44.84019370922482],
              [34.95282684547897, 44.841415470643284],
              [34.98567967978991, 44.840275160795755],
              [35.0053224583441, 44.83538786296728],
              [35.017958163849414, 44.82219008824552],
              [35.02703289780189, 44.80890779582285],
              [35.037933245998005, 44.79869792240089],
              [35.08073333784134, 44.793525442788905],
              [35.1080207326404, 44.824553365795765],
              [35.130368105574235, 44.86879838545747],
              [35.15485200090768, 44.90071251697748],
              [35.17111229780758, 44.90746386008772],
              [35.21522068940149, 44.91421441031795],
              [35.233163085981715, 44.925728224907715],
              [35.25636688416236, 44.95896657181197],
              [35.27300098099195, 44.96690119386028],
              [35.29748487632534, 44.95605693543271],
              [35.30496087491386, 44.96121482614441],
              [35.315240372954605, 44.965711070514175],
              [35.31935217217088, 44.96941359539801],
              [35.36757236298112, 44.94362319076086],
              [35.36103086422793, 44.97364475976596],
              [35.362152264014156, 44.98593980935419],
              [35.374674561627444, 44.997835734117416],
              [35.389439658813274, 45.00180049366759],
              [35.42270785247763, 45.00087540764923],
              [35.43504325012745, 45.00470780964241],
              [35.43504325012745, 45.011446929213974],
              [35.40631957913584, 45.02015821022701],
              [35.40089948016896, 45.025046135473445],
              [35.39790908073891, 45.03482073400548],
              [35.40052568024015, 45.042216617888045],
              [35.40631957913584, 45.051328088783805],
              [35.40744097892215, 45.06294640963205],
              [35.41734667704213, 45.0708666385693],
              [35.469304867139925, 45.10068964922732],
              [35.5070260597534, 45.113341616151644],
              [35.54758335202416, 45.12019982412133],
              [35.59019654390909, 45.11993606213795],
              [35.63411803553862, 45.11439677872579],
              [35.70669729572677, 45.09480210570922],
              [35.771782422456766, 45.06572995732262],
              [35.78430472007, 45.057941041321754],
              [35.81250040352472, 45.031852200991295],
              [35.81941570220667, 45.021152336906454],
              [35.82763930064016, 44.99895365027004],
              [35.848198296721705, 44.99208088455586],
              [35.916977483614176, 45.00172895661731],
              [35.99360646900681, 44.997896355361604],
              [36.00893226608571, 45.00926125333629],
              [36.02539976723364, 45.03288661039673],
              [36.047827762958946, 45.048074065419456],
              [36.078666257082034, 45.03883000769565],
              [36.079137312377895, 45.046610970582435],
              [36.135020401727616, 45.02125162210126],
              [36.2241716847341, 45.00751061631556],
              [36.24398308095806, 45.011474706353084],
              [36.24828178013877, 45.01649549321965],
              [36.25332807917695, 45.03247980324494],
              [36.25743987839326, 45.03842324279259],
              [36.267158676549116, 45.043573724415154],
              [36.2783726744118, 45.04555455542638],
              [36.36740852558336, 45.04833265291825],
              [36.44029951169139, 45.06787222615526],
              [36.45375630913995, 45.07631970334319],
              [36.455251508854985, 45.09202341204062],
              [36.44142091149291, 45.10709638287736],
              [36.41432041665814, 45.12872568311289],
              [36.40852651776157, 45.149160473330085],
              [36.409997342308856, 45.171615955386955],
              [36.418312796420764, 45.23001671705953],
              [36.42672329481775, 45.25186253492981],
              [36.43756477765089, 45.27227491599612],
              [36.4497132753354, 45.28542626329343],
              [36.45905827355429, 45.28753019598713],
              [36.4814862692796, 45.28845064200263],
              [36.4909554290368, 45.29213135137758],
              [36.49637552800283, 45.300940007322055],
              [36.49394582846682, 45.305015191082816],
              [36.48871262946426, 45.30935296803605],
              [36.48460083024801, 45.315924724862185],
              [36.489647129296515, 45.336413860372005],
              [36.502169426909745, 45.34731734941451],
              [36.52104632331191, 45.35033842661815],
              [36.544281237819945, 45.34731734942025],
              [36.57455903204905, 45.33601971904315],
              [36.585399229982954, 45.333917585593355],
              [36.59810088537549, 45.334837278577254],
              [36.630808379142394, 45.34048649352954],
              [36.637536777859964, 45.3511265071989],
              [36.63099527910589, 45.3741073632589],
              [36.61359545390113, 45.40895280985421],
              [36.59845655678569, 45.421547717459106],
              [36.58331765967199, 45.42731944465129],
              [36.566309762912795, 45.42548305000767],
              [36.54836736633254, 45.41210180010589],
              [36.53285466928139, 45.4090840212946],
              [36.51565987255873, 45.41957994832251],
              [36.49117597722616, 45.44279525429408],
              [36.47043008117939, 45.4458112314303],
              [36.411182792482634, 45.43610707766504],
              [36.391371396258705, 45.43991025572652],
              [36.35959840231365, 45.45407156049933],
              [36.33960010612526, 45.45695583486963],
              [36.33025510790637, 45.454464879327446],
              [36.32053630976225, 45.44856480887407],
              [36.31156511147125, 45.4438443081136],
              [36.29885591389362, 45.442795254299995],
              [36.3072664122906, 45.46115087970253],
              [36.30016421364425, 45.47320989503609],
              [36.283717016779036, 45.476355300848866],
              [36.267082919949445, 45.46704963343626],
              [36.25213092279836, 45.46115087970253],
              [36.13681364478941, 45.46219959214511],
              [36.11700224855986, 45.45721803432335],
              [36.097003952371466, 45.441483909606006],
              [36.06952965760803, 45.43046741078453],
              [36.0655449627526, 45.42553028973455],
              [36.05134056545904, 45.39535242162091],
              [36.022557970944945, 45.368441166003805],
              [35.986486277818386, 45.362926059418186],
              [35.94723728529826, 45.372380198658874],
              [35.87220216002379, 45.404075760536614],
              [35.85388596351393, 45.413916621802144],
              [35.84715756479628, 45.426379251448395],
              [35.8524047739447, 45.44386497541683],
              [35.85950697259193, 45.45933624762881],
              [35.857824872912545, 45.469953901705],
              [35.83278027768503, 45.47087138287168],
              [35.8167068807486, 45.46392436820739],
              [35.80362388324218, 45.44963442058864],
              [35.79469305616038, 45.42980210462429],
              [35.791889556694684, 45.41209230278156],
              [35.772265060435046, 45.39214572935421],
              [35.767405661361295, 45.38873311015669],
              [35.75189296431793, 45.386632934388984],
              [35.7481549650407, 45.379938103368545],
              [35.746846665290036, 45.369960021421576],
              [35.74423006578874, 45.36076812520648],
              [35.71619507113218, 45.34040932557082],
              [35.69451467527287, 45.32989869277279],
              [35.51720627467216, 45.29506847418358],
              [35.48038698168983, 45.2979608697527],
              [35.33194061536096, 45.371562726652314],
              [35.04491375777232, 45.669545248704424],
              [35.00230056589345, 45.7290693869553],
              [34.70631294999043, 46.024929846739866],
              [34.35868883309806, 46.106725558140795],
              [34.00905273547181, 46.55925987559425],
            ],
          ],
        },
      },
    },
  },
  version: 8,
  metadata: {
    "maptiler:copyright":
      "This style was generated on MapTiler Cloud. Usage is governed by the license terms in https://github.com/maplibre/demotiles/blob/gh-pages/LICENSE",
    "openmaptiles:version": "3.x",
  },
};

const hexToRgb = (hex: string) => {
  let arrBuff = new ArrayBuffer(4);
  let vw = new DataView(arrBuff);
  hex = hex.replace(/[^0-9A-F]/gi, "");
  vw.setUint32(0, parseInt(hex, 16), false);
  let arrByte = new Uint8Array(arrBuff);

  return arrByte[1] + "," + arrByte[2] + "," + arrByte[3];
};

const interpolateColor = (color1: any, color2: any, factor: number = 0.5) => {
  let result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
};

const interpolateColors = (color1: any, color2: any, steps: number) => {
  let stepFactor = 1 / (steps - 1),
    interpolatedColorArray = [];

  color1 = color1.match(/\d+/g).map(Number);
  color2 = color2.match(/\d+/g).map(Number);

  for (let i = 0; i < steps; i++) {
    let color_ = interpolateColor(color1, color2, stepFactor * i);

    let new_color_ =
      "rgba(" + color_[0] + "," + color_[1] + "," + color_[2] + ",1)";
    interpolatedColorArray.push(new_color_);
  }

  return interpolatedColorArray;
};

const formatNumber = (number: number) => {
  if (isNaN(number)) {
    return "0";
  }

  const formattedNumber = Number(number).toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 10,
  });

  return formattedNumber;
};

const countriesWithDashedLines = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: 772,
      geometry: {
        type: "LineString",
        coordinates: [
          [35.508736187916504, 4.619999999947218],
          [35.43030149236893, 4.79332942968174],
          [35.43474648414758, 4.9202095018781815],
          [35.290769099377705, 5.013020699228646],
          [34.378459999883944, 4.619999999947218],
        ],
      },
      properties: {
        objectid: 772,
        iso3cd: "SSD_SSD",
        globalid: "{2A7E361E-437D-417A-B547-B2D5504B1FA8}",
        iso2cd: "SS_SS",
        m49_cd: "728_728",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1077,
      geometry: {
        type: "LineString",
        coordinates: [
          [47.973497071505626, 7.987108915663162],
          [45.231602438805105, 5.175008692975682],
          [44.7475767156994, 4.927890339144354],
          [44.01513999978635, 4.960440000340008],
          [43.43491999958071, 4.794679999865685],
          [43.04428000019481, 4.572130000076265],
          [42.969239999583266, 4.403349999867918],
          [42.8333099995406, 4.270619999866002],
          [42.52662000050564, 4.202910000227229],
          [42.08767000015908, 4.179370000308956],
          [41.98603334353084, 4.094583393640397],
          [41.910118999921366, 3.9827555598646036],
        ],
      },
      properties: {
        objectid: 1077,
        iso3cd: "ETH_SOM",
        globalid: "{891A0F93-8617-4C61-8330-CE5A276033FF}",
        iso2cd: "ET_SO",
        m49_cd: "231_706",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1134,
      geometry: {
        type: "LineString",
        coordinates: [
          [34.113245520872034, 9.498635660225817],
          [33.909723277507254, 9.49890336408207],
          [33.88767242402655, 9.546225546995544],
          [33.9176521295521, 9.751811027150788],
          [33.96667098861472, 9.820816039359556],
          [33.99332046484154, 9.929319382357251],
          [33.971427916993285, 10.140615462946885],
          [33.565263012575116, 10.562080977980228],
          [33.37220380882119, 10.690272502368888],
          [33.26155737122842, 10.821537799631544],
          [33.16014032887897, 11.471016568751311],
          [33.15704350045853, 11.690330278348304],
          [33.282032012416906, 12.190558433986476],
          [33.26613692215145, 12.215400903840743],
          [32.95053955872494, 12.229112765838611],
          [32.755380305421916, 12.235191276124214],
          [32.714770511346295, 11.946912689736944],
          [32.10657882721776, 11.94499778666153],
          [32.33387986079703, 11.7470894071106],
          [32.39289738653538, 11.56370145694751],
          [32.45191559351871, 11.034088243694264],
          [31.92123814464115, 10.528596401279403],
          [31.75394248970062, 10.26829433396173],
          [31.31464958098241, 9.77233695932177],
          [30.876976012199236, 9.738337517353115],
          [30.719932556658804, 9.806336403225412],
          [30.533744810705745, 9.955824851111899],
          [29.996772766150333, 10.288802146871932],
          [29.942266463695884, 10.287722587119296],
          [29.53903961201597, 10.08183193062576],
          [29.538087846368512, 9.93346857408384],
          [29.23821317130918, 9.749674353833214],
          [29.075044631704756, 9.744899749728022],
          [28.999999999890203, 9.6666670000066],
          [27.914202941690167, 9.610167399006508],
          [27.91420300009119, 9.610166999628863],
          [27.137382508114595, 9.624267577882403],
          [26.710691367566174, 9.489760834047894],
          [26.509525298528292, 9.529685020364717],
          [26.37549400333694, 9.576263427095041],
          [26.313705443548244, 9.636625290261783],
          [25.918264389237663, 10.407545088913082],
          [25.851724625434834, 10.438914299012202],
          [25.276863097910525, 10.342160224751868],
          [25.031778336525722, 10.168458938675082],
          [24.866167068709604, 9.882448196652712],
          [24.67533493013216, 9.43558502237025],
          [24.49116516067802, 8.829773904204192],
          [24.22335924455728, 8.642150831815043],
        ],
      },
      properties: {
        objectid: 1134,
        iso3cd: "SDN_SSD",
        globalid: "{01781466-EF63-4B6B-8657-D8207EFFC49B}",
        iso2cd: "SD_SS",
        m49_cd: "729_728",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1296,
      geometry: {
        type: "LineString",
        coordinates: [
          [33.182632954315494, 22.00165984138765],
          [33.564080000042914, 21.725389999970027],
          [33.96683952329081, 21.768294962835917],
          [34.01710107994641, 21.806046325262315],
          [34.08652927460527, 22.002508469847765],
          [34.08690685115036, 22.00355089211025],
        ],
      },
      properties: {
        objectid: 1296,
        iso3cd: "SDN_EGY",
        globalid: "{5540A0B1-8467-46BF-A97E-99C02CB3DBB0}",
        iso2cd: "SD_EG",
        m49_cd: "729_818",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1308,
      geometry: {
        type: "LineString",
        coordinates: [
          [114.22614306456467, 22.54411182826099],
          [114.16246500046687, 22.561114999913578],
          [114.03428430987702, 22.506850115285875],
        ],
      },
      properties: {
        objectid: 1308,
        iso3cd: "CHN_HKG",
        globalid: "{0BB9885A-B3BD-44B4-90C6-14403B2EC267}",
        iso2cd: "CN_HK",
        m49_cd: "156_344",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1318,
      geometry: {
        type: "LineString",
        coordinates: [
          [35.62337560307272, 23.146886229915893],
          [35.29706891859894, 22.8617857812707],
          [35.10042277974609, 22.817468057802543],
          [34.7947026101843, 22.520182660272603],
          [34.43572644345971, 22.254343529935923],
          [34.16068999996512, 22.207099999856617],
          [34.08690685115036, 22.00355089211025],
        ],
      },
      properties: {
        objectid: 1318,
        iso3cd: "EGY_SDN",
        globalid: "{8C2C5AC2-2236-4C81-8054-6D6787AD544D}",
        iso2cd: "EG_SD",
        m49_cd: "818_729",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1434,
      geometry: {
        type: "LineString",
        coordinates: [
          [34.2688393929402, 31.220534936832156],
          [34.272928385214136, 31.227410616155193],
          [34.27443437175998, 31.22549428719827],
          [34.312072753632634, 31.250122069828763],
          [34.364685058651055, 31.289123535276786],
          [34.36999511683272, 31.32685851997286],
          [34.36968994113332, 31.328308105031113],
          [34.36850992802873, 31.334289550356257],
          [34.36791992249015, 31.3372802732146],
          [34.36761474651932, 31.338836670198262],
          [34.366699218872085, 31.34350585911798],
          [34.36645507811576, 31.344787596815877],
          [34.365478515961904, 31.349914551389826],
          [34.365197754178915, 31.351391602359865],
          [34.36491699216854, 31.352868652665215],
          [34.36407470750743, 31.35729980461243],
          [34.36347961433654, 31.3611907958406],
          [34.363281250321684, 31.362487793367123],
          [34.36368815130581, 31.364888508922473],
          [34.36389160228007, 31.366088867160656],
          [34.36529540965403, 31.368713378936],
          [34.384820677006, 31.393533537182307],
          [34.39677200207621, 31.405490002253558],
          [34.39856811416251, 31.407282579308628],
          [34.399466170548706, 31.40817886701786],
          [34.40036422573461, 31.409075155017373],
          [34.401393863888075, 31.410009711046676],
          [34.40345314087403, 31.411878822022697],
          [34.466524238445935, 31.463227173252243],
          [34.5176086426931, 31.500396728855502],
          [34.55151843550365, 31.518442884282596],
          [34.56567382780325, 31.53387451179298],
          [34.56688232388873, 31.538452147737154],
          [34.56768798813236, 31.54150390564489],
          [34.545715331924534, 31.557495116851953],
          [34.54442681202813, 31.558403862584626],
          [34.53669569212545, 31.563856336770087],
          [34.53411865207606, 31.565673827730652],
          [34.53296137358595, 31.566482654926393],
          [34.52833226085754, 31.569717962852927],
          [34.52601770408757, 31.571335617391483],
          [34.524860286057105, 31.572144369620275],
          [34.52370286813858, 31.572953122850876],
          [34.52254545025146, 31.573761876246817],
          [34.51791577747826, 31.57699688730394],
          [34.51675821891487, 31.577805566236457],
          [34.512127985840834, 31.581040281110994],
          [34.50981286991838, 31.582657638287625],
          [34.508655171853334, 31.583466243084867],
          [34.50170898360734, 31.588317871162175],
          [34.49969482356951, 31.589721679884125],
          [34.498687744452575, 31.59042358372293],
          [34.497680664534, 31.59112548832927],
          [34.49409179738442, 31.593615722671082],
          [34.492895507657174, 31.594445801029114],
          [34.491699218669574, 31.595275878951615],
        ],
      },
      properties: {
        objectid: 1434,
        iso3cd: "ISR_PSE",
        globalid: "{AC315BD2-9C82-448A-8D25-5627797FA0A1}",
        iso2cd: "IL_PS",
        m49_cd: "376_275",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1436,
      geometry: {
        type: "LineString",
        coordinates: [
          [35.555121288697244, 32.38899549915337],
          [35.33544331051296, 32.516531874737936],
          [35.23184029591032, 32.54295556940267],
          [35.09061928819869, 32.474879191134065],
          [34.99072059347541, 32.209567806603154],
          [34.98628289904339, 31.96781457337249],
          [35.222327070885775, 31.799736061185826],
          [35.123101507580294, 31.71089476726089],
          [35.01230049120411, 31.6615004840253],
          [34.957500487469396, 31.591100484105738],
          [34.896500498508956, 31.43050047795805],
          [34.935500502776414, 31.34530049606292],
          [35.23330047680286, 31.376300483656717],
          [35.47602899984751, 31.49316700018092],
        ],
      },
      properties: {
        objectid: 1436,
        iso3cd: "ISR_PSE",
        globalid: "{2AF289D0-74C7-40F1-8492-ECBE499A2460}",
        iso2cd: "IL_PS",
        m49_cd: "376_725",
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1453,
      geometry: {
        type: "LineString",
        coordinates: [
          [75.33294673050831, 32.32612721636903],
          [75.53137000025792, 32.321379999948135],
          [75.82609999942848, 32.4938699997803],
          [75.91253999983203, 32.60667999990243],
          [75.94720000013658, 32.725820000208806],
          [75.90387000029591, 32.800829999661275],
          [76.03747978560783, 32.90804511218764],
          [76.48415000053265, 33.17083000027146],
          [76.75554999994841, 33.15804000024802],
          [76.91331999952594, 33.06388000002508],
          [77.00639030622263, 32.965825151365294],
          [77.27944000002321, 32.839990000129255],
          [77.44609000054481, 32.82471000007027],
          [77.5994300004792, 32.88249000026528],
          [77.89665000011634, 32.76999000025169],
          [78.33134709218423, 32.57714983111817],
          [78.28137000001796, 32.47193000038734],
          [78.31749000037406, 32.436930000030706],
          [78.40207700047777, 32.526977999822634],
        ],
      },
      properties: {
        objectid: 1453,
        iso3cd: "IND_xjk",
        globalid: "{46662EA3-2121-40D1-94C5-06ADDE5B69F3}",
        iso2cd: null,
        m49_cd: null,
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1494,
      geometry: {
        type: "LineString",
        coordinates: [
          [73.8402699996985, 36.79130999988092],
          [73.8547000003434, 36.71379999997551],
          [73.52385999962681, 36.72319999963212],
          [73.0588500002863, 36.63692999991667],
          [72.55276999960194, 36.23135000032359],
          [72.51277000059082, 35.900270000354915],
          [72.67082000001247, 35.81833000002961],
          [73.11294315115349, 35.77796001717021],
          [73.72192000023857, 35.42749000005682],
          [73.9370704983568, 35.197075193791974],
          [74.11580999944685, 35.123049999727584],
          [74.05524999971561, 34.97166000036893],
          [73.96666000035489, 34.85833000018799],
          [73.47637999985291, 34.57277000018173],
          [73.43932648904952, 34.5353666838695],
          [73.4008200000681, 34.404709999947364],
          [73.40609999962894, 34.33167000039308],
          [73.48831000035082, 34.17304999964867],
          [73.57925048757838, 33.76617678939458],
          [73.62830999996373, 33.09471000013906],
          [74.43779012577775, 32.79222709568531],
        ],
      },
      properties: {
        objectid: 1494,
        iso3cd: "PAK_xjk",
        globalid: "{A13B687B-8C76-4C27-89F0-D654C42CE1A4}",
        iso2cd: null,
        m49_cd: null,
        bdytyp: 3,
      },
    },
    {
      type: "Feature",
      id: 1523,
      geometry: {
        type: "LineString",
        coordinates: [
          [126.69173731127555, 37.84327613761065],
          [126.6937402172607, 37.95543884229136],
          [127.11938992651052, 38.295157446671745],
          [127.38920067188317, 38.3330188213949],
          [128.0809137545987, 38.3105345923874],
          [128.27965366079474, 38.43161345599732],
          [128.36080363659994, 38.61497621825292],
        ],
      },
      properties: {
        objectid: 1523,
        iso3cd: "KOR_PRK",
        globalid: "{D19D3808-B642-4EF1-9107-2DC77CFBF5E6}",
        iso2cd: "KR_KP",
        m49_cd: "410_408",
        bdytyp: 3,
      },
    },
  ],
};
