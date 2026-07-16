export interface StateInfo {
  code: string;
  name: string;
  popularCities: string[];
}

export interface CountryInfo {
  code: string;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryInfo[] = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
];

export const STATES_BY_COUNTRY: Record<string, StateInfo[]> = {
  US: [
    { code: "AL", name: "Alabama", popularCities: ["Birmingham", "Montgomery", "Mobile"] },
    { code: "AK", name: "Alaska", popularCities: ["Anchorage", "Juneau", "Fairbanks"] },
    { code: "AZ", name: "Arizona", popularCities: ["Phoenix", "Tucson", "Mesa"] },
    { code: "AR", name: "Arkansas", popularCities: ["Little Rock", "Fort Smith", "Fayetteville"] },
    { code: "CA", name: "California", popularCities: ["Los Angeles", "San Francisco", "San Diego", "San Jose"] },
    { code: "CO", name: "Colorado", popularCities: ["Denver", "Colorado Springs", "Aurora"] },
    { code: "CT", name: "Connecticut", popularCities: ["Bridgeport", "New Haven", "Hartford"] },
    { code: "DE", name: "Delaware", popularCities: ["Wilmington", "Dover", "Newark"] },
    { code: "FL", name: "Florida", popularCities: ["Miami", "Orlando", "Tampa", "Jacksonville"] },
    { code: "GA", name: "Georgia", popularCities: ["Atlanta", "Savannah", "Augusta"] },
    { code: "HI", name: "Hawaii", popularCities: ["Honolulu", "Hilo", "Kailua"] },
    { code: "ID", name: "Idaho", popularCities: ["Boise", "Nampa", "Idaho Falls"] },
    { code: "IL", name: "Illinois", popularCities: ["Chicago", "Aurora", "Rockford"] },
    { code: "IN", name: "Indiana", popularCities: ["Indianapolis", "Fort Wayne", "Bloomington"] },
    { code: "IA", name: "Iowa", popularCities: ["Des Moines", "Cedar Rapids", "Davenport"] },
    { code: "KS", name: "Kansas", popularCities: ["Wichita", "Overland Park", "Topeka"] },
    { code: "KY", name: "Kentucky", popularCities: ["Louisville", "Lexington", "Bowling Green"] },
    { code: "LA", name: "Louisiana", popularCities: ["New Orleans", "Baton Rouge", "Shreveport"] },
    { code: "ME", name: "Maine", popularCities: ["Portland", "Lewiston", "Bangor"] },
    { code: "MD", name: "Maryland", popularCities: ["Baltimore", "Annapolis", "Rockville"] },
    { code: "MA", name: "Massachusetts", popularCities: ["Boston", "Worcester", "Springfield"] },
    { code: "MI", name: "Michigan", popularCities: ["Detroit", "Grand Rapids", "Lansing"] },
    { code: "MN", name: "Minnesota", popularCities: ["Minneapolis", "Saint Paul", "Duluth"] },
    { code: "MS", name: "Mississippi", popularCities: ["Jackson", "Gulfport", "Biloxi"] },
    { code: "MO", name: "Missouri", popularCities: ["Kansas City", "Saint Louis", "Springfield"] },
    { code: "MT", name: "Montana", popularCities: ["Billings", "Missoula", "Great Falls"] },
    { code: "NE", name: "Nebraska", popularCities: ["Omaha", "Lincoln", "Bellevue"] },
    { code: "NV", name: "Nevada", popularCities: ["Las Vegas", "Reno", "Henderson"] },
    { code: "NH", name: "New Hampshire", popularCities: ["Manchester", "Nashua", "Concord"] },
    { code: "NJ", name: "New Jersey", popularCities: ["Newark", "Jersey City", "Paterson"] },
    { code: "NM", name: "New Mexico", popularCities: ["Albuquerque", "Las Cruces", "Santa Fe"] },
    { code: "NY", name: "New York", popularCities: ["New York City", "Buffalo", "Rochester", "Albany"] },
    { code: "NC", name: "North Carolina", popularCities: ["Charlotte", "Raleigh", "Greensboro"] },
    { code: "ND", name: "North Dakota", popularCities: ["Fargo", "Bismarck", "Grand Forks"] },
    { code: "OH", name: "Ohio", popularCities: ["Columbus", "Cleveland", "Cincinnati", "Toledo"] },
    { code: "OK", name: "Oklahoma", popularCities: ["Oklahoma City", "Tulsa", "Norman"] },
    { code: "OR", name: "Oregon", popularCities: ["Portland", "Salem", "Eugene"] },
    { code: "PA", name: "Pennsylvania", popularCities: ["Philadelphia", "Pittsburgh", "Allentown"] },
    { code: "RI", name: "Rhode Island", popularCities: ["Providence", "Warwick", "Cranston"] },
    { code: "SC", name: "South Carolina", popularCities: ["Charleston", "Columbia", "Greenville"] },
    { code: "SD", name: "South Dakota", popularCities: ["Sioux Falls", "Rapid City", "Aberdeen"] },
    { code: "TN", name: "Tennessee", popularCities: ["Nashville", "Memphis", "Knoxville"] },
    { code: "TX", name: "Texas", popularCities: ["Houston", "Austin", "Dallas", "San Antonio"] },
    { code: "UT", name: "Utah", popularCities: ["Salt Lake City", "West Valley City", "Provo"] },
    { code: "VT", name: "Vermont", popularCities: ["Burlington", "South Burlington", "Rutland"] },
    { code: "VA", name: "Virginia", popularCities: ["Virginia Beach", "Norfolk", "Richmond"] },
    { code: "WA", name: "Washington", popularCities: ["Seattle", "Spokane", "Tacoma"] },
    { code: "WV", name: "West Virginia", popularCities: ["Charleston", "Huntington", "Morgantown"] },
    { code: "WI", name: "Wisconsin", popularCities: ["Milwaukee", "Madison", "Green Bay"] },
    { code: "WY", name: "Wyoming", popularCities: ["Cheyenne", "Casper", "Laramie"] }
  ],
  IN: [
    { code: "MH", name: "Maharashtra", popularCities: ["Mumbai", "Pune", "Nagpur", "Nashik"] },
    { code: "DL", name: "Delhi", popularCities: ["New Delhi", "Dwarka", "Rohini"] },
    { code: "KA", name: "Karnataka", popularCities: ["Bengaluru", "Mysuru", "Hubballi", "Mangaluru"] },
    { code: "TN", name: "Tamil Nadu", popularCities: ["Chennai", "Coimbatore", "Madurai", "Salem"] },
    { code: "TG", name: "Telangana", popularCities: ["Hyderabad", "Warangal", "Nizamabad"] },
    { code: "GJ", name: "Gujarat", popularCities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot"] },
    { code: "UP", name: "Uttar Pradesh", popularCities: ["Lucknow", "Kanpur", "Agra", "Varanasi"] },
    { code: "WB", name: "West Bengal", popularCities: ["Kolkata", "Howrah", "Darjeeling"] },
    { code: "KL", name: "Kerala", popularCities: ["Thiruvananthapuram", "Kochi", "Kozhikode"] },
    { code: "RJ", name: "Rajasthan", popularCities: ["Jaipur", "Jodhpur", "Udaipur", "Kota"] }
  ],
  CA: [
    { code: "ON", name: "Ontario", popularCities: ["Toronto", "Ottawa", "Mississauga", "Hamilton"] },
    { code: "QC", name: "Quebec", popularCities: ["Montreal", "Quebec City", "Laval", "Gatineau"] },
    { code: "BC", name: "British Columbia", popularCities: ["Vancouver", "Victoria", "Surrey", "Burnaby"] },
    { code: "AB", name: "Alberta", popularCities: ["Calgary", "Edmonton", "Red Deer"] },
    { code: "MB", name: "Manitoba", popularCities: ["Winnipeg", "Brandon", "Steinbach"] },
    { code: "NS", name: "Nova Scotia", popularCities: ["Halifax", "Sydney", "Dartmouth"] }
  ],
  AU: [
    { code: "NSW", name: "New South Wales", popularCities: ["Sydney", "Newcastle", "Wollongong"] },
    { code: "QLD", name: "Queensland", popularCities: ["Brisbane", "Gold Coast", "Cairns"] },
    { code: "VIC", name: "Victoria", popularCities: ["Melbourne", "Geelong", "Ballarat"] },
    { code: "SA", name: "South Australia", popularCities: ["Adelaide", "Mount Gambier"] },
    { code: "WA", name: "Western Australia", popularCities: ["Perth", "Mandurah", "Bunbury"] },
    { code: "TAS", name: "Tasmania", popularCities: ["Hobart", "Launceston"] }
  ],
  GB: [
    { code: "ENG", name: "England", popularCities: ["London", "Manchester", "Birmingham", "Leeds"] },
    { code: "SCT", name: "Scotland", popularCities: ["Edinburgh", "Glasgow", "Aberdeen"] },
    { code: "WLS", name: "Wales", popularCities: ["Cardiff", "Swansea", "Newport"] },
    { code: "NIR", name: "Northern Ireland", popularCities: ["Belfast", "Derry", "Lisburn"] }
  ],
  DE: [
    { code: "BY", name: "Bavaria", popularCities: ["Munich", "Nuremberg", "Augsburg"] },
    { code: "BE", name: "Berlin", popularCities: ["Berlin"] },
    { code: "HH", name: "Hamburg", popularCities: ["Hamburg"] },
    { code: "HE", name: "Hesse", popularCities: ["Frankfurt", "Wiesbaden", "Kassel"] },
    { code: "NW", name: "North Rhine-Westphalia", popularCities: ["Cologne", "Düsseldorf", "Dortmund", "Essen"] }
  ],
  BR: [
    { code: "SP", name: "São Paulo", popularCities: ["São Paulo", "Campinas", "Santos"] },
    { code: "RJ", name: "Rio de Janeiro", popularCities: ["Rio de Janeiro", "Niterói", "Petrópolis"] },
    { code: "MG", name: "Minas Gerais", popularCities: ["Belo Horizonte", "Uberlândia", "Ouro Preto"] },
    { code: "BA", name: "Bahia", popularCities: ["Salvador", "Porto Seguro", "Feira de Santana"] }
  ],
  FR: [
    { code: "IDF", name: "Île-de-France", popularCities: ["Paris", "Boulogne-Billancourt", "Saint-Denis"] },
    { code: "ARA", name: "Auvergne-Rhône-Alpes", popularCities: ["Lyon", "Grenoble", "Saint-Étienne"] },
    { code: "PAC", name: "Provence-Alpes-Côte d'Azur", popularCities: ["Marseille", "Nice", "Toulon"] },
    { code: "OCC", name: "Occitanie", popularCities: ["Toulouse", "Montpellier", "Nîmes"] }
  ],
  JP: [
    { code: "13", name: "Tokyo", popularCities: ["Shinjuku", "Shibuya", "Chiyoda"] },
    { code: "27", name: "Osaka", popularCities: ["Osaka", "Sakai", "Higashiosaka"] },
    { code: "26", name: "Kyoto", popularCities: ["Kyoto", "Uji", "Kameoka"] },
    { code: "01", name: "Hokkaido", popularCities: ["Sapporo", "Asahikawa", "Hakodate"] }
  ]
};
