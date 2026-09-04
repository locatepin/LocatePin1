import { AccessLocation } from "../context/AccessLocationContext";

export interface GeoRegionOption {
  value: string;
  label: string;
}

export interface GeoRegionGroup {
  label: string;
  options: GeoRegionOption[];
}

// Curated focus areas for major metropolitan hubs
const CITY_FOCUS_AREAS: Record<string, GeoRegionOption[]> = {
  chennai: [
    { value: "Chennai (Anna Nagar / 3rd Ave Hub)", label: "Chennai (Anna Nagar / 3rd Ave Hub)" },
    { value: "Chennai - Thiruvanmiyur", label: "Chennai - Thiruvanmiyur (Coastal / South Hub)" },
    { value: "Chennai - Besant Nagar", label: "Chennai - Besant Nagar (Beach & Promenade Belt)" },
    { value: "Chennai - ECR", label: "Chennai - ECR (East Coast Road Coastal Belt)" },
    { value: "Chennai - OMR", label: "Chennai - OMR (IT Expressway & Corridor)" },
    { value: "Chennai - Adyar & Mylapore", label: "Chennai - Adyar & Mylapore (Cultural & Retail Belt)" },
    { value: "Chennai - T. Nagar & Kilpauk", label: "Chennai - T. Nagar & Kilpauk (Central Commercial Hub)" },
    { value: "Chennai - Velachery & Guindy", label: "Chennai - Velachery & Guindy (Transit & Tech Hub)" },
    { value: "Chennai - Nungambakkam & Alwarpet", label: "Chennai - Nungambakkam & Alwarpet (Prime High-Street)" },
    { value: "Chennai - Kolathur & Retteri", label: "Chennai - Kolathur & Retteri (Aquatics & Trade Hub)" },
  ],
  bangalore: [
    { value: "Bangalore (Central / MG Road & Brigade Hub)", label: "Bangalore (Central / MG Road & Brigade Hub)" },
    { value: "Bangalore - Indiranagar", label: "Bangalore - Indiranagar (100ft Rd / CMH Hub)" },
    { value: "Bangalore - Koramangala", label: "Bangalore - Koramangala (Startup & Retail Belt)" },
    { value: "Bangalore - Whitefield", label: "Bangalore - Whitefield (ITPL & Marathahalli)" },
    { value: "Bangalore - HSR Layout", label: "Bangalore - HSR Layout & BTM" },
    { value: "Bangalore - Jayanagar", label: "Bangalore - Jayanagar & JP Nagar" },
    { value: "Bangalore - Electronic City", label: "Bangalore - Electronic City Phase 1 & 2" },
    { value: "Bangalore - Malleshwaram", label: "Bangalore - Malleshwaram & Rajajinagar" },
    { value: "Bangalore - Hebbal & Yelahanka", label: "Bangalore - Hebbal & Yelahanka (North Hub)" },
    { value: "Bangalore - Bellandur & ORR", label: "Bangalore - Bellandur & Outer Ring Road (Tech Corridor)" },
  ],
  bengaluru: [
    { value: "Bangalore (Central / MG Road & Brigade Hub)", label: "Bangalore (Central / MG Road & Brigade Hub)" },
    { value: "Bangalore - Indiranagar", label: "Bangalore - Indiranagar (100ft Rd / CMH Hub)" },
    { value: "Bangalore - Koramangala", label: "Bangalore - Koramangala (Startup & Retail Belt)" },
    { value: "Bangalore - Whitefield", label: "Bangalore - Whitefield (ITPL & Marathahalli)" },
    { value: "Bangalore - HSR Layout", label: "Bangalore - HSR Layout & BTM" },
    { value: "Bangalore - Jayanagar", label: "Bangalore - Jayanagar & JP Nagar" },
    { value: "Bangalore - Electronic City", label: "Bangalore - Electronic City Phase 1 & 2" },
    { value: "Bangalore - Malleshwaram", label: "Bangalore - Malleshwaram & Rajajinagar" },
    { value: "Bangalore - Hebbal & Yelahanka", label: "Bangalore - Hebbal & Yelahanka (North Hub)" },
    { value: "Bangalore - Bellandur & ORR", label: "Bangalore - Bellandur & Outer Ring Road (Tech Corridor)" },
  ],
  coimbatore: [
    { value: "Coimbatore - RS Puram & DB Road", label: "Coimbatore - RS Puram & DB Road (Prime Commercial)" },
    { value: "Coimbatore - Gandhipuram & Cross Cut", label: "Coimbatore - Gandhipuram & Cross Cut Road (Central Hub)" },
    { value: "Coimbatore - Peelamedu & Avinashi Rd", label: "Coimbatore - Peelamedu & Avinashi Rd (Tech & Edu Belt)" },
    { value: "Coimbatore - Saravanampatti", label: "Coimbatore - Saravanampatti (IT SEZ Corridor)" },
    { value: "Coimbatore - Saibaba Colony", label: "Coimbatore - Saibaba Colony & Thudiyalur" },
  ],
  madurai: [
    { value: "Madurai - KK Nagar & Simmakkal", label: "Madurai - KK Nagar & Simmakkal (Central Hub)" },
    { value: "Madurai - Mattuthavani & Bypass", label: "Madurai - Mattuthavani & Ring Road Commercial" },
    { value: "Madurai - Anna Nagar & Goripalayam", label: "Madurai - Anna Nagar & Goripalayam" },
    { value: "Madurai - Sellur & Vilakkuthoon", label: "Madurai - Sellur & Heritage Market" },
  ],
  hyderabad: [
    { value: "Hyderabad - Hitec City & Madhapur", label: "Hyderabad - Hitec City & Madhapur (Cyberabad Hub)" },
    { value: "Hyderabad - Gachibowli & Financial District", label: "Hyderabad - Gachibowli & Financial District" },
    { value: "Hyderabad - Jubilee Hills & Banjara Hills", label: "Hyderabad - Jubilee Hills & Banjara Hills (Prime Retail)" },
    { value: "Hyderabad - Secunderabad & Begumpet", label: "Hyderabad - Secunderabad & Begumpet" },
    { value: "Hyderabad - Kondapur & Kukatpally", label: "Hyderabad - Kondapur & Kukatpally (High Growth Belt)" },
  ],
  mumbai: [
    { value: "Mumbai - South Mumbai & BKC", label: "Mumbai - Bandra Kurla Complex (BKC) & Nariman Point" },
    { value: "Mumbai - Bandra West & Juhu", label: "Mumbai - Bandra West & Juhu (Lifestyle & Retail)" },
    { value: "Mumbai - Andheri & Lokhandwala", label: "Mumbai - Andheri West & Lokhandwala (Commercial Hub)" },
    { value: "Mumbai - Powai & Hiranandani", label: "Mumbai - Powai & Hiranandani (Tech & Startup Corridor)" },
    { value: "Mumbai - Thane & Navi Mumbai", label: "Mumbai - Thane & Navi Mumbai (Vashi / Belapur Hub)" },
  ],
  delhi: [
    { value: "Delhi - Connaught Place & Central", label: "Delhi - Connaught Place & Central Business District" },
    { value: "Delhi - South Extension & Greater Kailash", label: "Delhi - South Extension & Greater Kailash" },
    { value: "Delhi NCR - Gurgaon Cyber City", label: "Delhi NCR - Gurgaon Cyber City & Golf Course Road" },
    { value: "Delhi NCR - Noida Sector 18 & 62", label: "Delhi NCR - Noida Sector 18 & 62 (Tech & Media)" },
    { value: "Delhi - Aerocity & Dwarka", label: "Delhi - Aerocity & Dwarka Sub-City" },
  ],
  kochi: [
    { value: "Kochi - Marine Drive & MG Road", label: "Kochi - Marine Drive & MG Road (Central Commercial)" },
    { value: "Kochi - Kakkanad & Infopark", label: "Kochi - Kakkanad (Infopark & SmartCity Tech SEZ)" },
    { value: "Kochi - Edappally & Palarivattom", label: "Kochi - Edappally & Palarivattom (Lulu Hub)" },
    { value: "Kochi - Fort Kochi & Mattancherry", label: "Kochi - Fort Kochi & Coastal Heritage Belt" },
  ],
  newyork: [
    { value: "New York - Manhattan (Midtown & Wall St)", label: "New York - Manhattan (Midtown & Wall St)" },
    { value: "New York - Brooklyn (DUMBO & Williamsburg)", label: "New York - Brooklyn (DUMBO & Williamsburg)" },
    { value: "New York - Queens & Long Island City", label: "New York - Queens & Long Island City" },
  ],
  sanfrancisco: [
    { value: "San Francisco - SoMa & Financial District", label: "San Francisco - SoMa & Financial District" },
    { value: "San Francisco - Silicon Valley & South Bay", label: "San Francisco - Silicon Valley & South Bay" },
    { value: "San Francisco - East Bay & Oakland", label: "San Francisco - East Bay & Oakland" },
  ],
  london: [
    { value: "London - City of London & Westminster", label: "London - City of London & Westminster" },
    { value: "London - Canary Wharf & Docklands", label: "London - Canary Wharf & Docklands" },
    { value: "London - Shoreditch & Tech City", label: "London - Shoreditch & Tech City" },
    { value: "London - Kensington & Chelsea", label: "London - Kensington & Chelsea" },
  ],
  dubai: [
    { value: "Dubai - Downtown & Business Bay", label: "Dubai - Downtown & Business Bay (Burj Khalifa Hub)" },
    { value: "Dubai - Dubai Marina & JBR", label: "Dubai - Dubai Marina & JBR" },
    { value: "Dubai - DIFC & Sheikh Zayed Road", label: "Dubai - DIFC & Sheikh Zayed Road" },
    { value: "Dubai - Deira & Old Dubai", label: "Dubai - Deira & Gold Souk Commercial Hub" },
  ],
  singapore: [
    { value: "Singapore - Marina Bay & CBD", label: "Singapore - Marina Bay & Raffles Place (CBD)" },
    { value: "Singapore - Orchard Road & Somerset", label: "Singapore - Orchard Road & Somerset (Prime Retail)" },
    { value: "Singapore - Jurong East & one-north", label: "Singapore - Jurong East & one-north (Tech Hub)" },
  ],
};

