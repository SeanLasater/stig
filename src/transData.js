// Track and car choices for transmission tuning command
export const TRACK_CHOICES = [
  { name: '24H du Mans', value: '24_heures_du_mans_racing_circuit' },
  { name: 'Alsace', value: 'alsace' },
  { name: 'Lago Maggiore', value: 'autodrome_lago_maggiore' },
  { name: 'Interlagos', value: 'autodromo_de_interlagos' },
  { name: 'Monza', value: 'autodromo_nazionale_monza' },
  { name: 'Autopolis', value: 'autopolis_international_racing_course' },
  { name: 'Blue Moon Bay', value: 'blue_moon_bay_speedway' },
  { name: 'Brands Hatch', value: 'brands_hatch' },
  { name: 'Broad Bean', value: 'broad_bean_raceway' },
  { name: 'Barcelona', value: 'circuit_de_barcelona_catalunya' },
  { name: 'Sainte-Croix', value: 'circuit_de_sainte_croix' },
  { name: 'Spa', value: 'circuit_de_spa_francorchamps' },
  { name: 'Colorado Springs', value: 'colorado_springs' },
  { name: 'Daytona', value: 'daytona_international_speedway' },
  { name: 'Deep Forest', value: 'deep_forest_raceway' },
  { name: 'Dragon Trail', value: 'dragon_trail' },
  { name: 'Eiger Nordwand', value: 'eiger_nordwand' },
  { name: 'Fisherman\'s Ranch', value: 'fishermans_ranch' },
  { name: 'Fuji', value: 'fuji_international_speedway' },
  { name: 'Goodwood', value: 'goodwood_motor_circuit' },
  { name: 'Grand Valley', value: 'grand_valley' },
  { name: 'High Speed Ring', value: 'high_speed_ring' },
  { name: 'Kyoto', value: 'kyoto_driving_park' },
  { name: 'Lake Louise', value: 'lake_louise' },
  { name: 'Michelin', value: 'michelin_raceway_road_atlanta' },
  { name: 'Panorama', value: 'mount_panorama_circuit' },
  { name: 'Northern Isle', value: 'northern_isle_speedway' },
  { name: 'Nurburgring', value: 'nurburgring' },
  { name: 'Red Bull Ring', value: 'red_bull_ring' },
  { name: 'Sardegna Road', value: 'sardegna_road_track' },
  { name: 'Sardegna Wind', value: 'sardegna_windmills' },
  { name: 'Route X', value: 'special_stage_route_x' },
  { name: 'Suzuka', value: 'suzuka_circuit' },
  { name: 'Tokyo', value: 'tokyo_expressway' },
  { name: 'Trial Mountain', value: 'trial_mountain_circuit' },
  { name: 'Tsukuba', value: 'tsukuba_circuit' },
  { name: 'Watkins Glen', value: 'watkins_glen_international' },
  { name: 'Laguna Seca', value: 'weathertech_raceway_laguna_seca' },
  { name: 'Willow Springs', value: 'willow_springs_international_raceway' },
];

// Transmission tuning data - final drive and gear ratios for each track
export const TRANSMISSION_TUNINGS = {
  '24_heures_du_mans_racing_circuit': {
    finalDrive: 2.800,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'alsace': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'autodrome_lago_maggiore': {
    finalDrive: 3.200,
    gears: { '1st': 3.900, '2nd': 2.700, '3rd': 1.950, '4th': 1.450, '5th': 1.150, '6th': 0.850 }
  },
  'autodromo_de_interlagos': {
    finalDrive: 3.400,
    gears: { '1st': 3.700, '2nd': 2.500, '3rd': 1.850, '4th': 1.350, '5th': 1.050, '6th': 0.850 }
  },
  'autodromo_nazionale_monza': {
    finalDrive: 3.000,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'autopolis_international_racing_course': {
    finalDrive: 3.300,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'blue_moon_bay_speedway': {
    finalDrive: 3.600,
    gears: { '1st': 4.200, '2nd': 2.900, '3rd': 2.100, '4th': 1.600, '5th': 1.300, '6th': 1.000 }
  },
  'brands_hatch': {
    finalDrive: 3.700,
    gears: { '1st': 4.200, '2nd': 2.900, '3rd': 2.100, '4th': 1.600, '5th': 1.300, '6th': 1.000 }
  },
  'broad_bean_raceway': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'circuit_de_barcelona_catalunya': {
    finalDrive: 3.200,
    gears: { '1st': 3.900, '2nd': 2.700, '3rd': 1.950, '4th': 1.450, '5th': 1.150, '6th': 0.850 }
  },
  'circuit_de_sainte_croix': {
    finalDrive: 3.400,
    gears: { '1st': 3.700, '2nd': 2.500, '3rd': 1.850, '4th': 1.350, '5th': 1.050, '6th': 0.850 }
  },
  'circuit_de_spa_francorchamps': {
    finalDrive: 3.100,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'colorado_springs': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'daytona_international_speedway': {
    finalDrive: 2.900,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'deep_forest_raceway': {
    finalDrive: 3.400,
    gears: { '1st': 3.700, '2nd': 2.500, '3rd': 1.850, '4th': 1.350, '5th': 1.050, '6th': 0.850 }
  },
  'dragon_trail': {
    finalDrive: 3.600,
    gears: { '1st': 4.200, '2nd': 2.900, '3rd': 2.100, '4th': 1.600, '5th': 1.300, '6th': 1.000 }
  },
  'eiger_nordwand': {
    finalDrive: 3.800,
    gears: { '1st': 4.300, '2nd': 3.000, '3rd': 2.200, '4th': 1.700, '5th': 1.400, '6th': 1.100 }
  },
  'fishermans_ranch': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'fuji_international_speedway': {
    finalDrive: 3.100,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'goodwood_motor_circuit': {
    finalDrive: 3.800,
    gears: { '1st': 4.300, '2nd': 3.000, '3rd': 2.200, '4th': 1.700, '5th': 1.400, '6th': 1.100 }
  },
  'grand_valley': {
    finalDrive: 3.400,
    gears: { '1st': 3.700, '2nd': 2.500, '3rd': 1.850, '4th': 1.350, '5th': 1.050, '6th': 0.850 }
  },
  'high_speed_ring': {
    finalDrive: 3.000,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'kyoto_driving_park': {
    finalDrive: 4.000,
    gears: { '1st': 4.500, '2nd': 3.100, '3rd': 2.300, '4th': 1.800, '5th': 1.500, '6th': 1.200 }
  },
  'lake_louise': {
    finalDrive: 3.600,
    gears: { '1st': 4.200, '2nd': 2.900, '3rd': 2.100, '4th': 1.600, '5th': 1.300, '6th': 1.000 }
  },
  'michelin_raceway_road_atlanta': {
    finalDrive: 3.300,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'mount_panorama_circuit': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'northern_isle_speedway': {
    finalDrive: 3.700,
    gears: { '1st': 4.200, '2nd': 2.900, '3rd': 2.100, '4th': 1.600, '5th': 1.300, '6th': 1.000 }
  },
  'nurburgring': {
    finalDrive: 3.200,
    gears: { '1st': 3.900, '2nd': 2.700, '3rd': 1.950, '4th': 1.450, '5th': 1.150, '6th': 0.850 }
  },
  'red_bull_ring': {
    finalDrive: 3.300,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'sardegna_road_track': {
    finalDrive: 3.400,
    gears: { '1st': 3.700, '2nd': 2.500, '3rd': 1.850, '4th': 1.350, '5th': 1.050, '6th': 0.850 }
  },
  'sardegna_windmills': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'special_stage_route_x': {
    finalDrive: 2.800,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'suzuka_circuit': {
    finalDrive: 3.100,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'tokyo_expressway': {
    finalDrive: 3.000,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'trial_mountain_circuit': {
    finalDrive: 3.600,
    gears: { '1st': 4.200, '2nd': 2.900, '3rd': 2.100, '4th': 1.600, '5th': 1.300, '6th': 1.000 }
  },
  'tsukuba_circuit': {
    finalDrive: 4.200,
    gears: { '1st': 4.800, '2nd': 3.300, '3rd': 2.400, '4th': 1.900, '5th': 1.600, '6th': 1.300 }
  },
  'watkins_glen_international': {
    finalDrive: 3.300,
    gears: { '1st': 3.800, '2nd': 2.600, '3rd': 1.900, '4th': 1.400, '5th': 1.100, '6th': 0.900 }
  },
  'weathertech_raceway_laguna_seca': {
    finalDrive: 3.500,
    gears: { '1st': 4.000, '2nd': 2.800, '3rd': 2.000, '4th': 1.500, '5th': 1.200, '6th': 0.950 }
  },
  'willow_springs_international_raceway': {
    finalDrive: 3.400,
    gears: { '1st': 3.700, '2nd': 2.500, '3rd': 1.850, '4th': 1.350, '5th': 1.050, '6th': 0.850 }
  },
};

// Car choices for transmission tuning command
export const CAR_CHOICES = [
  { name: 'Porsche 911 GT3 RS', value: 'porsche_911_gt3_rs' },
  { name: 'Ferrari 488 Pista', value: 'ferrari_488_pista' },
];