// Curated state economic regions
const STATE_REGIONS: Record<string, GeoRegionOption[]> = {
  "tamil nadu": [
    { value: "Tamil Nadu (Statewide)", label: "Tamil Nadu (Statewide / Regional Hub)" },
    { value: "Tamil Nadu - Chennai Metropolitan Area", label: "Tamil Nadu - Chennai Metropolitan Area" },
    { value: "Tamil Nadu - Coimbatore Industrial Belt", label: "Tamil Nadu - Coimbatore Industrial Belt" },
    { value: "Tamil Nadu - Madurai & Southern Corridor", label: "Tamil Nadu - Madurai & Southern Corridor" },
    { value: "Tamil Nadu - Tiruchirappalli & Central Hub", label: "Tamil Nadu - Tiruchirappalli & Central Hub" },
    { value: "Tamil Nadu - Salem & Western Belt", label: "Tamil Nadu - Salem & Western Belt" },
  ],
  karnataka: [
    { value: "Karnataka (Statewide)", label: "Karnataka (Statewide / Bengaluru Hub)" },
    { value: "Karnataka - Bengaluru Urban & Rural", label: "Karnataka - Bengaluru Urban & Rural" },
    { value: "Karnataka - Mysuru Tech & Heritage Belt", label: "Karnataka - Mysuru Tech & Heritage Belt" },
    { value: "Karnataka - Mangaluru Coastal Economic Zone", label: "Karnataka - Mangaluru Coastal Economic Zone" },
    { value: "Karnataka - Hubballi-Dharwad Commercial Corridor", label: "Karnataka - Hubballi-Dharwad Commercial Corridor" },
  ],
  maharashtra: [
    { value: "Maharashtra (Statewide)", label: "Maharashtra (Statewide / Mumbai-Pune Hub)" },
    { value: "Maharashtra - Mumbai Metropolitan Region (MMR)", label: "Maharashtra - Mumbai Metropolitan Region (MMR)" },
    { value: "Maharashtra - Pune IT & Auto Corridor", label: "Maharashtra - Pune IT & Auto Corridor" },
    { value: "Maharashtra - Nagpur Logistics & Central Zone", label: "Maharashtra - Nagpur Logistics & Central Zone" },
    { value: "Maharashtra - Nashik Industrial Belt", label: "Maharashtra - Nashik Industrial Belt" },
  ],
  telangana: [
    { value: "Telangana (Statewide)", label: "Telangana (Statewide / Hyderabad Hub)" },
    { value: "Telangana - Hyderabad & Cyberabad Mega Belt", label: "Telangana - Hyderabad & Cyberabad Mega Belt" },
    { value: "Telangana - Warangal Regional Economic Hub", label: "Telangana - Warangal Regional Economic Hub" },
  ],
  delhi: [
    { value: "Delhi NCR (Statewide)", label: "Delhi NCR (Statewide / National Capital Region)" },
    { value: "Delhi NCR - Delhi Urban Core", label: "Delhi NCR - Delhi Urban Core" },
    { value: "Delhi NCR - Gurgaon Millenium City", label: "Delhi NCR - Gurgaon Millenium City" },
    { value: "Delhi NCR - Noida & Greater Noida Expressway", label: "Delhi NCR - Noida & Greater Noida Expressway" },
  ],
  kerala: [
    { value: "Kerala (Statewide)", label: "Kerala (Statewide / Coastal Hub)" },
    { value: "Kerala - Kochi Greater Metropolitan Zone", label: "Kerala - Kochi Greater Metropolitan Zone" },
    { value: "Kerala - Thiruvananthapuram Tech Hub", label: "Kerala - Thiruvananthapuram Tech Hub" },
    { value: "Kerala - Kozhikode Malabar Trade Corridor", label: "Kerala - Kozhikode Malabar Trade Corridor" },
  ],
  california: [
    { value: "California (Statewide)", label: "California (Statewide Tech & Commercial Hub)" },
    { value: "California - Silicon Valley & SF Bay Area", label: "California - Silicon Valley & SF Bay Area" },
    { value: "California - Los Angeles Metro", label: "California - Los Angeles Metro" },
    { value: "California - San Diego Biotech Corridor", label: "California - San Diego Biotech Corridor" },
  ],
  "new york": [
    { value: "New York State (Statewide)", label: "New York State (Statewide)" },
    { value: "New York - NYC 5-Borough Metro", label: "New York - NYC 5-Borough Metro" },
    { value: "New York - Long Island & Hudson Valley", label: "New York - Long Island & Hudson Valley" },
    { value: "New York - Upstate Tech Hub (Buffalo & Albany)", label: "New York - Upstate Tech Hub (Buffalo & Albany)" },
  ],
};

// Curated country regions
const COUNTRY_REGIONS: Record<string, GeoRegionOption[]> = {
  india: [
    { value: "India Nationwide", label: "India Nationwide (All Metros & 3-Packs)" },
    { value: "India - Tier 1 Metros", label: "India - Tier 1 Metros (Chennai, Bangalore, Mumbai, Delhi, Hyderabad)" },
    { value: "India - South India Economic Belt", label: "India - South India Economic Belt (TN, KA, TS, KL, AP)" },
    { value: "India - North & West Commercial Corridor", label: "India - North & West Commercial Corridor" },
    { value: "India - Tier-2 High Growth Hubs", label: "India - Tier-2 High Growth Hubs (Coimbatore, Pune, Kochi)" },
  ],
  "united states": [
    { value: "United States (Tier 1)", label: "United States (Tier 1 Metros)" },
    { value: "United States Nationwide", label: "United States Nationwide Coverage" },
    { value: "United States - Silicon Valley & Tech Belts", label: "United States - Silicon Valley & Tech Belts" },
    { value: "United States - East Coast Financial Corridor", label: "United States - East Coast Financial Corridor" },
  ],
  "united kingdom": [
    { value: "United Kingdom (London & SE)", label: "United Kingdom (London & Southeast Hub)" },
    { value: "United Kingdom Nationwide", label: "United Kingdom Nationwide Coverage" },
    { value: "United Kingdom - Midlands & Northern Belt", label: "United Kingdom - Midlands & Northern Belt" },
  ],
  "united arab emirates": [
    { value: "United Arab Emirates - Dubai & Abu Dhabi", label: "United Arab Emirates - Dubai & Abu Dhabi" },
    { value: "United Arab Emirates Nationwide", label: "United Arab Emirates Nationwide (All Emirates)" },
    { value: "GCC / Middle East Regional Network", label: "GCC / Middle East Regional Network" },
  ],
};

/**
 * Generates dynamic Geo Region option groups according to the live location with states and country.
 */
export function getDynamicGeoRegionGroups(location: AccessLocation): GeoRegionGroup[] {
  const city = location?.city?.trim() || "Chennai";
  const state = location?.region?.trim() || "Tamil Nadu";
  const country = location?.country?.trim() || "India";
  const suburb = location?.suburb?.trim() || "";
  const radiusKm = location?.radiusKm || 10;

  const cityKey = city.toLowerCase();
  const stateKey = state.toLowerCase();
  const countryKey = country.toLowerCase();

  const groups: GeoRegionGroup[] = [];

  // 1. Live Detected City & Neighborhood Zones
  const livePrimaryValue = `${city} (${suburb ? suburb + " / " : ""}${radiusKm} km Live Perimeter)`;
  const livePrimaryLabel = `★ ${city} (${suburb ? suburb + " / " : ""}Live ${radiusKm} km Perimeter)`;

  let cityOptions: GeoRegionOption[] = [];

  // Check if we have curated sub-areas
  const matchedCuratedCity =
    CITY_FOCUS_AREAS[cityKey] ||
    Object.entries(CITY_FOCUS_AREAS).find(([k]) => cityKey.includes(k) || k.includes(cityKey))?.[1];

  if (matchedCuratedCity) {
    cityOptions = [
      { value: livePrimaryValue, label: livePrimaryLabel },
      ...matchedCuratedCity.filter((opt) => opt.value !== livePrimaryValue),
    ];
  } else {
    // Generate dynamic directional/quadrant zones for any custom or international city
    cityOptions = [
      { value: livePrimaryValue, label: livePrimaryLabel },
      { value: `${city} (Central Commercial Hub)`, label: `${city} (Central Commercial & Retail Hub)` },
      { value: `${city} - North Corridor`, label: `${city} - North Corridor & Business Belt` },
      { value: `${city} - South Hub`, label: `${city} - South Hub & Tech Belt` },
      { value: `${city} - East Sector`, label: `${city} - East Sector & Commercial Belt` },
      { value: `${city} - West Sector`, label: `${city} - West Sector & Transit Zone` },
      { value: `${city} (${radiusKm} km Local Pack)`, label: `${city} (${radiusKm} km Google Maps Local Pack)` },
    ];
  }

  groups.push({
    label: `📍 Live Detected: ${city} Focus Areas (${state})`,
    options: cityOptions,
  });

  // 2. State / Province Region Group
  const matchedState =
    STATE_REGIONS[stateKey] ||
    Object.entries(STATE_REGIONS).find(([k]) => stateKey.includes(k) || k.includes(stateKey))?.[1];

  if (matchedState) {
    groups.push({
      label: `🏛️ State / Province: ${state}`,
      options: matchedState,
    });
  } else if (state) {
    groups.push({
      label: `🏛️ State / Province: ${state}`,
      options: [
        { value: `${state} (Statewide)`, label: `${state} (Statewide / Regional Hub)` },
        { value: `${state} - Metropolitan Corridor`, label: `${state} - Major Metropolitan Centers` },
        { value: `${state} - Regional Growth Markets`, label: `${state} - Regional Growth Markets` },
      ],
    });
  }

  // 3. Country Focus Group
  const matchedCountry =
    COUNTRY_REGIONS[countryKey] ||
    Object.entries(COUNTRY_REGIONS).find(([k]) => countryKey.includes(k) || k.includes(countryKey))?.[1];

  if (matchedCountry) {
    groups.push({
      label: `🌐 Country Focus: ${country}`,
      options: matchedCountry,
    });
  } else if (country) {
    groups.push({
      label: `🌐 Country Focus: ${country}`,
      options: [
        { value: `${country} Nationwide`, label: `${country} Nationwide Coverage` },
        { value: `${country} - Primary Metros`, label: `${country} - Primary Metropolitan Centers` },
        { value: `${country} - Local Pack Network`, label: `${country} - Google Local Pack Network` },
      ],
    });
  }

  // 4. Alternative Major Hubs (Ensures Chennai, Bangalore, and Global are always easily accessible if not the live city)
  const altOptions: GeoRegionOption[] = [
    { value: "Global Distributed", label: "Global Distributed (Multi-Region Edge CDN)" },
  ];

  if (!cityKey.includes("chennai")) {
    altOptions.push({
      value: "Chennai, India",
      label: "Chennai (Anna Nagar / 3rd Ave Hub)",
    });
    altOptions.push({
      value: "Tamil Nadu (Statewide)",
      label: "Tamil Nadu (Statewide / Regional Hub)",
    });
  }

  if (!cityKey.includes("bangalore") && !cityKey.includes("bengaluru")) {
    altOptions.push({
      value: "Bangalore (Central / MG Road & Brigade Hub)",
      label: "Bangalore (Central / MG Road & Brigade Hub)",
    });
    altOptions.push({
      value: "Bangalore - Electronic City",
      label: "Bangalore - Electronic City Phase 1 & 2",
    });
    altOptions.push({
      value: "Karnataka (Statewide)",
      label: "Karnataka (Statewide / Bengaluru Hub)",
    });
  }

  if (!countryKey.includes("india")) {
    altOptions.push({
      value: "India Nationwide",
      label: "India Nationwide (All Metros)",
    });
  }

  if (!countryKey.includes("united states") && !countryKey.includes("usa")) {
    altOptions.push({
      value: "United States (Tier 1)",
      label: "United States (Tier 1 Metros)",
    });
  }

  altOptions.push({
    value: "United Kingdom (London & Europe Hub)",
    label: "United Kingdom (London & Europe Hub)",
  });
  altOptions.push({
    value: "UAE / Dubai & Middle East (GCC Hub)",
    label: "UAE / Dubai & Middle East (GCC Hub)",
  });

  groups.push({
    label: "🌍 Broader & Global Regions",
    options: altOptions,
  });

  return groups;
}
